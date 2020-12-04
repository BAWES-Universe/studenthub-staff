import { Component, OnInit, ViewChild } from '@angular/core';
import {
  AlertController,
  ModalController,
  NavController,
  Platform,
  PopoverController,
  ToastController
} from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
// models
import { Store } from 'src/app/models/store';
import { Candidate } from 'src/app/models/candidate';
import { Note } from 'src/app/models/note';
// service
import { StoreService } from 'src/app/providers/logged-in/store.service';
import { CandidateService } from 'src/app/providers/logged-in/candidate.service';
import { AwsService } from 'src/app/providers/aws.service';
import { EventService } from '../../../../providers/event.service';
import { CandidateNoteService } from '../../../../providers/logged-in/candidate-note.service';
import { AuthService } from '../../../../providers/auth.service';
// pages
import { OptionPage } from '../option/option.page';
import { CandidateCommittedFormPage } from '../candidate-committed-form/candidate-committed-form.page';
import { AllCompanyListPage } from "../../company/company-request-list/all-company-list/all-company-list.page";
import { CompanyRequestListPopupPage } from "../../company/company-request-list/company-request-list-popup/company-request-list-popup.page";
import { SuggestPage } from '../../suggest/suggest.page';


@Component({
  selector: 'app-candidate-view',
  templateUrl: './candidate-view.page.html',
  styleUrls: ['./candidate-view.page.scss'],
})
export class CandidateViewPage implements OnInit {

  @ViewChild('ckeditor') ckeditor;

  public candidate: Candidate;

  public notes: Note[] = [];

  public salaryTransfers: any[] = [];

  public stores: Store[];

  public workHistory: any[] = [];

  public candidate_id;

  public loadingSalaryTransfers = false;
  public sendingPassword = false;
  public assigning = false;
  public unassinging = false;

  public loading = false;
  public approving = false;
  public unapproving = false;

  public sections = 'personal';
  public processing = null;

  public updatingJobSearchStatus = false;

  public editorFocused = false;
  public deletingNote = false;
  public editNoteData: Note = new Note();

  public editorConfig = {
    placeholder: 'Click here to take notes...',
    toolbar: ['Heading', '|', 'bold', 'italic', 'link', 'bulletedList', 'numberedList', 'blockQuote', '|', 'indent', 'outdent'],
  };

  public Editor = ClassicEditor;

  public addingNote = false;

  public noteForm: FormGroup;

  public borderLimit = false;

  public company;

  constructor(
    public navCtrl: NavController,
    public router: Router,
    public platform: Platform,
    public activatedRoute: ActivatedRoute,
    public alertCtrl: AlertController,
    public storeService: StoreService,
    public candidateService: CandidateService,
    public aws: AwsService,
    public toastCtrl: ToastController,
    public eventService: EventService,
    public authService: AuthService,
    public popoverCtrl: PopoverController,
    public candidateNoteService: CandidateNoteService,
    public modalCtrl: ModalController,
    private fb: FormBuilder,
  ) {
    this.candidate_id = this.activatedRoute.snapshot.paramMap.get('id');
  }

  ngOnInit() {

    this.eventService.reloadCandidateHistory$.subscribe((res) => {
      this.loadCandidateDetail();
      this.loadWorkHistoryData();
    });

    this.eventService.reloadCandiate$.subscribe((res) => {
      this.loadCandidateDetail();
    });

    this.initNoteForm();
  }

  ionViewDidEnter() {
    // const state = window.history.state;
    // if (state.model) {
    //   this.candidate = state.model;
    // } else  {
    //   this.loadCandidateDetail();
    // }
    this.loadCandidateDetail();
    this.loadWorkHistoryData();
    this.loadCandidateNotes();

    this.loadStoreData();
    this.loadTransfersData();
  }

  /**
   * Load list of all salary transfers
   */
  loadTransfersData() {
    this.loadingSalaryTransfers = true;

    this.candidateService.transfers(this.candidate_id).subscribe(response => {

      this.loadingSalaryTransfers = false;

      this.salaryTransfers = response;
    }, () => {
      this.loadingSalaryTransfers = false;
    });
  }

