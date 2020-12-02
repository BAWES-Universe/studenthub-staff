import { Component, OnInit, ViewChild } from '@angular/core';
import { AlertController, ModalController, NavController, Platform, PopoverController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// services
import { FulltimerService } from 'src/app/providers/logged-in/fulltimer.service';
import { AwsService } from 'src/app/providers/aws.service';
import { NoteService } from '../../../../providers/logged-in/note.service';
import { AuthService } from '../../../../providers/auth.service';
// models
import { Fulltimer } from 'src/app/models/fulltimer';
import { Note } from 'src/app/models/note';
// pages
import { FulltimerFormPage } from '../fulltimer-form/fulltimer-form.page';
import { CandidateNoteFormPage } from '../../candidate/candidate-note-form/candidate-note-form.page';
import { AllCompanyListPage } from '../../company/company-request-list/all-company-list/all-company-list.page';
import { CompanyRequestListPopupPage } from "../../company/company-request-list/company-request-list-popup/company-request-list-popup.page";
import { SuggestPage } from "../../suggest/suggest.page";


@Component({
  selector: 'app-fulltimer-view',
  templateUrl: './fulltimer-view.page.html',
  styleUrls: ['./fulltimer-view.page.scss'],
})
export class FulltimerViewPage implements OnInit {

  @ViewChild('ckeditor') ckeditor;
  
  public borderLimit = false;

  public fulltimerUUID: string;
  public fulltimer: Fulltimer;
  public loading = false;
  public sections = 'personal';

  public notes: Note[] = [];
  
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

  public company;

  constructor(
    public aws: AwsService,
    private activatedRoute: ActivatedRoute,
    private fulltimerService: FulltimerService,
    private modalCtrl: ModalController,
    private navCtrl: NavController,
    private fb: FormBuilder,
    public platform: Platform,
    public alertCtrl: AlertController,
    public noteService: NoteService,
    public authService: AuthService,
    public popoverCtrl: PopoverController
  ) { }

  ngOnInit() {
    this.fulltimerUUID = this.activatedRoute.snapshot.paramMap.get('id');
    this.loadData();
    this.initNoteForm();
  }

  loadData() {
    this.loading = true;
    this.fulltimerService.view(this.fulltimerUUID).subscribe(res => {
      this.loading = false;
      this.fulltimer = res;
    });
  }

  /**
   * get candidate resume url
   */
  getResumeUrl() {
    return this.aws.permanentBucketUrl + 'fulltimer-resume/' + encodeURIComponent(this.fulltimer.fulltimer_pdf_cv);
  }

  /**
   * Loads Form in modal to update
   */
  async update() {
    window.history.pushState({ navigationId: window.history.state.navigationId }, null, window.location.pathname);

    const modal = await this.modalCtrl.create({
      component: FulltimerFormPage,
      componentProps: {
        model: this.fulltimer,
      }
    });
    modal.onDidDismiss().then(e => {

      if (!e.data || e.data.from != 'native-back-btn') {
        window['history-back-from'] = 'onDidDismiss';
        window.history.back();
      }

      if (e.data && e.data.refresh) {
        this.loadData();
      }
    });

    return await modal.present();
  }

  /**
   * On candidate selected from list
   */
  rowSelected(store) {
    this.navCtrl.navigateForward('store-view/' + store.store_id);
  }

  logScrolling(e) {
    this.borderLimit = (e.detail.scrollTop > 20);
  }

  public segmentChanged($e) {
    this.sections = $e.detail.value;
  }

  /**
   * display editor on input focused for note
   */
  onEditorFocus() {
    this.editorFocused = true;
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
                this.loadNotes(true);
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
   * load notes
   * @param loading
   */
  loadNotes(loading = true) {
    this.noteService.listByTypeAndId('fulltimer', this.fulltimer.fulltimer_uuid).subscribe(async jsonResponse => {
      this.notes = jsonResponse.body;
    });
  }

  /**
   * add new note for candidate
   */
  addNote() {
    this.addingNote = true;

    const model = new Note();
    model.fulltimer_uuid = this.fulltimer.fulltimer_uuid;
    model.note_text = this.noteForm.controls.note.value;
    model.note_type = this.noteForm.controls.type.value;
    model.request_uuid = this.noteForm.controls.request_uuid.value;
    model.company_id = this.noteForm.controls.company_id.value;

    this.noteService.create(model).subscribe(async jsonResponse => {

      this.addingNote = false;

      // On Success
      if (jsonResponse.operation == 'success') {

        this.editorFocused = false;
        this.cancelAddNote();

        this.loadNotes(false);
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

  cancelAddNote() {
    this.editNoteData = new Note();
    this.noteForm.controls.note.setValue('');
    this.ckeditor.editorInstance.setData('');
    this.editorFocused = false;

    this.noteForm.controls.type.setValue('');
    this.noteForm.controls.company_name.setValue('');
    this.noteForm.controls.company_id.setValue('');
    this.noteForm.controls.request_name.setValue('');
    this.noteForm.controls.request_uuid.setValue('');
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

  /**
   * suggess this candidate 
   */
  async suggest() {

    window.history.pushState({ navigationId: window.history.state.navigationId }, null, window.location.pathname);

    const modal = await this.modalCtrl.create({
      component: SuggestPage,
      componentProps: {
        fulltimer: this.fulltimer
      }
    });
    modal.onDidDismiss().then(e => {

      if (!e.data || e.data.from != 'native-back-btn') {
        window['history-back-from'] = 'onDidDismiss';
        window.history.back();
      }

      if(e.data && e.data.refresh) {
        this.loadNotes();
      }
    });
    return await modal.present();
  }
}
