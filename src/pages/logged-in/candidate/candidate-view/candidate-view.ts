import { Component } from '@angular/core';
import { NavController, NavParams, ModalController } from 'ionic-angular';
// Pages
import { CandidateFormPage } from '../candidate-form/candidate-form';
// Models
import { Candidate } from '../../../../models/candidate';

@Component({
  selector: 'page-candidate-view',
  templateUrl: 'candidate-view.html'
})
export class CandidateViewPage {

  public candidate: Candidate;

  constructor(
    public navCtrl: NavController,
    private _modalCtrl: ModalController,
    params: NavParams
  ) {
    this.candidate = params.get('model');
  }

  /**
   * Loads Form in modal to update
   */
  update(){
    let modal = this._modalCtrl.create(CandidateFormPage, {
      model: this.candidate
    });
    modal.present();
  }

}
