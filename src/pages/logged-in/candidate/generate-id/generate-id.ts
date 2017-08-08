import { Component } from '@angular/core';
import { LoadingController, AlertController } from 'ionic-angular';

// Forms
import { FormBuilder, FormGroup } from '@angular/forms';

// Providers
import { CandidateIdCardService } from '../../../../providers/logged-in/candidate-id-card.service';

@Component({
  selector: 'page-generate-id',
  templateUrl: 'generate-id.html'
})
export class GenerateIdPage {

  public pageCount: number = 0;
  public currentPage: number = 1;
  public pages: number[] = [];

  public searchBar: string = '';
  public cndSegment: string = 'not-generated';
  public candidates: any = [];
  
  public form: FormGroup;
  public candidatelistData;
  
  constructor(
    public candidateIdCardService: CandidateIdCardService,
    private _fb: FormBuilder,
    private _loadingCtrl: LoadingController,
    private _alertCtrl: AlertController
  ) {    
      this.form = this._fb.group({
        candidates: [],
      });
  }

  ionViewDidLoad() {
    this.loadData(this.currentPage);
  }

  /**
   * Generate id cards
   */
  generate() {
    
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

    this.candidateIdCardService.generate(this.candidates).subscribe(response => {
    }, (err) => {
    }, () => {
      loader.dismiss();
    });
  }

  /**
   * search method
   */
  search() {
    this.currentPage = 1;
    this.loadData(this.currentPage);
  }

  /**
   * load data
   * @param page 
   */
  loadData(page: number) {
    if(this.cndSegment == 'not-generated') {
      this.loadNotGenerated(page);
    } else {
      this.loadGenerated(page);
    }
  }

  pageLinkColor(page: number) {

    if(page == this.currentPage) 
      return 'light';
    
    return '';
  }

  /**
   * Load candidates whose ID not generated 
   */
  loadNotGenerated(page: number) {

    this.currentPage = page;

    // Load list of candidates
    let loader = this._loadingCtrl.create();
    loader.present();

    this.candidateIdCardService.listCandidates(this.searchBar, page).subscribe(response => {
      
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

      this.candidates = [];

      this.candidatelistData.forEach((value, index) => {
          this.candidates[index] = value.candidate_id;  
        });

      },
    error => {},
    ()=>{loader.dismiss();}
    );
  }

  /**
   * Load candidates whose ID generated 
   */
  loadGenerated(page: number) {

    this.currentPage = page;

    // Load list of candidates
    let loader = this._loadingCtrl.create();
    loader.present();

    this.candidateIdCardService.listCandidateIds(this.searchBar, page).subscribe(response => {
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

      this.candidates = [];
      
      this.candidatelistData.forEach((value, index) => {
          this.candidates[index] = value.candidate_id;  
        });

    },
    error => {},
    ()=>{loader.dismiss();}
    );
  }
}
