import { Component } from '@angular/core';
import { NavController, NavParams, ModalController, LoadingController, AlertController } from 'ionic-angular';
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
  public stores: Store[];

  constructor(
    public navCtrl: NavController,
    private _modalCtrl: ModalController,
    params: NavParams,
    public alertCtrl: AlertController,
    public storeService: StoreService,
    public candidateService: CandidateService,
    public aws: AwsService,
    private _loadingCtrl: LoadingController
  ) {
    this.candidate = params.get('model');
  }

  ionViewDidLoad() {
    this.loadData();
  }

  /**
   * Load data required
   */
  loadData() {
    // Load list of ALL stores
    let loader = this._loadingCtrl.create();
    loader.present();
    this.storeService.list().subscribe(response => {
      this.stores = response.json();
      this.stores.forEach((value) => {
        if (value.store_id == this.candidate.store_id) {
          this.candidate.store_name = value.store_name;
          this.candidate.store_id = value.store_id;
        }
      });
      loader.dismiss();
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
   */
  assignToStoreButtonClicked() {
    let alert = this.alertCtrl.create();
    alert.setTitle('Assign Candidate to Store');
    
    if (this.candidate.store_id) {
      alert.addInput({
        type: 'radio',
        label: 'Unassign Candidate',
        value: '-1'
      });
    }

    this.stores.forEach((value) => {
      alert.addInput({
        type: 'radio',
        label: value.store_name,
        value: value.store_id.toString()
      });
    });

    alert.addButton('Cancel');
    alert.addButton({
      text: 'Okay',
      handler: data => {
        if (data != '-1') {           
          //Assinging Candidate from store
          this.assignCandidateToStore(this.candidate.candidate_id, data);
        }
        else {
          //Unassinging Candidate from store
          this.unassignCandidateFromStore(this.candidate.candidate_id);
        }

      }
    });
    alert.present();
  }

  /**
   * Unassign Candidate from store
   * @param {*} candidate_id
   */
  unassignCandidateFromStore(candidate_id: any) {
    let confirm = this.alertCtrl.create({
      title: '',
      message: 'Do you want to Unassign the Candidate from Store',
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
            this.candidateService.unAssignCandidate(candidate_id).subscribe(response => {
              // Dismiss the loader
              loader.dismiss();              

              if(response.operation == 'success') {
                this.candidate.store_name = null;
                this.candidate.store_id = null;
              }
              else {
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
   * Assign Candidate to Store
   * 
   * @param {number} store_id
   * @param {number} candidate_id
   */
  assignCandidateToStore(store_id: number, candidate_id: number) {
    let loader = this._loadingCtrl.create();
    loader.present();

    this.candidateService.assignCandidate(store_id, candidate_id).subscribe(response => {

      loader.dismiss();      

      if(response.operation == 'success') 
      {
        this.candidate.store_name = response.store_name;
        this.candidate.store_id = response.store_id;
      }      
      else {
        let prompt = this.alertCtrl.create({
          message: this._processResponseMessage(response),
          buttons: ["Ok"]
        });
        prompt.present();
      }
      
    });
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

}
