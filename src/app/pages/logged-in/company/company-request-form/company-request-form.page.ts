import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ModalController, AlertController, PopoverController } from '@ionic/angular';
// services
import { CompanyRequestService } from 'src/app/providers/logged-in/company-request.service';
// models
import { Request } from 'src/app/models/request';
import { AuthService } from "../../../../providers/auth.service";
//pages
import { CompanyContactListPage } from "../company-contact/company-contact-list/company-contact-list.page";
import {EventService} from "../../../../providers/event.service";


@Component({
  selector: 'app-company-request-form',
  templateUrl: './company-request-form.page.html',
  styleUrls: ['./company-request-form.page.scss'],
})
export class CompanyRequestFormPage implements OnInit {

  @Input() company;
  @Input() request;

  public saving = false;

  public model: Request = new Request();
  public operation: string;

  public form: FormGroup;

  public borderLimit = false;

  constructor(
    public requestService: CompanyRequestService,
    private fb: FormBuilder,
    private modalCtrl: ModalController,
    private alertCtrl: AlertController,
    private authService: AuthService,
    private popoverCtrl: PopoverController,
    private eventService: EventService
  ) {
  }

  ngOnInit() {
    if (this.request) {
      this.model = this.request;
    }

    this.form = this.fb.group({
      company_id: [this.company? this.company.company_id: null, Validators.required],
      contact_name: [(this.model.contact) ? this.model.contact.contact_name : '', Validators.required],
      contact_uuid: [this.model.contact_uuid, Validators.required],
      position_type: [this.model.request_position_type + '', Validators.required],
      position_title: [this.model.request_position_title, Validators.required],
      number_of_employees: [this.model.request_number_of_employees, Validators.required],
      additional_info: [this.model.request_additional_info]
    });

    this.operation = (this.model && this.model.request_uuid) ? 'Update' : 'Create';
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

  async openClient(e) {

    let popover;

    if(this.company) {
      popover = await this.popoverCtrl.create({
        component: CompanyContactListPage,
        event: e,
        componentProps: {
          company: this.company
        }
      });
    } else {
      popover = await this.modalCtrl.create({
        component: CompanyContactListPage
      });
    }

    popover.onDidDismiss().then((_) => {
      if (_ && _.data && _.data.companyContact) {
        this.form.controls.contact_name.setValue(_.data.companyContact.contact_name);
        this.form.controls.contact_uuid.setValue(_.data.companyContact.contact_uuid);

        if (!this.company || !this.company.company_id) {
          this.form.controls.company_id.setValue(_.data.companyContact.company.company_id);
        }

      }
    });
    popover.present();
  }

  logScrolling(e) {
    this.borderLimit = (e.detail.scrollTop > 20);
  }


  resetForm() {
    this.form.controls.contact_name.setValue(null);
    this.form.controls.contact_uuid.setValue(null);
    this.form.controls.position_type.setValue(null);
    this.form.controls.position_title.setValue(null);
    this.form.controls.number_of_employees.setValue(null);
    this.form.controls.additional_info.setValue(null);
  }
}
