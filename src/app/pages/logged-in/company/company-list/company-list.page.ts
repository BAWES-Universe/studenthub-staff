import { Component, OnInit } from '@angular/core';
import { ModalController, NavController, Platform } from '@ionic/angular';
// model
import { Company } from 'src/app/models/company';
// service
import { CompanyService } from 'src/app/providers/logged-in/company.service';
import { AwsService } from '../../../../providers/aws.service';
import { EventService } from 'src/app/providers/event.service';
//pages
import { CompanyFormPage } from 'src/app/pages/logged-in/company/company-form/company-form.page';


@Component({
  selector: 'app-company-list',
  templateUrl: './company-list.page.html',
  styleUrls: ['./company-list.page.scss'],
})
export class CompanyListPage implements OnInit {

  public borderLimit = false;

  public pageCount = 0;
  public currentPage = 1;
  public loading = false;
  public loadingMore = false;
  public active = 1;
  public inActive = 0;
  public companies: Company[] = [];
  public segment = 1;

  public filters: {
    name: string
    status: number
  } = {
      name: null,
      status: 4
    };

  constructor(
    public navCtrl: NavController,
    public companyService: CompanyService,
    public platform: Platform,
    public aws: AwsService,
    public eventService: EventService,
    public _modalCtrl: ModalController
  ) {
  }

  ngOnInit() {
    this.eventService.reloadCandidateHistory$.subscribe(response => {
      this.loadData(1);
    });

    this.eventService.reloadCompanyList$.subscribe(response => {
      this.loadData(1);
    });
  }

  ionViewWillEnter() {
    console.log('ionViewWillEnter');
    const state = window.history.state;

    if (state.filter) {
      this.filters.status = state.value;
    }
    // if (state.companies) {
    //   this.companies = state.companies;
    //   this.loadCompaniesSegmentData();
    // }

    this.loadData(1);
  }

  /**
   * Return url string to filter list
   */
  urlParams() {
    let urlParams = '';
    if (this.filters.name) {
      urlParams += '&name=' + this.filters.name;
    }

    if (this.filters.status) {
      urlParams += '&status=' + this.filters.status;
    }

    return urlParams;
  }

  /**
   * Reset question filter
   */
  resetFilter() {
    this.filters = {
      name: null,
      status: 4
    };

    this.loadData(1); // reload all result
  }

  async loadData(page: number) {

    // Load list of companies
    this.loading = true;

    const searchParams = this.urlParams();

    this.companyService.list(page, searchParams).subscribe(response => {

      this.pageCount = parseInt(response.headers.get('X-Pagination-Page-Count'));
      this.currentPage = parseInt(response.headers.get('X-Pagination-Current-Page'));
      this.companies = response.body;
    },
      error => { },
      () => { this.loading = false; }
    );
  }

  /**
   * When its selected
   */
  rowSelected(model: Company) {
    this.navCtrl.navigateForward('company-view/' + model.company_id, {
      state: {
        model
      }
    });
  }

  segmentChanged($event) {
    this.segment = $event.detail.value;
  }

  loadLogo($event, company) {
    company.company_logo = null;
  }

  doInfinite(event) {

    this.loadingMore = true;
    this.currentPage++;

    const urlParams = this.urlParams();

    this.companyService.list(this.currentPage, urlParams).subscribe(response => {

      this.pageCount = parseInt(response.headers.get('X-Pagination-Page-Count'));
      this.currentPage = parseInt(response.headers.get('X-Pagination-Current-Page'));
      this.companies = this.companies.concat(response.body);
    },
      error => { },
      () => {
        this.loadingMore = false;
        event.target.complete();
      }
    );
  }

  /**
   * Loads the create page
   */
  async create() {
    window.history.pushState({ navigationId: window.history.state.navigationId }, null, window.location.pathname);

    const modal = await this._modalCtrl.create({
      component: CompanyFormPage,
      componentProps: {
        model: new Company(),
        subcompany: 0
      }
    });
    // Refresh List if required
    modal.onDidDismiss().then(e => {

      if (!e.data || e.data.from != 'native-back-btn') {
        window['history-back-from'] = 'onDidDismiss';
        window.history.back();
      }

      if (e && e.data && e.data.refresh) {
        this.loadData(1);
      }
    });
    modal.present();
  }

  logScrolling(e) {
    this.borderLimit = (e.detail.scrollTop > 20);
  }

  /**
   *  "40 days passed without payment" functionality currently ("Active" + Has assigned staff + hasn't made any payment in 40 days)
   *  has issue for newly added company and just now assigned staff. We need to add rule to check if all above rules pass,
   *  we query for the oldest candidate assignment datetime assigned to that company,
   *  if its less than 40 days then no need to mark as  "40 days passed without payment"
   */

  candidateWorkHistoryByLast40Days(company) {
    if (company.company_status && !company.transferInLast40Days) {
      if (company.stores.length > 0) {
        return (company.stores.find(store => store.candidateWorkHistoryByLast40Days === true));
      }
      if (company.subCompanies.length > 0) {
        company.subCompanies.map(subCompany => {
          if (subCompany.stores.length > 0) {
            return (subCompany.stores.find(store => store.candidateWorkHistoryByLast40Days === true));
          }
        });
      }
    }
    return false;
  }

  filterByStatus($event, status) {
    this.filters.status = status;
    this.loadData(1); // reload all result
  }
  searchByName($event) {
    this.filters.name = $event.detail.value;
    this.loadData(1); // reload all result
  }
}

