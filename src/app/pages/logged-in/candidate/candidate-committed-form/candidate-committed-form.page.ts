import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ModalController, AlertController } from '@ionic/angular';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
//services
import { AuthService } from '../../../../providers/auth.service';
import { CandidateService } from 'src/app/providers/logged-in/candidate.service';
//models
import { Note } from 'src/app/models/note';
import { AnalyticsService } from 'src/app/providers/analytics.service';


@Component({
  selector: 'app-candidate-committed-form',
  templateUrl: './candidate-committed-form.page.html',
  styleUrls: ['./candidate-committed-form.page.scss'],
})
export class CandidateCommittedFormPage implements OnInit {

  @Input() candidate;
   
  @ViewChild('ckeditor', { static: false }) ckeditor: ClassicEditor;
 
  public model: Note;

  public Editor = ClassicEditor;

  public saving = false;

  public editorConfig = {
    placeholder: 'Click here to take notes...',
    startupFocus : true,
    toolbar: ['Heading', '|', 'bold', 'italic', 'link', 'bulletedList', 'numberedList', 'blockQuote', '|', 'indent', 'outdent'],
  };

  public form: FormGroup;

  public borderLimit = false;

  constructor(
    private fb: FormBuilder,
    private modalCtrl: ModalController,
    private alertCtrl: AlertController,
    public candidateService: CandidateService,
    private authService: AuthService,
    public analyticService: AnalyticsService
  ) {
  }

  ngOnInit() { 
    this.analyticService.page('Candidate Committed Form Page');

    this.form = this.fb.group({
      note: ['', Validators.required],
      type: ['Internal Note', Validators.required],
    });
  }

  onEditorReady() {
    setTimeout(() => {
      this.ckeditor.editorInstance.editing.view.focus();
    }, 500);
  }

  /**
   * Update Model Data based on Form Input
   */
  updateModelDataFromForm() {
    this.model = new Note;
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

    this.candidateService.toggleCommitted(this.model).subscribe(async jsonResponse => {

      this.saving = false;

      // On Success

      if (jsonResponse.operation == 'success') {
        const data = { 
          candidate_committed: jsonResponse.candidate_committed, 
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

    this.form.controls['note'].setValue(data);
    this.form.markAsDirty();
    this.form.updateValueAndValidity();
  }
  
  logScrolling(e) {
    this.borderLimit = (e.detail.scrollTop > 20) ? true : false;
  }
}
