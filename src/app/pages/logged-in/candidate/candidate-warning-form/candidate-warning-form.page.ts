import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController, ModalController } from '@ionic/angular';
//models
import { CandidateWarning } from 'src/app/models/candidate-warning';
//services
import { AnalyticsService } from 'src/app/providers/analytics.service';
import { CandidateService } from 'src/app/providers/logged-in/candidate.service';
import { TranslateLabelService } from 'src/app/providers/translate-label.service';


@Component({
  selector: 'app-candidate-warning-form',
  templateUrl: './candidate-warning-form.page.html',
  styleUrls: ['./candidate-warning-form.page.scss'],
})
export class CandidateWarningFormPage implements OnInit {

  @Input() candidate;

  @Input() warning: CandidateWarning;// = new CandidateWarning();

  public operation: string;
 
  public saving = false;

  public borderLimit = false; 

  public form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private modalCtrl: ModalController,
    private alertCtrl: AlertController, 
    public candidateService: CandidateService,
    public analyticService: AnalyticsService,
    public translateService: TranslateLabelService
  ) {

  }

  ngOnInit() {
    this.analyticService.page('Candidate Warning Form Page');
 
    this.form = this.fb.group({
      title: [this.warning.title, Validators.required],
      message: [this.warning.message, Validators.required],
    });

    this.operation = (this.warning && this.warning.warning_id) ? 'Update' : 'Create';
  }


  /**
   * Update Model Data based on Form Input
   */
  updateModelDataFromForm() {
    this.warning.title = this.form.value.title;
    this.warning.message = this.form.value.message;
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

    if (!this.warning.warning_id) {
      // Create
      action = this.candidateService.warnCandidate(this.candidate.candidate_id, this.warning);
    } else {
      // Update
      action = this.candidateService.updateWarning(this.warning);
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
          message: this.translateService.errorMessage(jsonResponse),
          buttons: ['Okay']
        });
        prompt.present();
      }
    }, () => {
      this.saving = false;
    });
  }

  logScrolling(e) {
    this.borderLimit = (e.detail.scrollTop > 20);
  }
}
