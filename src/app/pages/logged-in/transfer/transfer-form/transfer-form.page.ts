import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {
  AlertController,
  IonContent,
  LoadingController,
  ModalController,
  NavController,
  Platform,
  ToastController
} from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CustomValidator } from 'src/app/validators/custom.validator';
import { CalendarModal, CalendarModalOptions } from 'ion2-calendar';
import { Subscription } from 'rxjs';
// models
import { Transfer } from 'src/app/models/transfer';
import { Candidate } from 'src/app/models/candidate';
import { TransferCandidate } from 'src/app/models/transfer-candidate';
// service
import { CandidateService } from 'src/app/providers/logged-in/candidate.service';
import { TransferService } from 'src/app/providers/logged-in/transfer.service';
import { CompanyService } from 'src/app/providers/logged-in/company.service';
import { AwsService } from 'src/app/providers/aws.service';
import { AuthService } from '../../../../providers/auth.service';
import { EventService } from '../../../../providers/event.service';
import { TranslateLabelService } from 'src/app/providers/translate-label.service';
import { SentryErrorhandlerService } from 'src/app/providers/sentry.errorhandler.service';
import { AnalyticsService } from 'src/app/providers/analytics.service';


@Component({
  selector: 'app-transfer-form',
  templateUrl: './transfer-form.page.html',
  styleUrls: ['./transfer-form.page.scss'],
})
export class TransferFormPage implements OnInit {

  // Html Content
  @ViewChild(IonContent) content: IonContent;

  // The form containing entire records
  public form: FormGroup = new FormGroup({});
  // The Transfer containing all records
  public transfer: Transfer;

  // Page Title depends on Operation (Create vs Edit Transfer)
  public pageTitle = 'New Transfer';

  // Total Price for Transfer
  public total = 0;
  public companyHourlyCost = 2;

  // Whether the content is ready to be displayed or not
  public ready: Boolean = false;
  public min; // min date
  public max; // max date
  public startDate; // max date
  public endDate; // max date
  public selected; // max date
  dateRange: { from: string; to: string; };
  type: 'string'; // 'string' | 'js-date' | 'moment' | 'time' | 'object'

  public borderLimit: boolean = false;

  public segment = 'excel-sheet-upload';

  public range;

  // File input used for browser fallback when no capacitor is available
  @ViewChild('fileInput', { static: false }) fileInput: ElementRef;

  public browserUploadSubscription: Subscription;

  public uploading: Boolean = false;

  public currentTarget; 

  public progress = null;

  public loading = false;

  constructor(
    public activatedRoute: ActivatedRoute,
    public navCtrl: NavController,
    public platform: Platform,
    public awsService: AwsService,
    public translateService: TranslateLabelService,
    public transferService: TransferService,
    public candidateService: CandidateService,
    public companyService: CompanyService,
    public sentryService: SentryErrorhandlerService,
    // private _viewCtrl: ViewController,
    private _loadingCtrl: LoadingController,
    private _alertCtrl: AlertController,
    public _toastCtrl: ToastController,
    private _fb: FormBuilder,
    public authService: AuthService,
    public analyticService: AnalyticsService,
    private modalCtrl: ModalController,
    private eventService: EventService
  ) {
  }

  ngOnInit() {
     
    this.min = '1930/01/01';

    const d = new Date();
    this.max = (this.platform.is('mobile')) ? d.getFullYear() + '-12-12' : d;

    this.analyticService.page('Transfer Form Page');

    if (this.transfer.transfer_id) {
      this.pageTitle = 'Edit Transfer';
    }
  }

  loadData() {

    if (!this.transfer.transfer_id) {

      // Load List of All Candidates Assigned to this Company
      this._loadCandidateListThenInitialize();

    } else {
      this.loadTransferDetail();
    }
  }

  segmentChanged(event) {
    if (this.segment == "manual" && !this.ready) {
      this.loadData();
    }
  }

  /**
   * Load List of All Candidates Assigned to this Company
   * Initialise the form once loaded.
   */
  async _loadCandidateListThenInitialize() {

    const loader = await this._loadingCtrl.create();
    loader.present();

    //candidates.store,
    const params = "expand=candidates.company,candidates.currentWorkHistory,candidates.currentWorkHistory.transferCost";
    //expand=country,candidates,candidates.store,candidates.company

    this.companyService.getWithCandidates(this.transfer.company_id, params).subscribe(response => {
      const allCandidatesAssignedToCompany: Candidate[] = response.candidates;
      this._initTransferCandidateList(allCandidatesAssignedToCompany);
      loader.dismiss();
    });
  }

