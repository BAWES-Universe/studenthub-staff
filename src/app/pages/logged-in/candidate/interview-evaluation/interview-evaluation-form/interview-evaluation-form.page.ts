import { Component, OnInit } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
//models
import { InterviewEvaluation } from 'src/app/models/interview-evaluation';
import { Note } from 'src/app/models/note';
//pages
import { CompanyRequestListPopupPage } from '../../../company/company-request-list/company-request-list-popup/company-request-list-popup.page';
//services
import { AnalyticsService } from 'src/app/providers/analytics.service';
import { InterviewEvaluationService } from 'src/app/providers/logged-in/interview-evaluation.service';
import { AuthService } from 'src/app/providers/auth.service';


@Component({
  selector: 'app-interview-evaluation-form',
  templateUrl: './interview-evaluation-form.page.html',
  styleUrls: ['./interview-evaluation-form.page.scss'],
})
export class InterviewEvaluationFormPage implements OnInit {

  public candidate_id;
  
  public model: InterviewEvaluation;

  public form: FormGroup;

  public saving: boolean = false; 

  public borderLimit = false;

  constructor(
    public fb: FormBuilder,
    public alertCtrl: AlertController,
    public modalCtrl: ModalController,
    public authService: AuthService,
    public interviewEvaluationService: InterviewEvaluationService,
    public analyticService: AnalyticsService
  ) { }

  ngOnInit() {
    this.analyticService.page('Interview Evaluation Form Page');

    this.form = this.fb.group({
      note: ['', Validators.required],
      request_uuid: ['', Validators.required],
      request_name: ['', Validators.required],
    });
  }

  /**
   * Update Model Data based on Form Input
   */
  updateModelDataFromForm() {

    if(!this.model) {
      this.model = new InterviewEvaluation;
    }

    this.model.request_uuid = this.form.value.request_uuid;
    this.model.candidate_id = this.candidate_id;

    let note = new Note;
    note.note_text = this.form.value.note;
    this.model.notes = [note];
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

    if (!this.model.interview_evaluation_uuid) {
      // Create
      action = this.interviewEvaluationService.create(this.model);
    } else {
      // Update
      action = this.interviewEvaluationService.update(this.model);
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
          message: this.authService._processResponseMessage(jsonResponse),
          buttons: ['Okay']
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

  /**
   * open popup to select contact
   * @param e
   */
  async openRequest(e) {

    let modal = await this.modalCtrl.create({
      component: CompanyRequestListPopupPage,
      componentProps: {
        filters: {
          companyName: null,
          companyID: null,
          requestStatus: "",
          startDate: null,
          endDate: null
        }
      }
    });
    modal.onDidDismiss().then(e => {
      if (e && e.data) {
        this.form.controls['request_name'].setValue(e.data.request_position_title);
        this.form.controls['request_uuid'].setValue(e.data.request_uuid);
      }
    });
    modal.present();
  }
}