  /**
   * Make date readable by Safari
   * @param date
   */
  toDate(date) {
    if (date) {
      return new Date(date.replace(/-/g, '/'));
    }
  }

  /**
   * Load list of all stores then set store name and id as per candidate data
   */
  loadStoreData() {
    this.storeService.list('store_id', 'storeWithCompany').subscribe(response => {
      this.stores = response;
    });
  }

  /**
   * Loads Form in modal to update
   */
  update() {
    this.navCtrl.navigateForward('candidate-form/' + this.candidate.candidate_id, {
      state: {
        model: this.candidate
      }
    });
  }

  /**
   * Assign Candidate to Store
   * @param {number} store_id
   */
  async assignCandidateToStore(store_id: number) {

    this.assigning = true;

    this.candidateService.assignCandidateToStore(this.candidate, store_id).subscribe(async response => {

      this.assigning = false;

      if (response.operation == 'success') {

        this.candidate.store_id = store_id;

        this.loadCandidateDetail();

        this.loadWorkHistoryData();

      } else {
        this.candidate.store_id = null;

        const alert = await this.alertCtrl.create({
          message: this._processResponseMessage(response),
          buttons: ['Ok']
        });
        alert.present();
      }
    });
  }

  /**
   * Process the response coming from the server
   * @private
   * @param {any} response
   * @returns message to display in error message
   */
  private _processResponseMessage(response) {
    let html = '';
    if (response.code == 2) {
      for (const i in response.message) {
        for (const j of response.message[i]) {
          html += j + '<br />';
        }
      }
    } else { html = response.message; }

    return html;
  }

  /**
   * Load candidate work history data
   */
  loadWorkHistoryData() {
    this.candidateService.workHistory(this.candidate_id).subscribe(response => {
      this.workHistory = response;
    });
  }

  loadCandidateDetail(loading = true) {
    this.loading = loading;

    this.candidateService.detail(this.candidate_id).subscribe(response => {
    
      this.loading = false;
      this.candidate = response;
    });
  }

  /**
   * @param $event
   * @param candidate
   */
  loadLogo($event, candidate) {
    candidate.candidate_personal_photo = null;
  }

  /**
   * Approve the provided model
   */
  async approve(candidate: Candidate) {

    this.approving = true;

    this.candidateService.approve(candidate).subscribe(response => {

      this.approving = false;

      if (response.operation == 'error') {

        this.toastCtrl.create({
          message: this.authService.errorMessage(response.message),
          duration: 3000
        }).then(toast => {
          toast.present();
        });

      } else {
        this.candidate.approved = 1;
        // update review count
        this.eventService.reviewRequired$.next();

        // back to listing
        // this.router.navigate(['/candidate-review-list']);
      }
    });
  }

  /**
   * unapprove the provided model
   */
  async unapprove(candidate: Candidate) {

    this.unapproving = true;

    this.candidateService.unapprove(candidate).subscribe(response => {

      this.unapproving = false;

      if (response.operation == 'error') {

        this.toastCtrl.create({
          message: this.authService.errorMessage(response.message),
          duration: 3000
        }).then(toast => {
          toast.present();
        });

      } else {
        this.candidate.approved = 0;

        // update review count
        this.eventService.reviewRequired$.next();

        // back to listing
        // this.router.navigate(['/candidate-review-list']);
      }
    }, () => {
      this.unapproving = false;
    });
  }

  /**
   * Display Popover with Additional Actions (Change Password and Logout)
   * @param e
   */
  async openPopover(e) {
    const popover = await this.popoverCtrl.create({
      component: OptionPage,
      componentProps: {
        candidate: this.candidate
      },
      event: e
    });
    popover.present();

    popover.onDidDismiss().then(e => {

      if (e.data && e.data.suggess) {
        this.suggest();
      }
    });
  }