  /**
   * Initialize the TransferCandidate list required for this transfer.
   * @param { Candidate[] } allCandidatesAssignedToCompany
   */
  private _initTransferCandidateList(allCandidatesAssignedToCompany: Candidate[]) {
    const allTransferCandidateRecordsMapped: TransferCandidate[] = [];

    // Map all candidate records to an empty TransferCandidate record for a new transfer.
    allCandidatesAssignedToCompany.forEach((candidate: Candidate) => {
      const candidateTransferRecord = new TransferCandidate;
      candidateTransferRecord.candidate = candidate;
      candidateTransferRecord.candidate_id = candidate.candidate_id;
      //candidateTransferRecord.currentWorkHistory = candidate.currentWorkHistory;
      candidateTransferRecord.transfer_cost = candidate.currentWorkHistory?.transferCost; //effective transfer cost 

      // Append the candidateTransferRecord into the allTransferCandidateRecordsMapped array
      allTransferCandidateRecordsMapped[candidate.candidate_id] = candidateTransferRecord;
    });

    // If we are editing an existing transfer
    // 1) Get previous hours and bonus values from the Transfer
    // 2) Overwrite them into the allTransferCandidateRecordsMapped mapped
    if (this.transfer && this.transfer.transferCandidates) {
      this.transfer.transferCandidates.forEach((transferCandidate: TransferCandidate) => {

        // Only overwrite existing records based on currently assigned employees
        // (This is for the case where a that was available during the draft got unassigned)
        if (allTransferCandidateRecordsMapped[transferCandidate.candidate_id]) {
          transferCandidate.candidate = allTransferCandidateRecordsMapped[transferCandidate.candidate_id].candidate;
          allTransferCandidateRecordsMapped[transferCandidate.candidate_id] = transferCandidate;
        }
      });
    }

    // Re-index the TransferCandidate list to avoid issues array length and create required FormControls
    const updatedTransferRecords = [];
    const formControls: any = {};
    allTransferCandidateRecordsMapped.forEach(record => {
      updatedTransferRecords.push(record);

      // Create Form Controls with validation for this TransferCandidate record
      formControls['hours[' + record.candidate.candidate_id + ']'] = [record.hours, [
        // Validators.required,
        CustomValidator.negativeNumberValidator
      ]];
      formControls['minutes[' + record.candidate.candidate_id + ']'] = [record.minutes, [
        // Validators.required,
        CustomValidator.negativeNumberValidator
      ]];
      formControls['seconds[' + record.candidate.candidate_id + ']'] = [record.seconds, [
        // Validators.required,
        CustomValidator.negativeNumberValidator
      ]];
      
      formControls['bonus[' + record.candidate.candidate_id + ']'] = [record.bonus, [
        CustomValidator.negativeNumberValidator
      ]];
    });

    formControls['start_date'] = [(this.transfer && this.transfer.start_date) ? this.transfer.start_date : this.startDate, [
      Validators.required
    ]];

    formControls['end_date'] = [(this.transfer && this.transfer.end_date) ? this.transfer.end_date : this.endDate, [
      Validators.required
    ]];

    formControls['currency_code'] = [(this.transfer && this.transfer.currency_code) ? this.transfer.currency_code : this.authService.currency_pref, [
      Validators.required
    ]];

    // Replace the transferCandidates within the transfer with our up to date list
    if (this.transfer) {
      this.transfer.transferCandidates = updatedTransferRecords;
    }

    // Setup the form to use our form controls
    this.form = this._fb.group(formControls);

    // Calculate transfer total
    this.calculateTotal();

    if(this.startDate && this.endDate) {
      this.range = this.startDate + '-' + this.endDate;
    }

    this.ready = true;
  }

  approvedWorkLog() {
    this.transferService.approvedWorkLog(this.transfer.company_id, this.startDate, this.endDate).subscribe(data => {

      let values = {}

      for (let record of data) {
        values['hours[' + record.candidate_id + ']'] = record.hours;
        values['minutes[' + record.candidate_id + ']'] = record.minutes;
        values['seconds[' + record.candidate_id + ']'] = record.seconds;
      }

      this.form.patchValue(values);
      this.form.markAsDirty();
      this.form.updateValueAndValidity();

      this._toastCtrl.create({
        message: "Transfer hours, minutes, seconds updated from work log",
          duration: 3000
      }).then(t => t.present());
    });
  }

