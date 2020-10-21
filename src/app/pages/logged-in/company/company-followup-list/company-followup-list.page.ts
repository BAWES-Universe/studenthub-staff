import { Component, OnInit } from '@angular/core';
import { NavController, Platform } from '@ionic/angular';
//models
import { Company } from 'src/app/models/company';
//services
import { CompanyService } from 'src/app/providers/logged-in/company.service';
import { AwsService } from 'src/app/providers/aws.service';


@Component({
  selector: 'app-company-followup-list',
  templateUrl: './company-followup-list.page.html',
  styleUrls: ['./company-followup-list.page.scss'],
})
export class CompanyFollowupListPage implements OnInit {

  public companies: Company[] = [];

  public loading: boolean = false; 

  public pageCount = 0;
  public currentPage = 1;
  public pages: number[] = [];

  constructor(
    public navCtrl: NavController,
    public platform: Platform,
    public companyService: CompanyService,
    public aws: AwsService
  ) { }

  ngOnInit() {
    this.loadCompanyList(1);
  }

  async loadCompanyList(page: number) {
    // Load list of companies
    this.loading = true;

    this.companyService.listFollowups(page).subscribe(response => {

        this.pageCount = response.headers.get('X-Pagination-Page-Count');
        this.currentPage = response.headers.get('X-Pagination-Current-Page');

        this.companies = response.body;
      },
      error => {},
      () => {this.loading = false; }
    );
  }

  doInfinite(event) {

    this.loading = true;
    this.currentPage++;

    this.companyService.listFollowups(this.currentPage).subscribe(response => {

        this.pageCount = response.headers.get('X-Pagination-Page-Count');
        this.currentPage = response.headers.get('X-Pagination-Current-Page');

        this.companies = this.companies.concat(response.body);
      },
      error => {},
      () => {
        this.loading = false;
        event.target.complete();
      }
    );
  }

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
    if (date)
      return new Date(date.replace(/-/g, '/'));
  }

  loadLogo(company) {
    company.company_logo = null;
  }
}
