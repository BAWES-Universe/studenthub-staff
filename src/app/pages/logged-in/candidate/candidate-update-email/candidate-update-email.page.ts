import { Component, OnInit, ViewChild } from '@angular/core';
import { AlertController, NavController, ModalController } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
// services
import { AccountService } from 'src/app/providers/logged-in/account.service';
import { EventService } from 'src/app/providers/event.service';
import {TranslateLabelService} from 'src/app/providers/translate-label.service';
import {CandidateService} from 'src/app/providers/logged-in/candidate.service';
import { AnalyticsService } from 'src/app/providers/analytics.service';


@Component({
  selector: 'app-candidate-update-email',
  templateUrl: './candidate-update-email.page.html',
  styleUrls: ['./candidate-update-email.page.scss'],
})
export class CandidateUpdateEmailPage implements OnInit {

  @ViewChild('emailInput') emailInput;

  public candidate;

  public form: FormGroup;

  // Disable submit button if loading response
  public isLoading = false;

  constructor(
    public router: Router,
    public fb: FormBuilder,
    public alertCtrl: AlertController,
    public candidateService: CandidateService,
    public eventService: EventService,
    public accountService: AccountService,
    public navCtrl: NavController,
    public modalCtrl: ModalController,
    public translateService: TranslateLabelService,
    public analyticService: AnalyticsService
  ) {
  }

  ionViewDidEnter() {
    setTimeout(() => {
      if (this.emailInput) {
        this.emailInput.setFocus();
      }
    }, 300);
  }

  ngOnInit() {
    this.analyticService.page('Candidate Update Email Page');

    // Initialize the Login Form
    this.form = this.fb.group({
      email: [this.candidate.candidate_email, [Validators.required, Validators.email]]
    });
  }

  /**
   * close popup modal
   */
  dismiss(data = {}) {
    this.modalCtrl.getTop().then(overlay => {
      if (overlay) {
        this.modalCtrl.dismiss(data);
      }
    });
  }

  /**
   * Attempts to register an account for the user
   * Then process his previous request
   */
  async onSubmit() {
    // if (!this.form.valid) {
    //   return false;
    // }
    //
    // this.isLoading = true;
    //
    // this.accountService.updateEmail(this.form.value.email).subscribe(async res => {
    //   this.isLoading = false;
    //
    //   if (res.operation == 'success') {
    //
    //     const { value } = await this.storageService.get('loggedInUser');
    //
    //     this.storageService.set({
    //       key: 'unVerifiedToken',
    //       value
    //     }).catch(r => {
    //       this.eventService.errorStorage$.next({});
    //     });
    //
    //     /*this.eventService.verifyEmail$.next({
    //       email: this.form.controls['email'].value,
    //       candidate_uuid: res.candidate_uuid
    //     });*/
    //
    //     this.dismiss({ email: this.form.controls['email'].value });
    //
    //   }
    //   else if (res.operation == 'error') {
    //     this._handleError(res);
    //   }
    //
    // }, error => {
    //   this.isLoading = false;
    // });
  }

  /**
   * Handle error
   * @param res
   */
  async _handleError(res) {
    const ok = this.translateService.transform('Okay');

    const prompt = await this.alertCtrl.create({
      message: this.translateService.errorMessage(res.message),
      buttons: [ok]
    });
    prompt.present();
  }
}
