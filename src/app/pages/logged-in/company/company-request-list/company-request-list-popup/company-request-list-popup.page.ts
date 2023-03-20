import {Component, Input, OnInit} from '@angular/core';
import {
  AlertController, ModalController,
  NavController,
  Platform,
  PopoverController,
  ToastController
} from '@ionic/angular';
import { Router } from '@angular/router';
// models
import { Company } from 'src/app/models/company';
import { Request } from 'src/app/models/request';
// services
import { CompanyService } from 'src/app/providers/logged-in/company.service';
import { AwsService } from 'src/app/providers/aws.service';
import { CompanyRequestService } from 'src/app/providers/logged-in/company-request.service';
import { AnalyticsService } from 'src/app/providers/analytics.service';


@Component({
  selector: 'app-company-request-list-popup',
  templateUrl: './company-request-list-popup.page.html',
  styleUrls: ['./company-request-list-popup.page.scss'],
})
export class CompanyRequestListPopupPage implements OnInit {

  public companies: Company[] = [];

  public loading = false;

  public pageCount = 0;
  public currentPage = 1;
  public pages: number[] = [];
  public requests: Request[] = [];

  @Input() company;

  public filters: {
    companyName: string,
    companyID: string,
    requestStatus: string,
    startDate: string
    endDate: string
  } = {
      companyName: null,
      companyID: null,
      requestStatus: 'started',
      startDate: null,
      endDate: null
    };

  public borderLimit = false;

  constructor(
    public navCtrl: NavController,
    public platform: Platform,
    public companyService: CompanyService,
    public requestService: CompanyRequestService,
    public analyticService: AnalyticsService,
    public aws: AwsService,
    public alertCtrl: AlertController,
    public toastCtrl: ToastController,
    public popupCtrl: PopoverController,
    public modalCtrl: ModalController,
    public router: Router
  ) { }

  ngOnInit() {
    this.analyticService.page('Company Request List Popup Page');
  }

  ionViewWillEnter() {
    if (this.company && this.company.company_id) {
      this.filters.companyID = this.company.company_id;
      this.requests = this.company.requests;
    }

    if (!this.requests || (this.requests && this.requests.length == 0)) {
      this.list(this.currentPage);
    }
  }

  /**
   * list all requests
   * @param page
   */
  async list(page: number) {

    this.loading = true;

    const urlParams = this.urlParams();

    this.requestService.listWithPagination(page, urlParams).subscribe(response => {

      this.pageCount = parseInt(response.headers.get('X-Pagination-Page-Count'));
      this.currentPage = parseInt(response.headers.get('X-Pagination-Current-Page'));

      this.requests = response.body;
    },
      error => { },
      () => { this.loading = false; }
    );
  }

  /**
   * load more on scroll to bottom
   * @param event
   */
  doInfinite(event) {

    this.loading = true;

    this.currentPage++;

    const urlParams = this.urlParams();

    this.requestService.listWithPagination(this.currentPage, urlParams).subscribe(response => {

      this.pageCount = parseInt(response.headers.get('X-Pagination-Page-Count'));
      this.currentPage = parseInt(response.headers.get('X-Pagination-Current-Page'));

      this.requests = this.requests.concat(response.body);
    },
      error => { },
      () => {
        this.loading = false;
        event.target.complete();
      }
    );
  }

  /**
   * Return url string to filter list
   */
  urlParams() {
    let urlParams = '';

    if (this.filters.companyName) {
      urlParams += '&company_name=' + this.filters.companyName;
    }

    if (this.filters.requestStatus) {
      urlParams += '&request_status=' + this.filters.requestStatus;
    }

    if (this.filters.startDate) {
      urlParams += '&start_date=' + this.filters.startDate;
    }
    
    if (this.filters.endDate) {
      urlParams += '&end_date=' + this.filters.endDate;
    }

    if (this.filters.companyID) {
      urlParams += '&company_id=' + this.filters.companyID;
    }

    return urlParams;
  }

  /**
   * Make date readable by Safari
   * @param date
   */
  toDate(date) {
    if (!date) 
      return null;
      
    if (date) {
      return new Date(date.replace(/-/g, '/'));
    }
  }

  resetFilter() {
    this.filters = {
      companyName: null,
      companyID: null,
      requestStatus: 'started',
      startDate: null,
      endDate: null
    };
  }

  logScrolling(e) {
    this.borderLimit = (e.detail.scrollTop > 20);
  }

  /**
   * When its selected
   */
  rowSelected(model) {
    this.dismiss(model);
  }

  /**
   * close popup on selection
   * @param data
   */
  dismiss(data = null) {

    this.popupCtrl.getTop().then(overlay => {
      if(overlay) {
        this.popupCtrl.dismiss(data);
      } else {
        this.modalCtrl.dismiss(data);
      }
    });
  }
}
