import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
//models
import { Country } from 'src/app/models/country';
//services
import { CountryService } from 'src/app/providers/logged-in/country.service';


@Component({
  selector: 'app-country-list',
  templateUrl: './country-list.page.html',
  styleUrls: ['./country-list.page.scss'],
})
export class CountryListPage implements OnInit {

  public pageCount = 0;
  public currentPage = 1;

  public loading = false;
  public countries: Country[];
  public country_id = null;

  constructor(
    public navCtrl: NavController,
    public countryService: CountryService,
    public activatedRoute: ActivatedRoute
  ) {
  }

  ngOnInit() {
    this.country_id = this.activatedRoute.snapshot.paramMap.get('id');

    this.loadData(this.currentPage);
  }

  /**
   *  Load list of country
   * @param page 
   */
  async loadData(page: number) {
  
    this.loading = true;

    this.countryService.list(page).subscribe(response => {

      this.pageCount = parseInt(response.headers.get('X-Pagination-Page-Count'));
      this.currentPage = parseInt(response.headers.get('X-Pagination-Current-Page'));

      this.countries = response.body;

    },
      error => { },
      () => { this.loading = false; }
    );
  }

  /**
   * When its selected
   */
  rowSelected(model) {
    // Load Detail Page
    this.navCtrl.navigateForward('country-view/' + model.country_id, {
      state: {
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
      error => { },
      () => {
        this.loading = false;
        event.target.complete();
      }
    );
  }
}
