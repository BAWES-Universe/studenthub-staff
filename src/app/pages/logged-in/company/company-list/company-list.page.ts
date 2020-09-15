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

  public pageCount = 0;
  public currentPage = 1;
  public pages: number[] = [];
  public loading = false;
  public loadingMore = false;

  public companies: Company[];
  public segment = 1;
  public enableCompanies: Company[] = [];
  public disableCompanies: Company[] = [];

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
      this.loadCompanyList(this.currentPage);
    });
  }

  ionViewWillEnter() {
    const state = window.history.state;

    if (state.companies) {
      this.companies = state.companies;
      this.loadCompaniesSegmentData();
    }

    if (!this.companies) {
      this.loadCompanyList(this.currentPage);
    }
  }

  async loadCompanyList(page: number) {
    // Load list of companies
    this.loading = true;

    this.companyService.list(page).subscribe(response => {

      this.pageCount = response.headers.get('X-Pagination-Page-Count');
      this.currentPage = response.headers.get('X-Pagination-Current-Page');

      this.companies = response.body;
      this.loadCompaniesSegmentData();
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

  /**
   * segment data
   */
  loadCompaniesSegmentData() {
    this.enableCompanies = [];
    this.disableCompanies = [];
    for (const company of this.companies) {
      if (company.company_status == 10) {
        this.enableCompanies.push(company);
      } else {
        this.disableCompanies.push(company);
      }
    }
  }

  loadLogo($event, company) {
    company.company_logo = null;
  }

  doInfinite(event) {

    this.loadingMore = true;
    this.currentPage++;

    this.companyService.list(this.currentPage).subscribe(response => {

      this.pageCount = response.headers.get('X-Pagination-Page-Count');
      this.currentPage = response.headers.get('X-Pagination-Current-Page');

      this.companies = this.companies.concat(response.body);
      this.loadCompaniesSegmentData();
    },
      error => { },
      () => {
        this.loadingMore = false;
        event.target.complete();
      }
    );
  }
}

