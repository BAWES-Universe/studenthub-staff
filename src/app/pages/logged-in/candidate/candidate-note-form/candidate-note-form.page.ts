import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ModalController, AlertController, PopoverController } from '@ionic/angular';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
//services
import { AuthService } from '../../../../providers/auth.service';
import { NoteService } from '../../../../providers/logged-in/note.service';
//models
import { Note } from '../../../../models/note';
//pages
import { AllCompanyListPage } from "../../company/company-request-list/all-company-list/all-company-list.page";
import { CompanyRequestListPopupPage } from "../../company/company-request-list/company-request-list-popup/company-request-list-popup.page";
import { AnalyticsService } from 'src/app/providers/analytics.service';


@Component({
  selector: 'app-candidate-note-form',
  templateUrl: './candidate-note-form.page.html',
  styleUrls: ['./candidate-note-form.page.scss'],
})
export class CandidateNoteFormPage implements OnInit {

  @Input() candidate;

  @Input() note;

  @ViewChild('ckeditor', { static: false }) ckeditor: ClassicEditor;

  public model: Note = new Note();

  public operation: string;

  public Editor = ClassicEditor;

  public saving = false;

  public borderLimit = false;
  public company: any;

  public editorConfig = {
    placeholder: 'Click here to take notes...',
    startupFocus: true,
    toolbar: ['Heading', '|', 'bold', 'italic', 'link', 'bulletedList', 'numberedList', 'blockQuote', '|', 'indent', 'outdent'],
  };

  public form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private modalCtrl: ModalController,
    private popoverCtrl: PopoverController,
    private alertCtrl: AlertController,
    public noteService: NoteService,
    private authService: AuthService,
    public analyticService: AnalyticsService,
  ) {

  }

  ngOnInit() {
    this.analyticService.page('Candidate Note Form Page');

    if (this.note) {
      this.model = this.note;
    }

    this.form = this.fb.group({
      note: [(this.model && this.model.note_uuid) ? this.model.note_text : '', Validators.required],
      type: [(this.model && this.model.note_type) ? this.model.note_type : '', Validators.required],
      company_id: [(this.model && this.model.company_id) ? this.model.company_id : '', Validators.required],
      request_uuid: [(this.model && this.model.request_uuid) ? this.model.request_uuid : '', Validators.required],
      company_name: ['', Validators.required],
      request_name: ['', Validators.required],
    });

    this.operation = (this.model && this.model.note_uuid) ? 'Update' : 'Create';

    setTimeout(() => {
      if (this.ckeditor.editorInstance)
        this.ckeditor.editorInstance.editing.view.focus();
    }, 1000);
  }

  ionViewDidEnter() {
    if (this.model && this.ckeditor && this.ckeditor.editorInstance && this.ckeditor.editorInstance.editing) {
      this.ckeditor.editorInstance.setData(this.model.note_text);
    }
  }

  /**
   * Update Model Data based on Form Input
   */
  updateModelDataFromForm() {
    this.model.note_text = this.form.value.note;
    this.model.note_type = this.form.value.type;
    this.model.candidate_id = this.candidate.candidate_id;
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
        const data = { refresh: true };
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

    this.form.controls['note'].setValue(data);
    this.form.markAsDirty();
    this.form.updateValueAndValidity();
  }

  logScrolling(e) {
    this.borderLimit = (e.detail.scrollTop > 20);
  }

  /**
   * open client page
   * @param e
   */
  async openClient(e) {
    const popover = await this.popoverCtrl.create({
      component: AllCompanyListPage,
      event: e,
    });
    popover.onDidDismiss().then((_) => {

      if (_ && _.data) {

        this.company = _.data;
        this.form.controls['company_name'].setValue(_.data.company_name);
        this.form.controls['company_id'].setValue(_.data.company_id);
        this.form.controls['request_name'].setValue(null);
        this.form.controls['request_uuid'].setValue(null);
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

    // if (this.company) {
    popover = await this.popoverCtrl.create({
      component: CompanyRequestListPopupPage,
      event: e,
      componentProps: {
        company: this.company
      }
    });
    // } else {
    //   popover = await this.modalCtrl.create({
    //     component: CompanyRequestListPopupPage
    //   });
    // }

    popover.onDidDismiss().then((_) => {
      if (_ && _.data && _.data) {

        if (!this.company || !this.company.company_id) {
          this.form.controls['company_name'].setValue(_.data.company.company_name);
          this.form.controls['company_id'].setValue(_.data.company.company_id);
        }
        this.form.controls['request_name'].setValue(_.data.request_position_title);
        this.form.controls['request_uuid'].setValue(_.data.request_uuid);
      }
    });
    popover.present();
  }
}
