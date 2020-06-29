import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, ToastController, AlertController } from 'ionic-angular';

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

  public pageCount = 0;
  public currentPage = 1;
  public pages: number[] = [];

  public searchBar: string = '';
  public cndSegment: string = 'assigned';
  public candidates: Candidate[];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public candidateService: CandidateService,
    private _loadingCtrl: LoadingController,
    public toastCtrl: ToastController,
    public alertCtrl: AlertController,
  ) {
    //to open specific tab  
    let segment = this.navParams.get('segment');
    if(segment) {
      this.cndSegment = segment;
    }
  }

  ionViewWillEnter() {
    this.loadData(this.currentPage);
  }

  search() {
    this.currentPage = 1;
    this.loadData(this.currentPage);
  }

  loadData(page: number) {
    if(this.cndSegment == 'not-assigned') {
      this.loadNotAssigned(page);
    } else {
      this.loadAssigned(page);
    }
  }

  loadNotAssigned(page: number) {

    this.currentPage = page;

    // Load list of candidates
    let loader = this._loadingCtrl.create();
    loader.present();
    this.candidateService.listNotAssigned(this.searchBar, page).subscribe(response => {

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
    },
    error => {},
    () => {
      // console.log('Not Assigned Request Completed');
      loader.dismiss();
    }
    );
  }

  loadAssigned(page: number) {

    this.currentPage = page;

    // Load list of candidates
    let loader = this._loadingCtrl.create();
    loader.present();
    this.candidateService.listAssigned(this.searchBar, page).subscribe(response => {
      
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
    },
    error => {},
    () => { console.log('Assigned Request Completed'); loader.dismiss(); }
    );
  }

  pageLinkColor(page: number) {

    if(page == this.currentPage) 
      return 'light';
    
    return '';
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
    this.navCtrl.push(CandidateFormPage, {
      model: new Candidate()
    });
  }

  /**
   * Delete the provided model
   */

  delete(candidate: Candidate) {
    let loader = this._loadingCtrl.create();
    loader.present();
    let confirm = this.alertCtrl.create({
      title: 'Delete Candidate?',
      message: 'Are you sure you want to delete this Candidate?',
      buttons: [
        {
          text: 'Yes',
          handler: () => {
            this.candidateService.delete(candidate).subscribe(jsonResp => {
              loader.dismiss();
              
              if (jsonResp.operation == 'error') {
                let alert = this.alertCtrl.create({
                    title: 'Deletion Error!',
                    subTitle: jsonResp.message,
                    buttons: ['OK']
                  });
                  alert.present();
              }

              if (jsonResp.operation == 'success') {
                let toast = this.toastCtrl.create({
                  message: jsonResp.message,
                  duration: 3000
                });
                toast.present();
              }
              this.search();
            });
          }
        },
        {
          text: 'No',
          handler: () => {
            this.search();
            loader.dismiss();
          }
        }
      ]
    });
    confirm.present();
  }
}
