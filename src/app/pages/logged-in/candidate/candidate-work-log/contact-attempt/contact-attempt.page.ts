import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController, ModalController } from '@ionic/angular';
//services
import { AnalyticsService } from 'src/app/providers/analytics.service';
import { AuthService } from 'src/app/providers/auth.service';
import { CandidateWorkingHourService } from 'src/app/providers/logged-in/candidate-working-hour.service';
import { TranslateLabelService } from 'src/app/providers/translate-label.service';


@Component({
  selector: 'app-contact-attempt',
  templateUrl: './contact-attempt.page.html',
  styleUrls: ['./contact-attempt.page.scss'],
})
export class ContactAttemptPage implements OnInit {

  public appeal_uuid;

  public saving: boolean;

  public form: FormGroup;

  constructor(
    private _fb: FormBuilder, 
    public alertCtrl: AlertController,
    public modalCtrl: ModalController,
    public authService: AuthService,
    public analyticsService: AnalyticsService,
    public translateService: TranslateLabelService,
    public candidateWorkingHourService: CandidateWorkingHourService) { }

  ngOnInit() {
    this.analyticsService.page('Contact Attempt page');
 
    this.form = this._fb.group({
      update: ["", Validators.required],
      detail: ["", Validators.required],
    });
  }
 
  dismiss(data = {}) {
    this.modalCtrl.dismiss(data);
  }

  save() {
    this.saving = true;
 
    this.candidateWorkingHourService.appealUpdate(this.appeal_uuid, this.form.value).subscribe(async response => {
      this.saving = false;

      if (response.operation == "success") {
        this.dismiss({ refresh: true});
      } else {
        const prompt = await this.alertCtrl.create({
          message: this.authService.errorMessage(response.message),
          buttons: ['Okay']
        });
        prompt.present();
      }
    });
  }
}
