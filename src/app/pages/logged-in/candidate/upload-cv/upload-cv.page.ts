import {Component, OnInit, ViewChild, ElementRef, OnDestroy} from '@angular/core';
import { Subscription } from 'rxjs';
import { AlertController, ModalController, Platform } from '@ionic/angular';

// services
import { SentryErrorhandlerService } from 'src/app/providers/sentry.errorhandler.service';
import { TranslateLabelService } from 'src/app/providers/translate-label.service';
import { AccountService } from 'src/app/providers/logged-in/account.service';
import { FilepickerService } from 'src/app/providers/logged-in/filepicker.service';
import { AwsService } from 'src/app/providers/aws.service';


@Component({
  selector: 'app-upload-cv',
  templateUrl: './upload-cv.page.html',
  styleUrls: ['./upload-cv.page.scss'],
})
export class UploadCvPage implements OnInit, OnDestroy {

  @ViewChild('fileInput', { static: false }) fileInput: ElementRef;

  public candidate;

  public progress;

  public loading = false;

  public dirty = false;

  public currentTarget;

  public filePickSubscription: Subscription;
  public browserUploadSubscription: Subscription;
  public uploadSubscription: Subscription;

  constructor(
    public platform: Platform,
    public modalCtrl: ModalController,
    public alertCtrl: AlertController,
    public accountService: AccountService,
    public translateService: TranslateLabelService,
    public sentryService: SentryErrorhandlerService,
    public filepickerService: FilepickerService,
    public awsService: AwsService
  ) { }

  ngOnInit() {
  }

  ngOnDestroy() {

    if (!!this.uploadSubscription) {
      this.uploadSubscription.unsubscribe();
    }

    if (!!this.filePickSubscription) {
      this.filePickSubscription.unsubscribe();
    }

    if (!!this.browserUploadSubscription) {
      this.browserUploadSubscription.unsubscribe();
    }
  }

  /**
   * is given extension is valid/allowed for file upload
   * @param extension
   */
  isValidExtension(extension) {

    const allowedExtensions = [];

    const arrExt = ['pdf'];

    for (const ext of arrExt) {
      allowedExtensions.push(ext.replace('.', ''));
    }

    return allowedExtensions.indexOf(extension) > -1;
  }

  /**
   * Upload file in mobile device
   */
  mobileUpload() {
    this.filePickSubscription = this.filepickerService.pick().subscribe(async uri => {

      // validate extension

      /*let extension = uri.split('.').pop();

      if(!this.isValidExtension(extension)) {

          const alert = await this._alertCtrl.create({
              header: this.translateService.transform('Invalid file'),
              message: this.translateService.transform('txt_invalid_file_format', { value: this.allwedFormats() }),
              buttons: [this.translateService.transform('Okay')]
          });

          return alert.present();
      }*/

      this.progress = 1; // show loader

      this.awsService.uploadNativePath(uri).then(o => {
        o.subscribe(event => {
          this._handleFileSuccess(event);
        }, async err => {

          this.progress = null;

          const ignoreErrors = [
            'No image picked',
            'User cancelled photos app',
          ];

          if (
            err && (
              ignoreErrors.indexOf(err.message) > -1 ||
              err.message.includes('aborted')
            ) 
          ) {
            return null;
          }

          // log to slack/sentry to know how many user getting file upload error

          this.sentryService.handleError(err);

          // always show abstract error message

          let message;

          const networkErrors = [
            '504:null',
            'NetworkingError: Network Failure'
          ];

          // networking errors
          if (err && networkErrors.indexOf(err.message) > -1) {
            message = this.translateService.transform('Error uploading file');
            // system errors
          } else if (err.message && err.message.indexOf(':') > -1) {
            message = this.translateService.transform('Error getting file from Library');
            // plugin errors
          } else if (err.message) {
            message = err.message;
            // custom file validation errors
          } else {
            message = err;
          }

          const alert = await this.alertCtrl.create({
            header: this.translateService.transform('Error'),
            message,
            buttons: [this.translateService.transform('Okay')]
          });

          await alert.present();
        });
      });
    });
  }

  /**
   * Upload file in browser platform
   * @param event
   */
  browserUpload(event) {
    const fileList: FileList = event.target.files;

    if (fileList.length == 0) {
      return false;
    }

    this.progress = 1; // show loader

    this.browserUploadSubscription = this.awsService.uploadFile('_', fileList[0]).subscribe(event => {
      this._handleFileSuccess(event);
    },
      async err => {
        // log to slack/sentry to know how many user getting file upload error
  
        if(!err.message || !err.message.includes('aborted')) {
          
          const alert = await this.alertCtrl.create({
            header: this.translateService.transform('Error'),
            message: this.translateService.transform('Error while uploading file!'),
            buttons: [this.translateService.transform('Okay')]
          });
          await alert.present();

          this.sentryService.handleError(err);
        }

        if (this.fileInput && this.fileInput.nativeElement) {
          this.fileInput.nativeElement.value = null;
        }

        this.progress = null;
      });
  }

  /**
   * Handle file upload success
   * @param event
   */
  public _handleFileSuccess(event) {

    // Via this API, you get access to the raw event stream.
    // Look for upload progress events.
    if (event.type === 'progress') {
      // This is an upload progress event. Compute and show the % done:
      this.progress = Math.round(100 * event.loaded / event.total);

    } else if (event.Key && event.Key.length > 0) {

      if (this.fileInput && this.fileInput.nativeElement) {
        this.fileInput.nativeElement.value = null;
      }

      this.dirty = true;
      this.dismiss({resume: event.Key});
      // this.uploadSubscription = this.accountService.updateResume(event.Key).subscribe(res => {
      //
      //   this.progress = false;
      //
      //   if (res.operation == 'success') {
      //
      //     this.candidate.candidate_resume = res.candidate_resume;

      //   }
      //
      // }, () => {
      //   this.progress = false;
      // });

      // tempLocation = event.Location;

    } else {
      this.currentTarget = event;
    }
  }

  /**
   * close popup modal
   */
  dismiss(data = {}) {
    this.modalCtrl.getTop().then(overlay => {
      if (overlay) {
        this.modalCtrl.dismiss(data);
      }
    });
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

  /**
   * return extension of uploaded file
   */
  get uploadedFileExtension() {
    const a = this.candidate.candidate_resume.split('.');

    if (a) {
      return a[a.length - 1];
    }
  }

  getResumeUrl(candidate) {
    return this.awsService.permanentBucketUrl + 'candidate-resume/' + encodeURIComponent(candidate.candidate_resume);
  }
}
