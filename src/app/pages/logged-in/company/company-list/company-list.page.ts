import { Component, OnInit } from '@angular/core';
import {NavController, Platform} from '@ionic/angular';
import {ActivatedRoute} from '@angular/router';
// model
import {Company} from 'src/app/models/company';
// service
import {CompanyService} from 'src/app/providers/logged-in/company.service';

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
  public company_id = null;
  public companies: Company[];

  constructor(
    public activatedRoute: ActivatedRoute,
    public navCtrl: NavController,
    public companyService: CompanyService,
    public platform: Platform,
  ) {
      this.company_id = this.activatedRoute.snapshot.paramMap.get('id');
  }

  ngOnInit() {}
  ionViewWillEnter() {
    const state = window.history.state;
    if (state.companies) {
      this.companies = state.companies;
    }

    if (!this.companies && this.company_id) {
      this.viewDetail();
    }
    if (!this.companies && !this.company_id) {
      this.loadCompanyList(this.currentPage);
    }
  }

  pageLinkColor(page: number) {

    if (page == this.currentPage) {
      return 'light';
    }

    return '';
  }

  async loadCompanyList(page: number){
    // Load list of companies
    this.loading = true;

    this.companyService.list(page).subscribe(response => {

        this.pageCount = response.headers.get('X-Pagination-Page-Count');
        this.currentPage = response.headers.get('X-Pagination-Current-Page');

        this.pages = [];

        for (let i = 1; i <= this.pageCount; i++){
          this.pages.push(i);
        }

        // hide if no page = 1

        if (this.pageCount == 1) {
          this.pages = [];
        }

        this.companies = response.body;

      },
      error => {},
      () => {this.loading = false; }
    );
  }

  /**
   * When its selected
   */
  rowSelected(model: Company){
    // Check if has subCompanies
    if (model.subCompanies && model.subCompanies.length > 0){
      // Load Subcompany List
      this.navCtrl.navigateForward('company-list/' + model.company_id, {
        state : {
          companies: model.subCompanies
        }
      });
    }else{
      // Load store list for this company
      this.navCtrl.navigateForward('store-list/' + model.company_id);
    }
  }

  /**
   * view detail
   */
  viewDetail() {
    this.loading = true;
    this.companyService.view(this.company_id).subscribe( response => {
      this.loading = false;
      this.companies = response.subCompanies;
    });
  }
}
