import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ModalController, AlertController } from '@ionic/angular';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
//models
import { Note } from 'src/app/models/note';
//services
import { CompanyNoteService } from 'src/app/providers/logged-in/company-note.service';
import { AuthService } from "../../../../providers/auth.service";
import { CompanyContactService } from 'src/app/providers/logged-in/company-contact.service';


@Component({
  selector: 'app-company-note-form',
  templateUrl: './company-note-form.page.html',
  styleUrls: ['./company-note-form.page.scss'],
})
export class CompanyNoteFormPage implements OnInit {

  @ViewChild('ckeditor', { static: false }) ckeditor: ClassicEditor;

  @Input() company;
  @Input() note;
  @Input() companyContacts;

  public saving = false;

  public model: Note = new Note();

  public operation: string;

  public Editor = ClassicEditor;

  public editorConfig = {
    placeholder: 'Click here to take notes...',
    startupFocus: true,
    width: '100%',
    toolbar: ['Heading', '|', 'bold', 'italic', 'link', 'bulletedList', 'numberedList', 'blockQuote', '|', 'indent', 'outdent'],
  };

  public form: FormGroup;

  constructor(
    public noteService: CompanyNoteService,
    public companyContactService: CompanyContactService,
    private fb: FormBuilder,
    private modalCtrl: ModalController,
    private alertCtrl: AlertController,
    private authService: AuthService
  ) {

  }

  ngOnInit() {
    if (this.note) {
      this.model = this.note;
    }

    let company_id;

    if (this.model && this.model.company_id) {
      company_id = this.model.company_id;
    } else if (this.company) {
      company_id = this.company.company_id;
    }

    this.form = this.fb.group({
      note: [(this.model && this.model.note_uuid) ? this.model.note_text : '', Validators.required],
      type: [(this.model && this.model.note_uuid) ? this.model.note_type : '', Validators.required],
      contact: [(this.model && this.model.contact_uuid) ? this.model.contact_uuid : ''],
      request: [(this.model && this.model.request_uuid) ? this.model.request_uuid : ''],
      company_id: [company_id],
    });

    this.operation = (this.model && this.model.note_uuid) ? 'Update' : 'Post an update';

    // this is causing issue. https://www.pivotaltracker.com/story/show/175598774
    // setTimeout(() => this.ckeditor.editorInstance.editing.view.focus(), 1000);

    if (!this.companyContacts && this.form.value.company_id) {
      this.loadContacts();
    }

    setTimeout(() => {
      if (this.model && this.ckeditor) {
        this.ckeditor.editorInstance.setData(this.form.value.note);
      }
    }, 200);
  }

  loadContacts() {
    this.companyContactService.companyContacts(this.form.value.company_id).subscribe(data => {
      this.companyContacts = data;
    });
  }

  /**
   * Update Model Data based on Form Input
   */
  updateModelDataFromForm() {
    this.model.note_text = this.form.value.note;
    this.model.note_type = this.form.value.type;
    this.model.company_id = this.form.value.company_id;
    this.model.contact_uuid = this.form.value.contact;
    this.model.request_uuid = this.form.value.request;
  }

  /**
   * Close the page
   */
  close() {
    const data = { refresh: false };
    this.modalCtrl.dismiss(data);
  }

  /**
   * Save the model
   */
  async save() {

    this.saving = true;

    this.updateModelDataFromForm();

    let action;

    if (!this.model.note_uuid) {
      // Create
      action = this.noteService.create(this.model);
    } else {
      // Update
      action = this.noteService.update(this.model);
    }

    action.subscribe(async jsonResponse => {

      this.saving = false;

      // On Success
      if (jsonResponse.operation == 'success') {
        // Close the page
        const data = { 
          request_updated_datetime: jsonResponse.request_updated_datetime, 
          refresh: true 
        };
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
  /**
   * on note editor change
   * @param event
   */
  onChange(event) {

    if (!event.editor) {
      return event;
    }

    const data = event.editor.getData();

    this.form.controls.note.setValue(data);
    this.form.markAsDirty();
    this.form.updateValueAndValidity();
  }
}
