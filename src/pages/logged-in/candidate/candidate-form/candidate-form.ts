import { Component, Renderer, ElementRef, ViewChild } from '@angular/core';
import { NavController, Platform, ViewController, LoadingController, AlertController, ActionSheetController, NavParams } from 'ionic-angular';
// Forms
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomValidator } from '../../../../validators/custom.validator';
// Providers
import { AwsService } from '../../../../providers/aws.service';
import { CameraService } from '../../../../providers/camera.service';
import { CandidateService } from '../../../../providers/logged-in/candidate.service';
import { BankService } from '../../../../providers/logged-in/bank.service';
import { UniversityService } from '../../../../providers/logged-in/university.service';
import { CountryService } from '../../../../providers/logged-in/country.service';

// Models
import { Candidate } from '../../../../models/candidate';

@Component({
  selector: 'page-candidate-form',
  templateUrl: 'candidate-form.html'
})
export class CandidateFormPage {
  @ViewChild('fileInput') fileInput:ElementRef;

  public bucketUrl = "https://bawes-public.s3.eu-west-2.amazonaws.com/"; // Used for link generation after upload
  // Photo Uploads Progress Indicators
  public isPhotoUploading = false;
  public isCivilFrontUploading = false;
  public isCivilBackUploading = false;
  private _lastClickedFileInputType: string; // last file input item clicked

  public model: Candidate;
  public operation: string;

  public form: FormGroup;
  public banklistData;
  public universitylistData;
  public countrylistData;

  // Date values for Date Input
  public todayDate;
  public maxDate;

  constructor(
    params: NavParams,
    public navCtrl: NavController,
    public candidateService: CandidateService,
    public bankService: BankService,
    public universityService: UniversityService,
    public countryService: CountryService,
    private _fb: FormBuilder,
    private _viewCtrl: ViewController,
    private _loadingCtrl: LoadingController,
    private _actionSheetCtrl: ActionSheetController,
    private _alertCtrl: AlertController,
    private _awsService: AwsService,
    private _cameraService: CameraService,
    private _platform: Platform,
    private _renderer:Renderer
  ) {
    // Load the passed model if available
    this.model = params.get('model');

    // Set the min and max dates
    this.setDates();

    // Init Form
    if (!this.model.candidate_id) { // Show Create Form
      this.operation = "Create";
      this.form = this._fb.group({
        name: ["", Validators.required],
        email: ["", [Validators.required, CustomValidator.emailValidator]],
        password: ["", Validators.required],
        bank_account_name: ["", Validators.required],
        iban: ["", Validators.required],
        name_ar: ["", Validators.required],
        phone: ["", Validators.required],
        birth_date: ["", Validators.required],
        civil_id: ["", Validators.required],
        expiry_date: ["", Validators.required],
        photo_front: ["", Validators.required],
        photo_back: ["", Validators.required],
        hourly_rate: ["", Validators.required]


      });
    } else { // Show Update Form
      this.operation = "Update";
      this.form = this._fb.group({
        name: [this.model.candidate_name, Validators.required],
        email: [this.model.candidate_email, [Validators.required, CustomValidator.emailValidator]],
        password: [this.model.candidate_password_hash], //not required,
        bank_account_name: [this.model.bank_account_name, Validators.required],
        iban: [this.model.candidate_iban, Validators.required],
        name_ar: [this.model.candidate_name_ar, Validators.required],
        phone: [this.model.candidate_phone, Validators.required],
        birth_date: [this.model.candidate_birth_date, Validators.required],
        civil_id: [this.model.candidate_civil_id, Validators.required],
        expiry_date: [this.model.candidate_civil_expiry_date, Validators.required],
        photo_front: [this.model.candidate_civil_photo_front, Validators.required],
        photo_back: [this.model.candidate_civil_photo_back, Validators.required],
        hourly_rate: [this.model.candidate_hourly_rate, Validators.required]
      });
    }
  }

  ionViewDidLoad() {
    //let loader = this._loadingCtrl.create();
    //loader.present();
    // Load the all available bank list
    this.loadBanksList();
    // Load the all available university list
    this.loadUniversityList();
    // Load all country 
    this.loadCountryList();
    //loader.dismiss();
  }

