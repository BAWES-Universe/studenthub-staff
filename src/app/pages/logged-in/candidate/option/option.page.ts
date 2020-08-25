import {Component, Input, OnInit} from '@angular/core';
import {AlertController, PopoverController, ToastController} from '@ionic/angular';
// services
import { AuthService } from 'src/app/providers/auth.service';
import { TranslateLabelService } from 'src/app/providers/translate-label.service';
import {Candidate} from 'src/app/models/candidate';
import {CandidateService} from '../../../../providers/logged-in/candidate.service';
import {EventService} from "../../../../providers/event.service";


@Component({
  selector: 'app-option',
  templateUrl: './option.page.html',
  styleUrls: ['./option.page.scss'],
})
export class OptionPage implements OnInit {

  @Input() candidate: Candidate;
  public updatingJobSearchStatus = false;
  public sendingPassword: boolean = false;
  public unassinging: boolean = false;
  public assigning: boolean = false;

  constructor(
    public translateService: TranslateLabelService,
    public authService: AuthService,
    public candidateService: CandidateService,
    public popoverCtrl: PopoverController,
    public alertCtrl: AlertController,
    public toastCtrl: ToastController,
    public eventService: EventService
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
   * Log Agent out of the app
   */
  logout() {
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
            this.popoverCtrl.dismiss();
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
        this.popoverCtrl.dismiss();
      }
    });
  }

  /**
   * Unassign Candidate from store
   */
  async unassignCandidateFromStore() {
    const confirm = await this.alertCtrl.create({
      header: 'Are you sure?',
      message: 'Remove candidate from store',
      buttons: [
        {
          text: 'Cancel',
          handler: () => {
            // Handle the functionality when user click on 'cancel' button
          }
        },
        {
          text: 'Ok',
          handler: async () => {
            // Handle the functionality when user click on 'ok' button
            this.unassinging = true;

            // Unassign Candidate from store
            this.candidateService.removeFromAssignedStore(this.candidate).subscribe(async response => {
              this.popoverCtrl.dismiss();
              // Dismiss the loader
              this.unassinging = false;
              if (response.operation == 'success') {
                this.candidate.store_id = null;
                this.eventService.reloadCandidateHistory$.next();
              } else {
                const prompt = await this.alertCtrl.create({
                  message: this._processResponseMessage(response),
                  buttons: ['Ok']
                });
                prompt.present();
              }
            });
          }
        }
      ]
    });
    confirm.present();
  }

  toggleJobSearchStatus() {

    this.updatingJobSearchStatus = true;

    const params = {
      candidate_id: this.candidate.candidate_id,
      job_search_status: this.candidate.candidate_job_search_status == 1 ? 0 : 1
    };
    this.candidateService.updateJobSearchStatus(params).subscribe(async data => {

      this.updatingJobSearchStatus = false;
      this.popoverCtrl.dismiss();
      if (data.operation == 'success') {
        this.eventService.reloadCandiate$.next();
      } else {
        const toast = await this.toastCtrl.create({
          message: data.message,
          duration: 3000
        });

        toast.present();
      }
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
}
