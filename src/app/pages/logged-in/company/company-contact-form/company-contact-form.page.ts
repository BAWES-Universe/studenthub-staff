import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { ModalController, AlertController } from '@ionic/angular';
//services
import { CompanyContactService } from 'src/app/providers/logged-in/company-contact.service';
//models
import { CompanyContact } from 'src/app/models/company-contact';
//validator
import { CustomValidator } from 'src/app/validators/custom.validator';


@Component({
  selector: 'app-company-contact-form',
  templateUrl: './company-contact-form.page.html',
  styleUrls: ['./company-contact-form.page.scss'],
})
export class CompanyContactFormPage implements OnInit {

  public saving: boolean = false;

  public model: CompanyContact;
  public operation: string;

  public form: FormGroup;

  constructor(
    public companyContactService: CompanyContactService,
    private _fb: FormBuilder,
    private modalCtrl: ModalController,
    private _alertCtrl: AlertController
  ) { }

  ngOnInit() {

    let emailCtrls = [];

    let phoneCtrls = [];

    if(this.model.companyContactEmails)
      for (let companyContactEmail of this.model.companyContactEmails) {
        emailCtrls.push(this._fb.group({
          email_address: [companyContactEmail.email_address, [CustomValidator.emailValidator]]
        }));
      }

    if(this.model.companyContactPhones)
      for (let companyContactPhone of this.model.companyContactPhones) {
        phoneCtrls.push(this._fb.group({
          phone_number: [companyContactPhone.phone_number, []]
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
        emails: new FormArray(emailCtrls),
        phones: new FormArray(phoneCtrls),
      });

    } else { // Show Update Form

      this.operation = "Update";

      this.form = this._fb.group({
        name: [this.model.contact_name, Validators.required],
        position: [this.model.contact_position, Validators.required],
        note: [this.model.contact_note],
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
    console.log(this.form);

    this.model.contact_name = this.form.value.name;
    this.model.contact_position = this.form.value.position;
    this.model.contact_note = this.form.value.note;
    this.model.companyContactEmails = this.form.value.emails;
    this.model.companyContactPhones = this.form.value.phones;
  }

  removeEmail(index) {
    this.emails.removeAt(index);
  }

  removePhone(index) {
    this.phones.removeAt(index);
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
}
