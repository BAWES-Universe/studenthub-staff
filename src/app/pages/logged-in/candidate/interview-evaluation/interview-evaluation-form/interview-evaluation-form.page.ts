import { Component, OnInit } from '@angular/core';
import { AlertController, ModalController, ToastController } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
//models
import { InterviewEvaluation, InterviewEvaluationNote } from 'src/app/models/interview-evaluation';
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

  public interviewEvaluationNotes: InterviewEvaluationNote[] = [];//new InterviewEvaluationNote

  public txtInterviewEvaluationNotes = '';
  public loading = false;
  public tmpInterviewEvaluationNotes: any = [];// [new InterviewEvaluationNote]; // assignment initial value

  public count;

  public dirty: boolean = false; 
  public query;

  constructor(
    public fb: FormBuilder,
    public toastCtrl: ToastController,
    public alertCtrl: AlertController,
    public modalCtrl: ModalController,
    public authService: AuthService,
    public interviewEvaluationService: InterviewEvaluationService,
    public analyticService: AnalyticsService
  ) { }

  ngOnInit() {
    this.analyticService.page('Interview Evaluation Form Page');

    let candidate_id = this.candidate_id? this.candidate_id: this.model?.candidate_id;

    this.form = this.fb.group({
     // note: ['', Validators.required],
      candidate_id: [candidate_id, Validators.required],
      request_uuid: [this.model?.request_uuid],//, Validators.required
      request_name: [this.model?.request?.request_position_title], //, Validators.required
    });

    if (this.interviewEvaluationNotes.length > 0) {
      this.interviewEvaluationNotes.push(new InterviewEvaluationNote);
      
      this.interviewEvaluationNotes.map((data, index) => {
        // initializing note list and loop count
        this.tmpInterviewEvaluationNotes.push(index); // for loop
      });
    } else {
      this.interviewEvaluationNotes.push(new InterviewEvaluationNote);

      // initializing note list with zero and loop count
      this.tmpInterviewEvaluationNotes[0] = new InterviewEvaluationNote;
    }

    this.count = this.tmpInterviewEvaluationNotes.length; // to check to add new textbox when type
  }

  ionViewDidEnter() {

    if(!this.interviewEvaluationNotes) {
      this.interviewEvaluationNotes = [];
    }

    setTimeout(() => {

      const lastElementIndex = this.interviewEvaluationNotes.length;

      const lastElement = document.getElementById('input[' + lastElementIndex + ']') as any;

      if (lastElement && document.getElementById('input[' + lastElementIndex + ']')) {
        lastElement.setFocus();
      }
    }, 200);
  }
  
  /**
   * focus on next input on enter pressed
   * @param event
   * @param i
   */
  nextOnEnter(event, i) {
    if (event.which == 13) {

      i++;

      const ele = document.getElementById('input[' + i + ']') as any;

      ele.setFocus();
    }
  }

  /**
   * close popup modal
   */
  dismiss(data = {}) {
    this.modalCtrl.getTop().then(overlay => {
      if (overlay) {
        this.modalCtrl.dismiss(data);
      }
    });
  }

  /**
   * When user hit enter on input
   * @param event
   * @param index
   * @param tempIndex
   */
  change(event, index, tempIndex) {

    this.query = event.target.value;

    // remove field on clearing it out + have next empty field

    if (this.count - index > 1 && event.target.value.length == 0) {
      return this.removeNote(index, tempIndex);
    }

    // check if new field is not added && something is typed
    if (((index - this.count) === -1) && event.target.value) {
      // adding new field
      this.tmpInterviewEvaluationNotes.push(this.interviewEvaluationNotes.length);
      this.interviewEvaluationNotes.push(new InterviewEvaluationNote);
      this.count++;
    }

    this.dirty = true;
  }

  /**
   * validate notes
   */
  validateNotes() {

    let found = false, noteIndex;

    for (let i = 0; i < this.interviewEvaluationNotes.length; i++) {
      for (let j = 0; j < this.interviewEvaluationNotes.length; j++) {
        if (i != j && this.interviewEvaluationNotes[i]['note'] == this.interviewEvaluationNotes[j]["note"]) {// not same index but same value
          noteIndex = j; // remove value at j
          found = true;
          break;
        }
      }
    }

    if (found) {
      this.toastCtrl.create({
        message: 'Duplicate note not allowed!',
        duration: 3000,
        cssClass: 'error_toast_'
      }).then(toast => toast.present());

      this.removeNote(noteIndex, noteIndex);

      return false;
    }

    return true;
  }

  /**
   * remove note item
   * @param noteIndex
   * @param tempIndex
   */
  removeItem(noteIndex, tempIndex) {
    this.interviewEvaluationNotes = this.interviewEvaluationNotes.filter((value, index) => index != noteIndex); // remove data from note
    this.tmpInterviewEvaluationNotes.splice(tempIndex, 1); // remove index value for loop
    this.count--; // decrease one value to compare new field
    this.tmpInterviewEvaluationNotes = new Array(this.tmpInterviewEvaluationNotes.length).fill(1); // resetting loop to avoid duplicate key

    this.dirty = !!(this.interviewEvaluationNotes.length); // to check if change or if its length is greater then zero
  }

  /**
   * removing note
   * @param noteIndex
   * @param tempIndex
   */
  removeNote(noteIndex, tempIndex) {
    this.dirty = true;

    if (tempIndex == 0) {
      if (this.interviewEvaluationNotes.length > 0) {
        this.removeItem(noteIndex, tempIndex);
      } else {
        this.interviewEvaluationNotes = [];
      }
    } else {
      this.removeItem(noteIndex, tempIndex);
    }
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
    
    /*let note = new Note;
    note.note_text = this.form.value.note;
    this.model.notes = [note];*/
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

    if(!this.validateNotes()) {
      return false;
    }

    this.saving = true;

    this.updateModelDataFromForm();

    let action;

    if (!this.model.interview_evaluation_uuid) {
      // Create
      action = this.interviewEvaluationService.create(this.model, this.interviewEvaluationNotes);
    } else {
      // Update
      action = this.interviewEvaluationService.update(this.model, this.interviewEvaluationNotes);
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
      },
      cssClass: "popup-modal"
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
