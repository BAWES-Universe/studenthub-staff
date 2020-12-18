import { Component, OnInit } from '@angular/core';
//models
import { Request } from 'src/app/models/request';
//services
import { CompanyRequestService } from 'src/app/providers/logged-in/company-request.service';
import {ModalController, NavController} from "@ionic/angular";
import {ActivatedRoute} from "@angular/router";
import {Company} from "../../../../models/company";
import {CompanyService} from "../../../../providers/logged-in/company.service";
import {TransferChartPage} from "../../transfer/transfer-chart/transfer-chart.page";
import {CompanyRequestFormPage} from "../company-request-form/company-request-form.page";


@Component({
  selector: 'app-company-requests',
  templateUrl: './company-requests.page.html',
  styleUrls: ['./company-requests.page.scss'],
})
export class CompanyRequestsPage implements OnInit {

  public loading: boolean = false;
  public company: Company;

  public borderLimit = false;

  public requests: Request[] = [];
  public company_id = null;
  public pageCount = 0;
  public currentPage = 1;
  public pages: number[] = [];

  constructor(
    public requestService: CompanyRequestService,
    public navCtrl: NavController,
    public activatedRoute: ActivatedRoute,
    public companyService: CompanyService,
    public modalCtrl: ModalController
  ) { }

  ngOnInit() {
    this.company_id = this.activatedRoute.snapshot.paramMap.get('company_id');
  }

  ionViewDidEnter() {
    this.loadCompanyDetail();
    this.loadRequests(this.currentPage);
  }

  /**
   * load active request I'm not handling
   */
  loadRequests(page: number) {
    this.loading = true;
    const urlParams = this.urlParams();
    this.requestService.listWithPagination(page, urlParams).subscribe(response => {
      this.pageCount = parseInt(response.headers.get('X-Pagination-Page-Count'));
      this.currentPage = parseInt(response.headers.get('X-Pagination-Current-Page'));

      this.requests = response.body;
      this.loading = false;
    });
  }

  logScrolling(e) {
    this.borderLimit = (e.detail.scrollTop > 20);
  }

  requestDetail(request) {
    this.navCtrl.navigateForward('/request-view/' + request.request_uuid, {
      state : {
        from: 'company-request-dashboard'
      }
    });
  }

  loadCompanyDetail() {
    this.companyService.view(this.company_id).subscribe(response => {
      this.company = response;
    }, () => {
    });
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

  urlParams() {
    let urlParams = '';

    if (this.company_id) {
      urlParams += '&company_id=' + this.company_id;
    }

    return urlParams;
  }

  async addRequest($event) {
      window.history.pushState({ navigationId: window.history.state.navigationId }, null, window.location.pathname);

      const modal = await this.modalCtrl.create({
        component: CompanyRequestFormPage,
        componentProps: {
          company: this.company,
        }
      });
      modal.onDidDismiss().then(e => {
        this.loadRequests(this.currentPage);
        if (!e.data || e.data.from != 'native-back-btn') {
          window['history-back-from'] = 'onDidDismiss';
          window.history.back();
        }
      });
      modal.present();
  }
}
