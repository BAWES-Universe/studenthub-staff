import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import {
  AlertController,
  IonContent,
  LoadingController,
  ModalController,
  NavController,
  Platform,
  ToastController
} from "@ionic/angular";
import { ActivatedRoute } from "@angular/router";
import { Subscription } from 'rxjs';
//models
import { Transfer } from "../../../../models/transfer";
//services
import { TransferService } from "../../../../providers/logged-in/transfer.service";
import { TranslateLabelService } from 'src/app/providers/translate-label.service';
import { AwsService } from 'src/app/providers/aws.service';
import { SentryErrorhandlerService } from 'src/app/providers/sentry.errorhandler.service';
import {
  CalendarModal,
  CalendarModalOptions,
  DayConfig,
  CalendarResult,
  CalendarComponentOptions
} from 'ion2-calendar';
import { DefaultDate } from "ion2-calendar/dist/calendar.model";


@Component({
  selector: 'app-import-transfer-form',
  templateUrl: './import-transfer-form.page.html',
  styleUrls: ['./import-transfer-form.page.scss'],
})
export class ImportTransferFormPage implements OnInit {

  // Html Content
  @ViewChild(IonContent) content: IonContent;

  // File input used for browser fallback when no capacitor is available
  @ViewChild('fileInput', { static: false }) fileInput: ElementRef;

  public browserUploadSubscription: Subscription;

  // The Transfer containing all records
  public transfer_id;
  public transfer: Transfer;
  public scenario: string = 'create';

  public company_id;

  // Page Title depends on Operation (Create vs Edit Transfer)
  public pageTitle: string = "Create Transfer via Excel";

  public uploading: Boolean = false;
  public min; // min date
  public max; // max date
  public start_date; // max date
  public end_date; // max date

  constructor(
    public activatedRoute: ActivatedRoute,
    public navCtrl: NavController,
    public transferService: TransferService,
    public awsService: AwsService,
    public sentryService: SentryErrorhandlerService,
    public translateService: TranslateLabelService,
    private _loadingCtrl: LoadingController,
    private _alertCtrl: AlertController,
    public _toastCtrl: ToastController,
    public platform: Platform,
    public modalCtrl: ModalController,
  ) {
  }

  ngOnInit() {

    this.transfer_id = this.activatedRoute.snapshot.paramMap.get('id');
    this.company_id = this.activatedRoute.snapshot.paramMap.get('company_id');

    this.min = '1930/01/01';

    const d = new Date();
    this.max = (this.platform.is('mobile')) ? d.getFullYear() + '-12-12' : d;

    const state = window.history.state;
    // Load the passed model (required)
    if (state['transfer']) {
      this.transfer = state['transfer'];
      // Update Page Title if Editing a Transfer that already exists in backend
      if (this.transfer.transfer_id) 
        this.pageTitle = "Edit Transfer via Excel";

      this.scenario = 'update'
    }
    if (!this.transfer && this.transfer_id) {
      this.loadTransferData();
    }
  }

  ngOnDestroy() {
    if (!!this.browserUploadSubscription) {
      this.browserUploadSubscription.unsubscribe();
    }
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

      if (this.scenario == 'update') {
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

    this.transferService.uploadTransferExcel(file, this.start_date, this.end_date, this.company_id).subscribe(async data => {

      this.uploading = false;

      if (data.operation == 'success') {

        let prompt = await this._alertCtrl.create({
          message: data.message,
          buttons: ["Ok"]
        });
        prompt.present();

        this.navCtrl.navigateBack('transfer-view/' + data.transfer_id);
        // this.navCtrl.push(TransferViewPage, {
        //   'model': data.transfer_id
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
      .updateTransferUploadExcel(file, this.transfer.transfer_id, this.start_date, this.end_date)
      .subscribe(async data => {

        this.uploading = false;

        if (data.operation == 'success') {

          let prompt = await this._alertCtrl.create({
            message: data.message,
            buttons: ["Ok"]
          });
          prompt.present();

          this.navCtrl.navigateForward('transfer-view/' + this.transfer.transfer_id, {
            state: {
              refresh: true
            }
          })
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
      }, () => {
        this.uploading = false;
      });
  }

  /**
   * download transfer template invoice
   */
  async downloadTemplate() {
    let loader = await this._loadingCtrl.create();
    loader.present();
    this.transferService.downloadTransferTemplate(this.company_id).subscribe(response => {
      loader.dismiss();
    });
  }

  async loadTransferData() {
    // Load list of transfer
    let loader = await this._loadingCtrl.create();
    loader.present();

    this.transferService.transferIdDetails(this.transfer_id).subscribe(response => {
      this.transfer = response;
      // Update Page Title if Editing a Transfer that already exists in backend
      this.pageTitle = "Edit Transfer via Excel";
      this.scenario = 'update';

      loader.dismiss();
    });
  }

  async openCalendar() {
    const options: CalendarModalOptions = {
      canBackwardsSelected: true,
      pickMode: 'range',
      title: 'RANGE',
      defaultScrollTo: new Date(this.end_date ? this.end_date : new Date()),
      defaultDateRange: {
        from: new Date(this.start_date ? this.start_date : ''),
        to: new Date(this.end_date ? this.end_date : '')
      }
    };

    const myCalendar = await this.modalCtrl.create({
      component: CalendarModal,
      componentProps: { options }
    });

    myCalendar.present();

    const event: any = await myCalendar.onDidDismiss();
    const date = event.data;
    if (date) {
      const from: CalendarResult = date.from;
      const to: CalendarResult = date.to;
      if (from.string) {
        this.start_date = from.string;
      }
      if (to.string) {
        this.end_date = to.string;
      }
    }
  }
}
