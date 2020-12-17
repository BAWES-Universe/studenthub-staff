import { Component, OnInit, ViewChild } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
//models
import { Company } from 'src/app/models/company';
import { Note } from 'src/app/models/note';
import { CompanyContact } from 'src/app/models/company-contact';
//services
import { NoteService } from 'src/app/providers/logged-in/note.service';
import { AuthService } from 'src/app/providers/auth.service';
import { CompanyContactService } from 'src/app/providers/logged-in/company-contact.service';


@Component({
  selector: 'app-company-notes',
  templateUrl: './company-notes.page.html',
  styleUrls: ['./company-notes.page.scss'],
})
export class CompanyNotesPage implements OnInit {
  
  @ViewChild('ckeditor') ckeditor;

  public company_id;

  public company: Company;

  public notes: Note[] = [];
  
  public companyContacts: CompanyContact[] = [];

  public loadingNotes: boolean = false;
  
  public deleting: boolean = false;

  public addingNote = false;

  public editNoteData;

  public noteForm: FormGroup;

  public borderLimit: boolean = false;

  public editorFocused: boolean = false;

  public Editor = ClassicEditor;

  public editorConfig = {
    placeholder: 'Click here to take notes...',
    toolbar: ['Heading', '|', 'bold', 'italic', 'link', 'bulletedList', 'numberedList', 'blockQuote', '|', 'indent', 'outdent'],
  };

  constructor(
    public fb: FormBuilder,
    public activatedRoute: ActivatedRoute,
    public alertCtrl: AlertController,
    public modalCtrl: ModalController,
    public noteService: NoteService,

    public companyContactService: CompanyContactService,
    public authService: AuthService
  ) { }

  ngOnInit() {

    this.company_id = this.activatedRoute.snapshot.paramMap.get('company_id');
    
    const state = window.history.state;

    if(state.company) {
      this.company = state.company;
    } 

    this.initNoteForm();
    this.loadNotes();
    this.loadContacts();
  }

  loadRequests() {
   // this.request
    //requests

  }
  
  loadContacts() {
    this.companyContactService.companyContacts(this.company_id).subscribe(data => {
      this.companyContacts = data;
    });
  }

  /**
   * load company notes
   */
  loadNotes() {
    this.loadingNotes = true;

    const params = '&company_id=' + this.company_id;

    this.noteService.list(params).subscribe(response => {

      this.loadingNotes = false;

      this.notes = response;
    }, () => {
      this.loadingNotes = false;
    });
  }
  
  onEditorFocus() {
    this.editorFocused = true;
  }

  cancelAddNote() {
    this.editNoteData = new Note();

    this.ckeditor.editorInstance.setData('');
    this.editorFocused = false;

    this.noteForm.controls.note.reset();
    this.noteForm.controls.type.reset();
    this.noteForm.controls.contact.reset();
    this.noteForm.controls.request.reset();
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

  initNoteForm() {
    this.noteForm = this.fb.group({
      note: ['', Validators.required],
      type: ['Internal Note', Validators.required],
      contact: [''],
      request: [''],
    });
  }

  /**
   * add note
   */
  addNote() {
    this.addingNote = true;

    const model = new Note();
    model.company_id = this.company_id;
    model.note_text = this.noteForm.controls.note.value;
    model.note_type = this.noteForm.controls.type.value;
    model.contact_uuid = this.noteForm.controls.contact.value;
    model.request_uuid = this.noteForm.controls.request.value;

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

    if (note.contact_uuid) {
      this.noteForm.controls.contact.setValue(note.contact_uuid);
    }
    if (note.request_uuid) {
      this.noteForm.controls.request.setValue(note.request_uuid);
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

            this.deleting = true;

            this.noteService.delete(note).subscribe(async response => {

              this.deleting = false;

              if (response.operation == 'success') {
                this.loadNotes();
              } else {

                this.deleting = false;

                // failer text
                const prompt = await this.alertCtrl.create({
                  header: 'Deletion Error!',
                  message: response.message,
                  buttons: ['Ok']
                });
                prompt.present();
              }
            }, () => {
              this.deleting = false;
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

  dismiss() {
    this.modalCtrl.dismiss();
  }

  logScrolling(e) {
    this.borderLimit = (e.detail.scrollTop > 20);
  }
}
