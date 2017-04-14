import { Component } from '@angular/core';
import { NavController, LoadingController, ModalController } from 'ionic-angular';

// Pages
import { CandidateViewPage } from '../candidate-view/candidate-view';
import { CandidateFormPage } from '../candidate-form/candidate-form';
// Providers
import { CandidateService } from '../../../../providers/logged-in/candidate.service';
// Models
import { Candidate } from '../../../../models/candidate';

@Component({
  selector: 'page-candidate-list',
  templateUrl: 'candidate-list.html'
})
export class CandidateListPage {

  public cndSegment: string;
  public candidates: Candidate[];

  constructor(
    public navCtrl: NavController,
    public candidateService: CandidateService,
    private _modalCtrl: ModalController,
    private _loadingCtrl: LoadingController,
  ) { }

  ionViewDidLoad() {
    this.cndSegment = 'assigned';
    this.loadData();
  }

  loadData() {

    if(this.cndSegment == 'not-assigned') {
      this.loadNotAssigned();
    } else {
      this.loadAssigned();
    }
  }

  loadNotAssigned() {
    // Load list of candidates
    let loader = this._loadingCtrl.create();
    loader.present();
    this.candidateService.listNotAssigned().subscribe(response => {
      this.candidates = response;
      loader.dismiss();
    });
  }

  loadAssigned() {
    // Load list of candidates
    let loader = this._loadingCtrl.create();
    loader.present();
    this.candidateService.listAssigned().subscribe(response => {
      this.candidates = response;
      loader.dismiss();
    });
  }

  /**
   * When its selected
   */
  rowSelected(model) {
    // Load Detail Page
    this.navCtrl.push(CandidateViewPage, {
      'model': model
    });
  }

  /**
   * Loads the create page
   */
  create() {
    let modal = this._modalCtrl.create(CandidateFormPage, {
      model: new Candidate()
    });
    // Refresh List if required
    modal.onDidDismiss(data => {
      if (data) {
        if (data.refresh) {
          this.loadData();
        }
      }
    });
    modal.present();
  }

  /**
   * Delete the provided model
   */
  delete(candidate: Candidate) {
    let loader = this._loadingCtrl.create();
    loader.present();

    this.candidateService.delete(candidate).subscribe(jsonResp => {
      loader.dismiss();
      this.loadData();
    });
  }

}
