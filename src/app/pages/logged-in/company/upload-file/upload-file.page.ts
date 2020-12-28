import { Component, OnInit, ViewChild, ElementRef, OnDestroy, Input } from '@angular/core';
import { Subscription } from 'rxjs';
import { AlertController, ModalController, Platform, ToastController } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
//models
import { File } from '../../../../models/file';
// Services
import { SentryErrorhandlerService } from 'src/app/providers/sentry.errorhandler.service';
import { FilepickerService } from 'src/app/providers/logged-in/filepicker.service';
import { AwsService } from 'src/app/providers/aws.service';
import { CompanyService } from '../../../../providers/logged-in/company.service';
import {EventService} from "../../../../providers/event.service";


@Component({
  selector: 'app-upload-file',
  templateUrl: './upload-file.page.html',
  styleUrls: ['./upload-file.page.scss'],
})
export class UploadFilePage implements OnInit, OnDestroy {

  @ViewChild('fileInput', { static: false }) fileInput: ElementRef;

  @Input() file;

  public borderLimit = false;

  public fileModel: File = new File();
  public company;

  public progress = null;
  public form: FormGroup;
  public loading = false;

  public dirty = false;
  public saving = false;

  public currentTarget;
  public tempLocation;

  public filePickSubscription: Subscription;
  public browserUploadSubscription: Subscription;
  public uploadSubscription: Subscription;

  constructor(
    public platform: Platform,
    public modalCtrl: ModalController,
    public toastCtrl: ToastController,
    public alertCtrl: AlertController,
    public fb: FormBuilder,
    public companyService: CompanyService,
    public sentryService: SentryErrorhandlerService,
    public filepickerService: FilepickerService,
    public awsService: AwsService,
    public eventService: EventService
  ) { }

  ngOnInit() {
    this._initForm();
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
            message = 'Error uploading file';
            // system errors
          } else if (err.message && err.message.indexOf(':') > -1) {
            message = 'Error getting file from Library';
            // plugin errors
          } else if (err.message) {
            message = err.message;
            // custom file validation errors
          } else {
            message = err;
          }

          const alert = await this.alertCtrl.create({
            header: 'Error',
            message,
            buttons: ['Okay']
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

    this.browserUploadSubscription = this.awsService.uploadFile(fileList[0]).subscribe(event => {
      this._handleFileSuccess(event);
    },
      async err => {
        // log to slack/sentry to know how many user getting file upload error

        if (!err.message || !err.message.includes('aborted')) {

          const alert = await this.alertCtrl.create({
            header: 'Error',
            message: 'Error while uploading file!',
            buttons: ['Okay']
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
      this.form.controls.file.setValue(event.Key);
      this.form.controls.file.markAsDirty();
      this.fileModel.file_s3_path = event.Key;
      this.tempLocation = event.Location;
      this.progress = false;
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
    const a = this.fileModel.file_s3_path.split('.');

    if (a) {
      return a[a.length - 1];
    }
  }

  /**
   * init form
   */
  _initForm() {
    this.form = this.fb.group({
      title: ['', Validators.required],
      desc: [''],
      file: ['', Validators.required]
    });
  }

  async save() {
    this.saving = true;
    this.fileModel.file_title = this.form.value.title;
    this.fileModel.file_description = this.form.value.desc;
    this.fileModel.company_id = this.company.company_id;
    this.companyService.createFile(this.fileModel).subscribe(async jsonResponse => {
      this.saving = false;

      // On Success
      if (jsonResponse.operation == 'success') {
        this.eventService.reloadStats$.next();
        // open view page
        this.dismiss({ refresh: true });

        const toast = await this.toastCtrl.create({
          message: jsonResponse.message,
          duration: 3000
        });
        toast.present();
      }

      // On Failure
      if (jsonResponse.operation == 'error') {
        let html = '';

        for (const i in jsonResponse.message) {
          for (const j of jsonResponse.message[i]) {
            html += j + '<br />';
          }
        }

        const prompt = await this.alertCtrl.create({
          message: html,
          buttons: ['Ok']
        });
        prompt.present();
      }
    });
  }

  logScrolling(e) {
    this.borderLimit = (e.detail.scrollTop > 20) ? true : false;
  }
}
