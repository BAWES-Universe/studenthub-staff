import { Component } from '@angular/core';
import { NavController, ViewController, LoadingController, AlertController, NavParams } from 'ionic-angular';
// Forms
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomValidator } from '../../../../validators/custom.validator';
// Providers
import { CandidateService } from '../../../../providers/logged-in/candidate.service';
// Models
import { Candidate } from '../../../../models/candidate';

@Component({
  selector: 'page-candidate-form',
  templateUrl: 'candidate-form.html'
})
export class CandidateFormPage {

  public model: Candidate;
  public operation:string;

  public form: FormGroup;

  constructor(
    params: NavParams,
    public navCtrl: NavController,
    public candidateService: CandidateService,
    private _fb: FormBuilder,
    private _viewCtrl: ViewController,
    private _loadingCtrl: LoadingController,
    private _alertCtrl: AlertController
  ){
    // Load the passed model if available
    this.model = params.get('model');

    // Init Form
    if(!this.model.candidate_id){ // Show Create Form
      this.operation = "Create";
      this.form = this._fb.group({
        name: ["", Validators.required],
        nameArabic: ["", Validators.required],
        birthDate: ["", Validators.required],
        civilIdNumber: ["", Validators.required],
        civilIdExpiry: ["", Validators.required],
        civilIdFront: ["", Validators.required],
        civilIdBack: ["", Validators.required],
        phone: ["", Validators.required],
        email: ["", [Validators.required, CustomValidator.emailValidator]],
        password: ["", Validators.required],
        hourlyRate: ["", Validators.required]
      });
    }else{ // Show Update Form
      this.operation = "Update";
      this.form = this._fb.group({
        name: [this.model.candidate_name, Validators.required],
        nameArabic: [this.model.candidate_name_ar, Validators.required],
        birthDate: [this.model.candidate_birth_date, Validators.required],
        civilIdNumber: [this.model.candidate_civil_id, Validators.required],
        civilIdExpiry: [this.model.candidate_civil_expiry_date, Validators.required],
        civilIdFront: [this.model.candidate_civil_photo_front, Validators.required],
        civilIdBack: [this.model.candidate_civil_photo_back, Validators.required],
        phone: [this.model.candidate_phone, Validators.required],
        email: [this.model.candidate_email, [Validators.required, CustomValidator.emailValidator]],
        password: [this.model.candidate_password_hash], //not required
        hourlyRate: [this.model.candidate_hourly_rate, Validators.required]
      });
    }
  }

  /**
   * Update Model Data based on Form Input
   */
  updateModelDataFromForm(){
    this.model.candidate_name = this.form.value.name;
    this.model.candidate_name_ar = this.form.value.nameArabic;
    this.model.candidate_email = this.form.value.email;
    this.model.candidate_password_hash = this.form.value.password;
  }

  /**
   * Close the page
   */
  close(){
    let data = { 'refresh': false };
    this._viewCtrl.dismiss(data);
  }

  /**
   * Save the model
   */
  save(){
    let loader = this._loadingCtrl.create();
    loader.present();

    this.updateModelDataFromForm();

    let action;
    if(!this.model.candidate_id){
      // Create
      action = this.candidateService.create(this.model);
    }else{
      // Update
      action = this.candidateService.update(this.model);
    }

    action.subscribe(jsonResponse => {
      loader.dismiss();

      // On Success
      if(jsonResponse.operation == "success"){
        // Close the page
        let data = { 'refresh': true };
        this._viewCtrl.dismiss(data);
      }

      // On Failure
      if(jsonResponse.operation == "error"){
        let prompt = this._alertCtrl.create({
          message: JSON.stringify(jsonResponse.message),
          buttons: ["Ok"]
        });
        prompt.present();
      }
    });
  }

}
