import { Component, OnInit } from '@angular/core';
import {AlertController, NavController, ToastController} from '@ionic/angular';
import {ActivatedRoute} from '@angular/router';

// models
import {Store} from 'src/app/models/store';
import {Candidate} from 'src/app/models/candidate';

// service
import {StoreService} from 'src/app/providers/logged-in/store.service';
import {CandidateService} from 'src/app/providers/logged-in/candidate.service';
import {AwsService} from 'src/app/providers/aws.service';


@Component({
  selector: 'app-candidate-view',
  templateUrl: './candidate-view.page.html',
  styleUrls: ['./candidate-view.page.scss'],
})
export class CandidateViewPage implements OnInit {

  public candidate: Candidate;
  public salaryTransfers: any[] = [];
  public stores: Store[];
  public workHistory: any[] = [];
  public candidate_id;
  public sendingPassword = false;
  public assigning = false;
  public unassinging = false;
  constructor(
    public navCtrl: NavController,
    public activatedRoute: ActivatedRoute,
    public alertCtrl: AlertController,
    public storeService: StoreService,
    public candidateService: CandidateService,
    public aws: AwsService,
    public toastCtrl: ToastController,
  ) {
    this.candidate_id = this.activatedRoute.snapshot.paramMap.get('id');
  }


  ngOnInit() {
    const state = window.history.state;

    // if (state.model) {
    //   this.candidate = state.model;
    // } else  {
    //   this.loadCandidateDetail();
    // }
    this.loadCandidateDetail();
    this.loadWorkHistoryData();

    this.loadStoreData();
    this.loadTransfersData();
  }

  /**
   * Load list of all salary transfers
   */
  loadTransfersData() {
    this.candidateService.transfers(this.candidate_id).subscribe(response => {
      this.salaryTransfers = response;
    });
  }

  /**
   * Load list of all stores then set store name and id as per candidate data
   */
  loadStoreData() {
    this.storeService.list('store_id', 'storeWithCompany').subscribe(response => {
      this.stores = response;
    });
  }

  /**
   * Loads Form in modal to update
   */
  update() {
    this.navCtrl.navigateForward('candidate-form/' + this.candidate.candidate_id, {
      state : {
        model: this.candidate
      }
    });
  }

  /**
   * Assign Candidate to Store
   * @param {number} store_id
   */
  async assignCandidateToStore(store_id: number) {
    this.assigning = true;

    this.candidateService.assignCandidateToStore(this.candidate, store_id).subscribe(async response => {
      this.assigning = false;
      if (response.operation == 'success') {
        this.candidate = response.candidate_detail;
      } else {
        this.candidate.store_id = null;
        const alert = await this.alertCtrl.create({
          message: this._processResponseMessage(response),
          buttons: ['Ok']
        });
        alert.present();
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
              // Dismiss the loader
              this.unassinging = false;

              if (response.operation == 'success') {
                this.candidate = response.candidate_detail;
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

  /**
   * Process the response coming from the server
   * @private
   * @param {any} response
   * @returns message to display in error message
   */
  private _processResponseMessage(response){
    let html = '';
    if (response.code == 2) {
      for (const i in response.message) {
        for (const j of response.message[i]) {
          html += j + '<br />';
        }
      }
    }else { html = response.message; }

    return html;
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
          role: 'cancel'
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

      if (response.operation == 'error')
      {
        const toast = await this.toastCtrl.create({
          message: response.message,
          duration: 3000
        });

        toast.present();
      }
      else
      {
        const alert = await this.alertCtrl.create({
          header: 'Reset Password',
          subHeader: 'New password sent to candidate',
          buttons: ['Okay']
        });
        alert.present();
      }
    });
  }

  /**
   * Load candidate work history data
   */
  loadWorkHistoryData() {
    this.candidateService.workHistory(this.candidate_id).subscribe(response => {
      this.workHistory = response;
    });
  }

  loadCandidateDetail() {
    this.candidateService.detail(this.candidate_id).subscribe( response => {
      console.log(this.candidate);
      this.candidate = response;
    });
  }

  /**
   * @param $event
   * @param candidate
   */
  loadLogo($event, candidate) {
    candidate.candidate_personal_photo = null;
    return candidate.candidate_personal_photo_thumb = null;
  }
}
