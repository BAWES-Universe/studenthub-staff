import { Component } from '@angular/core';
import { NavController, NavParams, ModalController } from 'ionic-angular';

// Pages
import { StoreFormPage } from '../store-form/store-form';
import { CandidateViewPage } from '../../candidate/candidate-view/candidate-view';

// Models
import { Store } from '../../../../models/store';
import { Candidate } from '../../../../models/candidate';

@Component({
  selector: 'page-store-view',
  templateUrl: 'store-view.html'
})
export class StoreViewPage {

  public store: Store;

  constructor(
    public navCtrl: NavController,
    private _modalCtrl: ModalController,
    params: NavParams
  ) {
    this.store = params.get('model');
  }

  /**
   * On candidate selected from list
   */
  candidateSelected(candidate: Candidate){
    this.navCtrl.push(CandidateViewPage, {
      'model': candidate
    });
  }

  /**
   * Loads Form in modal to update
   */
  update(){
    let modal = this._modalCtrl.create(StoreFormPage, {
      model: this.store
    });
    modal.present();
  }

}
