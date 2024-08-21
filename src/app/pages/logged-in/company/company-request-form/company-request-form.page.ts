import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ModalController, AlertController, PopoverController } from '@ionic/angular';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
// services
import { CompanyRequestService } from 'src/app/providers/logged-in/company-request.service';
import { EventService } from "../../../../providers/event.service";
// models
import { Request } from 'src/app/models/request';
import { AuthService } from "../../../../providers/auth.service";
//pages
import { CompanyContactListPage } from "../company-contact/company-contact-list/company-contact-list.page";
import { AnalyticsService } from 'src/app/providers/analytics.service';
import { CountryService } from 'src/app/providers/logged-in/country.service';


@Component({
  selector: 'app-company-request-form',
  templateUrl: './company-request-form.page.html',
  styleUrls: ['./company-request-form.page.scss'],
})
export class CompanyRequestFormPage implements OnInit {

  @ViewChild('ckeditor', { static: false }) ckeditor: ClassicEditor;

  @Input() company;

  @Input() request;

  public saving = false;

  public model: Request = new Request();
  public operation: string;

  public form: FormGroup;

  public borderLimit = false;

  public editorConfig = {
    placeholder: 'Click here add description...',
    startupFocus: true,
    width: '100%',
    height: 500,
    toolbar: ['Heading', '|', 'bold', 'italic', 'link', 'bulletedList', 'numberedList', 'blockQuote', '|', 'indent', 'outdent'],
  };

  public Editor = ClassicEditor;

  public countrylistData = [];

  constructor(
    public requestService: CompanyRequestService,
    private fb: FormBuilder,
    private modalCtrl: ModalController,
    private alertCtrl: AlertController,
    public authService: AuthService,
    private popoverCtrl: PopoverController,
    private eventService: EventService,
    public countryService: CountryService,
    public analyticService: AnalyticsService
  ) {
  }

  ngOnInit() {
    this.analyticService.page('Company Request Form Page');

    if (this.request) {
      this.model = this.request;
    }

    this.form = this.fb.group({
      company_id: [this.company ? this.company.company_id : null, Validators.required],
      contact_name: [(this.model.contact) ? this.model.contact.contact_name : '', Validators.required],
      contact_uuid: [this.model.contact_uuid, Validators.required],
      position_type: [this.model.request_position_type + '', Validators.required],
      position_title: [this.model.request_position_title, Validators.required],
      number_of_employees: [this.model.request_number_of_employees, Validators.required],
      no_of_employees_per_story: [this.model.no_of_employees_per_story, Validators.required],
      location: [this.model.request_location],
      job_description: [this.model.request_job_description, Validators.required],
      compensation: [this.model.request_compensation, Validators.required],
      additional_info: [this.model.request_additional_info],
      gender: [this.model.gender],
      nationality_id: [this.model.nationality_id]
    });

    this.operation = (this.model && this.model.request_uuid) ? 'Update' : 'Create';
  }

  ionViewDidEnter() {
    this.loadCountryList();
  }

  /**
   * Load list of countries
   */
  loadCountryList() {
    this.countryService.listAll().subscribe(response => {
      this.countrylistData = response;
    });
  }

  onEditorReady() {
    const interval = setTimeout(() => {
      if (this.ckeditor.editorInstance && this.form.value.job_description) {
        this.ckeditor.editorInstance.setData(this.form.value.job_description);
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

    this.form.controls['job_description'].setValue(data);
    this.form.markAsDirty();
    this.form.updateValueAndValidity();
  }

  /**
   * Update Model Data based on Form Input
   */
  updateModelDataFromForm() {
    this.model.company_id = this.form.value.company_id;
    this.model.contact_uuid = this.form.value.contact_uuid;
    this.model.request_position_type = this.form.value.position_type;
    this.model.request_position_title = this.form.value.position_title;
    this.model.request_number_of_employees = this.form.value.number_of_employees;
    this.model.request_additional_info = this.form.value.additional_info;
    this.model.request_job_description = this.form.value.job_description;
    this.model.request_compensation = this.form.value.compensation;
    this.model.request_location = this.form.value.location;
    this.model.no_of_employees_per_story = this.form.value.no_of_employees_per_story;
    this.model.nationality_id = this.form.value.nationality_id; 
    this.model.gender = this.form.value.gender;
  }

  /**
   * Close the page
   */
  close() {
    this.modalCtrl.getTop().then(o => {
      if(o) {
        o.dismiss({ refresh: false });
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

    if (!this.model.request_uuid) {
      // Create
      action = this.requestService.create(this.model);
    } else {
      // Update
      action = this.requestService.update(this.model);
    }

    action.subscribe(async jsonResponse => {

      this.saving = false;

      // On Success
      if (jsonResponse.operation == 'success') {
        // Close the page
        this.eventService.reloadStats$.next({
          company_id: this.model.company_id
        });
        const data = { refresh: true };
        this.modalCtrl.dismiss(data);
      }

      // On Failure
      if (jsonResponse.operation == 'error') {
        const prompt = await this.alertCtrl.create({
          message: this.authService._processResponseMessage(jsonResponse),
          buttons: ['Ok']
        });
        prompt.present();
      }
    }, () => {

      this.saving = false;

    });
  }

  /**
   * popover to select company
   * @param e 
   */
  async openClient(e) {

    let popover;

    if (this.company) {
      popover = await this.popoverCtrl.create({
        component: CompanyContactListPage,
        event: e,
        componentProps: {
          company: this.company
        }
      });
    } else {
      popover = await this.modalCtrl.create({
        component: CompanyContactListPage,
        cssClass: "popup-modal"
      });
    }

    popover.onDidDismiss().then((_) => {

      if (_ && _.data && _.data.contact) {
        this.form.controls['contact_name'].setValue(_.data.contact.contact_name);
        this.form.controls['contact_uuid'].setValue(_.data.contact.contact_uuid);

        if ((!this.company || !this.company.company_id) && _.data.contact.company) {
          this.form.controls['company_id'].setValue(_.data.contact.company.company_id);
        }
      }

      if (_ && _.data && _.data.companyContact) {
        this.form.controls['contact_name'].setValue(_.data.companyContact.contact_name);
        this.form.controls['contact_uuid'].setValue(_.data.companyContact.contact_uuid);

        if (!this.company || !this.company.company_id) {
          this.form.controls['company_id'].setValue(_.data.companyContact.company.company_id);
        }

      }
    });
    popover.present();
  }

  logScrolling(e) {
    this.borderLimit = (e.detail.scrollTop > 20);
  }

  /**
   * reset form inputs
   */
  resetForm() {
    this.form.controls['contact_name'].setValue(null);
    this.form.controls['contact_uuid'].setValue(null);
    this.form.controls['position_type'].setValue(null);
    this.form.controls['position_title'].setValue(null);
    this.form.controls['number_of_employees'].setValue(null);
    this.form.controls['additional_info'].setValue(null);
    this.form.controls['job_description'].setValue(null);
    this.form.controls['compensation'].setValue(null);
    this.form.controls['location'].setValue(null);
    this.form.controls['no_of_employees_per_story'].setValue(null);
    this.form.controls['nationality_id'].setValue(null);
    this.form.controls['gender'].setValue(null);
  }
}
