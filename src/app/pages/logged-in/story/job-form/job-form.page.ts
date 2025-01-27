import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController, ModalController } from '@ionic/angular';
import { format, parseISO } from 'date-fns';
//models
import { Job } from 'src/app/models/job';
//services
import { AnalyticsService } from 'src/app/providers/analytics.service';
import { AuthService } from 'src/app/providers/auth.service';
import { JobService } from 'src/app/providers/logged-in/job.service';
import { LocationPage } from '../../candidate/location/location.page';
import { TranslateLabelService } from 'src/app/providers/translate-label.service';


@Component({
  selector: 'app-job-form',
  templateUrl: './job-form.page.html',
  styleUrls: ['./job-form.page.scss'],
})
export class JobFormPage implements OnInit {

  public model: Job;
  public operation: string;

  public form: FormGroup;

  public borderLimit = false;
  
  public saving = false;

  constructor(
    private fb: FormBuilder,
    private modalCtrl: ModalController,
    private alertCtrl: AlertController,
    public authService: AuthService,
    public jobService: JobService,
    public translateService: TranslateLabelService,
    public analyticService: AnalyticsService
  ) { }

  ngOnInit() {
    this.analyticService.page('Job Form Page');
 
    let skillCtrls = [];

    if(this.model.jobSkills) {
      for (let requestSkill of this.model.jobSkills) {
        skillCtrls.push(this.fb.group({
          skill: [requestSkill.skill, [Validators.required]],
          skill_ar: [requestSkill.skill_ar, [Validators.required]],
        }));
      }
    }

    if (!this.model.job_uuid) {
      skillCtrls.push(this.fb.group({
        skill: ['', [Validators.required]],
        skill_ar: ['', [Validators.required]],
      }));
    }

    this.form = this.fb.group({
      area_uuid: [this.model.area_uuid, Validators.required],
      position: [this.model.position, Validators.required],
      position_ar: [this.model.position_ar],
      description: [this.model.description, Validators.required],
      description_ar: [this.model.description_ar],
      hours_per_day: [this.model.hours_per_day, Validators.required],
      days_per_week: [this.model.days_per_week, Validators.required],
      compensation_type: [this.model.compensation_type, Validators.required],
      compensation_amount: [this.model.compensation_amount], //, Validators.required
      compensation_description: [this.model.compensation_description],
      compensation_description_ar: [this.model.compensation_description_ar],
      min_age: [this.model.min_age],
      max_age: [this.model.max_age],
      gender: [this.model.gender], //MALE = 1, FEMALE = 2, OTHER = 3
      available_from: [this.model.available_from],
      available_to: [this.model.available_to],
      status: [this.model.status],// 0 -DRAFT | 1 - ACTIVE | 2- CLOSED
      jobSkills:  new FormArray(skillCtrls),
    });

    this.operation = (this.model && this.model.job_uuid) ? 
      'Update Job Post' : 'Create Job Post';
  }

  addSkill() {
    this.jobSkills.push(this.fb.group({
      skill: ['', [Validators.required]],
      skill_ar: ['', [Validators.required]],
    }));
  }

  removeSkill(i) {
    this.jobSkills.removeAt(i);
  }

  get jobSkills(): FormArray {
    return this.form.get('jobSkills') as FormArray;
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
        hideCountry: true,
        heading: 'Job location',
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

      this.model.area = data.area;

      this.form.updateValueAndValidity();
    }
  }

  selectDate($event, type) {
    if ($event && $event.modified) {
      this.form.controls[type].setValue(format(parseISO($event.original), 'yyyy-MM-dd'));
      this.form.controls[type].markAsDirty();
    }
  }

  updateModelDataFromForm() {
    this.model.area_uuid = this.form.value.area_uuid;
    this.model.position = this.form.value.position;
    this.model.position_ar = this.form.value.position_ar;
    this.model.description = this.form.value.description;
    this.model.description_ar = this.form.value.description_ar;
    this.model.hours_per_day = this.form.value.hours_per_day;
    this.model.days_per_week = this.form.value.days_per_week;
    this.model.compensation_type = this.form.value.compensation_type;
    this.model.compensation_amount = this.form.value.compensation_amount;
    this.model.compensation_description = this.form.value.compensation_description;
    this.model.compensation_description_ar = this.form.value.compensation_description_ar;
    this.model.min_age = this.form.value.min_age;
    this.model.max_age = this.form.value.max_age;
    this.model.gender = this.form.value.gender;
    this.model.available_from = this.form.value.available_from;
    this.model.available_to = this.form.value.available_to;
    this.model.status = this.form.value.status;
    this.model.jobSkills = this.form.value.jobSkills;
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

    if (!this.model.job_uuid) {
      // Create
      action = this.jobService.create(this.model);
    } else {
      // Update
      action = this.jobService.update(this.model);
    }

    action.subscribe(async jsonResponse => {

      this.saving = false;

      if (jsonResponse.operation == 'success') {
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

  logScrolling(e) {
    this.borderLimit = (e.detail.scrollTop > 20);
  }
}
