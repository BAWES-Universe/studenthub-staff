import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import {AlertController, ToastController, ModalController, NavController} from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
//validators
import { CustomValidator } from 'src/app/validators/custom.validator';
// services
import { AuthService } from 'src/app/providers/auth.service';
import { CompanyService } from 'src/app/providers/logged-in/company.service';
import { EventService } from "../../../../providers/event.service";
// models
import { Company } from 'src/app/models/company';
import { AnalyticsService } from 'src/app/providers/analytics.service';


@Component({
  selector: 'app-company-form',
  templateUrl: './company-form.page.html',
  styleUrls: ['./company-form.page.scss'],
})
export class CompanyFormPage implements OnInit {

  @ViewChild('ckeditor', { static: false }) ckeditor: ClassicEditor;
  @ViewChild('ckeditor_ar', { static: false }) ckeditor_ar: ClassicEditor;

  public borderLimit = false;

  public loading = false;

  public saving = false;

  public company_id;

  public model: Company;

  public operation: string;

  public isSubCompany = 0;

  public form: FormGroup;

  public followup = false;

  public editorConfig = {
    placeholder: 'Click here add description...',
    startupFocus: true,
    width: '100%',
    toolbar: ['Heading', '|', 'bold', 'italic', 'link', 'bulletedList', 'numberedList', 'blockQuote', '|', 'indent', 'outdent'],
  };

  public Editor = ClassicEditor;

  constructor(
    public activateRoute: ActivatedRoute,
    public authService: AuthService,
    public companyService: CompanyService,
    private _fb: FormBuilder,
    private _alertCtrl: AlertController,
    public modalCtrl: ModalController,
    private _toastCtrl: ToastController,
    private eventService: EventService,
    public analyticService: AnalyticsService,
    private navCtrl: NavController
  ) {
    // this.company_id = this.activateRoute.snapshot.paramMap.get('company_id');
    // console.log(this.company_id);
  }

  ngOnInit() {
    this.analyticService.page('Company Form Page');

    // if (window && window.history.state) {
    //   this.model = window.history.state.model;
    // }

    if (this.company_id && !this.model) {
      this.loadData(this.company_id);
    } else {
      this._initForm();
    }
  }

  /**
   * load company detail
   * @param company_id
   */
  loadData(company_id) {
    this.loading = true;

    this.companyService.view(company_id,'brands').subscribe(res => {
      this.model = res;
      this._initForm();
      this.loading = false;

    }, () => {

      this.loading = false;
    });
  }

  /**
   * init form
   */
  _initForm() {

    if (this.model.parent_company_id) {
      this.isSubCompany = 1;
    }
    // Init Form

    if (!this.model.company_id) { // Show Create Form

      this.operation = (this.isSubCompany) ? 'Add New Subcompany' : 'Add New Client';

      if (this.isSubCompany) {
        this.form = this._fb.group({
          name: ['', Validators.required],
          bonus_commission: ['', Validators.required],
          hourly_rate: ['', Validators.required],
          logo: [''],
          common_name_en: [''],
          common_name_ar: [''],
          description_en: [''],
          description_ar: [''],
          website: [''],
          approved_to_hire: [true]
        });
      } else {
        this.form = this._fb.group({
          name: ['', Validators.required],
          common_name_ar: ['', Validators.required],
          common_name_en: ['', Validators.required],
          bonus_commission: ['', Validators.required],
          hourly_rate: ['', Validators.required],
          password: ['', Validators.required],
          description_en: [''],
          description_ar: [''],
          website: [''],
          email: ['', [Validators.required, CustomValidator.emailValidator]],
          logo: [''],
          commercial_licence: ['', Validators.required],
          followup_interval_weeks: [''],
          followup: [0],
          approved_to_hire: [true]
        });
      }
    } else { // Show Update Form
      this.operation = (this.isSubCompany) ? 'Update  Sub-company' : 'Update Client';
      if (this.isSubCompany) {
        this.form = this._fb.group({
          name: [this.model.company_name, Validators.required],
          bonus_commission: [this.model.company_bonus_commission],
          hourly_rate: [this.model.company_hourly_rate, Validators.required],
          common_name_en: [this.model.company_common_name_en, Validators.required],
          common_name_ar: [this.model.company_common_name_ar, Validators.required],
          description_en: [this.model.company_description_en],
          description_ar: [this.model.company_description_ar],
          website: [this.model.company_website],
          logo: [this.model.company_logo],
          approved_to_hire: [this.model.company_approved_to_hire]
        });
      } else {
        this.form = this._fb.group({
          name: [this.model.company_name, Validators.required],
          email: [this.model.company_email, [Validators.required, CustomValidator.emailValidator]],
          bonus_commission: [this.model.company_bonus_commission],
          password: [''],
          hourly_rate: [this.model.company_hourly_rate, Validators.required],
          common_name_en: [this.model.company_common_name_en, Validators.required],
          common_name_ar: [this.model.company_common_name_ar, Validators.required],
          description_en: [this.model.company_description_en],
          description_ar: [this.model.company_description_ar],
          website: [this.model.company_website],
          logo: [this.model.company_logo],
          commercial_licence: [this.model.commercial_licence, Validators.required],
          followup_interval_weeks: [this.model.company_followup_interval_weeks],
          followup: [this.model.company_followup],
          approved_to_hire: [this.model.company_approved_to_hire]
        });
      }
    }
  }