  async suggest() {

    window.history.pushState({ navigationId: window.history.state.navigationId }, null, window.location.pathname);

    const modal = await this.modalCtrl.create({
      component: SuggestPage,
      componentProps: {
        candidate: this.candidate
      }
    });
    modal.onDidDismiss().then(e => {

      if (!e.data || e.data.from != 'native-back-btn') {
        window['history-back-from'] = 'onDidDismiss';
        window.history.back();
      }

      if(e.data && e.data.refresh) {
        this.loadCandidateNotes();
      }
    });
    await modal.present();
  }

  public segmentChanged($e) {
    this.sections = $e.detail.value;
  }

  /**
   * update candidate hourly rate
   * @param $e
   */
  updateRate($e) {
    this.alertCtrl.create({
      header: 'Set hourly rate',
      inputs: [
        {
          name: 'rate',
          type: 'text',
          placeholder: 'Hourly Rate'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        }, {
          text: 'Save',
          handler: (data) => {
            this.processing = 'setting_hours';
            if (data.rate) {
              this.candidateService.updateHour(this.candidate, data.rate).subscribe(response => {

                this.processing = false;

                if (response.operation == 'error') {
                  this.toastCtrl.create({
                    message: this.authService.errorMessage(response.message),
                    duration: 3000
                  }).then(toast => {
                    toast.present();
                  });
                } else {
                  this.loadCandidateDetail(false);
                }
              });
            }
          }
        }
      ]
    }).then(alert => { alert.present(); });
  }

  /**
   * get candidate resume url
   * @param candidate
   */
  getResumeUrl(candidate) {
    return this.aws.permanentBucketUrl + 'candidate-resume/' + encodeURIComponent(candidate.candidate_resume);
  }

  cancelAddNote() {
    this.editNoteData = new Note();

    this.noteForm.controls.note.setValue('');
    this.ckeditor.editorInstance.setData('');
    this.editorFocused = false;

    this.noteForm.controls.type.setValue('Internal Note');
    this.noteForm.controls.company_name.setValue('');
    this.noteForm.controls.company_id.setValue('');
    this.noteForm.controls.request_name.setValue('');
    this.noteForm.controls.request_uuid.setValue('');
  }

  /**
   * toggle candidate committed status
   */
  async toggleCommitted() {

    window.history.pushState({ navigationId: window.history.state.navigationId }, null, window.location.pathname);

    const modal = await this.modalCtrl.create({
      component: CandidateCommittedFormPage,
      componentProps: {
        candidate: this.candidate
      }
    });
    modal.present();
    modal.onDidDismiss().then(e => {

      if (!e.data || e.data.from != 'native-back-btn') {
        window['history-back-from'] = 'onDidDismiss';
        window.history.back();
      }
    });

    const { data } = await modal.onWillDismiss();

    if (data && data.refresh) {
      this.loadCandidateNotes();
      this.candidate.candidate_committed = data.candidate_committed;
    }
  }

  /**
   * edit note
   * @param note
   */
  async editNote(note: Note) {
    this.editNoteData = note;
    this.noteForm.controls.note.setValue(note.note_text);
    this.ckeditor.editorInstance.setData(note.note_text);
    this.editorFocused = true;

    this.noteForm.controls.type.setValue(note.note_type);

    if (note.company) {
        this.noteForm.controls.company_name.setValue(note.company.company_name);
        this.noteForm.controls.company_id.setValue(note.company.company_id);
    }

    if (note.request) {
      this.noteForm.controls.request_name.setValue(note.request.request_position_title);
      this.noteForm.controls.request_uuid.setValue(note.request.request_uuid);
    }
  }

