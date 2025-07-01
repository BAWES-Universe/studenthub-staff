import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import {AlertController, ModalController, NavController, ToastController} from '@ionic/angular';
import { CustomValidator } from 'src/app/validators/custom.validator';
import { format, parseISO } from 'date-fns';
// service
import { CandidateService } from 'src/app/providers/logged-in/candidate.service';
import { UniversityService } from 'src/app/providers/logged-in/university.service';
import { CountryService } from 'src/app/providers/logged-in/country.service';
// model
import { Candidate } from 'src/app/models/candidate';
// pages
import { SkillFormPage } from '../skill-form/skill-form.page';
import { ExperienceFormPage } from '../experience-form/experience-form.page';
import { UploadCvPage } from '../upload-cv/upload-cv.page';
import {LocationPage} from '../location/location.page';
import { AnalyticsService } from 'src/app/providers/analytics.service';
import { TagFormPage } from '../tag-form/tag-form.page';
import { AuthService } from 'src/app/providers/auth.service';


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

  public borderLimit = false;

  constructor(
    public activatedRoute: ActivatedRoute,
    public navCtrl: NavController,
    public authService: AuthService,
    public candidateService: CandidateService,
    public universityService: UniversityService,
    public countryService: CountryService,
    public analyticService: AnalyticsService,
    private _fb: FormBuilder,
    private modalCtrl: ModalController,
    private _alertCtrl: AlertController,
    private _toastCtrl: ToastController,
  ) {
  }

  ngOnInit() {
    this.analyticService.page('Candidate Form Page');

    if(!this.candidate_id)
      this.candidate_id = this.activatedRoute.snapshot.paramMap.get('id');

    const state = window.history.state;

    // if (state.model) {
    //   this.model = state.model;
    // }

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

    this.model.candidate_birth_date = this.form.controls['birth_date'].value;

    this.model.candidate_civil_id = this.form.value.civil_id;

    this.model.candidate_civil_expiry_date = this.form.controls['expiry_date'].value;

    //this.model.candidate_hourly_rate = this.form.value.hourly_rate;
    this.model.university_id = Number(this.form.value.university_id);
    this.model.country_id = Number(this.form.value.country_id);

    this.model.candidate_personal_photo = this.form.value.photo;
    this.model.candidate_civil_photo_front = this.form.value.civilfront;
    this.model.candidate_civil_photo_back = this.form.value.civilback;
    this.model.candidate_objective = this.form.value.objective;

    this.model.candidate_latitude = this.form.value.latitude;
    this.model.candidate_longitude = this.form.value.longitude;
    this.model.candidate_area_uuid = this.form.value.area_uuid;
    this.model.candidate_mom_kuwaiti = this.form.value.candidate_mom_kuwait;

    this.model.candidate_preferred_time = this.form.value.preferred_time;

    if(!this.model.currency_code)
      this.model.currency_code = this.authService.currency_pref;
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

        // open view page
        this.navCtrl.navigateForward('candidate-view/' + jsonResponse.candidate.candidate_id);

        const candidate_name = this.model.candidate_name ? this.model.candidate_name : this.model.candidate_name_ar;

        const toast = await this._toastCtrl.create({
          message: candidate_name + '\'s account saved successfully',
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

    const query = 'expand=candidateSkills,candidateTags,candidateExperiences,area,country';

    this.candidateService.detail(this.candidate_id, query).subscribe(response => {
      this.loading = false;
      if (response) {
        this.model = response;
        this.model.pendingField =  this.model.pendingField.filter(v => v != "experience")
        this.model.isProfileCompleted = this.model.pendingField.length == 0;

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
        phone: ['', [Validators.required, Validators.pattern('^[0-9]{8}$')]],
        birth_date: ['', Validators.required],
        civil_id: ['', [Validators.required, Validators.pattern('^[0-9]{12}$')]],
        photo: ['', Validators.required],
        civilfront: ['', Validators.required],
        civilback: ['', Validators.required],
        expiry_date: ['', Validators.required],
        //hourly_rate: ['', Validators.required],
        objective: ['', Validators.required],
        gender: ['', Validators.required],
        license: ['', Validators.required],
        skills: ['', Validators.required],
        tags: [''],
        experiences: [''],
        resume: [''],
        latitude: [''],
        longitude: [''],
        area_uuid: [''],
        candidate_mom_kuwait: [''],
        preferred_time: [''],
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
        phone: [this.model.candidate_phone, [Validators.required, Validators.pattern('^[0-9]{8}$')]],
        birth_date: [this.model.candidate_birth_date, Validators.required],
        civil_id: [this.model.candidate_civil_id, [Validators.required, Validators.pattern('^[0-9]{12}$')]],
        photo: [this.model.candidate_personal_photo, Validators.required],
        civilfront: [this.model.candidate_civil_photo_front, Validators.required],
        civilback: [this.model.candidate_civil_photo_back, Validators.required],
        expiry_date: [this.model.candidate_civil_expiry_date, Validators.required],
        //hourly_rate: [this.model.candidate_hourly_rate, Validators.required],
        objective: [this.model.candidate_objective, Validators.required],
        gender: [this.model.candidate_gender, Validators.required],
        license: [this.model.candidate_driving_license, Validators.required],
        skills: [this.model.skill, Validators.required],
        tags: [this.model.tags],
        experiences: [this.model.experience],
        resume: [this.model.candidate_resume],
        latitude: [this.model.candidate_latitude],
        longitude: [this.model.candidate_longitude],
        area_uuid: [this.model.candidate_area_uuid],
        candidate_mom_kuwait: [this.model.candidate_mom_kuwaiti],
        preferred_time: [this.model.candidate_preferred_time],
      });

      this.loadExp();
      this.loadSkill();
      this.loadTags();
    }
  }

  setGenderOption(value) {
    this.form.controls['gender'].setValue(value);
    this.form.controls['gender'].markAsDirty();
    this.model.candidate_gender = value;
  }

  setKuwaitiMomStatus(value) {
    this.form.controls['candidate_mom_kuwait'].setValue(value);
    this.form.controls['candidate_mom_kuwait'].markAsDirty();
    this.model.candidate_mom_kuwaiti = value;
  }

  setLicenseOption(value) {
    this.form.controls['license'].setValue(value);
    this.form.controls['license'].markAsDirty();
    this.model.candidate_driving_license = value;
  }

  async updateTags () {
    window.history.pushState({ navigationId: window.history.state?.navigationId }, null, window.location.pathname);

    const modal = await this.modalCtrl.create({
      component: TagFormPage,
      componentProps: {
        candidate: this.model,
        tagList: (this.form.value.tags) ? this.form.value.tags.split(',') : []
      },
      cssClass: "popup-modal"
    });
    modal.present();
    modal.onDidDismiss().then(e => {

      if (!e.data || e.data.from != 'native-back-btn') {
        window['history-back-from'] = 'onDidDismiss';
        window.history.back();
      }
    });

    const { data } = await modal.onWillDismiss();

    if (data && data.tags) {
      this.form.controls['tags'].setValue(data.tags);
      this.form.controls['tags'].markAsDirty();
      this.model.tags = data.tags;
    }
  }


  async updateSkills() {
    window.history.pushState({ navigationId: window.history.state?.navigationId }, null, window.location.pathname);

    const modal = await this.modalCtrl.create({
      component: SkillFormPage,
      componentProps: {
        candidate: this.model,
        skillList: (this.form.value.skills) ? this.form.value.skills.split(',') : []
      },
      cssClass: "popup-modal"
    });
    modal.present();
    modal.onDidDismiss().then(e => {

      if (!e.data || e.data.from != 'native-back-btn') {
        window['history-back-from'] = 'onDidDismiss';
        window.history.back();
      }
    });

    const { data } = await modal.onWillDismiss();

    if (data && data.skills) {
      this.form.controls['skills'].setValue(data.skills);
      this.form.controls['skills'].markAsDirty();
      this.model.skill = data.skills;
    }
  }

  async updateExperiences() {
    window.history.pushState({ navigationId: window.history.state?.navigationId }, null, window.location.pathname);

    const modal = await this.modalCtrl.create({
      component: ExperienceFormPage,
      componentProps: {
        candidate: this.model,
        experienceList: (this.form.value.experiences) ? this.form.value.experiences.split(',') : []
      },
      cssClass: "popup-modal"
    });
    modal.present();
    modal.onDidDismiss().then(e => {

      if (!e.data || e.data.from != 'native-back-btn') {
        window['history-back-from'] = 'onDidDismiss';
        window.history.back();
      }
    });

    const { data } = await modal.onWillDismiss();

    if (data && data.experiences) {
      this.form.controls['experiences'].setValue(data.experiences);
      this.form.controls['experiences'].markAsDirty();
      this.model.experience = data.experiences;
    }
  }

  loadTags() {
    const tags = [];
    if (this.model.candidateTags && this.model.candidateTags.length > 0) {
      for (const skl of this.model.candidateTags) {
          tags.push(skl.tag);
          this.form.controls['tags'].setValue(tags.join(','));
          this.model.tags = tags.join(',');
        }
      }
  }

  loadSkill() {
    const skills = [];
    if (this.model.candidateSkills && this.model.candidateSkills.length > 0) {
      for (const skl of this.model.candidateSkills) {
        skills.push(skl.skill);
      }
    }

    this.form.controls['skills'].setValue(skills.join(','));
    this.model.skill = skills.join(',');
  }

  loadExp() {
    const experiences = [];
    if (this.model.candidateExperiences && this.model.candidateExperiences.length > 0) {
      for (const exp of this.model.candidateExperiences) {
          experiences.push(exp.experience);
          this.form.controls['experiences'].setValue(experiences.join(','));
          this.model.experience = experiences.join(',');
        }
      }
  }

  async updateResume() {
    window.history.pushState({ navigationId: window.history.state?.navigationId }, null, window.location.pathname);

    const modal = await this.modalCtrl.create({
      component: UploadCvPage,
      componentProps: {
        candidate: this.model,
      },
      cssClass: "popup-modal"
    });
    modal.present();
    modal.onDidDismiss().then(e => {

      if (!e.data || e.data.from != 'native-back-btn') {
        window['history-back-from'] = 'onDidDismiss';
        window.history.back();
      }
    });

    const { data } = await modal.onWillDismiss();

    if (data && data.resume) {
      this.form.controls['resume'].setValue(data.resume);
      this.form.controls['resume'].markAsDirty();
      this.model.candidate_resume = data.resume;
    }
  }

  logScrolling(e) {
    this.borderLimit = (e.detail.scrollTop > 20);
  }

  /**
   * select fulltimer location
   */
  async updateLocation() {
    window.history.pushState({ navigationId: window.history.state?.navigationId }, null, window.location.pathname);

    const modal = await this.modalCtrl.create({
      component: LocationPage,
      componentProps: {
        candidate: this.model,
      },
      cssClass: "popup-modal"
    });
    modal.present();
    modal.onDidDismiss().then(e => {

      if (!e.data || e.data.from != 'native-back-btn') {
        window['history-back-from'] = 'onDidDismiss';
        window.history.back();
      }
    });

    const { data } = await modal.onWillDismiss();

    if (data && data.area_uuid) {
      this.form.controls['area_uuid'].setValue(data.area_uuid);
      this.form.controls['area_uuid'].markAsDirty();

      this.form.controls['country_id'].setValue(data.country_id);
      this.form.controls['country_id'].markAsDirty();

      this.model.area = data.area;
      this.model.country = data.country;

      this.form.updateValueAndValidity();
    }
  }

  selectDate($event, type) {
    if ($event && $event.modified) {
      this.form.controls[type].setValue(format(parseISO($event.original), 'yyyy-MM-dd'));
      this.form.controls[type].markAsDirty();
    }
  }
}
