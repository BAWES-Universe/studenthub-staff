import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AlertController, ModalController, NavController} from '@ionic/angular';

// model
import {AuthService} from "../../../../providers/auth.service";
import {Expense} from "../../../../models/expense";
import {ExpenseService} from "../../../../providers/logged-in/expense.service";
import {AwsService} from "../../../../providers/aws.service";
import {Subscription} from "rxjs";
import {SentryErrorhandlerService} from "../../../../providers/sentry.errorhandler.service";
import { AnalyticsService } from 'src/app/providers/analytics.service';


@Component({
  selector: 'app-expense-form',
  templateUrl: './expense-form.page.html',
  styleUrls: ['./expense-form.page.scss'],
})
export class ExpenseFormPage implements OnInit, OnDestroy {

  @ViewChild('fileInput', { static: false }) fileInput: ElementRef;

  public model: Expense = new Expense();
  public brands: any = [];
  public operation: string;
  public mallUUID = null;
  public form: FormGroup;
  public loading = false;

  public borderLimit = false;

  public progress;

  public filePickSubscription: Subscription;
  public browserUploadSubscription: Subscription;
  public uploadSubscription: Subscription;
  public currentTarget;

  constructor(
    public activatedRoute: ActivatedRoute,
    public awsService: AwsService,
    public expenseService: ExpenseService,
    public sentryService: SentryErrorhandlerService,
    private fb: FormBuilder,
    private modelCtrl: ModalController,
    private navCtrl: NavController,
    private alertCtrl: AlertController,
    private authService: AuthService,
    public analyticService: AnalyticsService
  ) {
  }

  ngOnInit() {
    this.analyticService.page('Mall Form Page');

    if(!this.mallUUID)
      this.mallUUID = this.activatedRoute.snapshot.paramMap.get('id');

    // Load the passed model if available
    const state = window.history.state;
    if (state.model) {
      this.model = state.model;
    }

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
    // Init Form
    if (!this.model.staff_expense_uuid){ // Show Create Form
      this.operation = 'Create';
      this.form = this.fb.group({
        supplier: ['', Validators.required],
        category: ['', Validators.required],
        purchase_date: ['', Validators.required],
        total_amount: ['', Validators.required],
        currency: [''],
        vat: [''],
        reimbursable: [''],
        description: [''],
        file: [''],
      });
    }else{ // Show Update Form
      this.operation = 'Update';
      this.form = this.fb.group({
        supplier: ['', Validators.required],
        category: ['', Validators.required],
        purchase_date: ['', Validators.required],
        total_amount: ['', Validators.required],
        currency: [''],
        vat: [''],
        reimbursable: [''],
        description: [''],
        file: [''],
      });
    }
  }

  /**
   * Update Model Data based on Form Input
   */
  updateModelDataFromForm(){
    this.model.supplier = this.form.value.supplier;
    this.model.category = this.form.value.category;
    this.model.purchase_date = this.form.value.purchase_date;
    this.model.total_amount = this.form.value.total_amount;
    this.model.currency = this.form.value.currency;
    this.model.vat = this.form.value.vat;
    this.model.reimbursable = this.form.value.reimbursable;
    this.model.description = this.form.value.description;
    this.model.file = this.form.value.file;
  }

  /**
   * Close the page
   */
  close(refresh = false){
    const data = { refresh };
    this.modelCtrl.getTop().then(e => {
      if (e) {
        this.modelCtrl.dismiss(data);
      } else {
        this.navCtrl.back();
      }
    })

  }

  /**
   * Save the model
   */
  async save(){
    this.loading = true;

    this.updateModelDataFromForm();

    let action;
    if (!this.model.staff_expense_uuid){
      // Create
      action = this.expenseService.create(this.model);
    }else{
      // Update
      action = this.expenseService.update(this.model);
    }

    action.subscribe(async jsonResponse => {
      this.loading = false;

      // On Success
      if (jsonResponse.operation == 'success'){

        const prompt = await this.alertCtrl.create({
          message: this.authService.errorMessage(jsonResponse.message),
          buttons: ['Ok']
        });
        prompt.present();

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

  getResumeUrl() {

    if (this.form.controls['file'].value) {
      return decodeURIComponent(this.form.controls['file'].value);
    }

    if (this.form.controls['file'].value) {
      return this.awsService.permanentBucketUrl + 'staff-expenses/' + encodeURIComponent(this.form.controls['file'].value);
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

      // this.form.controls['tempPdfCVLocation'].setValue(event.Location);
      // this.form.controls['tempPdfCVLocation'].markAsDirty();

      this.form.updateValueAndValidity();

      this.progress = null;

    } else {
      this.currentTarget = event;
    }
  }

}