  /**
   * Validate candidate data before submit
   */
  async validate() {
    let error = '';

    for (const entry of this.transfer.transferCandidates) {
      // Check if any candidates have unset hours or 0 hours set
      if (
        (!entry.hours || entry.hours == 0) && 
        (!entry.minutes || entry.minutes == 0) && 
        (!entry.seconds || entry.seconds == 0)
      ) {
        error = 'You have set that some employees haven\'t worked any hours. Are you sure?';
      }

      // Check if any candidates have worked more than 180 hours
      if (entry.hours > 180) {
        error = 'You have employees set to have worked for more than 180 hours. are you sure?';
      }

      /*if (entry.minutes > 59) {
        error = 'Minutes can not be more than 59';
      }

      if (entry.seconds > 59) {
        error = 'Seconds can not be more than 59';
      }*/

      // Prompt to show user where error is or Save if he knows about it.
      if (error) {
        const prompt = await this._alertCtrl.create({
          message: error,
          buttons: [
            {
              text: 'Show me where',
              role: 'cancel',
              handler: () => {
                this.scrollTo('candidate_' + entry.candidate_id);
              }
            },
            {
              text: 'Yes',
              handler: () => {
                this.save();
              }
            }
          ]
        });
        prompt.present();
        break; // Exit the loop
      }
    }

    // Save if there are no errors
    if (!error) {
      this.save();
    }
  }

  /**
   * trigger click event on change logo button
   */
  triggerUpload($event) {
    $event.stopPropagation();
    document.getElementById('btn-upload-pic').click();
    // this.fileInput.nativeElement.click();
  }

  onCurrencyUpdate(event) {
    this.transfer.currency_code = event.target.value;
    this.form.controls.currency_code.setValue(event.target.value);
    this.form.controls.currency_code.updateValueAndValidity();
  }

  /**
   * Save the model
   */
  async save() {
    const loader = await this._loadingCtrl.create();
    loader.present();

    /**
     * Update the transfer data if it already exists
     * Otherwise create a new transfer
     */
    this.removeUnaccountedUsers();

    const action = this.transfer.transfer_id ?
      this.transferService.updateTransfer(this.transfer, this.startDate, this.endDate, this.form.value.currency_code) :
      this.transferService.save(this.transfer, this.startDate, this.endDate, this.form.value.currency_code);

    action.subscribe(async jsonResponse => {
      loader.dismiss();

      // On Success. Show Toast with the response message and close the page
      if (jsonResponse.operation == 'success') {

        this.eventService.reloadStats$.next({
          company_id: this.transfer.company_id
        });

        const toast = await this._toastCtrl.create({
          message: this.translateService.errorMessage(jsonResponse.message),
          duration: 3000
        });
        toast.present();

        this.close({ refresh: true });

        // create mode
        /*if (!this.transfer.transfer_id) {
          this.navCtrl.navigateForward('transfer-view/' + jsonResponse.transfer.transfer_id);
          // this.navCtrl.push('transfer-view/'+jsonResponse.transfer.transfer_idTransferViewPage, {
          //   'model': jsonResponse.transfer.transfer_id
          // });
        } else {
          this.navCtrl.navigateForward('transfer-view/' + this.transfer.transfer_id, {
            state: {
              refresh: true
            }
          });
        }*/
      }

      // On Failure, show an alert with the error message
      if (jsonResponse.operation == 'error') {
        const prompt = await this._alertCtrl.create({
          message: this.authService.errorMessage(jsonResponse.message),
          buttons: ['Ok']
        });
        prompt.present();
      }
    });
  }

  /**
   * Calculate the transfer total based on data input
   */
  calculateTotal() {
    this.total = 0;

    if (this.transfer) {
      this.transfer.transferCandidates.forEach((transferCandidate: TransferCandidate) => {
        // this.total += this.parseNumber(transferCandidate.company_total);
        const hours = this.parseNumber(transferCandidate.hours);
        const minutes = this.parseNumber(transferCandidate.minutes);
        const seconds = this.parseNumber(transferCandidate.seconds);
        const bonus = this.parseNumber(transferCandidate.bonus);
        const company_hourly_rate = this.getCompanyHourlyRate(transferCandidate);
        
        const subTotal = (hours * company_hourly_rate) 
          + (minutes * (company_hourly_rate/ 60)) 
          + (seconds * (company_hourly_rate/ 3600)) 
          + bonus;

        if (subTotal > 0)
          this.total += subTotal + this.parseNumber(transferCandidate.transfer_cost);

        //transferCandidate.candidate.company.company_hourly_rate
      });
    }
  }

