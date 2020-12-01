import {Component, OnInit, ViewChild} from '@angular/core';
import {AlertController, ModalController, NavController, Platform} from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
// services
import { FulltimerService } from 'src/app/providers/logged-in/fulltimer.service';
import { AwsService } from 'src/app/providers/aws.service';
// models
import { Fulltimer } from 'src/app/models/fulltimer';
// pages
import { FulltimerFormPage } from '../fulltimer-form/fulltimer-form.page';
import {Note} from 'src/app/models/note';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {NoteService} from "../../../../providers/logged-in/note.service";
import {AuthService} from "../../../../providers/auth.service";
import {CandidateNoteFormPage} from "../../candidate/candidate-note-form/candidate-note-form.page";


@Component({
  selector: 'app-fulltimer-view',
  templateUrl: './fulltimer-view.page.html',
  styleUrls: ['./fulltimer-view.page.scss'],
})
export class FulltimerViewPage implements OnInit {

  public borderLimit = false;

  public fulltimerUUID: string;
  public fulltimer: Fulltimer;
  public loading = false;
  public sections = 'personal';

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

  @ViewChild('ckeditor') ckeditor;

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
    public authService: AuthService
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
      this.fulltimer.notes = jsonResponse.body;
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

    this.noteService.create(model).subscribe(async jsonResponse => {

      this.addingNote = false;

      // On Success
      if (jsonResponse.operation == 'success') {

        this.editorFocused = false;

        this.noteForm.controls.note.setValue('');

        this.ckeditor.editorInstance.setData('');

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
    this.editorFocused = false;
  }

  /**
   * edit note
   * @param note
   */
  async editNote(note: Note) {
    window.history.pushState({ navigationId: window.history.state.navigationId }, null, window.location.pathname);

    const modal = await this.modalCtrl.create({
      component: CandidateNoteFormPage,
      componentProps: {
        candidate: this.fulltimer,
        note,
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
      this.loadNotes(false);
    }
  }
}