  /**
   * Update Model Data based on Form Input
   */
  updateModelDataFromForm() {

    this.model.candidate_name = this.form.value.name;
    this.model.candidate_email = this.form.value.email;
    this.model.candidate_password_hash = this.form.value.password;

    this.model.bank_account_name = this.form.value.bank_account_name;
    this.model.candidate_iban = this.form.value.iban;
    this.model.candidate_name_ar = this.form.value.name_ar;

    this.model.candidate_phone = this.form.value.phone;
    this.model.candidate_birth_date = this.form.value.birth_date;
    this.model.candidate_civil_id = this.form.value.civil_id;

    this.model.candidate_civil_expiry_date = this.form.value.expiry_date;
    this.model.candidate_civil_photo_front = this.form.value.photo_front;
    this.model.candidate_civil_photo_back = this.form.value.photo_back;

    this.model.candidate_hourly_rate = this.form.value.hourly_rate;
    this.model.bank_id = Number(this.banklistData.bank_id);
    this.model.university_id = Number(this.universitylistData.university_id);
    this.model.country_id = Number(this.countrylistData.country_id);
  }

  /**
   * Save the candidate model
   */
  save() {
    let loader = this._loadingCtrl.create();
    loader.present();
    this.updateModelDataFromForm();

    let action;
    if (!this.model.candidate_id) {
      // Create
      action = this.candidateService.create(this.model);
    } else {
      // Update
      action = this.candidateService.update(this.model);
    }

    action.subscribe(jsonResponse => {
      loader.dismiss();

      // On Success
      if (jsonResponse.operation == "success") {
        // Close the page
        let data = { 'refresh': true };
        this._viewCtrl.dismiss(data);
      }

      // On Failure
      if (jsonResponse.operation == "error") {

        var html = '';

        for (let i in jsonResponse.message) {
          
          for (let j of jsonResponse.message[i]) {
             
             html += j + '<br />';
          }
        }

        let prompt = this._alertCtrl.create({
          message: html,
          buttons: ["Ok"]
        });
        prompt.present();
      }
    });
  }

  /**
   * Load list of countries
   */
  loadCountryList() {
    this.countryService.listAll().subscribe(response => {
      this.countrylistData = response;
      response.forEach((value) => {
        if (value.country_id == this.model.country_id) {
          this.model.country_id = value.country_id;
          this.countrylistData.country_id = this.model.country_id;
        }
      });
    });
  }

  /**
   * Load list of universities available
   */
  loadUniversityList() {
    this.universityService.listAll().subscribe(response => {
      this.universitylistData = response;
      response.forEach((value) => {
        if (value.university_id == this.model.university_id) {
          this.model.university_id = value.university_id;
          this.universitylistData.university_id = this.model.university_id;
        }
      });
    });
  }

  /**
   * Load list of banks
   */
  loadBanksList() {
    this.bankService.listAll().subscribe(response => {
      this.banklistData = response;
      response.forEach((value) => {
        if (value.bank_id == this.model.bank_id) {
          this.model.bank_id = value.bank_id;
          this.banklistData.bank_id = this.model.bank_id;
        }
      });
    });
  }

  
  /**
   * Sets the default dates for min/max validation
   */
  setDates(){
    let today = new Date();
    //var dd = today.getDate();
    var mm = today.getMonth() + 1; // 0 is January, so we must add 1
    var yyyy = today.getFullYear();

    this.todayDate = new Date().toISOString();
    this.maxDate = new Date((yyyy+20), mm).toISOString();
  }



  /**
   * All Upload Functionality Below this Line
   */

  /**
   * Upload Photo button clicked
   * - On Native device, load native camera/gallery
   * - On Browser, trigger a click on the html file input
  * @param  {string} fileType which file we're uploading
  */
  uploadBtnClicked(fileType: string){
    // If Upload isn't allowed, return
    if(!this._isUploadAllowed(fileType)) return;

    // Store File Type for loading indicators 
    this._lastClickedFileInputType = fileType; 

    if(this._platform.is("cordova")){
      // Display action sheet giving user option of camera vs local filesystem.
      let actionSheet = this._actionSheetCtrl.create({
        title: "Select image source",
        buttons: [
          {
            text: 'Load from Library',
            handler: () => {
              this._cameraService.getImageFromLibrary().then((nativeImageFilePath) => {

                  // Upload and process for progress
                  this._awsService.uploadNativePath("library", nativeImageFilePath)
                    .then((uploadObservable) => {
                      this.processFileUpload(uploadObservable);
                    })
                    .catch((err) => {
                      alert(err);
                    });

              }, (err) => {
                  // Error getting picture
                  alert("Error getting picture from Library: " + JSON.stringify(err));
                  console.log("Error getting picture from Library: " + JSON.stringify(err));
              });;
            }
          },
          {
            text: 'Use Camera',
            handler: () => {
              this._cameraService.getImageFromCamera().then((nativeImageFilePath) => {

                  // Upload and process for progress
                  this._awsService.uploadNativePath("camera", nativeImageFilePath)
                    .then((uploadObservable) => {
                      this.processFileUpload(uploadObservable);
                    })
                    .catch((err) => {
                      alert(err);
                    });

              }, (err) => {
                  // Error getting picture
                  alert("Error getting picture from Camera: " + JSON.stringify(err));
                  console.log("Error getting picture from Camera: " + JSON.stringify(err));
              });;
            }
          }
        ]
      });
      actionSheet.present();

    }else{
      // Trigger click event on regular HTML file input
      let event = new MouseEvent('click', {bubbles: true});
      this._renderer.invokeElementMethod(this.fileInput.nativeElement, 'dispatchEvent', [event]);
    }
  }


