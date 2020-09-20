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
      this.loadCompanyList(this.activeCurrentPage, this.active);
      this.loadCompanyList(this.inActiveCurrentPage, this.inActive);
    });
  }

  ionViewWillEnter() {
    // const state = window.history.state;

    // if (state.companies) {
    //   this.companies = state.companies;
    //   this.loadCompaniesSegmentData();
    // }

    if (!this.companies) {
      this.loadCompanyList(this.activeCurrentPage, this.active);
      this.loadCompanyList(this.inActiveCurrentPage, this.inActive);
    }
  }

  async loadCompanyList(page: number, status) {
    // Load list of companies
    this.loading = true;

    this.companyService.list(page, status).subscribe(response => {
      if (status == this.active) {

        this.activePageCount = response.headers.get('X-Pagination-Page-Count');
        this.activeCurrentPage = response.headers.get('X-Pagination-Current-Page');
        this.activeCompanies = response.body;

      } else if (status == this.inActive) {

        this.activePageCount = response.headers.get('X-Pagination-Page-Count');
        this.activeCurrentPage = response.headers.get('X-Pagination-Current-Page');
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

    this.companyService.list((status == this.active) ? this.activeCurrentPage : this.inActiveCurrentPage, status).subscribe(response => {

      if (status == this.active) {

        this.activePageCount = response.headers.get('X-Pagination-Page-Count');
        this.activeCurrentPage = response.headers.get('X-Pagination-Current-Page');
        this.activeCompanies = this.activeCompanies.concat(response.body);

      } else if (status == this.inActive) {

        this.inActiveCompanies = this.inActiveCompanies.concat(response.body);
        this.inActivePageCount = response.headers.get('X-Pagination-Page-Count');
        this.inActiveCurrentPage = response.headers.get('X-Pagination-Current-Page');

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

