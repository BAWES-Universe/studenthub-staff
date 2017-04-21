import { Component } from '@angular/core';
import { NavController, LoadingController, ModalController } from 'ionic-angular';

// Pages
import { UniversityViewPage } from '../university-view/university-view';
import { UniversityFormPage } from '../university-form/university-form';
// Providers
import { UniversityService } from '../../../../providers/logged-in/university.service';
// Models
import { University } from '../../../../models/university';

@Component({
  selector: 'page-university-list',
  templateUrl: 'university-list.html'
})
export class UniversityListPage {

  public pageCount = 0;
  public currentPage = 1;
  public pages: number[] = [];

  public universities: University[];

  constructor(
    public navCtrl: NavController,
    public universityService: UniversityService,
    private _modalCtrl: ModalController,
    private _loadingCtrl: LoadingController,
  ) {}

  ionViewDidLoad() {
    this.loadData(this.currentPage);
  }

  loadData(page: number) {
    // Load list of university
    let loader = this._loadingCtrl.create();
    loader.present();
    this.universityService.list(page).subscribe(response => {

      this.pageCount = response.headers.get('X-Pagination-Page-Count');
      this.currentPage = response.headers.get('X-Pagination-Current-Page');

      this.pages = [];

      for(var i = 1; i <= this.pageCount; i++){
         this.pages.push(i);
      }

      //hide if no page = 1 

      if(this.pageCount == 1)
        this.pages = [];

      this.universities = response.json();

      loader.dismiss();
    });
  }

  /**
   * When its selected
   */
  rowSelected(model){
    // Load Detail Page
    this.navCtrl.push(UniversityViewPage, {
      'model': model
    });
  }
}
