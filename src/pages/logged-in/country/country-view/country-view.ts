import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, ModalController } from 'ionic-angular';

// Pages
import { CandidateViewPage } from '../../candidate/candidate-view/candidate-view';

// Providers
import { CandidateService } from '../../../../providers/logged-in/candidate.service';

// Models
import { Candidate } from '../../../../models/candidate';
import { Country } from '../../../../models/Country';

@Component({
  selector: 'page-country-view',
  templateUrl: 'country-view.html'
})
export class CountryViewPage {
  
  public pageCount = 0;
  public currentPage = 1;
  public pages: number[] = [];

  public country: Country;
  public candidates: Candidate[];

  constructor(
    public navCtrl: NavController,
    private _modalCtrl: ModalController,
    private candidateService: CandidateService,
    private _loadingCtrl: LoadingController,
    params: NavParams
  ) {
    this.country = params.get('model');

    this.loadData(this.currentPage);
  }

  loadData(page: number) {
    // Load list of candidates
    let loader = this._loadingCtrl.create();
    loader.present();
    this.candidateService.listByCountry(this.country.country_id, page).subscribe(response => {

      this.pageCount = response.headers.get('X-Pagination-Page-Count');
      this.currentPage = response.headers.get('X-Pagination-Current-Page');

      this.pages = [];

      for(var i = 1; i <= this.pageCount; i++){
         this.pages.push(i);
      }

      //hide if no page = 1 

      if(this.pageCount == 1)
        this.pages = [];

      this.candidates = response.json();

      loader.dismiss();
    });
  }
  
  candidateSelected(candidate) {
    // Load Detail Page
    this.navCtrl.push(CandidateViewPage, {
      'model': candidate
    });
  }

  deleteCandidates(candidate) {
    let loader = this._loadingCtrl.create();
    loader.present();

    this.candidateService.delete(candidate).subscribe(jsonResp => {
      loader.dismiss();
      this.loadData(this.currentPage);
    });
  }

  pageLinkColor(page: number) {

    if(page == this.currentPage) 
      return 'light';
    
    return '';
  }
}
