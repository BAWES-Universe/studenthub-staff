import { Component } from '@angular/core';
import { NavParams } from 'ionic-angular';

// Models
import { University } from '../../../../models/university';

@Component({
  selector: 'page-university-view',
  templateUrl: 'university-view.html'
})
export class UniversityViewPage {

  public university: University;

  constructor(
    params: NavParams
  ) {
    this.university = params.get('model');
  }
}
