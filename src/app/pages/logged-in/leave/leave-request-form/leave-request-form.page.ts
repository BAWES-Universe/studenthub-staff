import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {DailyStandupService} from "src/app/providers/logged-in/daily-standup.service";
import {AuthService} from "src/app/providers/auth.service";
import {AlertController, ModalController, NavController} from "@ionic/angular";
import {CalendarModal, CalendarModalOptions} from "ion2-calendar";
import {StaffLeaveService} from "../../../../providers/logged-in/staff-leave.service";
import {AwsService} from "../../../../providers/aws.service";
import {Subscription} from "rxjs";
import {SentryErrorhandlerService} from "../../../../providers/sentry.errorhandler.service";

@Component({
  selector: 'app-leave-request-form',
  templateUrl: './leave-request-form.page.html',
  styleUrls: ['./leave-request-form.page.scss'],
})
export class LeaveRequestFormPage implements OnInit, OnDestroy {

  @ViewChild('fileInput', { static: false }) fileInput: ElementRef;

  dateRange: { from: string; to: string; };

  public form: FormGroup;
  public loading = false;

  public borderLimit = false;

  public range

  public progress;

  public filePickSubscription: Subscription;
  public browserUploadSubscription: Subscription;
  public uploadSubscription: Subscription;
  public currentTarget;

  constructor(
    public dailyStandupService: DailyStandupService,
    public staffLeaveService: StaffLeaveService,
    private fb: FormBuilder,
    private authService: AuthService,
    private modalCtrl: ModalController,
    private alertCtrl: AlertController,
    private navCtrl: NavController,
    private awsService: AwsService,
    private sentryService: SentryErrorhandlerService
  ) { }

  ngOnInit() {
    window.analytics.page('Leave Request Form Page');

    this.formInit();
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

  formInit() {

    this.form = this.fb.group({
      from_date: [null, Validators.required],
      to_date: [null, Validators.required],
      type: [null, Validators.required],
      note: [null],
      file: [null],
    });
  }

  /**
   * Close the page
   */
  close(refresh = false){
    const data = { refresh };
    this.modalCtrl.getTop().then(res => {
      if (res) {
        this.modalCtrl.dismiss(data);
      } else {
        this.navCtrl.back();
      }
    });
  }

  /**
   * Save the model
   */
  async save(){
    this.loading = true;

    this.staffLeaveService.create(this.form.value).subscribe(async jsonResponse => {

      this.loading = false;

      // On Success
      if (jsonResponse.operation == 'success'){

        const prompt = await this.alertCtrl.create({
          header: 'success',
          message: this.authService.errorMessage(jsonResponse.message),
          buttons: ['Ok']
        });
        prompt.present();

        // Close the page
        this.close(true);
      }

      // On Failure
      if (jsonResponse.operation == 'error'){
        const prompt = await this.alertCtrl.create({
          message: this.authService.errorMessage(jsonResponse.message),
          buttons: ['Ok']
        });
        prompt.present();
      }
    });
  }

  logScrolling(e) {
    this.borderLimit = (e.detail.scrollTop > 20);
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
      // this.form.value.from_date
      this.form.controls['from_date'].setValue(date.from.string);
      this.form.controls['to_date'].setValue(date.to.string);

      this.range = date.from.string + '-' + date.to.string;
    }
  }

  getFileUrl() {

    if (this.form.controls['file'].value) {
      return decodeURIComponent(this.form.controls['file'].value);
    }

    if (this.form.controls['file'].value) {
      return this.awsService.permanentBucketUrl + 'staff-leave/' + encodeURIComponent(this.form.controls['file'].value);
    }
  }

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

  removeResume(event) {
    event.preventDefault();
    event.stopPropagation();

    this.form.controls['file'].setValue(null);
    this.form.controls['file'].updateValueAndValidity();
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

      this.form.controls['file'].setValue(event.Key);
      this.form.controls['file'].markAsDirty();

      this.form.updateValueAndValidity();

      this.progress = null;

    } else {
      this.currentTarget = event;
    }
  }
}
