import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { ModalController, AlertController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
//services
import { EmailCampaignService } from 'src/app/providers/logged-in/email-campaign.service';
import { AuthService } from 'src/app/providers/auth.service';
//models
import { EmailCampaign } from 'src/app/models/email-campaign';
import { AnalyticsService } from 'src/app/providers/analytics.service';


@Component({
  selector: 'app-email-campaign-form',
  templateUrl: './email-campaign-form.page.html',
  styleUrls: ['./email-campaign-form.page.scss'],
})
export class EmailCampaignFormPage implements OnInit {

  public loading: boolean = false; 

  public saving: boolean = false; 
  
  public campaign_uuid;

  public model: EmailCampaign;
  public operation:string;

  public form: FormGroup;

  editorConfig = {
    base_url: '/tinymce',  
    suffix: '.min'        
  };

  constructor( 
    public activateRoute: ActivatedRoute,
    public emailCampaignService: EmailCampaignService,
    public authService: AuthService,
    private _fb: FormBuilder,
    private modalCtrl: ModalController,
    public analyticService: AnalyticsService,
    private _alertCtrl: AlertController
  ){
  }

  ngOnInit() {
    this.analyticService.page('Email Campaign Form Page');

    // Load the passed model if available
    if(window['state']) {
      this.model = window['state']['model'];
    }

    //this.campaign_uuid = this.activateRoute.snapshot.paramMap.get('campaign_uuid');

    if(this.campaign_uuid) {//&& !this.model
      this.loadData(this.campaign_uuid);
    } else {
      this._initForm();
    }
  }

  loadData(campaign_uuid) {
    this.loading = true; 

    this.emailCampaignService.view(campaign_uuid).subscribe(emailCampaign => {

      this.model = emailCampaign; 

      this.loading = false;

      this._initForm();

    }, () => {

      this.loading = false;
    })
  }

  _initForm() {

    let emailCampaignFilters = [];

    if (!this.model.emailCampaignFilters) {
      this.model.emailCampaignFilters = [];
    }

    this.model.emailCampaignFilters.forEach(emailCampaignFilter => {
 
      const form = this._fb.group({ 
        param: [emailCampaignFilter.param, Validators.required],
        value: [emailCampaignFilter.value],
        cf_uuid: [emailCampaignFilter.cf_uuid]
      });

      emailCampaignFilters.push(form);
    });

    if(!this.campaign_uuid) { // Show Create Form
      this.operation = "Create"; 
    } else { // Show Update Form
      this.operation = "Update";
    }

    this.form = this._fb.group({
      subject: [this.model.subject, Validators.required],
      message: [this.model.message, Validators.required], 
      emailCampaignFilters: this._fb.array(emailCampaignFilters),
    });
  }

  get emailCampaignFilters() {
    return this.form.controls['emailCampaignFilters'] as FormArray;
  }

  addFilter() {

    const filterForm = this._fb.group({
      param: [null, Validators.required],
      value: [null],
      cf_uuid: [null], 
    });

    this.emailCampaignFilters.push(filterForm);
  }

  removeFilter(index) {
    this.emailCampaignFilters.removeAt(index);
  }

  /**
   * Close the page
   */
  close(){
    let data = { 'refresh': false };
    this.modalCtrl.dismiss(data);
  }

  updateModelFromFormValue() {
    this.model = Object.assign(this.model, this.form.value);
  }

  /**
   * Save the model
   */
  async save() {

    this.saving = true;
 
    this.updateModelFromFormValue();

    let action;

    if(!this.model.campaign_uuid) {
      // Create
      action = this.emailCampaignService.create(this.model);
    }else{
      // Update
      action = this.emailCampaignService.update(this.model);
    }

    action.subscribe(async jsonResponse => {
      
      this.saving = false;

      // On Success
      if(jsonResponse.operation == "success") {

        this.model = this.form.value;

        // Close the page
        let data = { 'refresh': true, 'model':jsonResponse.detail };
        this.modalCtrl.dismiss(data);
      }

      // On Failure
      if (jsonResponse.operation == "error") {
        
        //failer text
        let prompt = await this._alertCtrl.create({
          message: this.authService.errorMessage(jsonResponse.message),
          buttons: ["Ok"]
        });
        prompt.present();
      }
    }, () => {
      this.saving = false;
    });
  }  
}
