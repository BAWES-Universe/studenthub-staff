import { Component, OnInit, ViewChild } from '@angular/core';
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
import {
  CalendarModal,
  CalendarModalOptions,
  DayConfig,
  CalendarResult,
  CalendarComponentOptions
} from 'ion2-calendar';
import { DefaultDate } from 'ion2-calendar/dist/calendar.model';
import {EventService} from '../../../../providers/event.service';


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
  public endData; // max date
  public selected; // max date
  dateRange: { from: string; to: string; };
  type: 'string'; // 'string' | 'js-date' | 'moment' | 'time' | 'object'
  optionsRange: CalendarComponentOptions = {
    pickMode: 'range'
    // pickMode: 'multi'
  };

  constructor(
    public activatedRoute: ActivatedRoute,
    public navCtrl: NavController,
    public platform: Platform,
    public aws: AwsService,
    public transferService: TransferService,
    public candidateService: CandidateService,
    public companyService: CompanyService,
    // private _viewCtrl: ViewController,
    private _loadingCtrl: LoadingController,
    private _alertCtrl: AlertController,
    public _toastCtrl: ToastController,
    private _fb: FormBuilder,
    private _authService: AuthService,
    private modalCtrl: ModalController,
    private eventService: EventService
  ) {

  }

  ngOnInit() {

    this.min = '1930/01/01';

    const d = new Date();
    this.max = (this.platform.is('mobile')) ? d.getFullYear() + '-12-12' : d;

    if (!this.transfer.transfer_id) {

      // Load List of All Candidates Assigned to this Company
      this._loadCandidateListThenInitialize();

    } else {
      this.pageTitle = 'Edit Transfer';

      this.loadTransferDetail();
    }
  }

  /**
   * Load List of All Candidates Assigned to this Company
   * Initialise the form once loaded.
   */
  async _loadCandidateListThenInitialize() {

    const loader = await this._loadingCtrl.create();
    loader.present();

    this.companyService.getWithCandidates(this.transfer.company_id).subscribe(response => {
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
          transferCandidate.candidate = this.removeUnwantedData(allTransferCandidateRecordsMapped[transferCandidate.candidate_id].candidate);
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
      formControls['bonus[' + record.candidate.candidate_id + ']'] = [record.bonus, [
        CustomValidator.negativeNumberValidator
      ]];
    });

    formControls.start_date = [(this.transfer && this.transfer.start_date) ? this.transfer.start_date : '', [
      Validators.required
    ]];
    formControls.end_date = [(this.transfer && this.transfer.end_date) ? this.transfer.end_date : '', [
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

    this.ready = true;
  }

  /**
   * Validate candidate data before submit
   */
  async validate() {
    let error = '';

    for (const entry of this.transfer.transferCandidates) {
      // Check if any candidates have unset hours or 0 hours set
      if (!entry.hours || entry.hours == 0) {
        error = 'You have set that some employees haven\'t worked any hours. Are you sure?';
      }

      // Check if any candidates have worked more than 180 hours
      if (entry.hours > 180) {
        error = 'You have employees set to have worked for more than 180 hours. are you sure?';
      }

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
    this.transferService.updateTransfer(this.transfer, this.form.value.start_date, this.form.value.end_date) :
    this.transferService.save(this.transfer, this.form.value.start_date, this.form.value.end_date);

    action.subscribe(async jsonResponse => {
      loader.dismiss();

      // On Success. Show Toast with the response message and close the page
      if (jsonResponse.operation == 'success') {

        this.eventService.reloadStats$.next({
          company_id: this.transfer.company_id
        });

        const toast = await this._toastCtrl.create({
          message: jsonResponse.message,
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
          message: this._authService.errorMessage(jsonResponse.message),
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
        const bonus = this.parseNumber(transferCandidate.bonus);
        this.total += (hours * transferCandidate.candidate.company.company_hourly_rate) + bonus;
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
    this.modalCtrl.dismiss(data);
  }

  /**
   * loading transfer
   */
  async loadTransferDetail() {
    const loading = await this._loadingCtrl.create();
    loading.present();

    this.transferService.transferIdDetails(this.transfer.transfer_id).subscribe(response => {
      loading.dismiss();
      this.transfer = response;

      // Load List of All Candidates Assigned to this Company
      this._loadCandidateListThenInitialize();
    });
  }

  async openCalendar() {
    const options: CalendarModalOptions = {
      canBackwardsSelected: true,
      pickMode: 'range',
      title: '',
      defaultScrollTo: new Date(this.transfer.end_date ? this.transfer.end_date : new Date()),
      defaultDateRange: {
        from: new Date(this.transfer.start_date ? this.transfer.start_date : ''),
        to: new Date(this.transfer.end_date ? this.transfer.end_date : '')
      }
    };

    const myCalendar = await this.modalCtrl.create({
      component: CalendarModal,
      cssClass: 'modal-calender',
      componentProps: { options }
    });

    myCalendar.present();

    const event: any = await myCalendar.onDidDismiss();
    const date = event.data;

    if (date) {
      const from: CalendarResult = date.from;
      const to: CalendarResult = date.to;
      if (from.string) {
        this.form.controls.start_date.setValue(from.string);
        this.transfer.start_date = from.string;
      }
      if (to.string) {
        this.form.controls.end_date.setValue(to.string);
        this.transfer.end_date = to.string;
      }
    }
  }

  /**
   * Make date readable by Safari
   * @param date
   */
   toDate(date) {
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
      return (candidates.bonus > 0 || candidates.hours > 0 );
    });
  }
}
