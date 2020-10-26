import { Component, OnInit } from '@angular/core';
import { NavController, Platform } from '@ionic/angular';
// model
import { Company } from 'src/app/models/company';
// service
import { CompanyService } from 'src/app/providers/logged-in/company.service';
import { AwsService } from '../../../../providers/aws.service';
import { EventService } from 'src/app/providers/event.service';

@Component({
  selector: 'app-company-list',
  templateUrl: './company-list.page.html',
  styleUrls: ['./company-list.page.scss'],
})
export class CompanyListPage implements OnInit {

  public activePageCount = 0;
  public activeCurrentPage = 1;
  public inActivePageCount = 0;
  public inActiveCurrentPage = 1;
  public loading = false;
  public loadingMore = false;
  public active = 1;
  public inActive = 2;
  public companies: Company[];
  public segment = 1;
  public activeCompanies: Company[] = [];
  public inActiveCompanies: Company[] = [];

  public filters: {
    name: string,
    common_name_en: string,
    common_name_ar: string
  } = {
    name: null,
    common_name_en: null,
    common_name_ar: null
  };

  constructor(
    public navCtrl: NavController,
    public companyService: CompanyService,
    public platform: Platform,
    public aws: AwsService,
    public eventService: EventService
  ) {
  }

  ngOnInit() {
    this.eventService.reloadCandidateHistory$.subscribe(response => {
      this.loadData(1);
    });
  }

  ionViewWillEnter() {
    // const state = window.history.state;

    // if (state.companies) {
    //   this.companies = state.companies;
    //   this.loadCompaniesSegmentData();
    // }

    if (!this.companies) {
      this.loadData(1);
    }
  }

  /**
   * Return url string to filter list
   */
  urlParams() {
    let urlParams = '&status=' + this.segment;

    if (this.filters.name) {
      urlParams += '&name=' + this.filters.name;
    }

    if (this.filters.common_name_en) {
      urlParams += '&common_name_en=' + this.filters.common_name_en;
    }

    if (this.filters.common_name_ar) {
      urlParams += '&common_name_ar=' + this.filters.common_name_ar;
    }

    return urlParams;
  }

  /**
   * Reset question filter
   */
  resetFilter() {
    this.filters = {
      name: null,
      common_name_en: null,
      common_name_ar: null
    };
    
    this.loadData(1); // reload all result
  }

  async loadData(page: number) {

    // Load list of companies
    this.loading = true;

    let searchParams = this.urlParams();

    this.companyService.list(page, searchParams).subscribe(response => {
      if (this.segment == this.active) {

        this.activePageCount = parseInt(response.headers.get('X-Pagination-Page-Count'));
        this.activeCurrentPage = parseInt(response.headers.get('X-Pagination-Current-Page'));
        this.activeCompanies = response.body;

      } else {
        this.inActivePageCount = parseInt(response.headers.get('X-Pagination-Page-Count'));
        this.inActiveCurrentPage = parseInt(response.headers.get('X-Pagination-Current-Page'));
        this.inActiveCompanies = response.body;
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

  doInfinite(event, status) {

    this.loadingMore = true;

    if (status == this.active) {
      this.activeCurrentPage++;
    } else {
      this.inActiveCurrentPage++;
    }

    const urlParams = this.urlParams();

    this.companyService.list((status == this.active) ? this.activeCurrentPage : this.inActiveCurrentPage, urlParams).subscribe(response => {

      if (status == this.active) {

        this.activePageCount = parseInt(response.headers.get('X-Pagination-Page-Count'));
        this.activeCurrentPage = parseInt(response.headers.get('X-Pagination-Current-Page'));
        this.activeCompanies = this.activeCompanies.concat(response.body);

      } else if (status == this.inActive) {

        this.inActiveCompanies = this.inActiveCompanies.concat(response.body);
        this.inActivePageCount = parseInt(response.headers.get('X-Pagination-Page-Count'));
        this.inActiveCurrentPage = parseInt(response.headers.get('X-Pagination-Current-Page'));
      }
    },
      error => { },
      () => {
        this.loadingMore = false;
        event.target.complete();
      }
    );
  }
}

