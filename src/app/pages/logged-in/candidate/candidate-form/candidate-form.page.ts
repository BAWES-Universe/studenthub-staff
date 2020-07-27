import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AlertController, NavController, ToastController } from '@ionic/angular';
import { CustomValidator } from 'src/app/validators/custom.validator';
// service
import { CandidateService } from 'src/app/providers/logged-in/candidate.service';
import { UniversityService } from 'src/app/providers/logged-in/university.service';
import { CountryService } from 'src/app/providers/logged-in/country.service';
// model
import { Candidate } from 'src/app/models/candidate';


@Component({
  selector: 'app-candidate-form',
  templateUrl: './candidate-form.page.html',
  styleUrls: ['./candidate-form.page.scss'],
})
export class CandidateFormPage implements OnInit {

  public model: Candidate = new Candidate;
  public operation: string;
  public candidate_id = null;
  public form: FormGroup;
  public universitylistData;
  public countrylistData;

  // Date values for Date Input
  public todayDate;
  public maxDate;
  public minBirthDate;
  public maxBirthDate;
  public loading = false;
  public saving = false;
  constructor(
    public activatedRoute: ActivatedRoute,
    public navCtrl: NavController,
    public candidateService: CandidateService,
    public universityService: UniversityService,
    public countryService: CountryService,
    private _fb: FormBuilder,
    private _alertCtrl: AlertController,
    private _toastCtrl: ToastController,
  ) {
  }

  ngOnInit() {

    this.candidate_id = this.activatedRoute.snapshot.paramMap.get('id');

    const state = window.history.state;

    if (state.model) {
      this.model = state.model;
    }

    if (this.candidate_id) {
      this.candidateDetail();
    } else {
      this.initForm();
    }

    // Set the min and max dates
    this.setDates();

    // Load the all available university list
    this.loadUniversityList();

    // Load all country
    this.loadCountryList();
  }

  /**
   * Update Model Data based on Form Input
   */
  updateModelDataFromForm() {
    this.model.candidate_name = this.form.value.name;
    this.model.candidate_email = this.form.value.email;

    this.model.bank_account_name = this.form.value.bank_account_name;
    this.model.candidate_iban = this.form.value.iban;
    this.model.candidate_name_ar = this.form.value.name_ar;

    this.model.candidate_phone = this.form.value.phone;
    this.model.candidate_birth_date = this.form.value.birth_date;
    this.model.candidate_civil_id = this.form.value.civil_id;
    this.model.candidate_civil_expiry_date = this.form.value.expiry_date;

    this.model.candidate_hourly_rate = this.form.value.hourly_rate;
    this.model.university_id = Number(this.form.value.university_id);
    this.model.country_id = Number(this.form.value.country_id);

    this.model.candidate_personal_photo = this.form.value.photo;
    this.model.candidate_civil_photo_front = this.form.value.civilfront;
    this.model.candidate_civil_photo_back = this.form.value.civilback;
  }

  /**
   * Save the candidate model
   */
  async save() {

    this.saving = true;
    this.updateModelDataFromForm();

    let action;
    if (!this.model.candidate_id) {
      // Create
      action = this.candidateService.create(this.model);
    } else {
      // Update
      action = this.candidateService.update(this.model);
    }

    action.subscribe(async jsonResponse => {
      this.saving = false;

      // On Success
      if (jsonResponse.operation == 'success') {
        // Fix photo folder path after upload
        if (this.model.candidate_personal_photo && !this.model.candidate_personal_photo.includes('photos/')) {
          this.model.candidate_personal_photo = `photos/${this.model.candidate_personal_photo}`;
        }

        // Close the page
        const data = { refresh: true };
        // this._viewCtrl.dismiss(data);

        // open view page
        this.navCtrl.navigateForward('candidate-view/' + jsonResponse.candidate.candidate_id, {
          state: {
            model: jsonResponse.candidate
          }
        });

        const toast = await this._toastCtrl.create({
          message: this.model.candidate_name + '\'s account saved successfully',
          duration: 3000
        });
        toast.present();
      }

      // On Failure
      if (jsonResponse.operation == 'error') {
        let html = '';

        for (const i in jsonResponse.message) {
          for (const j of jsonResponse.message[i]) {
            html += j + '<br />';
          }
        }

        const prompt = await this._alertCtrl.create({
          message: html,
          buttons: ['Ok']
        });
        prompt.present();
      }
    });
  }

  /**
   * Load list of countries
   */
  loadCountryList() {
    this.countryService.listAll().subscribe(response => {
      this.countrylistData = response;
    });
  }

  /**
   * Load list of universities available
   */
  loadUniversityList() {
    this.universityService.listAll().subscribe(response => {
      this.universitylistData = response;
    });
  }

  /**
   * Sets the default dates for min/max validation
   */
  setDates() {
    const today = new Date();
    // var dd = today.getDate();
    const mm = today.getMonth() + 1; // 0 is January, so we must add 1
    const yyyy = today.getFullYear();

    this.todayDate = new Date().toISOString();
    this.maxDate = new Date((yyyy + 20), mm).toISOString();
    this.minBirthDate = new Date((yyyy - 26), mm).toISOString();
    this.maxBirthDate = new Date((yyyy - 16), mm).toISOString();
  }

  /**
   * candidate detail
   */
  async candidateDetail() {
    this.loading = true;
    this.candidateService.detail(this.candidate_id).subscribe(response => {
      this.loading = false;
      if (response) {
        this.model = response;
        this.initForm();
      }
    });
  }

  initForm() {
    // Init Form
    if (!this.model.candidate_id) { // Show Create Form
      this.operation = 'Create';
      this.form = this._fb.group({
        name: ['', Validators.required],
        email: ['', [Validators.required, CustomValidator.emailValidator]],
        bank_account_name: [''],
        university_id: ['', Validators.required],
        country_id: ['', Validators.required],
        iban: [''],
        name_ar: ['', Validators.required],
        phone: ['', Validators.required],
        birth_date: ['', Validators.required],
        civil_id: ['', Validators.required],
        photo: ['', Validators.required],
        civilfront: ['', Validators.required],
        civilback: ['', Validators.required],
        expiry_date: ['', Validators.required],
        hourly_rate: ['', Validators.required]
      });
    } else { // Show Update Form
      this.operation = 'Update';
      this.form = this._fb.group({
        name: [this.model.candidate_name, Validators.required],
        email: [this.model.candidate_email, [Validators.required, CustomValidator.emailValidator]],
        bank_account_name: [this.model.bank_account_name],
        university_id: [this.model.university_id, Validators.required],
        country_id: [this.model.country_id + '', Validators.required],
        iban: [this.model.candidate_iban],
        name_ar: [this.model.candidate_name_ar, Validators.required],
        phone: [this.model.candidate_phone, Validators.required],
        birth_date: [this.model.candidate_birth_date, Validators.required],
        civil_id: [this.model.candidate_civil_id, Validators.required],
        photo: [this.model.candidate_personal_photo, Validators.required],
        civilfront: [this.model.candidate_civil_photo_front, Validators.required],
        civilback: [this.model.candidate_civil_photo_back, Validators.required],
        expiry_date: [this.model.candidate_civil_expiry_date, Validators.required],
        hourly_rate: [this.model.candidate_hourly_rate, Validators.required]
      });
    }
  }
}
