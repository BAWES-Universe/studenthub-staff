import { Component, OnInit } from '@angular/core';
import { ModalController, NavController, Platform } from '@ionic/angular';
// model
import { Company } from 'src/app/models/company';
// service
import { CompanyService } from 'src/app/providers/logged-in/company.service';
import { AwsService } from '../../../../providers/aws.service';
import { EventService } from 'src/app/providers/event.service';
//pages
import {Router} from "@angular/router";
import {CompanyFilterPage} from "src/app/pages/logged-in/company/company-list/company-filter/company-filter.page";
import { AnalyticsService } from 'src/app/providers/analytics.service';


@Component({
  selector: 'app-assigned-company-list',
  templateUrl: './assigned-company-list.page.html',
  styleUrls: ['./assigned-company-list.page.scss'],
})
export class AssignedCompanyListPage implements OnInit {

  public borderLimit = false;

  public pageCount = 0;
  public currentPage = 1;
  public totalCount = null;
  public loading = false;
  public loadingMore = false;
  public active = 1;
  public inActive = 0;
  public companies: Company[] = [];
  public segment = 1;

  public filters: {
    name: string
    status: number,
    approved_to_hire: number
  } = {
      name: null,
      status: 100,
      approved_to_hire: null
    };

  constructor(
    public navCtrl: NavController,
    public companyService: CompanyService,
    public platform: Platform,
    public aws: AwsService,
    public eventService: EventService,
    public _modalCtrl: ModalController,
    public analyticService: AnalyticsService,
    public router: Router
  ) {
  }

  ngOnInit() {
    this.analyticService.page('Company List Page');

    this.eventService.reloadCandidateHistory$.subscribe(response => {
      this.loadData(1);
    });

    this.eventService.reloadCompanyList$.subscribe(response => {
      this.loadData(1);
    });
  }

  ionViewWillEnter() {

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

    if ([0, 1].indexOf(this.filters.approved_to_hire) > -1) {
      urlParams += '&approved_to_hire=' + this.filters.approved_to_hire;
    }

    return urlParams;
  }

  resetStatus() {
    this.filters = {
      name: this.filters.name,
      status: 100,
      approved_to_hire: null
    };

    this.loadData(1); // reload all result
  }

  /**
   * Reset question filter
   */
  resetFilter() {
    this.filters = {
      approved_to_hire: null,
      name: null,
      status: 100
    };

    this.loadData(1); // reload all result
  }

  async loadData(page: number) {

    // Load list of companies
    this.loading = true;

    const searchParams = this.urlParams();

    this.companyService.assignedList(page, searchParams).subscribe(response => {

      this.pageCount = parseInt(response.headers.get('X-Pagination-Page-Count'));
      this.currentPage = parseInt(response.headers.get('X-Pagination-Current-Page'));
      this.totalCount = parseInt(response.headers.get('X-Pagination-Total-Count'));
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

    this.companyService.assignedList(this.currentPage, urlParams).subscribe(response => {

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
  async filter() {
    window.history.pushState({ navigationId: window.history.state.navigationId }, null, window.location.pathname);

    const modal = await this._modalCtrl.create({
      component: CompanyFilterPage,
      componentProps: {
        filters: this.filters,
      }
    });
    // Refresh List if required
    modal.onDidDismiss().then(e => {

      if (!e.data || e.data.from != 'native-back-btn') {
        window['history-back-from'] = 'onDidDismiss';
        window.history.back();
      }

      if (e && e.data && e.data.refresh) {
        this.filters = e.data.filter;
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

    if(this.filters.status == status) {
      this.filters.status = null;
    } else {
      this.filters.status = status;
    }

    this.loadData(1); // reload all result
  }

  filterByApprovedToHire($event, status) {

    if(this.filters.approved_to_hire == status) {
      this.filters.approved_to_hire = null;
    } else {
      this.filters.approved_to_hire = status;
    }

    this.loadData(1); // reload all result
  }

  searchByName($event) {
    this.filters.name = $event.detail.value;
    this.loadData(1); // reload all result
  }
}