  /**
   * Upload the selected file through regular HTML file input 
   * This method will only be called if the target is not a cordova app.
   * @param  {} $event
   */
  uploadFileViaHtmlFileInput($event){
    let fileList: FileList = $event.target.files;

    // Check if files available
    if(fileList.length > 0){
      let file = fileList.item(0);

      // Upload The File
      let uploadObservable = this._awsService.uploadFile("browser", file);
      this.processFileUpload(uploadObservable);
    }
  }

  /**
   * Process S3 upload by subscribing to progress observable
   * @param  {} uploadObservable
   */
  processFileUpload(uploadObservable){
    // Create Temporary Transfer Record
    let newUpload = {
      name: "Preparing file for upload",
      type: this._lastClickedFileInputType,
      status: "uploading",
      loaded: 0,
      total: 100,
      link: ''
    };

    // Show File Upload Indicator based on which file is being uploaded
    this._showProgressIndicator(newUpload.type);

    // Process Upload and Display Progress
    uploadObservable.subscribe((progress) => {
      if(progress.loaded &&  progress.loaded != progress.total){
          newUpload.status = "uploading";
          newUpload.loaded = progress.loaded;
          newUpload.total = progress.total;
      }

      // If Multipart upload (big file), Key with capital "K"
      if(progress.key || progress.Key){
        newUpload.name = progress.key? progress.key : progress.Key; 
        newUpload.link = this.bucketUrl + newUpload.name;
      }

    }, (err) => {
      console.log("Error", err);
      newUpload.status = "error";
      // Hide File Upload Indicator based on which file is being uploaded
      this._hideProgressIndicator(newUpload.type);
    }, () => {
      newUpload.status = "complete";
      // Hide File Upload Indicator based on which file is being uploaded
      this._hideProgressIndicator(newUpload.type);
      // Update model for new file 
      this._updateCandidateModelForUpload(newUpload.type, newUpload.link);
    });
  }

  /**
   * Is upload required for supplied file type?
   * @param  {string} fileType
   * @param  {string} fileUrl
   */
  private _updateCandidateModelForUpload(fileType: string, fileUrl: string){
    switch(fileType){
      case "photo":
        // Model currently missing personal photo field/validation
        break;
      case "civilfront":
        this.model.candidate_civil_photo_front = fileUrl;
        this.form.value.photo_front = fileUrl;
        break;
      case "civilback":
        this.model.candidate_civil_photo_back = fileUrl;
        this.form.value.photo_back = fileUrl;
        break;
    }
  }
  /**
   * Show upload progress indicator for specific filetype
   * @param  {string} fileType
   */
  private _showProgressIndicator(fileType: string){
    switch(fileType){
      case "photo":
        this.isPhotoUploading = true;
        break;
      case "civilfront":
        this.isCivilFrontUploading = true;
        break;
      case "civilback":
        this.isCivilBackUploading = true;
        break;
    }
  }
  /**
   * Hide upload progress indicator for specific filetype
   * @param  {string} fileType
   */
  private _hideProgressIndicator(fileType: string){
    switch(fileType){
      case "photo":
        this.isPhotoUploading = false;
        break;
      case "civilfront":
        this.isCivilFrontUploading = false;
        break;
      case "civilback":
        this.isCivilBackUploading = false;
        break;
    }
  }
  /**
   * Is upload required for supplied file type?
   * @param  {string} fileType
   * @returns boolean
   */
  private _isUploadAllowed(fileType: string): boolean{
    switch(fileType){
      case "photo":
        if(!this.isPhotoUploading) return true;
        break;
      case "civilfront":
        if(!this.isCivilFrontUploading) return true;
        break;
      case "civilback":
        if(!this.isCivilBackUploading) return true;
        break;
    }

    return false;
  }

}
