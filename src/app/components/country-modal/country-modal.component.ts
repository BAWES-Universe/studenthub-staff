import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
//services
import { CountryService } from 'src/app/providers/country.service';
import { TranslateLabelService } from 'src/app/providers/translate-label.service';


@Component({
  selector: 'app-country-modal',
  templateUrl: './country-modal.component.html',
  styleUrls: ['./country-modal.component.scss'],
})
export class CountryModalComponent implements OnInit {

  public countries;
  public perPageCount = 20;
  public currentPage = 0;
  public totalPages = 0;
  public totalCount = 0;
  public search = null;
  public loading = false;
  public loadingMore = false;

  public borderLimit = false;

  constructor(
    public translateService: TranslateLabelService,
    public countryService: CountryService,
    public modalCtrl: ModalController,
  ) { }

  ngOnInit() {
    this.loadCountry(1);
  }

  selected(country) {
    this.modalCtrl.dismiss(country);
  }

  dismiss() {
    this.modalCtrl.dismiss();
  }
  
  loadCountry(page) {
    this.loading = true;

    this.countryService.list(page, this.search).subscribe(res => {

      this.perPageCount = parseInt(res.headers.get('X-Pagination-Per-Page'), 10);
      this.currentPage = parseInt(res.headers.get('X-Pagination-Current-Page'), 10);
      this.totalPages = parseInt(res.headers.get('X-Pagination-Page-Count'), 10);
      this.countries = res.body;
    },
      err => {
        this.loading = false;
      },
      () => this.loading = false,
    );
  }

  loadMoreCountries(event) {

    if(this.currentPage >= this.totalPages) {
      if(event && event.target)
        event.target.complete();
      return null;
    }
    
    this.loadingMore = true;

    this.currentPage += 1;

    this.countryService.list(this.currentPage).subscribe(res => {
      this.perPageCount = parseInt(res.headers.get('X-Pagination-Per-Page'), 10);
      this.currentPage = parseInt(res.headers.get('X-Pagination-Current-Page'), 10);
      this.totalPages = parseInt(res.headers.get('X-Pagination-Page-Count'), 10);
      this.countries.push(...res.body);

      if(event && event.target)
        event.target.complete();
    },
      err => this.loadingMore = false,
      () => this.loadingMore = false
    );
  }
}
