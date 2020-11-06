import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ModalController, AlertController } from '@ionic/angular';
import { CompanyNoteService } from 'src/app/providers/logged-in/company-note.service';
import {Note} from 'src/app/models/note';
import {AuthService} from "../../../../providers/auth.service";
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
@Component({
  selector: 'app-company-note-form',
  templateUrl: './company-note-form.page.html',
  styleUrls: ['./company-note-form.page.scss'],
})
export class CompanyNoteFormPage implements OnInit {

  public saving = false;
  @Input() company;
  @Input() note;
  public model: Note = new Note();
  public operation: string;
  @ViewChild('ckeditor', { static: false }) ckeditor: ClassicEditor;

  public Editor = ClassicEditor;

  public editorConfig = {
    placeholder: 'Click here to take notes...',
    toolbar: [ 'Heading', '|', 'bold', 'italic', 'link', 'bulletedList', 'numberedList', 'blockQuote', '|', 'indent', 'outdent'],
  };


  public form: FormGroup;

  constructor(
    public noteService: CompanyNoteService,
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
      note: [(this.model && this.model.note_uuid) ? this.model.note_text : '', Validators.required],
    });
    this.operation  = (this.model && this.model.note_uuid) ? 'Update' : 'Create';
  }

  ionViewDidEnter() {
      if (this.model && this.ckeditor) {
        this.ckeditor.editorInstance.setData(this.model.note_text);
        // setTimeout(() => this.ckeditor.editorInstance.editing.view.focus(), 1000);
      }
  }

  /**
   * Update Model Data based on Form Input
   */
  updateModelDataFromForm() {
    this.model.note_text = this.form.value.note;
    this.model.company_id = this.company.company_id;
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
}
