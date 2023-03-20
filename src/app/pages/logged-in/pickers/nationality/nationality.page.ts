import { Component, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { AlertController, IonSearchbar, ModalController } from '@ionic/angular';
//services
import { TranslateLabelService } from 'src/app/providers/translate-label.service';
import { CountryService } from 'src/app/providers/logged-in/country.service';
//models
import { Fulltimer } from 'src/app/models/fulltimer';
import { Country } from 'src/app/models/country';
import { AnalyticsService } from 'src/app/providers/analytics.service';


@Component({
  selector: 'app-nationality',
  templateUrl: './nationality.page.html',
  styleUrls: ['./nationality.page.scss'],
})
export class NationalityPage implements OnInit {

  @ViewChild('inputToFocus', { static: false }) inputToFocus: IonSearchbar;

  public fulltimer: Fulltimer;

  public currentPage = 1;

  public totalPage = 0;

  public query: string = '';

  public countries: Country[];

  public countryList: Country[];

  public loading: boolean = false;
  public saving = false;

  public updatingNationality = false;

  public doInfiniteSubscription: Subscription;
  public updateSubscription: Subscription;
  public countrySubscription: Subscription;

  constructor(
    public modalCtrl: ModalController,
    public alertCtrl: AlertController,
    public countryService: CountryService,
    public translateService: TranslateLabelService,
    public analyticService: AnalyticsService
  ) { }

  ngOnInit() {
    this.analyticService.page('Nationality Page');

    this.loadData(this.currentPage);
  }

  ionViewDidEnter() {

    setTimeout(() => {
      if(this.inputToFocus)
        this.inputToFocus.setFocus();
    }, 500);
  }

  onSearchInput(ev: any) {

    this.query = ev.target.value;

    if (this.countryList) {
      this.countries = this.countryList.filter(item => {
        return (
          item.country_name_en.toLowerCase().indexOf(ev.target.value.toLowerCase()) > -1 ||
          item.country_name_ar.toLowerCase().indexOf(ev.target.value.toLowerCase()) > -1
        );
      });
    }
  }

  /**
   * load countries
   * @param page
   */
  loadData(page: number) {

    // Load list of country

    this.loading = true;

    this.countrySubscription = this.countryService.listAll().subscribe(response => {
      this.countries = response;
      this.countryList = response;
    },
      error => { },
      () => {
        this.loading = false;
      });
  }

  /**
   * Infinite scroll functionality
   * @param event
   */
  doInfinite(event) {

    if (this.currentPage == this.totalPage) {
      if (event && event.target) {
        return event.target.complete();
      }
    }

    this.currentPage++;

    this.loading = true;

    this.doInfiniteSubscription = this.countryService.list(this.currentPage).subscribe(response => {
      for (const country of response.body) {
        this.countries.push(country);
      }
      if (event && event.target) {
        event.target.complete();
      }

      this.loading = false;
    }, () => {
      this.loading = false;
    });
  }

  /**
   * close modal
   * @param data
   */
  dismiss(data = {}) {
    this.modalCtrl.getTop().then(overlay => {
      if (overlay)
        this.modalCtrl.dismiss(data);
    });
  }

  /**
   * on country selection
   * @param country
   */
  async rowSelected(country: Country) {
    this.dismiss({
      country: country
    });
  }
}
