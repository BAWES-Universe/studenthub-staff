import { Component, Input, OnInit } from '@angular/core';
import {AlertController, ModalController, NavController, PopoverController, ToastController} from '@ionic/angular';
// model
import { Candidate } from 'src/app/models/candidate';
// services
import { AuthService } from 'src/app/providers/auth.service';
import { TranslateLabelService } from 'src/app/providers/translate-label.service';
import { CandidateService } from 'src/app/providers/logged-in/candidate.service';
import { EventService } from 'src/app/providers/event.service';
import { CandidateIdCardService } from 'src/app/providers/logged-in/candidate.id.card.service';


@Component({
  selector: 'app-option',
  templateUrl: './option.page.html',
  styleUrls: ['./option.page.scss'],
})
export class OptionPage implements OnInit {

  @Input() candidate: Candidate;

  public updatingJobSearchStatus = false;
  public sendingPassword = false;
  public unassinging = false;
  public assigning = false;
  public expiring = false;

  public generating: boolean = false;

  constructor(
    public translateService: TranslateLabelService,
    public authService: AuthService,
    public candidateService: CandidateService,
    public candidateIdCardService: CandidateIdCardService,
    public popoverCtrl: PopoverController,
    public alertCtrl: AlertController,
    public toastCtrl: ToastController,
    public eventService: EventService,
    public navCtrl: NavController,
  ) { }

  ngOnInit() {
  }

  /**
   * close popup
   */
  dismiss() {
    this.popoverCtrl.dismiss();
  }

  /**
   * Show confirm alert to reset password
   */
  async resetPassword() {
    const alert = await this.alertCtrl.create({
      header: 'Confirm password reset',
      message: 'Do you want to send new password to candidate?',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          handler: () => {
            this.dismiss();
          }
        },
        {
          text: 'Yes',
          handler: () => {
            this.sendNewPassword();
          }
        }
      ]
    });
    alert.present();
  }

  /**
   * Reset and email the candidate a new password
   */
  async sendNewPassword() {
    this.sendingPassword = true;

    this.candidateService.resetPassword(this.candidate).subscribe(async response => {
      this.sendingPassword = false;

      if (response.operation == 'error') {
        const toast = await this.toastCtrl.create({
          message: response.message,
          duration: 3000
        });

        toast.present();
      }
      else {
        const alert = await this.alertCtrl.create({
          header: 'Reset Password',
          subHeader: 'New password sent to candidate',
          buttons: ['Okay']
        });
        alert.present();
        this.dismiss();
      }
    });
  }

  /**
   * Generate id cards
   */
  async generateId() {

    this.generating = true;

    const idList = [this.candidate.candidate_id];

    this.candidateIdCardService.generate(idList).subscribe(response => {
    }, err => {
    }, () => {
      this.generating = false;
    });
  }

  async renewCard() {
    const confirm = await this.alertCtrl.create({
      header: 'Are you sure?',
      message: 'Renew candidate card',
      buttons: [
        {
          text: 'Cancel'
        },
        {
          text: 'Yes',
          handler: async () => {
            // Handle the functionality when user click on 'ok' button
            this.expiring = true;

            // Unassign Candidate from store

            const idList = [this.candidate.candidate_id];

            this.candidateIdCardService.renew(idList).subscribe(async response => {

              this.dismiss();

              // Dismiss the loader
              this.expiring = false;

              if (response.operation == 'success') {
                this.eventService.reloadCandidateHistory$.next();
              }

              const prompt = await this.alertCtrl.create({
                message: this._processResponseMessage(response),
                buttons: ['Ok']
              });
              prompt.present();
            });
          }
        }
      ]
    });
    confirm.present();
  }

  /**
   * set candidate card expire
   */
  async setExpire() {
    const confirm = await this.alertCtrl.create({
      header: 'Are you sure?',
      message: 'Mark candidate card as expired',
      buttons: [
        {
          text: 'Cancel',
          handler: () => {
            // Handle the functionality when user click on 'cancel' button
          }
        },
        {
          text: 'Yes',
          handler: async () => {
            // Handle the functionality when user click on 'ok' button
            this.expiring = true;

            // Unassign Candidate from store
            this.candidateService.expired(this.candidate).subscribe(async response => {
              this.dismiss();
              // Dismiss the loader
              this.expiring = false;
              if (response.operation == 'success') {
                this.eventService.reloadCandidateHistory$.next();
              }
              const prompt = await this.alertCtrl.create({
                message: this._processResponseMessage(response),
                buttons: ['Ok']
              });
              prompt.present();
            });
          }
        }
      ]
    });
    confirm.present();
  }

  toggleJobSearchStatus(status = 'mark_as_looking') {

    this.alertCtrl.create({
      header: 'Are you sure?',
      message: (status == 'mark_as_looking') ? 'Mark as looking for job?' : 'Mark as not looking for job?',
      buttons: [
        {
          text: 'Cancel',
          handler: () => {
            // Handle the functionality when user click on 'cancel' button
          }
        },
        {
          text: 'Yes',
          handler: async () => {
            this.updatingJobSearchStatus = true;

            const params = {
              candidate_id: this.candidate.candidate_id,
              job_search_status: this.candidate.candidate_job_search_status == 1 ? 0 : 1
            };

            this.candidateService.updateJobSearchStatus(params).subscribe(async data => {

              this.updatingJobSearchStatus = false;
              this.dismiss();

              if (data.operation == 'success') {
                this.candidate.candidate_job_search_status = this.candidate.candidate_job_search_status == 1 ? 0 : 1;
                this.eventService.reloadCandiate$.next();
              } else {
                this.toastCtrl.create({
                  message: data.message,
                  duration: 3000
                }).then(toast => {
                  toast.present();
                });
              }
            });
          }
        }
      ]
    }).then(confirm => {
      confirm.present();
    });
  }

  /**
   * Process the response coming from the server
   * @private
   * @param {any} response
   * @returns message to display in error message
   */
  private _processResponseMessage(response) {
    let html = '';
    if (response.code == 2) {
      for (const i in response.message) {
        for (const j of response.message[i]) {
          html += j + '<br />';
        }
      }
    } else { html = response.message; }

    return html;
  }

  /**
   * suggess this candidate
   */
  async suggest() {
    this.popoverCtrl.dismiss({ suggess: true });
  }

  toggleCommitted() {
    this.popoverCtrl.dismiss({ toggleCommitted: true });
  }

  /**
   * Loads Form in modal to update
   */
  update() {
    this.navCtrl.navigateForward('candidate-form/' + this.candidate.candidate_id, {
      state: {
        model: this.candidate
      }
    });
    this.dismiss();
  }
}
