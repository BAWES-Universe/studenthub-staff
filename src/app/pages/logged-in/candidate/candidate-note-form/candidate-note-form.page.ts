import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ModalController, AlertController } from '@ionic/angular';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
//services
import { AuthService } from '../../../../providers/auth.service';
import { CandidateNoteService } from '../../../../providers/logged-in/candidate-note.service';
//models
import { CandidateNote } from '../../../../models/candidate.note';


@Component({
  selector: 'app-candidate-note-form',
  templateUrl: './candidate-note-form.page.html',
  styleUrls: ['./candidate-note-form.page.scss'],
})
export class CandidateNoteFormPage implements OnInit {

  @Input() candidate;

  @Input() note;

  @ViewChild('ckeditor', { static: false }) ckeditor: ClassicEditor;

  public model: CandidateNote = new CandidateNote();

  public operation: string;

  public Editor = ClassicEditor;

  public saving = false;

  public borderLimit = false;

  public editorConfig = {
    placeholder: 'Click here to take notes...',
    startupFocus : true,
    toolbar: ['Heading', '|', 'bold', 'italic', 'link', 'bulletedList', 'numberedList', 'blockQuote', '|', 'indent', 'outdent'],
  };

  public form: FormGroup;

  constructor(
    public noteService: CandidateNoteService,
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

    this.form = this.fb.group({
      note: [(this.model && this.model.candidate_note_uuid) ? this.model.note_text : '', Validators.required],
    });

    this.operation = (this.model && this.model.candidate_note_uuid) ? 'Update' : 'Create';

    setTimeout(() => this.ckeditor.editorInstance.editing.view.focus(), 1000);
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
    this.model.candidate_id = this.candidate.candidate_id;
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

    if (!this.model.candidate_note_uuid) {
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

    this.form.controls.note.setValue(data);
    this.form.markAsDirty();
    this.form.updateValueAndValidity();
  }
  
  logScrolling(e) {
    this.borderLimit = (e.detail.scrollTop > 20) ? true : false;
  }
}
