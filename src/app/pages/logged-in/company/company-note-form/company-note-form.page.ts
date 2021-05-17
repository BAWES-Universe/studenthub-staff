import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ModalController, AlertController, PopoverController } from '@ionic/angular';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
// models
import { Note } from 'src/app/models/note';
import { Company } from 'src/app/models/company';
// services
import { NoteService } from 'src/app/providers/logged-in/note.service';
import { AuthService } from 'src/app/providers/auth.service';
import { AwsService } from 'src/app/providers/aws.service';
// pages
import { AllCompanyListPage } from '../company-request-list/all-company-list/all-company-list.page';
import { CompanyRequestListPopupPage } from '../company-request-list/company-request-list-popup/company-request-list-popup.page';
import { CompanyContactListPage } from '../company-contact/company-contact-list/company-contact-list.page';
import {Candidate} from 'src/app/models/candidate';
import {Fulltimer} from 'src/app/models/fulltimer';


@Component({
  selector: 'app-company-note-form',
  templateUrl: './company-note-form.page.html',
  styleUrls: ['./company-note-form.page.scss'],
})
export class CompanyNoteFormPage implements OnInit {

  @ViewChild('ckeditor', { static: false }) ckeditor: ClassicEditor;

  @Input() note;
  @Input() from;

  public saving = false;
  public loading = false;
  public operation: string;
  public Editor = ClassicEditor;
  public company: Company;
  public candidate: Candidate;
  public fulltimer: Fulltimer;

  public editorConfig = {
    placeholder: 'Click here to take notes...',
    startupFocus: true,
    width: '100%',
    toolbar: ['Heading', '|', 'bold', 'italic', 'link', 'bulletedList', 'numberedList', 'blockQuote', '|', 'indent', 'outdent'],
  };

  public form: FormGroup;

  constructor(
    public noteService: NoteService,
    private fb: FormBuilder,
    private modalCtrl: ModalController,
    private alertCtrl: AlertController,
    public popoverCtrl: PopoverController,
    private authService: AuthService,
    public awsService: AwsService
  ) {
  }

  ngOnInit() {

    if (this.note && this.note.note_uuid) {
      this.loadData();
    } else {
      this.initForm();
    }
  }

  initForm() {

    this.form = this.fb.group({
      note: [this.note.note_text, Validators.required],
      type: [this.note.note_type, Validators.required],

      contact_uuid: [this.note.contact_uuid],
      contact_name: [this.note.companyContact ? this.note.companyContact.contact_name : ''],

      request_uuid: [this.note.request_uuid],
      request_name: [this.note.request ? this.note.request.request_position_title : ''],

      fulltimer_uuid: [this.note.fulltimer_uuid],
      candidate_id: [this.note.candidate_id],

      company_id: [this.note.company_id],
      company_name: [this.note.company ? this.note.company.company_name : ''],
    });
    
    // https://www.pivotaltracker.com/story/show/175926516
    if (this.from == 'post-update') {
      this.form.controls.type.setValue('Internal Note');
    }

    this.operation = (this.note && this.note.note_uuid) ? 'Update' : 'Post an update';
  }

  onEditorReady() {
    const interval = setTimeout(() => {
      if (this.ckeditor.editorInstance && this.form.value.note) {
        this.ckeditor.editorInstance.setData(this.form.value.note);
        // this.ckeditor.editorInstance.editing.view.focus();
        // clearInterval(interval);
      }
    }, 200);
  }

  /**
   * load note detail
   */
  loadData() {
    this.loading = true;

    this.noteService.view(this.note).subscribe(data => {
      this.note = data;

      this.initForm();

      this.loading = false;
    });
  }

  /**
   * Update Model Data based on Form Input
   */
  updateModelDataFromForm() {
    this.note.note_text = this.form.value.note;
    this.note.note_type = this.form.value.type;
    this.note.company_id = this.form.value.company_id;
    this.note.contact_uuid = this.form.value.contact_uuid;
    this.note.request_uuid = this.form.value.request_uuid;
    this.note.fulltimer_uuid = this.form.value.fulltimer_uuid;
    this.note.candidate_id = this.form.value.candidate_id;
  }

  /**
   * Close the page
   */
  close() {
    const data = { refresh: false };
    this.modalCtrl.dismiss(data);
  }

  /**
   * open popup to select contact
   * @param e
   */
  async openContact(e) {
    let popover;

    if (this.company && this.company.company_id) {
      popover = await this.popoverCtrl.create({
        component: CompanyContactListPage,
        event: e,
        componentProps: {
          company: this.company
        }
      });
    } else {
      popover = await this.modalCtrl.create({
        component: CompanyContactListPage,
        componentProps: {
          company: this.company
        }
      });
    }

    popover.onDidDismiss().then(e => {

      if (!e.data || (e.data && !e.data.contact)) {
        return null;
      }

      if (!this.form.controls.company_id.value) {
        this.form.controls.company_name.setValue(e.data.contact.company.company_name);
        this.form.controls.company_id.setValue(e.data.contact.company.company_id);
      }

      this.form.controls.contact_uuid.setValue(e.data.contact.contact_uuid);
      this.form.controls.contact_name.setValue(e.data.contact.contact_name);

    });
    popover.present();
  }

  /**
   * open popup to select company
   * @param e
   */
  async openClient(e) {

    const popover = await this.modalCtrl.create({
      component: AllCompanyListPage,
    });
    popover.onDidDismiss().then(e => {

      if (!e.data || this.form.controls.company_id.value == e.data.company_id) {
        return null;
      }

      if (e.data && e.data.company_id) {
        this.company = e.data;
      }
      this.form.controls.company_name.setValue(e.data.company_name);
      this.form.controls.company_id.setValue(e.data.company_id);

      this.form.controls.request_uuid.setValue(null);
      this.form.controls.request_name.setValue(null);

      this.form.controls.contact_uuid.setValue(null);
      this.form.controls.contact_name.setValue(null);

    });
    popover.present();
  }

  /**
   * open popup to select contact
   * @param e
   */
  async openRequest(e) {

    const company = new Company();

    if (this.form.controls.company_id.value) {
      company.company_id = this.form.controls.company_id.value;
    }

    const popover = await this.modalCtrl.create({
      component: CompanyRequestListPopupPage,
      componentProps: {
        company
      }
    });
    popover.onDidDismiss().then(e => {
      if (!e.data) {
        return null;
      }

      if (!this.form.controls.company_id.value) {
        this.form.controls.company_name.setValue(e.data.company.company_name);
        this.form.controls.company_id.setValue(e.data.company.company_id);
      }

      this.form.controls.request_name.setValue(e.data.request_position_title);
      this.form.controls.request_uuid.setValue(e.data.request_uuid);

    });
    popover.present();
  }

  /**
   * Save the model
   */
  async save() {

    this.saving = true;

    this.updateModelDataFromForm();

    let action;

    if (!this.note.note_uuid) {
      // Create
      action = this.noteService.create(this.note);
    } else {
      // Update
      action = this.noteService.update(this.note);
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

  /**
   * hide photo on error
   */
  onPhotoError() {
    this.candidate.candidate_personal_photo = null;
  }
}