  /**
   * Cast value to integer, return 0 by default
   * @param value
   */
  parseNumber(value) {
    if (!value) { return 0; }
    return Number(value);
  }

  onImageError(candidate) {
    candidate.candidate_personal_photo = null;
  }

  /**
   * Scroll to element on page by ID
   * @param element
   */
  scrollTo(element: string) {
    const yOffset = document.getElementById(element).offsetTop;
    // this.content.scrollTo(0, yOffset, 1000)
  }

  /**
   * Close the Page
   */
  close(data = {}) {
    this.modalCtrl.getTop().then(o => {
      if(o) {
        o.dismiss(data); 
      }
    });
  }

  /**
   * loading transfer
   */
  async loadTransferDetail() {
    const loading = await this._loadingCtrl.create();
    loading.present();

    //const params = "expand=candidates.store,candidates.company,candidates.currentWorkHistory,candidates.currentWorkHistory.transferCost";
    //expand=transferCandidates,transferCandidates.candidate
    const query = 'expand=transferCandidates'

    this.transferService.transferIdDetails(this.transfer.transfer_id, query).subscribe(response => {
      loading.dismiss();
      this.transfer = response;

      this.startDate = this.transfer.start_date;
      this.endDate = this.transfer.end_date;

      // Load List of All Candidates Assigned to this Company
      this._loadCandidateListThenInitialize();
    });
  }

  /**
   * Make date readable by Safari
   * @param date
   */
  toDate(date) {
    if (!date)
      return null;

    if (date) {
      return new Date(date.replace(/-/g, '/'));
    }
  }

  clearSelection() {
    this.transfer.start_date = this.transfer.end_date = null;
  }

  removeUnwantedData(candidate) {
    return candidate;
  }

  /**
   * remove those not paying candidates
   */
  removeUnaccountedUsers() {
    this.transfer.transferCandidates = this.transfer.transferCandidates.filter((candidates, index) => {
      return (candidates.bonus > 0 || candidates.hours > 0 || candidates.minutes > 0 || candidates.seconds > 0);
    });
  }

  checkDecimalHours(candidate_id) {

    const hours = this.form.controls['hours[' + candidate_id + ']'].value; 
  
    const minutes = hours * 60;

    //if hours decimal and minutes not available
 
    if (minutes % 60 > 0 && !this.form.controls['minutes[' + candidate_id + ']'].value) {
      const newHours = Math.floor(minutes/ 60);    
      const newMinutes = minutes - (newHours * 60);//(hours - newHours) * 60;    
  
      this.form.controls['hours[' + candidate_id + ']'].setValue(newHours);
      this.form.controls['hours[' + candidate_id + ']'].updateValueAndValidity();
      this.form.controls['hours[' + candidate_id + ']'].markAsDirty();

      this.form.controls['minutes[' + candidate_id + ']'].setValue(newMinutes);
      this.form.controls['minutes[' + candidate_id + ']'].updateValueAndValidity();
      this.form.controls['minutes[' + candidate_id + ']'].markAsDirty();
    }
  }

  async openCalendarPopup(event) {

    let fromDate = new Date();

    // Set it to one month ago
    fromDate.setMonth(fromDate.getMonth() - 1);

    const options: CalendarModalOptions = {
      canBackwardsSelected: true,
      pickMode: 'range',
      title: '',
      defaultScrollTo: new Date(),
      defaultDateRange: {
        from: fromDate,
        to: new Date()
      }
    };

    const myCalendar = await this.modalCtrl.create({
      component: CalendarModal,
      cssClass: 'modal-calender',
      componentProps: { options }
    });

    myCalendar.present();

    const eventCloseData: any = await myCalendar.onDidDismiss();

    const date = eventCloseData.data;

    if (date) {
      // this.startDate

      console.log(this.form)
      if (this.form && this.form.controls && this.form.controls['start_date']) {
        this.form.controls['start_date'].setValue(date.from.string);
        this.form.controls['end_date'].setValue(date.to.string);
      }

      this.startDate = date.from.string;
      this.endDate = date.to.string;

      this.range = date.from.string + '-' + date.to.string;
    }
  }
  
  ngOnDestroy() {
    if (!!this.browserUploadSubscription) {
      this.browserUploadSubscription.unsubscribe();
    }
  }

  /**
   * cancel file upload
   */
   cancelUpload() {
    if (this.fileInput && this.fileInput.nativeElement) {
      this.fileInput.nativeElement.value = null;
    }

    this.progress = null;

    this.loading = false;

    this.currentTarget.abort();
  }

  upload() {
    this.fileInput.nativeElement.click();
  }