  /**
   * removing note
   * @param event
   * @param note
   */
  async removeNote(event, note) {

    event.preventDefault();
    event.stopPropagation();

    const confirm = await this.alertCtrl.create({
      header: 'Delete Note',
      message: 'Do you want to delete this note?',
      buttons: [
        {
          text: 'Yes',
          handler: () => {

            this.deletingNote = true;

            this.candidateNoteService.delete(note).subscribe(async response => {

              this.deletingNote = false;

              if (response.operation == 'success') {
                this.loadCandidateNotes();
              } else {

                this.deletingNote = false;

                // failer text
                const prompt = await this.alertCtrl.create({
                  header: 'Deletion Error!',
                  message: response.message,
                  buttons: ['Ok']
                });
                prompt.present();
              }
            }, () => {
              this.deletingNote = false;
            });
          }
        },
        {
          text: 'No'
        }
      ]
    });
    confirm.present();
  }

  /**
   * display editor on input focused for note
   */
  onEditorFocus() {
    this.editorFocused = true;
  }

  /**
   * load candidate notes
   */
  loadCandidateNotes() {
    this.candidateNoteService.listById(this.candidate_id).subscribe(async jsonResponse => {
      this.notes = jsonResponse.body;
    });
  }

  /**
   * add new note for candidate
   */
  addNote() {
    this.addingNote = true;

    const model = new Note();
    model.candidate_id = this.candidate_id;
    model.note_text = this.noteForm.controls.note.value;
    model.note_type = this.noteForm.controls.type.value;
    model.request_uuid = this.noteForm.controls.request_uuid.value;
    model.company_id = this.noteForm.controls.company_id.value;

    let response = null;
    if (this.editNoteData && this.editNoteData.note_uuid) {
      model.note_uuid = this.editNoteData.note_uuid;
      response = this.candidateNoteService.update(model);
    } else {
      response = this.candidateNoteService.create(model);
    }
    response.subscribe(async jsonResponse => {

      this.addingNote = false;

      // On Success
      if (jsonResponse.operation == 'success') {

        this.cancelAddNote();
        this.loadCandidateNotes();
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
      this.editorFocused = false;
      this.addingNote = false;
    });
  }

  /**
   * on note editor change
   * @param event
   */
  onChange(event) {

    if (!event.editor) {
      return event;
    }

    const data = event.editor.getData();

    this.noteForm.controls.note.setValue(data);
    this.noteForm.markAsDirty();
    this.noteForm.updateValueAndValidity();
  }

  /**
   * init form to add note
   */
  initNoteForm() {
    this.noteForm = this.fb.group({
      note: ['', Validators.required],
      type: ['Internal Note', Validators.required],
      company_name: [''],
      company_id: [''],
      request_uuid: [''],
      request_name: [''],
    });
  }

  logScrolling(e) {
    this.borderLimit = (e.detail.scrollTop > 20);
  }

  /**
   * open client page
   * @param e
   */
  async openClient(e) {
    const popover = await this.modalCtrl.create({
      component: AllCompanyListPage,
    });
    popover.onDidDismiss().then((_) => {

      if (_ && _.data) {

        this.company = _.data;
        this.noteForm.controls.company_name.setValue(_.data.company_name);
        this.noteForm.controls.company_id.setValue(_.data.company_id);
        this.noteForm.controls.request_name.setValue(null);
        this.noteForm.controls.request_uuid.setValue(null);
      }
    });
    popover.present();
  }

  /**
   * open popup to select contact
   * @param e
   */
  async openRequest(e) {

    let popover;

    if (this.company) {
      popover = await this.popoverCtrl.create({
        component: CompanyRequestListPopupPage,
        event: e,
        componentProps: {
          company: this.company
        }
      });
    } else {
      popover = await this.modalCtrl.create({
        component: CompanyRequestListPopupPage
      });
    }

    popover.onDidDismiss().then((_) => {
      if (_ && _.data && _.data.data) {

        if (!this.company || !this.company.company_id) {
          this.noteForm.controls.company_name.setValue(_.data.data.company.company_name);
          this.noteForm.controls.company_id.setValue(_.data.data.company.company_id);
        }
        this.noteForm.controls.request_name.setValue(_.data.data.request_position_title);
        this.noteForm.controls.request_uuid.setValue(_.data.data.request_uuid);
      }
    });
    popover.present();
  }
}
