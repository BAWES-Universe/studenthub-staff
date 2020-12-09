import { Location } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AlertController, ModalController, Platform } from '@ionic/angular';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
//models
import { CompanyContact } from 'src/app/models/company-contact';
import { Note } from 'src/app/models/note';
import { AuthService } from 'src/app/providers/auth.service';
//services
import { CompanyContactService } from 'src/app/providers/logged-in/company-contact.service';
import { NoteService } from 'src/app/providers/logged-in/note.service';
import { CompanyContactFormPage } from '../../company-contact-form/company-contact-form.page';


@Component({
  selector: 'app-company-contact-view',
  templateUrl: './company-contact-view.page.html',
  styleUrls: ['./company-contact-view.page.scss'],
})
export class CompanyContactViewPage implements OnInit {

  @ViewChild('ckeditor') ckeditor;

  public contact_uuid: string;

  public loading: boolean = false;

  public deleting: boolean = false;

  public companyContact: CompanyContact;

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

  public pageCount: number;
  
  public currentPage: number;

  public borderLimit;

  constructor(
    private fb: FormBuilder,
    public location: Location,
    public platform: Platform,
    public route: ActivatedRoute,
    public alertCtrl: AlertController,
    public modalCtrl: ModalController,
    public authService: AuthService,
    public noteService: NoteService,
    public companyContactService: CompanyContactService
  ) { }

  ngOnInit() {
    this.contact_uuid = this.route.snapshot.params.contact_uuid;

    const model = window.history.state.model;

    if(model) {
      this.companyContact = model;
      this.initNoteForm();
      this.loadNotes();
    }

    if(!this.companyContact) {
      this.loadDetail();
    }
  }

  /**
   * load request detail
   */
  loadDetail() {
    this.loading = true;

    this.companyContactService.view(this.contact_uuid).subscribe(data => {
      this.companyContact = data;
      this.loadNotes();

      if(!this.noteForm)
        this.initNoteForm();
    }, () => {
    }, () => {
      this.loading = false;
    });
  }

  async edit() {
    window.history.pushState({ navigationId: window.history.state.navigationId }, null, window.location.pathname);

    const modal = await this.modalCtrl.create({
      component: CompanyContactFormPage,
      componentProps: {
        model: this.companyContact
      }
    });
    modal.onDidDismiss().then(e => {

      if (!e.data || e.data.from != 'native-back-btn') {
        window['history-back-from'] = 'onDidDismiss';
        window.history.back();
      }

      if (e && e.data && e.data.refresh) {
        this.loadDetail();
      }
    });
    modal.present();
  }

  async delete() {

    event.preventDefault();
    event.stopPropagation();

    const confirm = await this.alertCtrl.create({
      header: 'Delete Contact',
      message: 'Do you want to delete this contact?',
      buttons: [
        {
          text: 'Yes',
          handler: () => {

            this.deleting = true;

            this.companyContactService.delete(this.companyContact).subscribe(async response => {

              this.deleting = false;

              if (response.operation == 'success') {
                this.location.back();
              }
              else {
                const prompt = await this.alertCtrl.create({
                  message: this.authService.errorMessage(response.message),
                  buttons: ['Ok']
                });
                prompt.present();
              }
            }, () => {
              this.deleting = false;
            });
          },
        },
        {
          text: 'No',
        }
      ]
    });
    confirm.present();
  }

  /**
   * Make date readable by Safari
   * @param date
   */
  toDate(date) {
    if (date)
      return new Date(date.replace(/-/g, '/'));
  }

  /**
   * edit note
   * @param note
   */
  async editNote(note: Note) {
    this.editNoteData = note;

    this.noteForm.controls.note.setValue(note.note_text);
    this.noteForm.controls.type.setValue(note.note_type);

    this.ckeditor.editorInstance.setData(note.note_text);
    this.editorFocused = true;
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

  resetNoteForm() {
    this.editNoteData = new Note();

    this.noteForm.controls.note.setValue('');
    this.ckeditor.editorInstance.setData('');
    this.editorFocused = false;

    this.noteForm.controls.type.setValue('Internal Note');
  }

  /**
   * load notes
   */
  loadNotes() {
    const searchParams = this.urlParams();

    this.noteService.list(searchParams, 1).subscribe(async response => {

      this.pageCount = parseInt(response.headers.get('X-Pagination-Page-Count'));
      this.currentPage = parseInt(response.headers.get('X-Pagination-Current-Page'));

      this.notes = response.body;
    });
  }

  urlParams() {
    return '&contact_uuid=' + this.contact_uuid;
  }

  doInfinite(event) {

    const searchParams = this.urlParams();

    this.currentPage++;

    this.noteService.list(searchParams, this.currentPage).subscribe(response => {

      this.pageCount = parseInt(response.headers.get('X-Pagination-Page-Count'));
      this.currentPage = parseInt(response.headers.get('X-Pagination-Current-Page'));

      this.notes = this.notes.concat(response.body);
    },
      error => { },
      () => { event.target.complete(); }
    );
  }

  /**
   * save note data
   */
  save() {
    this.addingNote = true;

    const model = new Note();
    model.company_id = this.companyContact.company_id;
    model.note_type = this.noteForm.controls.type.value;
    model.contact_uuid = this.contact_uuid;
    model.note_text = this.noteForm.controls.note.value;
    
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

        this.resetNoteForm();
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

  logScrolling(e) {
    this.borderLimit = (e.detail.scrollTop > 0) ?  true : false;
  }
}
