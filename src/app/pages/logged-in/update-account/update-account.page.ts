import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import {
  AlertController,
  ToastController,
  ModalController,
  IonButton,
  ActionSheetController,
  Platform
} from '@ionic/angular';
//models
import { Staff } from 'src/app/models/staff';
//services 
import { AuthService } from 'src/app/providers/auth.service';
import { Subscription } from "rxjs";
import { AwsService } from "src/app/providers/aws.service";
import { SentryErrorhandlerService } from "src/app/providers/sentry.errorhandler.service";
import { AccountService } from 'src/app/providers/logged-in/account.service';
import { CameraService } from "src/app/providers/logged-in/camera.service";
import { AnalyticsService } from 'src/app/providers/analytics.service';


@Component({
  selector: 'app-update-account',
  templateUrl: './update-account.page.html',
  styleUrls: ['./update-account.page.scss'],
})
export class UpdateAccountPage implements OnInit {

  public loading: boolean = false;

  public saving: boolean = false;

  public model: Staff;
 
  public form: FormGroup;

  public type: string = 'password';

  public borderLimit = false;

  @ViewChild('fileInput', { static: false }) fileInput: ElementRef;

  @ViewChild('btnChangePhoto', { static: false }) btnChangePhoto: IonButton;

  public progress;

  public uploadFileSubscription: Subscription;

  public currentTarget;

  constructor(
    private authService: AuthService,
    public accountService: AccountService,
    private _fb: FormBuilder,
    private alertCtrl: AlertController,
    private _toastCtrl: ToastController,
    public modalCtrl: ModalController,
    public awsService: AwsService,
    public _cameraService: CameraService,
    public actionSheetCtrl: ActionSheetController,
    public analytics: AnalyticsService,
    public sentryService: SentryErrorhandlerService,
    public platform: Platform
  ) {
  }

  ngOnInit() {

    this.analytics.page('Update Account Page');

    if (!this.model) {
      this.loadData();
    } else {
      this._initForm();
    }
  }

  loadData() {

    this.loading = true;

    /**
     * this.staffService.detail(this.staff_id).subscribe(res => {
      this.loading = false;
      this.staff = res;
    });
     */
    
    this.accountService.accountInfo().subscribe(response => {

      if(!this.model)
        this.model = new Staff;

      this.model.staff_name = response.name;
      this.model.staff_job_title = response.staff_job_title;
      this.model.staff_notification = response.staff_notification;
      this.model.staff_photo = response.staff_photo;

      this.loading = false;

      this._initForm();
    }, () => {

      this.loading = false;
    })
  }

  _initForm() { 

    this.form = this._fb.group({
      name: [this.model.staff_name, Validators.required],
      logo_path: [this.awsService.cloudinaryUrl + 'staff-photo/' + this.model.staff_photo],
      logo: [this.model.staff_photo],
      staff_job_title: [this.model.staff_job_title, Validators.required],
      staff_notification: [this.model.staff_notification]
    }); 
  }

  /**
   * Update Model Data based on Form Input
   */
  updateModelDataFromForm() {
    this.model.staff_name = this.form.value.name;
    this.model.staff_photo = this.form.value.logo;
    this.model.staff_job_title = this.form.value.staff_job_title;
  }

  /**
   * Close the page
   */
  close() {
    let data = { 'refresh': false };
    this.modalCtrl.dismiss(data);
  }

  /**
   * Save the model
   */
  async save() {

    this.saving = true;

    this.updateModelDataFromForm();

    this.accountService.update(this.model).subscribe(async jsonResponse => {

      this.saving = false;

      // On Success
      if (jsonResponse.operation == "success") {

        // Close the page
        let data = { 'refresh': true };
        this.modalCtrl.dismiss(data);

        //success toast
        let toast = await this._toastCtrl.create({
          message: "Staff Member " + this.model.staff_name + ' account created successfully',
          duration: 3000
        });
        toast.present();
      }

      // On Failure
      if (jsonResponse.operation == "error") {

        let prompt = await this.alertCtrl.create({
          message: this.authService.errorMessage(jsonResponse.message),
          buttons: ["Ok"]
        });
        prompt.present();
      }
    });
  }

  togglePasswordVisibility() {
    this.type = this.type == 'password' ? 'text' : 'password';
  }

