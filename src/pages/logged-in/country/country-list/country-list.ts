import { Component } from '@angular/core';
import { NavController, LoadingController, ModalController } from 'ionic-angular';

// Pages
import { CountryViewPage } from '../country-view/country-view';
// Providers
import { CountryService } from '../../../../providers/logged-in/country.service';
// Models
import { Country } from '../../../../models/country';

@Component({
  selector: 'page-country-list',
  templateUrl: 'country-list.html'
})
export class CountryListPage {

  public pageCount = 0;
  public currentPage = 1;
  public pages: number[] = [];

  public countries: Country[];

  constructor(
    public navCtrl: NavController,
    public countryService: CountryService,
    private _modalCtrl: ModalController,
    private _loadingCtrl: LoadingController,
  ) {}

  ionViewDidLoad() {
    this.loadData(this.currentPage);
  }

  loadData(page: number) {
    // Load list of country
    let loader = this._loadingCtrl.create();
    loader.present();
    this.countryService.list(page).subscribe(response => {

      this.pageCount = response.headers.get('X-Pagination-Page-Count');
      this.currentPage = response.headers.get('X-Pagination-Current-Page');

      this.pages = [];

      for(var i = 1; i <= this.pageCount; i++){
         this.pages.push(i);
      }

      //hide if no page = 1 

      if(this.pageCount == 1)
        this.pages = [];

      this.countries = response.json();

      loader.dismiss();
    });
  }

  /**
   * When its selected
   */
  rowSelected(model){
    // Load Detail Page
    this.navCtrl.push(CountryViewPage, {
      'model': model
    });
  }

  pageLinkColor(page: number) {

    if(page == this.currentPage) 
      return 'light';
    
    return '';
  }
}
