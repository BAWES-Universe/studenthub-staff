import { Component } from '@angular/core';
import { Events, NavController, ViewController, LoadingController, AlertController, NavParams } from 'ionic-angular';
// Forms
import { FormBuilder, FormGroup } from '@angular/forms';

// Providers
import { CandidateIdCardService } from '../../../../providers/logged-in/candidate-id-card.service';

@Component({
  selector: 'page-expired-id',
  templateUrl: 'expired-id.html'
})
export class ExpiredIdPage {

  public pageCount: number = 0;
  public currentPage: number = 1;
  public pages: number[] = [];

  public searchBar: string = '';
  public candidates: any = [];
  
  public form: FormGroup;
  public candidatelistData;
  
  constructor(
    params: NavParams,
    public navCtrl: NavController,
    public candidateIdCardService: CandidateIdCardService,
    private _fb: FormBuilder,
    private _viewCtrl: ViewController,
    private _loadingCtrl: LoadingController,
    private _alertCtrl: AlertController,
    private _events: Events
  ) {
    
      this.form = this._fb.group({
        candidates: [],
      });
  }

  ionViewWillLoad() {
    this.loadData();
  }

  /**
   * Renew id cards
   */
  renew() {
    
    if(this.candidates.length == 0)
    {
        let prompt = this._alertCtrl.create({
          message: 'Please select candidate(s)',
          buttons: ["Ok"]
        });
        prompt.present();

        return false;
    }  
    
    let loader = this._loadingCtrl.create();
    loader.present();

    this.candidateIdCardService.renew(this.candidates).subscribe(jsonResponse => {
      loader.dismiss();

      //refresh list 
      this.currentPage = 1;
      this.loadData();

      this._events.publish('navigation:expiredIdCard');
    });
  }

  /**
   * current page link
   * @param page 
   */
  pageLinkColor(page: number) {

    if(page == this.currentPage) 
      return 'light';
    
    return '';
  }

  /**
   * Load expired ID cards
   */
  loadData() {

    // Load list of candidates
    let loader = this._loadingCtrl.create();
    loader.present();

    this.candidateIdCardService.listExpiredIds(this.searchBar, this.currentPage).subscribe(response => {
      this.pageCount = response.headers.get('X-Pagination-Page-Count');
      this.currentPage = response.headers.get('X-Pagination-Current-Page');

      this.pages = [];

      for(var i = 1; i <= this.pageCount; i++){
         this.pages.push(i);
      }

      //hide if no page = 1 

      if(this.pageCount == 1)
        this.pages = [];

      this.candidatelistData = response.json();

      this.candidatelistData.forEach((value, index) => {
          this.candidates[index] = value.candidate_id;  
        });
    },
    error => {},
    ()=>{loader.dismiss();}
    );
  }
}
