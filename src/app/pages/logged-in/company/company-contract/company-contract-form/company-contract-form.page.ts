import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActionSheetController, AlertController, ModalController, NavController, Platform, ToastController } from '@ionic/angular';
import { Contract } from 'src/app/models/contract';
import { FixedPriceContract } from 'src/app/models/fixed-price-contract';
import { HourlyContract } from 'src/app/models/hourly-contract';
import { MonthlySalaryContract } from 'src/app/models/monthly-salary-contract';
import { AnalyticsService } from 'src/app/providers/analytics.service';
import { AuthService } from 'src/app/providers/auth.service';
import { AwsService } from 'src/app/providers/aws.service';
import { CameraService } from 'src/app/providers/camera.service';
import { EventService } from 'src/app/providers/event.service';
import { ContractService } from 'src/app/providers/logged-in/contract.service';
import { SentryErrorhandlerService } from 'src/app/providers/sentry.errorhandler.service';

@Component({
  selector: 'app-company-contract-form',
  templateUrl: './company-contract-form.page.html',
  styleUrls: ['./company-contract-form.page.scss'],
})
export class CompanyContractFormPage implements OnInit {

  public saving = false;

  public model: Contract;

  public operation: string;

  public form: FormGroup;

  public borderLimit = false;

  constructor(
    public platform: Platform,
    public authService: AuthService,
    public _cameraService: CameraService,
    public contractService: ContractService,
    public sentryService: SentryErrorhandlerService,
    public awsService: AwsService,
    private _fb: FormBuilder,
    public navCtrl: NavController,
    public actionSheetCtrl: ActionSheetController,
    private alertCtrl: AlertController,
    public modalCtrl: ModalController,
    private _toastCtrl: ToastController,
    private eventService: EventService,
    public analyticService: AnalyticsService
  ) { }

  ngOnInit() {
    this.analyticService.page('Contract Form Page');

    this._initForm();
  }

  /**
   * init form
   */
  _initForm() {
 
    if (!this.model){ // Show Create Form
      this.operation  = 'Add Contract';
    } else { // Show Update Form
      this.operation  = 'Update Contract';
    }
 
    this.form = this._fb.group({
      type: [null, Validators.required],
      detail: [this.model?.detail, Validators.required],

      start_date: [this.model?.start_date],
      end_date: [this.model?.end_date],
      transfer_cost: [this.model?.transfer_cost],
      currency_code: [this.model?.currency_code || "KWD"],
       
      //FixedPriceContract
      candidate_total: [this.model?.amount?.candidate_total],
      company_total: [this.model?.amount?.company_total],
      completion_percentage: [this.model?.amount?.completion_percentage],
      
      //HourlyContract
      candidate_hourly_rate: [this.model?.amount?.candidate_hourly_rate],
      company_hourly_rate: [this.model?.amount?.company_hourly_rate],

      //MonthlySalaryContract
      salary_day: [this.model?.amount?.salary_day],

      //fixedPriceContract: FixedPriceContract;
      //hourlyContract: HourlyContract;
      //monthlySalaryContract: MonthlySalaryContract;
      //amount: any;//FixedPriceContract | HourlyContract | MonthlySalaryContract
  
      /*logo_path: [
        this.model? this.awsService.cloudinaryUrl + 'company-brand/' + this.model.brand_logo: ""
      ],
      logo: [this.model.brand_logo],*/
    });
    //todo: set validation based on type


    this.form.get('type').valueChanges.subscribe(val => {
      
      if (val == "FIXED_PRICE") {
        this.form.get('candidate_total').setValidators([Validators.required]);
        this.form.get('company_total').setValidators([Validators.required]);
        this.form.get('completion_percentage').setValidators([Validators.required]);

        this.form.get('candidate_hourly_rate').setValue(null);
        this.form.get('candidate_hourly_rate').clearValidators();
        this.form.get('candidate_hourly_rate').updateValueAndValidity();

        this.form.get('company_hourly_rate').setValue(null);
        this.form.get('company_hourly_rate').clearValidators();
        this.form.get('company_hourly_rate').updateValueAndValidity();
        
        this.form.get('salary_day').setValue(null);
        this.form.get('salary_day').clearValidators();
        this.form.get('salary_day').updateValueAndValidity();
         
      } else if (val == "HOURLY") {
        this.form.get('candidate_hourly_rate').setValidators([Validators.required]);
        this.form.get('company_hourly_rate').setValidators([Validators.required]);

        this.form.get('candidate_total').setValue(null);
        this.form.get('candidate_total').clearValidators();
        this.form.get('candidate_total').updateValueAndValidity();

        this.form.get('company_total').setValue(null);
        this.form.get('company_total').clearValidators();
        this.form.get('company_total').updateValueAndValidity();
        
        this.form.get('completion_percentage').setValue(null);
        this.form.get('completion_percentage').clearValidators();
        this.form.get('completion_percentage').updateValueAndValidity();

        this.form.get('salary_day').setValue(null);
        this.form.get('salary_day').clearValidators();
        this.form.get('salary_day').updateValueAndValidity();

      } else if (val == "MONTHLY_SALARY") {
        this.form.get('salary_day').setValidators([Validators.required]);
        this.form.get('candidate_total').setValidators([Validators.required]);
        this.form.get('company_total').setValidators([Validators.required]);

        this.form.get('candidate_hourly_rate').setValue(null);
        this.form.get('candidate_hourly_rate').clearValidators();
        this.form.get('candidate_hourly_rate').updateValueAndValidity();
         
        this.form.get('company_hourly_rate').setValue(null);
        this.form.get('company_hourly_rate').clearValidators();
        this.form.get('company_hourly_rate').updateValueAndValidity();

        this.form.get('completion_percentage').setValue(null);
        this.form.get('completion_percentage').clearValidators();
        this.form.get('completion_percentage').updateValueAndValidity();
      }
    });
 
    this.form.get('type').setValue(this.model?.type || "HOURLY");
    this.form.get('type').updateValueAndValidity();
  }

