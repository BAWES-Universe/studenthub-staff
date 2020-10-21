import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import {ModalController, AlertController, PopoverController} from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
// services
import { CompanyRequestService } from 'src/app/providers/logged-in/company-request.service';
// models
import { Request } from 'src/app/models/request';
import { AuthService } from 'src/app/providers/auth.service';
import { CompanyContactListPage } from '../../company-contact/company-contact-list/company-contact-list.page';
import {AllCompanyListPage} from '../all-company-list/all-company-list.page';
import {Location} from '@angular/common';
import {EventService} from '../../../../../providers/event.service';


@Component({
  selector: 'app-request-form',
  templateUrl: './request-form.page.html',
  styleUrls: ['./request-form.page.scss'],
})
export class RequestFormPage implements OnInit {

  public company;

  public saving = false;

  public model: Request = new Request();
  public operation: string;

  public form: FormGroup;
  public requestID = null;
  constructor(
    public requestService: CompanyRequestService,
    private fb: FormBuilder,
    private modalCtrl: ModalController,
    private alertCtrl: AlertController,
    private authService: AuthService,
    private popoverCtrl: PopoverController,
    private location: Location,
    private eventService: EventService,
    private route: ActivatedRoute
) {
  }

  ngOnInit() {
    this.requestID = this.route.snapshot.paramMap.get('id');

    if (window.history.state.model) {
      this.model = window.history.state.model;
      this.loadForm();
    } else {
      this.detail(this.requestID);
    }
  }

  loadForm(){
    this.form = this.fb.group({
      company_name: [(this.model.company) ? this.model.company.company_name : '', Validators.required],
      company_id: [this.model.company_id, Validators.required],
      contact_name: [(this.model.contact) ? this.model.contact.contact_name : '', Validators.required],
      contact_uuid: [this.model.contact_uuid, Validators.required],
      position_type: [this.model.request_position_type + '', Validators.required],
      position_title: [this.model.request_position_title, Validators.required],
      number_of_employees: [this.model.request_number_of_employees, Validators.required],
      additional_info: [this.model.request_additional_info]
    });

    this.operation = (this.requestID) ? 'Update' : 'Create';
  }

  /**
   * Update Model Data based on Form Input
   */
  updateModelDataFromForm() {
    this.model.company_id = this.company.company_id;
    this.model.contact_uuid = this.form.value.contact_uuid;
    this.model.request_position_type = this.form.value.position_type;
    this.model.request_position_title = this.form.value.position_title;
    this.model.request_number_of_employees = this.form.value.number_of_employees;
    this.model.request_additional_info = this.form.value.additional_info;
  }

  /**
   * Close the page
   */
  close() {
    const data = { refresh: false };
    this.modalCtrl.dismiss(data);
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
        this.eventService.companyRequestUpdate$.next();
        this.location.back();
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
  async openContact(e) {
    const popover = await this.popoverCtrl.create({
      component: CompanyContactListPage,
      event: e,
      componentProps: {
        contacts : this.company.companyContacts
      }
    });
    popover.onDidDismiss().then((_) => {
      if (_ && _.data) {
        this.form.controls.contact_name.setValue(_.data.companyContact.contact_name);
        this.form.controls.contact_uuid.setValue(_.data.companyContact.contact_uuid);
      }
    });
    popover.present();
  }

  async openClient(e) {
    const popover = await this.modalCtrl.create({
      component: AllCompanyListPage,
    });
    popover.onDidDismiss().then((_) => {

      if (_ && _.data) {
        this.company = _.data;
        this.form.controls.company_name.setValue(_.data.company_name);
        this.form.controls.company_id.setValue(_.data.company_id);

        this.form.controls.contact_name.setValue(null);
        this.form.controls.contact_uuid.setValue(null);

      }
    });
    popover.present();
  }

  /**
   * request detail
   * @param id
   */
  async detail(id) {
    this.requestService.view(id).subscribe(data => {
      this.model = data;
      this.loadForm();
    });
  }
}
