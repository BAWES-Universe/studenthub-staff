import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AlertController, IonContent, LoadingController, ModalController, ToastController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { Company } from 'src/app/models/company';
//services
import { AnalyticsService } from 'src/app/providers/analytics.service';
import { AwsService } from 'src/app/providers/aws.service';
import { TransferService } from 'src/app/providers/logged-in/transfer.service';
import { SentryErrorhandlerService } from 'src/app/providers/sentry.errorhandler.service';
import { TranslateLabelService } from 'src/app/providers/translate-label.service';


@Component({
  selector: 'app-transfer-rates',
  templateUrl: './transfer-rates.page.html',
  styleUrls: ['./transfer-rates.page.scss'],
})
export class TransferRatesPage implements OnInit {

  // Html Content
  @ViewChild(IonContent) content: IonContent;

  // File input used for browser fallback when no capacitor is available
  @ViewChild('fileInput', { static: false }) fileInput: ElementRef;

  public company: Company;
  
  public browserUploadSubscription: Subscription;

  public borderLimit: boolean = false;
  public uploading: Boolean = false;

  constructor(
    public transferService: TransferService,
    public loadingCtrl: LoadingController,
    public modalCtrl: ModalController,
    private alertCtrl: AlertController,
    public toastCtrl: ToastController,
    public sentryService: SentryErrorhandlerService,
    public translateService: TranslateLabelService,
    public awsService: AwsService,
    public analyticService: AnalyticsService
  ) { }
 
  ngOnInit() {
    this.analyticService.page('Import Transfer Rates Page');
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

      const alert = await this.alertCtrl.create({
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

      this.transferRatesUpload(event.Key);
    }
  }

  /**
   * new transfer upload excel
   * @param file
   */
  async transferRatesUpload(file) {

    this.transferService.uploadTransferRatesExcel(this.company.company_id, file).subscribe(async data => {

      this.uploading = false;

      if (data.operation == 'success') {
 
        let prompt = await this.alertCtrl.create({
          message: this.translateService.errorMessage(data.message),
          buttons: ["Ok"]
        });
        prompt.present();

        this.dismiss({ refresh: true });
      }

      // On Failure
      if (data.operation == "error") {

        let prompt = await this.alertCtrl.create({
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
   * download transfer template 
   */
  async downloadTemplate(preFilled = false) {
    let loader = await this.loadingCtrl.create();
    loader.present();
    this.transferService.downloadTransferRatesTemplate(this.company.company_id, preFilled).subscribe(() => {
      loader.dismiss();
    });
  }

  logScrolling(e) {
    this.borderLimit = (e.detail.scrollTop > 20);
  }

  dismiss(data = {}) {
    this.modalCtrl.getTop().then(o => {
      if(o) {
        o.dismiss(data); 
      }
    });
  }
}
