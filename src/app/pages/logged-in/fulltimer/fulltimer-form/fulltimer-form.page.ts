import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController, ModalController, Platform } from '@ionic/angular';
import { Subscription } from 'rxjs';
// service
import { AuthService } from "../../../../providers/auth.service";
import { CountryService } from 'src/app/providers/logged-in/country.service';
import { FulltimerService } from 'src/app/providers/logged-in/fulltimer.service';
import { AwsService } from 'src/app/providers/aws.service';
import { FilepickerService } from 'src/app/providers/logged-in/filepicker.service';
import { SentryErrorhandlerService } from 'src/app/providers/sentry.errorhandler.service';
// model
import { Fulltimer, FulltimerTag } from 'src/app/models/fulltimer';
//pages
import { FulltimerLocationPage } from '../fulltimer-location/fulltimer-location.page';
import { NationalityPage } from '../../pickers/nationality/nationality.page';
//validator
import { CustomValidator } from "../../../../validators/custom.validator";


@Component({
  selector: 'app-fulltimer-form',
  templateUrl: './fulltimer-form.page.html',
  styleUrls: ['./fulltimer-form.page.scss'],
})
export class FulltimerFormPage implements OnInit {

  @ViewChild('fileInput', { static: false }) fileInput: ElementRef;

  public model: Fulltimer = new Fulltimer();

  public progress;

  public currentTarget;

  public fulltimers: any = [];

  public operation: string;

  public fulltimerUUID = null;

  public form: FormGroup;

  public loading = false;

  public borderLimit = false;

  public filePickSubscription: Subscription;
  public browserUploadSubscription: Subscription;
  public uploadSubscription: Subscription;

  constructor(
    public platform: Platform,
    public activatedRoute: ActivatedRoute,
    public fulltimerService: FulltimerService,
    private fb: FormBuilder,
    private modalCtrl: ModalController,
    private alertCtrl: AlertController,
    public sentryService: SentryErrorhandlerService,
    public filepickerService: FilepickerService,
    public awsService: AwsService,
    public countryService: CountryService,
    private authService: AuthService
  ) {
  }