  /**
   * Update Model Data based on Form Input
   */
  updateModelDataFromForm() {
    this.model.company_name = this.form.value.name;
    this.model.company_email = this.form.value.email;
    this.model.company_bonus_commission = this.form.value.bonus_commission;
    this.model.company_hourly_rate = this.form.value.hourly_rate;
    this.model.company_common_name_en = this.form.value.common_name_en;
    this.model.company_common_name_ar = this.form.value.common_name_ar;
    this.model.company_description_en = this.form.value.description_en;
    this.model.company_description_ar = this.form.value.description_ar;
    this.model.company_website = this.form.value.website;
    this.model.company_followup_interval_weeks = this.form.value.followup_interval_weeks;
    this.model.company_followup = this.form.value.followup;
    this.model.company_logo = this.form.value.logo;
    this.model.commercial_licence = this.form.value.commercial_licence;
    this.model.company_approved_to_hire = this.form.value.approved_to_hire;
    if (!this.isSubCompany) {
      this.model.password = this.form.value.password;
    }
  }

  /**
   * Close the page
   */
  close() {
    this.modalCtrl.getTop().then(o => {
      if(o) {
        o.dismiss({ refresh: true });
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

    if (!this.model.company_id) {
      // Create
      action = this.companyService.create(this.model);
    } else {
      // Update
      action = this.companyService.update(this.model);
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
          message: this.model.company_name + ' account saved successfully',
          duration: 3000
        });
        toast.present();
      }

      // On Failure
      if (jsonResponse.operation == 'error') {

        const prompt = await this._alertCtrl.create({
          message: this.authService.errorMessage(jsonResponse.message),
          buttons: ['Ok']
        });
        prompt.present();
      }
    }, () => {
      this.saving = false;
    });
  }

  logScrolling(e) {
    this.borderLimit = (e.detail.scrollTop > 20);
  }

  onEditorReady() {
    const interval = setTimeout(() => {
      if (this.ckeditor.editorInstance && this.form.value.description_en) {
        this.ckeditor.editorInstance.setData(this.form.value.description_en);
        // this.ckeditor.editorInstance.editing.view.focus();
        // clearInterval(interval);
      }
    }, 200);
  }

  /**
   * on note editor change
   * @param event
   */
  onChange(event) {

    if (!event.editor) {
      return event;
    }

    const data = event.editor.getData();

    this.form.controls['description_en'].setValue(data);
    this.form.markAsDirty();
    this.form.updateValueAndValidity();
  }

  onArabicEditorReady() {
    const interval = setTimeout(() => {
      if (this.ckeditor_ar.editorInstance && this.form.value.description_ar) {
        this.ckeditor_ar.editorInstance.setData(this.form.value.description_ar);
        // this.ckeditor.editorInstance.editing.view.focus();
        // clearInterval(interval);
      }
    }, 200);
  }

  /**
   * on note editor change
   * @param event
   */
  onArabicEditorChange(event) {

    if (!event.editor) {
      return event;
    }

    const data = event.editor.getData();

    this.form.controls['description_ar'].setValue(data);
    this.form.markAsDirty();
    this.form.updateValueAndValidity();
  }
}
