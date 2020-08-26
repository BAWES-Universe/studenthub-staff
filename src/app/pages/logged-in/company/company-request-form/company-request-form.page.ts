import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ModalController, AlertController } from '@ionic/angular';
//services
import { CompanyRequestService } from 'src/app/providers/logged-in/company-request.service';
//models
import { Request } from 'src/app/models/request';


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

  constructor(
    public requestService: CompanyRequestService,
    private fb: FormBuilder,
    private modalCtrl: ModalController,
    private alertCtrl: AlertController
  ) {
  }

  ngOnInit() {

    if (this.request) {
      this.model = this.request;
    }

    this.form = this.fb.group({
      contact_uuid: [this.model.contact_uuid, Validators.required],
      position_type: [this.model.request_position_type, Validators.required],
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
        const data = { refresh: true };
        this.modalCtrl.dismiss(data);
      }

      // On Failure
      if (jsonResponse.operation == 'error') {
        const prompt = await this.alertCtrl.create({
          message: JSON.stringify(jsonResponse.message),
          buttons: ['Ok']
        });
        prompt.present();
      }
    }, () => {

      this.saving = false;

    });
  }
}
