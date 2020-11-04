import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AlertController, ToastController, ModalController } from '@ionic/angular';
import { CustomValidator } from 'src/app/validators/custom.validator';
// services
import { AuthService } from 'src/app/providers/auth.service';
import { CompanyService } from 'src/app/providers/logged-in/company.service';
// models
import { Company } from 'src/app/models/company';
import { ActivatedRoute } from '@angular/router';



@Component({
  selector: 'app-company-form',
  templateUrl: './company-form.page.html',
  styleUrls: ['./company-form.page.scss'],
})
export class CompanyFormPage implements OnInit {

  public loading = false;

  public saving = false;

  public company_id;

  public model: Company;
  
  public operation: string;
  
  public isSubCompany = 0;

  public form: FormGroup;

  public type: string = 'password';

  constructor(
    public activateRoute: ActivatedRoute,
    public authService: AuthService,
    public companyService: CompanyService,
    private _fb: FormBuilder,
    private _alertCtrl: AlertController,
    public modalCtrl: ModalController,
    private _toastCtrl: ToastController
  ) { }

  ngOnInit() {

    // Load the passed model if available
    // if (window.history.state && window.history.state.model) {
    //   this.model = window.history.state.model;
    // }

    // this.company_id = this.activateRoute.snapshot.paramMap.get('company_id');
    // this.isSubCompany = parseInt(this.activateRoute.snapshot.paramMap.get('subcompany'));

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

    this.companyService.view(company_id).subscribe(bank => {
      this.model = bank;

      this.loading = false;

    }, () => {

      this.loading = false;
    });
  }

  /**
   * init form
   */
  _initForm() {

    if (this.model.parent_company_id){
      this.isSubCompany = 1;
    }
    // Init Form

    if (!this.model.company_id){ // Show Create Form

      this.operation  = (this.isSubCompany) ? 'Create Sub-company' : 'Create Company';

      if (this.isSubCompany) {
        this.form = this._fb.group({
          name: ['', Validators.required],
          bonus_commission: [''],
          hourly_rate: ['', Validators.required],
          logo: [''],
          common_name_en: [''],
          common_name_ar: [''],
          description_en: [''],
          description_ar: [''],
          website: [''],
        });
      } else {
        this.form = this._fb.group({
          name: ['', Validators.required],
          common_name_ar: ['', Validators.required],
          common_name_en: ['', Validators.required],
          description_en: [''],
          description_ar: [''],
          website: ['', Validators.required],
          email: ['', [Validators.required, CustomValidator.emailValidator]],
          password: ['', Validators.required],
          bonus_commission: [''],
          hourly_rate: ['', Validators.required],
          logo: [''],
        });
      }
    } else { // Show Update Form
      this.operation  = (this.isSubCompany) ? 'Update  Sub-company' : 'Update Company';
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
            logo: [this.model.company_logo]
        });
      } else {
        this.form = this._fb.group({
            name: [this.model.company_name, Validators.required],
            email: [this.model.company_email, [Validators.required, CustomValidator.emailValidator]],
            password: [this.model.company_password_hash], // not required
            bonus_commission: [this.model.company_bonus_commission],
            hourly_rate: [this.model.company_hourly_rate, Validators.required],
            common_name_en: [this.model.company_common_name_en, Validators.required],
            common_name_ar: [this.model.company_common_name_ar, Validators.required],
            description_en: [this.model.company_description_en],
            description_ar: [this.model.company_description_ar],
            website: [this.model.company_website],
            logo: [this.model.company_logo],
        });
      }
    }
  }

  /**
   * Update Model Data based on Form Input
   */
  updateModelDataFromForm(){
    this.model.company_name = this.form.value.name;
    this.model.company_email = this.form.value.email;
    this.model.company_password_hash = this.form.value.password;
    this.model.company_bonus_commission = this.form.value.bonus_commission;
    this.model.company_hourly_rate = this.form.value.hourly_rate;
    this.model.company_common_name_en = this.form.value.common_name_en;
    this.model.company_common_name_ar = this.form.value.common_name_ar;
    this.model.company_description_en = this.form.value.description_en;
    this.model.company_description_ar = this.form.value.description_ar;
    this.model.company_website = this.form.value.website;
    this.model.company_logo = this.form.value.logo;
  }

  /**
   * Close the page
   */
  close(){
    this.modalCtrl.dismiss({ refresh: true });
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
      action =  this.companyService.update(this.model);
    }

    action.subscribe(async jsonResponse => {

      this.saving = false;

      // On Success
      if (jsonResponse.operation == 'success') {

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

  togglePasswordVisibility() {
    this.type = this.type == 'password'? 'text': 'password';
  }
}
