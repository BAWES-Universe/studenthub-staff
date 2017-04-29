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
    private _loadingCtrl: LoadingController,
  ) {
    this.candidate = params.get('model');
  }

  ionViewDidLoad() {
    this.loadData();
  }

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
  * Assigning Candidates to Store
  */
  assignCandidateToStore() {
    let alert = this.alertCtrl.create();
    alert.setTitle('Assign Candidate to Store');
    //Unassigning Candidate from Store
    if (this.candidate.store_id) {
      alert.addInput({
        type: 'radio',
        label: 'Unassign Candidate',
        value: '-1'
      });
    }

    //Assigning Candidate from Store
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
        console.log('Checkbox data:', data);
        if (data != '-1') {
          this.stores.forEach((value) => {
            if (value.store_id == data) {
              this.candidate.store_name = value.store_name;
              this.candidate.store_id = value.store_id;

              //Assinging Candidate from store
              this.assigning(this.candidate.candidate_id, this.candidate.store_id);

            }
          });
        }
        else {
          this.candidate.store_name = null;
          this.candidate.store_id = null;
          //Unassinging Candidate from store
          this.unAssigning(this.candidate.candidate_id);
        }

      }
    });
    alert.present();
  }


  /**
   * Unassinging Candidate from store
   */
  unAssigning(candidate_id: any) {
    let confirm = this.alertCtrl.create({
      title: '',
      message: 'Do you want to Unassign the Candidate from Store',
      buttons: [
        {
          text: 'Cancel',
          handler: () => {
            //handle the functionality when user click on 'cancel' button
          }
        },
        {
          text: 'Ok',
          handler: () => {
            //handle the functionality when user click on 'ok' button
            let loader = this._loadingCtrl.create();
            loader.present();
            //Unassigning Candidate from store
            this.candidateService.unAssignCandidate(candidate_id).subscribe(jsonResp => {
              this.candidate.store_name = null;
              this.candidate.store_id = null;
              loader.dismiss();
              this.loadData();
            });
          }
        }
      ]
    });
    confirm.present();
  }


  /**
   * Assign Candidate to store
   */
  assigning(store_id: number, candidate_id: number) {
    let loader = this._loadingCtrl.create();
    loader.present();

    this.candidateService.assignCandidate(store_id, candidate_id).subscribe(jsonResp => {
      loader.dismiss();
      this.loadData();
    });
  }

}
