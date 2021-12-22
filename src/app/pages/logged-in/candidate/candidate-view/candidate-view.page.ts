import { Component, OnInit, ViewChild } from '@angular/core';
import {
  ActionSheetController,
  AlertController, LoadingController,
  ModalController,
  NavController,
  Platform,
  PopoverController,
  ToastController
} from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// models
import { Store } from 'src/app/models/store';
import { Candidate } from 'src/app/models/candidate';
import { Note } from 'src/app/models/note';
import { Story } from 'src/app/models/request';
// service
import { StoreService } from 'src/app/providers/logged-in/store.service';
import { CandidateService } from 'src/app/providers/logged-in/candidate.service';
import { AwsService } from '../../../../providers/aws.service';
import { EventService } from '../../../../providers/event.service';
import { NoteService } from '../../../../providers/logged-in/note.service';
import { AuthService } from '../../../../providers/auth.service';
import { TranslateLabelService } from 'src/app/providers/translate-label.service';
import { InvitationService } from 'src/app/providers/logged-in/invitation.service';
// pages
import { OptionPage } from '../option/option.page';
import { CandidateCommittedFormPage } from '../candidate-committed-form/candidate-committed-form.page';
import { AllCompanyListPage } from '../../company/company-request-list/all-company-list/all-company-list.page';
import { CompanyRequestListPopupPage } from '../../company/company-request-list/company-request-list-popup/company-request-list-popup.page';
import { SuggestPage } from '../../suggest/suggest.page';
import { SelectSearchPageComponent } from 'src/app/components/select-search/select-search-page/select-search-page.component';
import { CompanyNoteFormPage } from '../../company/company-note-form/company-note-form.page';
import { ModalPopPage } from "../../modal-pop/modal-pop.page";
import { StoreViewPage } from "../../store/store-view/store-view.page";
import { InvitePage } from '../../invite/invite.page';


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
  public exportingCV = false;
  public loading = false;
  public approving = false;
  public unapproving = false;
  public downloading = false;

  public processing = null;

  public updatingJobSearchStatus = false;

  public editorFocused = false;
  public deletingNote = false;
  public job_search_status = false;
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
  public pendingData = null;

  public story: Story;

  constructor(
    public navCtrl: NavController,
    public router: Router,
    public platform: Platform,
    public activatedRoute: ActivatedRoute,
    public alertCtrl: AlertController,
    public storeService: StoreService,
    public candidateService: CandidateService,
    public translateService: TranslateLabelService,
    public invitationService: InvitationService,
    public awsService: AwsService,
    public toastCtrl: ToastController,
    public eventService: EventService,
    public authService: AuthService,
    public popoverCtrl: PopoverController,
    public noteService: NoteService,
    public modalCtrl: ModalController,
    private fb: FormBuilder,
    private actionSheetCtrl: ActionSheetController,
    private loadingCtrl: LoadingController,
  ) {

  }

  ngOnInit() {

    const state = window.history.state;

    if (state.story) {
      this.story = state.story;
    }

    if (!this.candidate_id) {
      this.candidate_id = this.activatedRoute.snapshot.paramMap.get('id');
    }

    this.eventService.reloadCandidateHistory$.subscribe((res) => {
      this.loadCandidateDetail();
      this.loadWorkHistoryData();
    });

    this.eventService.reloadCandiate$.subscribe((res) => {
      this.loadCandidateDetail();
    });

    this.eventService.noteUpdated$.subscribe((data: any) => {
      if (data.candidate_id == this.candidate_id) {
        this.loadNotes();
      }
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
    this.loadNotes();

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
    if (!date)
      return null;

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
    console.log(this.stores);
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

  async exportOption() {

    const actionSheet = await this.actionSheetCtrl.create({
      header: 'Export Candidates CV ',
      buttons: [{
        text: 'With contact details',
        handler: () => {
          this.exportCV();
        }
      }, {
        text: 'Without contact details',
        handler: () => {
          this.exportCV(0);
        }
      }]
    });
    actionSheet.present();
  }

  /**
   * export cv with and without
   * number
   * @param exportWithNumber
   */
  async exportCV(exportWithNumber = 1) {
    // Handle the functionality when user click on 'ok' button
    this.exportingCV = true;

    // Unassign Candidate from store
    this.candidateService.exportCV(this.candidate, exportWithNumber).subscribe(async response => {

      // Dismiss the loader
      this.exportingCV = false;
    });
  }

  /**
   * Unassign Candidate from store
   */
  async unassignCandidateFromStore() {
    const confirm = await this.alertCtrl.create({
      header: 'Are you sure?',
      message: 'Remove candidate from store',
      inputs: [
        {
          name: 'feedback',
          type: 'textarea',
          placeholder: 'Reason'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: () => {
            // Handle the functionality when user click on 'cancel' button
          }
        },
        {
          text: 'Ok',
          handler: async (data) => {
            if (!data.feedback) {
              this.alertCtrl.create({
                message: 'Please provide reason',
                buttons: ['Okay']
              }).then(alert => {
                alert.present();
              });
              return false;
            }

            // Handle the functionality when user click on 'ok' button
            this.unassinging = true;

            // Unassign Candidate from store
            this.candidateService.removeFromAssignedStore(this.candidate, data.feedback).subscribe(async response => {

              // Dismiss the loader
              this.unassinging = false;

              if (response.operation == 'success') {

                if (this.candidate) {
                  this.candidate.store_id = null;
                  this.candidate.store = null;
                  this.candidate.company = null;
                }
                this.loadNotes();

                this.eventService.reloadCandidateHistory$.next();
              } else {
                const prompt = await this.alertCtrl.create({
                  message: this._processResponseMessage(response),
                  buttons: ['Ok']
                });
                prompt.present();
              }
            });
          }
        }
      ]
    });
    confirm.present();
  }

  /**
   * Assign Candidate to Store
   * @param {number} storeID
   */
  async assignCandidateToStore(storeID) {

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
            if(!data || !data.rate) {
              return false;
            }

            this.assignCandidateToStoreWithRate(storeID, data.rate);
          }
        }
      ]
    }).then(alert => alert.present() );
  }

  /**
   * assign to store with rates
   * @param store_id
   * @param rate
   */
  assignCandidateToStoreWithRate(store_id, rate) {

    this.assigning = true;

    this.candidateService.assignCandidateToStore(this.candidate, store_id, rate).subscribe(async response => {

      this.assigning = false;

      if (response.operation == 'success') {

        this.candidate.store_id = store_id;

        this.loadCandidateDetail();

        this.loadWorkHistoryData();
        this.loadNotes();
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
      if (this.candidate && this.candidate.pendingField && this.candidate.pendingField.length > 0) {
        this.pendingData = 'Total ' + this.candidate.pendingField.length + ' pending fields\n ' + this.candidate.pendingField.join(',');
      }

      setTimeout(_ => {
        this.job_search_status = !!(this.candidate.candidate_job_search_status);
      }, 500);
    });
  }

  async openWorkPlace(history) {
    if (history.store) {
      window.history.pushState({ navigationId: window.history.state.navigationId }, null, window.location.pathname);

      const modal = await this.modalCtrl.create({
        component: ModalPopPage,
        componentProps: {
          activatedRoutePath: StoreViewPage,
          activatedRoutePathProps: {
            store_id: history.store.store_id,
            view: 'direct',
          }
        }
      });
      modal.onDidDismiss().then(e => {

        if (!e.data || e.data.from != 'native-back-btn') {
          window['history-back-from'] = 'onDidDismiss';
          window.history.back();
        }
      });
      modal.present();

      // this.router.navigate(['/store-view', history.store.store_id]);
    } else if (history.company) {
      this.router.navigate(['/company-view', history.company.company_id]);
    }
  }

  onVideoError() {
    this.candidate.candidate_video = null;
  }

  /**
   * hide photo on error
   */
  onPhotoError() {
    this.candidate.candidate_personal_photo = null;
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

      if (e.data && e.data.toggleCommitted) {
        this.toggleCommitted();
      }
    });
  }

  /**
   * invite candidate for open request
   */
  async invite() {

    if(this.story) {
      return this.addInvitation();
    }

    window.history.pushState({ navigationId: window.history.state.navigationId }, null, window.location.pathname);

    const modal = await this.modalCtrl.create({
      component: InvitePage,
      componentProps: {
        candidate: this.candidate,
        //story: this.story
      }
    });
    modal.onDidDismiss().then(e => {

      if (!e.data || e.data.from != 'native-back-btn') {
        window['history-back-from'] = 'onDidDismiss';
        window.history.back();
      }

      if (e.data && e.data.refresh && e.data.invitedCount) {
        //this.loadNotes();
        this.candidate.invited = e.data.invitedCount;
      }
    });
    await modal.present();
  }

  async addInvitation() {
    
    const confirm = await this.alertCtrl.create({
      header: 'Please provide feedback',
      inputs: [
        {
          name: 'feedback',
          type: 'textarea',
          placeholder: 'Reason'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: () => {
            // Handle the functionality when user click on 'cancel' button
          }
        },
        {
          text: 'Ok',
          handler: async (data) => {
                    
            //this.loading = true;

            const params = {
              request_uuid: this.story.request_uuid,
              story_uuid: this.story.story_uuid,
              candidate_id: this.candidate_id,
              reason: data.feedback
            };

            this.invitationService.create(params).subscribe(async response => {

              this.loading = false;

              // On Success
              if (response.operation == 'success') {
                this.candidate.invited = response.invitedCount;
              }

              // On Failure
              if (response.operation == 'error') {
                const prompt = await this.alertCtrl.create({
                  message: this.authService.errorMessage(response.message),
                  buttons: ['Okay']
                });
                prompt.present();
              }
            }, () => {
              this.loading = false;
            });
          }
        }
      ]
    });
    confirm.present();
  }

  /**
   * suggestion made to candidate
   */
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

      if (e.data && e.data.refresh && e.data.suggestionCount) {
        this.loadNotes();
        this.candidate.suggested = e.data.suggestionCount;
      }
    });
    await modal.present();
  }

  openNotes() {
    this.router.navigate(['candidate-notes', this.candidate_id], {
      state: {
        candidate: this.candidate
      }
    });
  }

  /**
   * open popup to select store
   * @param ev
   */
  async assingToStore(ev) {
    const selectPage = await this.popoverCtrl.create({
      component: SelectSearchPageComponent,
      componentProps: {
        collection: this.stores,
        valueAttr: 'store_id',
        labelAttr: 'storeWithCompany'
      },
      cssClass: 'select_search_store_id',
      // event: ev,
      translucent: true
    });
    selectPage.onDidDismiss().then(e => {
      console.log(e);
      if (e.data) {
        this.assignCandidateToStore(e.data.store_id);
      }
    });
    await selectPage.present();
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
    return this.awsService.permanentBucketUrl + 'candidate-resume/' + encodeURIComponent(candidate.candidate_resume);
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
      this.loadNotes();
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

            this.noteService.delete(note).subscribe(async response => {

              this.deletingNote = false;

              if (response.operation == 'success') {
                this.loadNotes();
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
   * return area name
   * @param area
   * @param country
   */
  area(area, country) {
    return this.translateService.langContent(area.area_name_en, area.area_name_ar) + ' ' +
      this.translateService.langContent(country.country_name_en, country.country_name_ar);
  }

  /**
   * load candidate notes without pagination
   */
  loadNotes() {
    const params = '&candidate_id=' + this.candidate_id;

    this.noteService.list(params).subscribe(async jsonResponse => {
      this.notes = jsonResponse;
    });
  }

  /**
   * open popup to update modal
   */
  async addNote() {

    window.history.pushState({ navigationId: window.history.state.navigationId }, null, window.location.pathname);

    const note = new Note;
    note.candidate_id = this.candidate_id;

    const modal = await this.modalCtrl.create({
      component: CompanyNoteFormPage,
      componentProps: {
        note,
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
      this.loadNotes();
    }
  }

  /**
   * add new note for candidate

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
      response = this.noteService.update(model);
    } else {
      response = this.noteService.create(model);
    }

    response.subscribe(async jsonResponse => {

      this.addingNote = false;

      // On Success
      if (jsonResponse.operation == 'success') {

        this.cancelAddNote();
        this.loadNotes();
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
  }*/

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
      popover = await this.modalCtrl.create({
        component: CompanyRequestListPopupPage,
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
      if (_ && _.data && _.data) {

        if (!this.company || !this.company.company_id) {
          this.noteForm.controls.company_name.setValue(_.data.company.company_name);
          this.noteForm.controls.company_id.setValue(_.data.company.company_id);
        }
        this.noteForm.controls.request_name.setValue(_.data.request_position_title);
        this.noteForm.controls.request_uuid.setValue(_.data.request_uuid);
      }
    });
    popover.present();
  }

  toggleFollowup($event) {

    // if same value then do nothing
    if (this.job_search_status == $event.detail.checked) {
      return;
    }

    this.job_search_status = $event.detail.checked;
    this.candidate.candidate_job_search_status = $event.detail.checked;


    this.candidateService.updateJobSearchStatus({
      candidate_id: this.candidate.candidate_id,
      job_search_status: this.candidate.candidate_job_search_status
    }).subscribe(async response => {

      // if (response && response.operation == 'success') {
      //   this.eventService.reloadFollowupList$.next();
      // }

    }, () => {
    });
  }

  onCivilBackError() {
    this.candidate.candidate_civil_photo_back = null;
  }
  onCivilFrontError() {
    this.candidate.candidate_civil_photo_front = null;
  }

  /**
   * invitation list page
   * @param status
   */
  invitationListPage(status: number) {
    if (status == 1 && parseInt(this.candidate.invited) < 1) { // Suggested
      return false;
    }
    if (status == 2 && parseInt(this.candidate.invitationRejected) < 1) { // Rejected
      return false;
    }
    if (status == 3 && parseInt(this.candidate.invitationAccepted) < 1) { // Accepted
      return false;
    }

    this.router.navigate(['candidate-invitations', this.candidate_id, status], {
      state: {
        candidate: this.candidate
      }
    });
  }

  /**
   * suggestion list page
   * @param status
   */
  suggestionListPage(status: number) {
    if (status == 1 && this.candidate.suggested < 1) { // Suggested
      return false;
    }
    if (status == 2 && this.candidate.suggestionRejected < 1) { // Rejected
      return false;
    }
    if (status == 3 && this.candidate.suggestionAccepted < 1) { // Accepted
      return false;
    }

    this.router.navigate(['candidate-suggestions', this.candidate_id, status], {
      state: {
        candidate: this.candidate
      }
    });
  }

  /**
   * download candidate appreciation certifcate
   * @param history
   */
  async downloadCertification(history) {
    this.downloading = true;

    this.candidateService.downloadCertificate(this.candidate.candidate_id, history.id).subscribe(response => {

      this.downloading = false;
    });
  }

  async updateEmailForm() {
    const confirm = await this.alertCtrl.create({
      header: 'Please provide New Email',
      inputs: [
        {
          name: 'email',
          type: 'email',
          placeholder: 'New Email'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: () => {
            // Handle the functionality when user click on 'cancel' button
          }
        },
        {
          text: 'Ok',
          handler: async (data) => {

            if (!data.email) {
              this.toastCtrl.create({
                message: this.authService.errorMessage('Email required'),
                duration: 3000
              }).then(toast => {
                toast.present();
              });
              return false;
            }
            const loading = await this.loadingCtrl.create();
            loading.present();

            this.candidateService.updateCandidateEmail(data.email, this.candidate_id).subscribe(res => {
              if (res.operation == 'success') {
                this.candidate.candidate_email = data.email;
              }
              if (res.operation == 'error') {
                this.toastCtrl.create({
                  message: this.authService.errorMessage(res.message),
                  duration: 3000
                }).then(toast => {
                  toast.present();
                });
              }
            },
                err => loading.dismiss(),
                () => loading.dismiss()
            );
          }
        }
      ]
    });
    confirm.present();
  }

  copy(event, val) {
    event.preventDefault();
    event.stopPropagation();

    const selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.innerText = val;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
  }
}
