import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { ModalController, AlertController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { format, parseISO } from 'src/app/util/date-fns';
//services
import { EmailCampaignService } from 'src/app/providers/logged-in/email-campaign.service';
import { AuthService } from 'src/app/providers/auth.service';
import { AnalyticsService } from 'src/app/providers/analytics.service';
//models
import { EmailCampaign } from 'src/app/models/email-campaign';
import { Country } from 'src/app/models/country';
import { CountryService } from 'src/app/providers/country.service';
import { CountryModalComponent } from 'src/app/components/country-modal/country-modal.component';


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

  public countries: Country[] = [];

  constructor( 
    public activateRoute: ActivatedRoute,
    public emailCampaignService: EmailCampaignService,
    public authService: AuthService,
    private _fb: FormBuilder,
    private modalCtrl: ModalController,
    public analyticService: AnalyticsService,
    private _alertCtrl: AlertController,
    private countryService: CountryService
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

   // this.loadCountries();
  }

  /*loadCountries() {
    this.countryService.list().subscribe(countries => {
      this.countries = countries;
    });
  }*/


  /**
   * Select Country
   * @param emailCampaignFilterForm 
   */  
  async selectCountry(emailCampaignFilterForm) {

    window.history.pushState({
      navigationId: window.history.state?.navigationId
    }, null, window.location.pathname);

    const modal = await this.modalCtrl.create({
      component: CountryModalComponent,
    });
    modal.onDidDismiss().then(e => {

      if (!e.data || e.data.from != 'native-back-btn') {
        window['history-back-from'] = 'onDidDismiss';
        window.history.back();
      }
    });
    await modal.present();

    const { data } = await modal.onWillDismiss();
 
    if (data) {

      emailCampaignFilterForm.controls.value.setValue(data.country_name_en);
     // emailCampaignFilterForm.controls.country_id.setValue(data.country_id);
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

      trigger_date_time: [this.model.trigger_date_time],
      is_recurring: [this.model.is_recurring || false],
      trigger_period: [this.model.trigger_period],
      target: [this.model.target || 'both'],

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

    if (this.model.trigger_date_time) {
      this.model.trigger_date_time = format(parseISO(this.form.controls['trigger_date_time'].value), 'yyyy-MM-dd HH:mm:ss');//, { timeZone: '+3:30' }
      // new Date(this.model.trigger_date_time).toISOString();
    }
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
