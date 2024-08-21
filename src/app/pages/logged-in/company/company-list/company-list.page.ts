import { Component, OnInit } from '@angular/core';
import { ModalController, NavController, Platform } from '@ionic/angular';
import { Router } from "@angular/router";
// model
import { Company } from 'src/app/models/company';
// service
import { CompanyService } from 'src/app/providers/logged-in/company.service';
import { AwsService } from '../../../../providers/aws.service';
import { EventService } from 'src/app/providers/event.service';
import { AnalyticsService } from 'src/app/providers/analytics.service';
//pages
import { CompanyFormPage } from 'src/app/pages/logged-in/company/company-form/company-form.page';
import { CompanyFilterPage } from "./company-filter/company-filter.page";
import { AuthService } from 'src/app/providers/auth.service';


@Component({
  selector: 'app-company-list',
  templateUrl: './company-list.page.html',
  styleUrls: ['./company-list.page.scss'],
})
export class CompanyListPage implements OnInit {

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
    approved_to_hire: number,
    have_students: number,
    withStats: boolean,
    staff_id: number;
  } = {
      name: null,
      status: 100,
      approved_to_hire: null,
      have_students: null,
      withStats: false,
      staff_id: null
    };

  constructor(
    public navCtrl: NavController,
    public companyService: CompanyService,
    public platform: Platform,
    public aws: AwsService,
    public authService: AuthService,
    public eventService: EventService,
    public analyticService: AnalyticsService,
    public _modalCtrl: ModalController,
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

    if(state) {
      if (state.filter) {
        this.filters.status = state.value;
      }

      if(state.filters) {
        this.filters = state.filters;
      }
    }
    
    // if (state.companies) {
    //   this.companies = state.companies;
    //   this.loadCompaniesSegmentData();
    // }

    if(this.companies.length == 0)
      this.loadData(1);
  }

  handleRefresh(event) {
    this.loadData(1, event);

  }

  /**
   * Return url string to filter list
   */
  urlParams() {
    let urlParams = '';

    if(this.filters.staff_id) {
      urlParams += '&staff_id=' + this.filters.staff_id;
    }

    if (this.filters.name) {
      urlParams += '&name=' + this.filters.name;
    }

    if (this.filters.status) {
      urlParams += '&status=' + this.filters.status;
    }

    if ([0, 1].indexOf(this.filters.have_students) > -1) {
      urlParams += '&have_students=' + this.filters.have_students;
    }

    if ([0, 1].indexOf(this.filters.approved_to_hire) > -1) {
      urlParams += '&approved_to_hire=' + this.filters.approved_to_hire;
    }

    if (this.filters.withStats) {
      urlParams += '&expand=subCompanies,stores,transferInLast40Days,subCompanies.stores,brands';
    }

    return urlParams;
  }

  resetStatus() {
    this.filters = {
      name: this.filters.name,
      status: 100,
      approved_to_hire: null,
      have_students: null,
      withStats: this.filters.withStats,
      staff_id: this.filters.staff_id
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
      status: 100,
      have_students: null,
      withStats: false,
      staff_id: null
    };

    this.loadData(1); // reload all result
  }

  /**
   * load with filters
   * @param page 
   */
  async loadData(page: number, event = null) {

    // Load list of companies
    this.loading = true;

    const searchParams = this.urlParams();

    this.companyService.list(page, searchParams).subscribe(response => {

      this.pageCount = parseInt(response.headers.get('X-Pagination-Page-Count'));
      this.currentPage = parseInt(response.headers.get('X-Pagination-Current-Page'));
      this.totalCount = parseInt(response.headers.get('X-Pagination-Total-Count'));
      this.companies = response.body;

      if(event) {
        event.target.complete();
      }
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

  /**
   * load more on scroll to bottom
   * @param event 
   */
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
    // return this.router.navigate(['company-form']);
    window.history.pushState({ navigationId: window.history.state?.navigationId }, null, window.location.pathname);

    const modal = await this._modalCtrl.create({
      component: CompanyFormPage,
      componentProps: {
        model: new Company(),
        subcompany: 0
      },
      cssClass: "popup-modal"
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


  /**
   * Loads the create page
   */
  async filter() {
    window.history.pushState({ navigationId: window.history.state?.navigationId }, null, window.location.pathname);

    const modal = await this._modalCtrl.create({
      component: CompanyFilterPage,
      componentProps: {
        filters: Object.assign({}, this.filters),
      },
      cssClass: "popup-modal"
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
    this.borderLimit = (e.detail.scrollTop > 166);
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


  filterWithStats($event) {
    this.filters.withStats = !this.filters.withStats;
    
    this.loadData(1); // reload all result
  }

  filterByStaff($event, staff_id) {

    if (this.filters.staff_id == staff_id) {
      this.filters.staff_id = null;
    } else {
      this.filters.staff_id = staff_id;
    }

    this.loadData(1); // reload all result
  }

  filterByStatus($event, status) {

    if (this.filters.status == status) {
      this.filters.status = null;
    } else {
      this.filters.status = status;
    }

    this.loadData(1); // reload all result
  }


  filterByHaveStudents($event, status) {

    if (this.filters.have_students == status) {
      this.filters.have_students = null;
    } else {
      this.filters.have_students = status;
    }

    this.loadData(1); // reload all result
  }

  filterByApprovedToHire($event, status) {

    if (this.filters.approved_to_hire == status) {
      this.filters.approved_to_hire = null;
    } else {
      this.filters.approved_to_hire = status;
    }

    this.loadData(1); // reload all result
  }

  searchByName(event) {
    this.filters.name = event.detail.value;
    this.loadData(1); // reload all result
  }
}

