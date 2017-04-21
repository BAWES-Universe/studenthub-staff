import { Component } from '@angular/core';
import { NavController, NavParams, ModalController } from 'ionic-angular';
// Pages
import { UniversityFormPage } from '../university-form/university-form';
// Models
import { University } from '../../../../models/university';

@Component({
  selector: 'page-university-view',
  templateUrl: 'university-view.html'
})
export class UniversityViewPage {

  public university: University;

  constructor(
    public navCtrl: NavController,
    private _modalCtrl: ModalController,
    params: NavParams
  ) {
    this.university = params.get('model');
  }
}