  /**
   * Upload logo from mobile
   */
  mobileUpload() {

    const SelectSourceLbl = 'Select image source';
    const LoadLibLbl = 'Load from Library';
    const ErrorLibLbl = 'Error getting picture from Library: ';
    const UseCamLbl = 'Use Camera';
    const ErrorCamLbl = 'Error getting picture from Camera: ';

    const arrButtons = [
      {
        text: LoadLibLbl,
        handler: () => {

          this._cameraService.getImageFromLibrary().then((nativeImageFilePath) => {
            // Upload and process for progress
            this.uploadFileViaNativeFilePath(nativeImageFilePath);
          }, async (err) => {

            const ignoreErrors = [
              'No image picked',
              'User cancelled photos app'
            ];

            if (err && ignoreErrors.indexOf(err.message) > -1) {
              return null;
            }

            const alert = await this.alertCtrl.create({
              header: 'Error getting picture from Library',
              message: err.message,
              buttons: ['Okay']
            });

            await alert.present();
            this.progress = null;
          });
        }
      },
      {
        text: UseCamLbl,
        handler: () => {

          this._cameraService.getImageFromCamera().then((nativeImageFilePath) => {
            // Upload and process for progress
            this.uploadFileViaNativeFilePath(nativeImageFilePath);
          }, async (err) => {

            const ignoreErrors = [
              'No image picked',
              'User cancelled photos app'
            ];

            if (err && ignoreErrors.indexOf(err.message) > -1) {
              return null;
            }

            const alert = await this.alertCtrl.create({
              header: 'Error getting picture from Library',
              message: err.message,
              buttons: ['Okay']
            });

            await alert.present();
            this.progress = null;
          });
        }
      }
    ];

    // Display action sheet giving user option of camera vs local filesystem.
    this.actionSheetCtrl.create({
      header: SelectSourceLbl,
      buttons: arrButtons
    }).then(actionSheet => actionSheet.present());
  }

  /**
   * Upload logo by native path
   */
  async uploadFileViaNativeFilePath(uri) {
    this.progress = 1;//show loader

    this.awsService.uploadNativePath(uri).then(o => {
      o.subscribe(event => {
        this._handleFileSuccess(event);
      }, async err => {

        this.progress = false;

        const ignoreErrors = [
          'No image picked',
          'User cancelled photos app',
        ];

        if (err && ignoreErrors.indexOf(err.message) > -1) {
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
          message: message,
          buttons: ['Okay']
        });

        await alert.present();
      });
    });
  }

  /**
   * Upload logo from browser
   * @param event
   */
  async browserUpload(event) {

    const fileList: FileList = event.target.files;

    if (fileList.length == 0) {
      return false;
    }

    const prefix = fileList[0].name.split('.')[0];

    const type = fileList[0].type.split('/')[0];

    if (type != 'image') {
      this.alertCtrl.create({
        message: 'Invalid File format',
        buttons: ['Ok']
      }).then(alert => { alert.present(); });
    }
    else {
      this.progress = 1;

      this.uploadFileSubscription = this.awsService.uploadFile(fileList[0]).subscribe(event => {
        this._handleFileSuccess(event);
      }, async err => {

        // log to sentry

        this.sentryService.handleError(err);

        if (this.fileInput && this.fileInput.nativeElement) {
          this.fileInput.nativeElement.value = null;
        }

        const alert = await this.alertCtrl.create({
          header: 'Error',
          message: 'Error while uploading file!',
          buttons: ['Okay']
        });

        await alert.present();

        this.progress = false;
      }, () => {
        this.uploadFileSubscription.unsubscribe();
      });
    }
  }

  /**
   * Handle logo upload api response
   * @param event
   */
  _handleFileSuccess(event) {
    // Via this API, you get access to the raw event stream.
    // Look for upload progress events.
    if (event.type === 'progress') {
      // This is an upload progress event. Compute and show the % done:
      this.progress = Math.round(100 * event.loaded / event.total);
    } else if (event.Key && event.Key.length > 0) {

      if (this.fileInput && this.fileInput.nativeElement) {
        this.fileInput.nativeElement.value = null;
      }

      const imgLarge = new Image();
      imgLarge.src = event.Location;
      imgLarge.onload = () => {

        this.form.controls['logo_path'].setValue(event.Location);
        this.form.controls['logo'].setValue(event.Key);
        this.form.controls['logo'].markAsDirty();
        this.form.updateValueAndValidity();

        this.model.staff_photo = event.Key;

        this.progress = null;

      };
    } else {
      this.currentTarget = event;
    }
  }

  /**
   * Display options to update logo
   */
  async updatePhoto(ev) {
    if (this.platform.is('capacitor')) {
      this.mobileUpload();
    } else {
      this.fileInput.nativeElement.click();
    }
  }

  /**
   * trigger click event on change logo button
   */
  triggerUpdatePhoto($event) {
    $event.stopPropagation();
    document.getElementById('upload-pic').click();
    // this.fileInput.nativeElement.click();
  }

  onchange($event) {
    this.model.staff_notification = ($event.detail.checked) ? 1 : 0;
  }

  /**
   * cancel file upload
   */
  cancelUpload() {
    if (this.fileInput && this.fileInput.nativeElement) {
      this.fileInput.nativeElement.value = null;
    }

    this.progress = null;

    this.currentTarget.abort();
  }

  logScrolling(e) {
    this.borderLimit = (e.detail.scrollTop > 20) ? true : false;
  }
}
