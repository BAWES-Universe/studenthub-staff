import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ModalController, AlertController } from '@ionic/angular';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
//services
import { AuthService } from '../../../../providers/auth.service';
import { CandidateNoteService } from '../../../../providers/logged-in/candidate-note.service';
import { CandidateNote } from 'src/app/models/candidate.note';


@Component({
  selector: 'app-candidate-committed-form',
  templateUrl: './candidate-committed-form.page.html',
  styleUrls: ['./candidate-committed-form.page.scss'],
})
export class CandidateCommittedFormPage implements OnInit {

  @Input() candidate;
   
  @ViewChild('ckeditor', { static: false }) ckeditor: ClassicEditor;
 
  public model: CandidateNote;

  public Editor = ClassicEditor;

  public saving = false;

  public editorConfig = {
    placeholder: 'Click here to take notes...',
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
    this.form = this.fb.group({
      note: ['', Validators.required],
    });

  }

  ionViewDidEnter() {
    setTimeout(() => this.ckeditor.editorInstance.editing.view.focus(), 1000);
  }

  /**
   * Update Model Data based on Form Input
   */
  updateModelDataFromForm() {
    this.model = new CandidateNote;
    this.model.note_text = this.form.value.note;
    this.model.candidate_id = this.candidate.candidate_id;
    console.log(this.model);
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

    this.noteService.toggleCommitted(this.model).subscribe(async jsonResponse => {

      console.log(jsonResponse);

      this.saving = false;

      // On Success

      if (jsonResponse.operation == 'success') {
        const data = { 
          candidate_committted: jsonResponse.candidate_committed, 
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
