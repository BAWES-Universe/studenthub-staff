import { Component, OnInit } from '@angular/core';
import {Country} from 'src/app/models/country';
import {LoadingController, NavController} from '@ionic/angular';
import {CountryService} from 'src/app/providers/logged-in/country.service';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-country-list',
  templateUrl: './country-list.page.html',
  styleUrls: ['./country-list.page.scss'],
})
export class CountryListPage implements OnInit {

  public pageCount = 0;
  public currentPage = 1;
  public pages: number[] = [];
  public loading = false;
  public countries: Country[];
  public country_id = null;
  constructor(
    public navCtrl: NavController,
    public countryService: CountryService,
    public activatedRoute: ActivatedRoute
  ) {
    this.country_id = this.activatedRoute.snapshot.paramMap.get('id');
  }

  ngOnInit() {
    this.loadData(this.currentPage);
  }

  async loadData(page: number) {
    // Load list of country
    this.loading = true;

    this.countryService.list(page).subscribe(response => {

        this.pageCount = parseInt(response.headers.get('X-Pagination-Page-Count'));
        this.currentPage = parseInt(response.headers.get('X-Pagination-Current-Page'));

        this.pages = [];

        for (let i = 1; i <= this.pageCount; i++){
          this.pages.push(i);
        }

        // hide if no page = 1

        if (this.pageCount == 1) {
          this.pages = [];
        }

        this.countries = response.body;

      },
      error => {},
      () => {this.loading = false; }
    );
  }

  /**
   * When its selected
   */
  rowSelected(model){
    // Load Detail Page
    this.navCtrl.navigateForward('country-view/' + model.country_id, {
      state : {
        model
      }
    });
  }

  doInfinite(event) {
    this.loading = true;
    this.currentPage++;
    this.countryService.list(this.currentPage).subscribe(response => {

        this.pageCount = parseInt(response.headers.get('X-Pagination-Page-Count'));
        // this.currentPage = parseInt(response.headers.get('X-Pagination-Current-Page'));

        this.countries = this.countries.concat(response.body);
      },
      error => {},
      () => {
        this.loading = false;
        event.target.complete();
      }
    );
  }
}
