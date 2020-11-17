import { Component, OnInit } from '@angular/core';
import {ModalController, NavController, Platform} from '@ionic/angular';
// model
import { Company } from 'src/app/models/company';
// service
import { CompanyService } from 'src/app/providers/logged-in/company.service';
import { AwsService } from 'src/app/providers/aws.service';

@Component({
  selector: 'app-all-company-list',
  templateUrl: './all-company-list.page.html',
  styleUrls: ['./all-company-list.page.scss'],
})
export class AllCompanyListPage implements OnInit {

  public pageCount = 0;
  public currentPage = 1;
  public loading = false;
  public loadingMore = false;
  public companies: Company[] = [];
  public selectedCompany = null;

  public filters: {
    name: string,
    common_name_en: string,
    common_name_ar: string
  } = {
    name: null,
    common_name_en: null,
    common_name_ar: null
  };

  public borderLimit = false;

  constructor(
    public navCtrl: NavController,
    public companyService: CompanyService,
    public platform: Platform,
    public aws: AwsService,
    public modalCtrl: ModalController,
  ) {
  }

  ngOnInit() {
      this.loadData(1);
  }

  /**
   * Return url string to filter list
   */
  urlParams() {
    let urlParams = '&status=1';

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

    this.companyService.listWithContact(page, searchParams).subscribe(response => {
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
  showSub(model: Company) {
    if (model.company_id && this.selectedCompany == model.company_id) {
      this.selectedCompany = null;
    } else  {
      this.selectedCompany = model.company_id;
    }
  }
  
  /**
   * When its selected
   */
  rowSelected(model: Company) {
    this.dismiss(model);
  }

  /**
   * hide logo on image load error
   * @param $event 
   * @param company 
   */
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

    this.companyService.listWithContact(this.currentPage, urlParams).subscribe(response => {

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
   * close page
   * @param data 
   */
  dismiss(data = null) {
    this.modalCtrl.dismiss(data);
  }
  
  logScrolling(e) {
    this.borderLimit = (e.detail.scrollTop > 20) ? true : false;
  }
}