  /**
   * Update Model Data based on Form Input
   */
  updateModelDataFromForm(){
    this.model.type = this.form.value.type;
    this.model.detail = this.form.value.detail;
    this.model.start_date = this.form.value.start_date;
    this.model.end_date = this.form.value.end_date;
    this.model.transfer_cost = this.form.value.transfer_cost;
    this.model.currency_code = this.form.value.currency_code;
 
    if (this.model.type == "FIXED_PRICE") {
      this.model.amount = new FixedPriceContract;
      this.model.amount.candidate_total = this.form.value.candidate_total;
      this.model.amount.company_total = this.form.value.company_total;
      this.model.amount.completion_percentage = this.form.value.completion_percentage;
    } else if (this.model.type == "HOURLY") {
      this.model.amount = new HourlyContract;
      this.model.amount.candidate_hourly_rate = this.form.value.candidate_hourly_rate;
      this.model.amount.company_hourly_rate = this.form.value.company_hourly_rate;
    } else if (this.model.type == "MONTHLY_SALARY") {
      this.model.amount = new MonthlySalaryContract;
      this.model.amount.salary_day = this.form.value.salary_day; 
      this.model.amount.candidate_total = this.form.value.candidate_total;
      this.model.amount.company_total = this.form.value.company_total;
    }
  }

  /**
   * Close the page
   */
  close(){
    this.modalCtrl.getTop().then(overlay => {
      if(overlay) {
        overlay.dismiss({ refresh: false });
      } else {
        this.navCtrl.back();
      }
    });
  }

  /**
   * Save the model
   */
  async save() {

    this.saving = true;

    this.updateModelDataFromForm();

    let action;

    if (!this.model.contract_uuid) {
      // Create
      action = this.contractService.create(this.model);
    } else {
      // Update
      action =  this.contractService.update(this.model);
    }

    action.subscribe(async jsonResponse => {

      this.saving = false;

      // On Success
      if (jsonResponse.operation == 'success') {

        this.eventService.reloadStats$.next({
          company_id: this.model.company_id
        });

        // Close the page
        const data = { refresh: true };
        this.modalCtrl.dismiss(data);

        const toast = await this._toastCtrl.create({
          message: 'Contract saved successfully',
          duration: 3000
        });
        toast.present();
      }

      // On Failure
      if (jsonResponse.operation == 'error') {

        const prompt = await this.alertCtrl.create({
          message: this.authService.errorMessage(jsonResponse.message),
          buttons: ['Ok']
        });
        prompt.present();
      }
    }, () => {
      this.saving = false;
    });
  }

  /**
   * Upload logo from mobile
   *
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
              message: this.authService.errorMessage(err.message),
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
              message: this.authService.errorMessage(err.message),
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
   *
  async uploadFileViaNativeFilePath(uri) {
    this.progress = 1; // show loader

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
          message,
          buttons: ['Okay']
        });

        await alert.present();
      });
    });
  }

  /**
   * Upload logo from browser
   * @param event
   *
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
    else
    {
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
   *
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

        this.model.brand_logo = event.Key;

        this.progress = null;

      };
    } else {
      this.currentTarget = event;
    }
  }

  /**
   * Display options to update logo
   *
  async updatePhoto(ev) {
    ev.preventDefault();
    if (this.platform.is('capacitor')) {
      this.mobileUpload();
    } else {
      this.fileInput.nativeElement.click();
    }
  }

  /**
   * trigger click event on change logo button
   *
  triggerUpdatePhoto($event) {
    $event.stopPropagation();
    document.getElementById('upload-pic').click();
    // this.fileInput.nativeElement.click();
  }

  /**
   * cancel file upload
   *
  cancelUpload() {
    if (this.fileInput && this.fileInput.nativeElement) {
      this.fileInput.nativeElement.value = null;
    }

    this.progress = null;

    this.currentTarget.abort();
  }*/

  logScrolling(e) {
    this.borderLimit = (e.detail.scrollTop > 20) ? true : false;
  }
}