  /**
   * Upload photo from browser
   * @param event
   */
  async browserUpload(event) {

    const fileList: FileList = event.target.files;

    if (fileList.length == 0) {
      return false;
    }

    this.uploading = true;

    this.browserUploadSubscription = this.awsService.uploadFile(fileList[0]).subscribe(event => {

      this._handleUpload(event);

    }, async err => {

      //log to slack/sentry to know how many user getting file upload error

      this.sentryService.handleError(err);

      if (this.fileInput && this.fileInput.nativeElement)
        this.fileInput.nativeElement.value = null;

      const alert = await this._alertCtrl.create({
        header: 'Error',
        message: 'Error while uploading file!',
        buttons: ['Okay']
      });

      await alert.present();

      this.uploading = false;
    });
  }

  /**
   * Handle successfull file upload
   * @param event
   */
  _handleUpload(event) {

    // Via this API, you get access to the raw event stream.
    // Look for upload progress events.
    if (event.type === 'progress') {
      // This is an upload progress event. Compute and show the % done:
      //this.progress = Math.round(100 * event.loaded / event.total);
    } else if (event.Key && event.Key.length > 0) {

      if (this.fileInput && this.fileInput.nativeElement)
        this.fileInput.nativeElement.value = null;

      if (this.transfer.transfer_id) {
        this.editTransferUpload(event.Key);
      } else {
        this.newTransferUpload(event.Key);
      }
    }
  }

  /**
   * new transfer upload excel
   * @param file
   */
  async newTransferUpload(file) {

    this.transferService.uploadTransferExcel(file, this.startDate, this.endDate, this.transfer.company_id).subscribe(async data => {

      this.uploading = false;

      if (data.operation == 'success') {

        this.eventService.reloadStats$.next({
          company_id: this.transfer.company_id
        });

        let prompt = await this._alertCtrl.create({
          message: this.translateService.errorMessage(data.message),
          buttons: ["Ok"]
        });
        prompt.present();

        this.close({ refresh: true });
      }

      // On Failure
      if (data.operation == "error") {

        let prompt = await this._alertCtrl.create({
          message: this.translateService.errorMessage(data.message),
          buttons: ["Ok"]
        });
        prompt.present();
      }
    }, () => {
      this.uploading = false;
    });
  }

  /**
   * edit transfer upload excel
   * @param event
   */
  async editTransferUpload(file) {

    this.transferService
      .updateTransferUploadExcel(file, this.transfer.transfer_id, this.startDate, this.endDate)
      .subscribe({
        next: async data => {

          this.uploading = false;

          if (data.operation == 'success') {

            this.eventService.reloadStats$.next({
              company_id: this.transfer.company_id
            });

            let prompt = await this._alertCtrl.create({
              message: this.translateService.errorMessage(data.message),
              buttons: ["Ok"]
            });
            prompt.present();

            this.close({ refresh: true });

            // this.navCtrl.push(TransferViewPage, {
            //   'model': this.transfer.transfer_id
            // });
          }

          // On Failure
          if (data.operation == "error") {
            let prompt = await this._alertCtrl.create({
              message: this.translateService.errorMessage(data.message),
              buttons: ["Ok"]
            });
            prompt.present();
          }
        }, 
        error: () => {
          this.uploading = false;
        }
      });
  }

  /**
   * download transfer template 
   */
  async downloadTemplate(preFilled = null) {
    let loader = await this._loadingCtrl.create();
    loader.present();
    this.transferService.downloadTransferTemplate(
      this.transfer.company_id, 
      preFilled, 
      this.startDate, 
      this.endDate
    ).subscribe(() => {
      loader.dismiss();
    });
  }

  getCompanyHourlyRate(transferCandidateRecord) {
    //if (transferCandidateRecord )
    //  candidate,candidate.company,currentWorkHistory,currentWorkHistory.

    if(!transferCandidateRecord.candidate) {
      transferCandidateRecord.company_hourly_rate;
    }

    return (transferCandidateRecord.candidate.currentWorkHistory && transferCandidateRecord.candidate.currentWorkHistory.company_hourly_rate > 0) ? 
        transferCandidateRecord.candidate.currentWorkHistory.company_hourly_rate :
        transferCandidateRecord.candidate.company.company_hourly_rate;
  }

  scrollToTop() {
    this.content.scrollToTop(0);
    //this.content.scrollToPoint(0, 0);
  }

  logScrolling(e) {
    this.borderLimit = e.detail.scrollTop;//(e.detail.scrollTop > 20);
  }
}