  ngOnInit() {

    this.fulltimerUUID = this.activatedRoute.snapshot.paramMap.get('id');

    // Load the passed model if available
    const state = window.history.state;

    if (state.model) {
      this.model = state.model;
    }

    this.initForm();
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

  initForm() {

    let tagCtrls = [];

    if(!this.model.fulltimerTags) {
      this.model.fulltimerTags = [];
    }
    
    for (let fulltimerTag of this.model.fulltimerTags) {
      tagCtrls.push(this.fb.group({
        tag: [fulltimerTag.tag]//, [Validators.required]
      }));
    }

    //show atleast one input for tag 

    tagCtrls.push(this.fb.group({
      tag: ['']//, [Validators.required]
    }));

    if (!this.model.fulltimer_uuid) { // Show Create Form

      this.operation = 'Create';

      this.form = this.fb.group({
        nationality_id: ['', Validators.required],
        nationality: ['', Validators.required],
        area_uuid: ['', Validators.required],
        country_id: ['', Validators.required],
        latitude: ['', Validators.required],
        longitude: ['', Validators.required],
        name: ['', Validators.required],
        phone: ['', [Validators.required, Validators.pattern('^[0-9-+\s()]*$')]],
        email: ['', [Validators.required, CustomValidator.emailValidator]],
        pdf_cv: [''],
        fulltimerTags: new FormArray(tagCtrls),
        location: ['', Validators.required],
        tempPdfCVLocation: [''],
      });

    } else { // Show Update Form

      this.operation = 'Update';

      let location, nationality;

      if (this.model.area && this.model.country) {
        location = this.model.area.area_name_en + ', ' + this.model.country.country_name_en;
      }

      if (this.model.nationality) {
        nationality = this.model.nationality.country_name_en;
      }

      this.form = this.fb.group({
        nationality_id: [this.model.nationality_id, Validators.required],
        nationality: [nationality, Validators.required],
        area_uuid: [this.model.fulltimer_area_uuid, Validators.required],
        country_id: [this.model.country_id, Validators.required],
        latitude: [this.model.fulltimer_latitude, Validators.required],
        longitude: [this.model.fulltimer_longitude, Validators.required],
        name: [this.model.fulltimer_name, Validators.required],
        phone: [this.model.fulltimer_phone, Validators.required],
        email: [this.model.fulltimer_email, Validators.required],
        pdf_cv: [this.model.fulltimer_pdf_cv, Validators.required],
        fulltimerTags: new FormArray(tagCtrls),
        location: [location, Validators.required],
        tempPdfCVLocation: [''],
      });
    }
  }

  // convenience getters for easy access to form fields
  get f() { return this.form.controls; }
  get fulltimerTags() { return this.f.fulltimerTags as FormArray; }

  removeTag(index) {
    this.fulltimerTags.removeAt(index);
    this.fulltimerTags.markAsDirty();
  }

  addTag() {
    this.fulltimerTags.push(this.fb.group({
      tag: ['']
    }));
  }

  /**
   * add new input
   * @param event
   * @param index
   */
  onTagChange(event, index) {

    // remove field on clearing it out + have next empty field

    if (this.fulltimerTags.length - index > 1 && event.target.value.length == 0) {
      return this.removeTag(index);
    }

    // check if new field is not added && something is typed
    if (((index - this.fulltimerTags.length) === -1) && event.target.value) {
      // adding new field
      this.addTag();
    }
  }

  removeResume(event) {
    event.preventDefault();
    event.stopPropagation();

    this.form.controls.pdf_cv.setValue(null);
    this.form.controls.pdf_cv.updateValueAndValidity();
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

  uploadCv(event) {

    event.preventDefault();
    event.stopPropagation();

    if (this.platform.is('hybrid')) {
      this.mobileUpload();
    } else {
      this.fileInput.nativeElement.click();
    }
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
   * cancel file upload
   */
  cancelUpload() {
    if (this.fileInput && this.fileInput.nativeElement) {
      this.fileInput.nativeElement.value = null;
    }

    this.progress = null;

    //this.uploading = false;

    this.currentTarget.abort();
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

      this.form.controls.pdf_cv.setValue(event.Key);
      this.form.controls.pdf_cv.markAsDirty();

      this.form.controls.tempPdfCVLocation.setValue(event.Location);
      this.form.controls.tempPdfCVLocation.markAsDirty();

      this.form.updateValueAndValidity();

      this.progress = null;

    } else {
      this.currentTarget = event;
    }
  }

  /**
   * return extension of uploaded file
   */
  get uploadedFileExtension() {
    const a = this.form.controls.pdf_cv.value.split('.');

    if (a) {
      return a[a.length - 1];
    }
  }

  getResumeUrl() {

    if (this.form.controls.tempPdfCVLocation.value) {
      return decodeURIComponent(this.form.controls.tempPdfCVLocation.value);
    }

    if (this.form.controls.pdf_cv.value) {
      return this.awsService.permanentBucketUrl + 'fulltimer-resume/' + encodeURIComponent(this.form.controls.pdf_cv.value);
    }
  }

  async selectNationality() {
    window.history.pushState({ navigationId: window.history.state.navigationId }, null, window.location.pathname);

    const modal = await this.modalCtrl.create({
      component: NationalityPage,
      componentProps: {
        fulltimer: this.model,
      }
    });
    modal.present();
    modal.onDidDismiss().then(e => {

      if (!e.data || e.data.from != 'native-back-btn') {
        window['history-back-from'] = 'onDidDismiss';
        window.history.back();
      }
    });

    const { data } = await modal.onWillDismiss();

    if (data && data.country) {
      this.form.controls.nationality_id.setValue(data.country.country_id);
      this.form.controls.nationality_id.markAsDirty();

      this.form.controls.nationality.setValue(data.country.country_name_en);
      this.form.controls.nationality.markAsDirty();

      this.form.updateValueAndValidity();
    }
  }

  /**
   * select fulltimer location
   */
  async updateLocation() {
    window.history.pushState({ navigationId: window.history.state.navigationId }, null, window.location.pathname);

    const modal = await this.modalCtrl.create({
      component: FulltimerLocationPage,
      componentProps: {
        fulltimer: this.model,
      }
    });
    modal.present();
    modal.onDidDismiss().then(e => {

      if (!e.data || e.data.from != 'native-back-btn') {
        window['history-back-from'] = 'onDidDismiss';
        window.history.back();
      }
    });

    const { data } = await modal.onWillDismiss();

    if (data && data.area_uuid) {
      this.form.controls.area_uuid.setValue(data.area_uuid);
      this.form.controls.area_uuid.markAsDirty();

      this.form.controls.country_id.setValue(data.country_id);
      this.form.controls.country_id.markAsDirty();

      this.form.controls.latitude.setValue(data.latitude);
      this.form.controls.latitude.markAsDirty();

      this.form.controls.longitude.setValue(data.longitude);
      this.form.controls.longitude.markAsDirty();

      this.form.controls.location.setValue(data.area.area_name_en + ', ' + data.country.country_name_en);
      this.form.controls.location.markAsDirty();

      this.form.updateValueAndValidity();
    }
  }

  /**
   * Update Model Data based on Form Input
   */
  updateModelDataFromForm() {
    this.model.nationality_id = this.form.value.nationality_id;
    this.model.country_id = this.form.value.country_id;
    this.model.fulltimer_area_uuid = this.form.value.area_uuid;
    this.model.fulltimer_latitude = this.form.value.latitude;
    this.model.fulltimer_longitude = this.form.value.longitude;
    this.model.fulltimer_name = this.form.value.name;
    this.model.fulltimer_phone = this.form.value.phone;
    this.model.fulltimer_email = this.form.value.email;
    this.model.fulltimer_pdf_cv = this.form.value.pdf_cv;
    this.model.fulltimerTags = this.form.value.fulltimerTags;
  }

  /**
   * Close the page
   */
  close(refresh = false) {
    const data = { refresh };
    this.modalCtrl.dismiss(data);
  }

  /**
   * Save the model
   */
  async save() {
    this.loading = true;

    this.updateModelDataFromForm();

    let action;
    if (!this.model.fulltimer_uuid) {
      // Create
      action = this.fulltimerService.create(this.model);
    } else {
      // Update
      action = this.fulltimerService.update(this.model);
    }

    action.subscribe(async jsonResponse => {
      this.loading = false;

      // On Success
      if (jsonResponse.operation == 'success') {
        // Close the page
        this.close(true);
      }

      // On Failure
      if (jsonResponse.operation == 'error') {
        const prompt = await this.alertCtrl.create({
          message: this.authService.errorMessage(jsonResponse.message),
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
