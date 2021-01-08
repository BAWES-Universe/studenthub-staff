import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { ModalController, AlertController } from '@ionic/angular';
//services
import { CompanyContactService } from 'src/app/providers/logged-in/company-contact.service';
import { EventService } from "../../../../providers/event.service";
//models
import { Contact } from 'src/app/models/contact';
//validator
import { CustomValidator } from 'src/app/validators/custom.validator';


@Component({
  selector: 'app-company-contact-form',
  templateUrl: './company-contact-form.page.html',
  styleUrls: ['./company-contact-form.page.scss'],
})
export class CompanyContactFormPage implements OnInit {

  public company_id;
  
  public saving: boolean = false;

  public type: string = 'password';

  public model: Contact;

  public operation: string;

  public form: FormGroup;

  public borderLimit = false;

  constructor(
    public companyContactService: CompanyContactService,
    private _fb: FormBuilder,
    private modalCtrl: ModalController,
    private _alertCtrl: AlertController,
    private eventService: EventService
  ) { }

  ngOnInit() {

    let emailCtrls = [];

    let phoneCtrls = [];

    if(this.model.contactEmails)
      for (let contactEmail of this.model.contactEmails) {
        emailCtrls.push(this._fb.group({
          email_address: [contactEmail.email_address, [CustomValidator.emailValidator]]
        }));
      }

    if(this.model.contactPhones)
      for (let contactPhone of this.model.contactPhones) {
        phoneCtrls.push(this._fb.group({
          phone_number: [contactPhone.phone_number, []]
        }));
      }

    emailCtrls.push(this._fb.group({
      email_address: ['', [CustomValidator.emailValidator]]
    }));

    phoneCtrls.push(this._fb.group({
      phone_number: ['', []]
    }));

    if (!this.model || !this.model.contact_uuid) { // Show Create Form
      this.operation = "Create";

      this.form = this._fb.group({
        name: ["", Validators.required],
        position: ["", Validators.required],
        note: [""],
        email: ['', [CustomValidator.emailValidator, Validators.required]],
        password: ['', Validators.required], 
        receive_email: [true, Validators.required],
        receive_notification: [true, Validators.required],
        emails: new FormArray(emailCtrls),
        phones: new FormArray(phoneCtrls),
      });

    } else { // Show Update Form

      this.operation = "Update";

      this.form = this._fb.group({
        name: [this.model.contact_name, Validators.required],
        position: [this.model.contact_position, Validators.required],
        email: [this.model.contact_email, [CustomValidator.emailValidator, Validators.required]],
        password: [this.model.contact_password, Validators.required], 
        receive_email: [this.model.contact_receive_email, Validators.required],
        receive_notification: [this.model.contact_receive_notification, Validators.required],
        emails: new FormArray(emailCtrls),
        phones: new FormArray(phoneCtrls),
      });
    }
  }

  // convenience getters for easy access to form fields
  get f() { return this.form.controls; }
  get emails() { return this.f.emails as FormArray; }
  get phones() { return this.f.phones as FormArray; }

  /**
   * Update Model Data based on Form Input
   */
  updateModelDataFromForm() {
    this.model.contact_name = this.form.value.name;
    this.model.contact_email = this.form.value.email;
    this.model.contact_receive_email = this.form.value.receive_email;
    this.model.contact_receive_notification = this.form.value.receive_notification;
    this.model.contact_password = this.form.value.password;
    this.model.contact_position = this.form.value.position;
    this.model.contactEmails = this.form.value.emails;
    this.model.contactPhones = this.form.value.phones;
  }

  removeEmail(index) {
    this.emails.removeAt(index);
    this.emails.markAsDirty();
  }

  removePhone(index) {
    this.phones.removeAt(index);
    this.phones.markAsDirty();
  }

  addEmail() {
    this.emails.push(this._fb.group({
      email_address: ['', [CustomValidator.emailValidator]]
    }));
  }

  addPhone() {
    this.phones.push(this._fb.group({
      phone_number: ['', []]
    }));
  }

  /**
   * add new input
   * @param event
   * @param index
   */
  onPhoneChange(event, index) {

    // remove field on clearing it out + have next empty field

    if (this.phones.length - index > 1 && event.target.value.length == 0) {
      return this.removePhone(index);
    }

    // check if new field is not added && something is typed
    if (((index - this.phones.length) === -1) && event.target.value) {
      // adding new field
      this.addPhone();
    }
  }

  /**
   * add new input
   * @param event
   * @param index
   */
  onEmailChange(event, index) {

    // remove field on clearing it out + have next empty field

    if (this.emails.length - index > 1 && event.target.value.length == 0) {
      return this.removeEmail(index);
    }

    // check if new field is not added && something is typed
    if (((index - this.emails.length) === -1) && event.target.value) {
      // adding new field
      this.addEmail();
    }
  }

  /**
   * Close the page
   */
  close() {
    let data = { 'refresh': false };
    this.modalCtrl.dismiss(data);
  }

  /**
   * Save the model
   */
  async save() {

    this.saving = true;

    this.updateModelDataFromForm();

    let action;
    if (!this.model.contact_uuid) {
      // Create
      action = this.companyContactService.create(this.model);
    } else {
      // Update
      action = this.companyContactService.update(this.model);
    }

    action.subscribe(async jsonResponse => {

      this.saving = false;

      // On Success
      if (jsonResponse.operation == "success") {

        this.eventService.reloadStats$.next({
          company_id: this.company_id
        }); 

        // Close the page
        let data = { 'refresh': true };
        this.modalCtrl.dismiss(data);

      }

      // On Failure
      if (jsonResponse.operation == "error") {
        let prompt = await this._alertCtrl.create({
          message: JSON.stringify(jsonResponse.message),
          buttons: ["Ok"]
        });
        prompt.present();
      }
    }, () => {

      this.saving = false;

    });
  }

  togglePasswordVisibility() {
    this.type = (this.type == 'password') ? 'text' : 'password';
  }

  logScrolling(e) {
    this.borderLimit = (e.detail.scrollTop > 20) ? true : false;
  }
}
