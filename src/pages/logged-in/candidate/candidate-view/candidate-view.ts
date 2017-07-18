import { Component } from '@angular/core';
import { NavController, NavParams, ModalController, LoadingController, ToastController, AlertController } from 'ionic-angular';
// Pages
import { CandidateFormPage } from '../candidate-form/candidate-form';
// Models
import { Candidate } from '../../../../models/candidate';
import { Store } from '../../../../models/store';
// Providers
import { StoreService } from '../../../../providers/logged-in/store.service';
import { CandidateService } from '../../../../providers/logged-in/candidate.service';
import { AwsService } from '../../../../providers/aws.service';

@Component({
  selector: 'page-candidate-view',
  templateUrl: 'candidate-view.html'
})
export class CandidateViewPage {

  public candidate: Candidate;
  public salaryTransfers: any[] = [];
  public stores: Store[];

  constructor(
    public navCtrl: NavController,
    private _modalCtrl: ModalController,
    params: NavParams,
    public alertCtrl: AlertController,
    public storeService: StoreService,
    public candidateService: CandidateService,
    public aws: AwsService,
    private _loadingCtrl: LoadingController,
    public toastCtrl: ToastController,
  ) {
    this.candidate = params.get('model');
  }

  ionViewDidLoad() {
    //let loader = this._loadingCtrl.create();
    //loader.present();
    this.loadStoreData();
    this.loadTransfersData();
    //loader.dismiss();
  }

  /**
   * Load list of all salary transfers
   */
  loadTransfersData() {
    this.candidateService.transfers(this.candidate.candidate_id).subscribe(response => {
      this.salaryTransfers = response;
    });
  }
  
  /**
   * Load list of all stores then set store name and id as per candidate data
   */
  loadStoreData() {
    this.storeService.list("store_id", "storeWithCompany").subscribe(response => {
      this.stores = response;
    });
  }

  /**
   * Loads Form in modal to update
   */
  update() {
    this.navCtrl.push(CandidateFormPage, {
      model: this.candidate
    });
  }

  /**
   * Assign Candidate to Store
   * @param {number} store_id
   */
  assignCandidateToStore(store_id: number) {
    let loader = this._loadingCtrl.create();
    loader.present();

    this.candidateService.assignCandidateToStore(this.candidate, store_id).subscribe(response => {
      loader.dismiss();

      if (response.operation == 'success') {
        this.candidate = response.candidate_detail; 
      } else {
        this.alertCtrl.create({
          message: this._processResponseMessage(response),
          buttons: ["Ok"]
        }).present();
      }
    });
  }

  /**
   * Unassign Candidate from store
   */
  unassignCandidateFromStore() {
    let confirm = this.alertCtrl.create({
      title: 'Are you sure?',
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
          handler: () => {
            // Handle the functionality when user click on 'ok' button
            let loader = this._loadingCtrl.create();
            loader.present();

            // Unassign Candidate from store
            this.candidateService.removeFromAssignedStore(this.candidate).subscribe(response => {
              // Dismiss the loader
              loader.dismiss();              

              if(response.operation == 'success') {
                this.candidate = response.candidate_detail;
              } else {
                let prompt = this.alertCtrl.create({
                  message: this._processResponseMessage(response),
                  buttons: ["Ok"]
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
    if(response.code == 2) {
      for (let i in response.message) {
        for (let j of response.message[i]) {
            html += j + '<br />';
        }
      }
    }else html = response.message;

    return html;
  }

  /**
   * Show confirm alert to reset password 
   */
  resetPassword() {
    let alert = this.alertCtrl.create({
      title: 'Confirm password reset',
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
  sendNewPassword() {
    let loader = this._loadingCtrl.create();
    loader.present();

    this.candidateService.resetPassword(this.candidate).subscribe(response => {
      loader.dismiss();

      if(response.operation == 'error')
      {
        let toast = this.toastCtrl.create({
          message: response.message,
          duration: 3000
        });
        
        toast.present();
      } 
      else 
      {
        let alert = this.alertCtrl.create({
            title: 'Reset Password',
            subTitle: 'New password sent to candidate',
            buttons: ['Okay']
          });
          alert.present();
      }      
    });
  }
}
