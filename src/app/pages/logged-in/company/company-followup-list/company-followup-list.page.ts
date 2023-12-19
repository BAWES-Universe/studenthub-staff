import { Component, OnInit } from '@angular/core';
import { NavController, Platform } from '@ionic/angular';
//models
import { Company } from 'src/app/models/company';
//services
import { CompanyService } from 'src/app/providers/logged-in/company.service';
import { AwsService } from 'src/app/providers/aws.service';
import { EventService } from 'src/app/providers/event.service';
import { AnalyticsService } from 'src/app/providers/analytics.service';


@Component({
  selector: 'app-company-followup-list',
  templateUrl: './company-followup-list.page.html',
  styleUrls: ['./company-followup-list.page.scss'],
})
export class CompanyFollowupListPage implements OnInit {

  public borderLimit = false;
  
  public companies: Company[] = [];

  public loading: boolean = false; 

  public pageCount = 0;
  public currentPage = 1;
  public pages: number[] = [];

  constructor(
    public navCtrl: NavController,
    public platform: Platform,
    public eventService: EventService,
    public companyService: CompanyService,
    public aws: AwsService,
    public analyticService: AnalyticsService
  ) { }

  ngOnInit() {
    this.analyticService.page('Company Followup List Page');

    this.loadCompanyList(1);

    this.eventService.reloadFollowupList$.subscribe(() => {
      this.loadCompanyList(1);
    });
  }

  /**
   * load company list 
   * @param page 
   */
  async loadCompanyList(page: number) {
  
    this.loading = true;

    const urlParams = '&expand=subCompanies,subCompanies.stores,stores';

    this.companyService.listFollowups(page, urlParams).subscribe(response => {

        this.pageCount = parseInt(response.headers.get('X-Pagination-Page-Count'));
        this.currentPage = parseInt(response.headers.get('X-Pagination-Current-Page'));

        this.companies = response.body;
      },
      error => {},
      () => {this.loading = false; }
    );
  }

  /**
   * load more followups on scroll to bottom 
   * @param event 
   */
  doInfinite(event) {

    this.loading = true;
    this.currentPage++;

    const urlParams = '&expand=subCompanies,subCompanies.stores,stores';
    //brands

    this.companyService.listFollowups(this.currentPage, urlParams).subscribe(response => {

        this.pageCount = parseInt(response.headers.get('X-Pagination-Page-Count'));
        this.currentPage = parseInt(response.headers.get('X-Pagination-Current-Page'));

        this.companies = this.companies.concat(response.body);
      },
      error => {},
      () => {
        this.loading = false;
        event.target.complete();
      }
    );
  }

  /**
   * open detail page 
   * @param model 
   */
  rowSelected(model: Company) {
    this.navCtrl.navigateForward('company-view/' + model.company_id, {
      state: {
        model
      }
    });
  }

  /**
   * Make date readable by Safari
   * @param date
   */
  toDate(date) {
    if (!date) 
      return null;
      
    if (date)
      return new Date(date.replace(/-/g, '/'));
  }

  logScrolling(e) {
    this.borderLimit = (e.detail.scrollTop > 20) ? true : false;
  }

  /**
   * reset logo on error
   * @param company 
   */
  loadLogo(company) {
    company.company_logo = null;
  }
}
