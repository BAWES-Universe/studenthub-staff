import { Component, OnInit } from '@angular/core';
import { ModalController, NavController } from "@ionic/angular";
import { Router } from '@angular/router';
//models
import { Request } from 'src/app/models/request';
//services
import { CompanyService } from "../../../../providers/logged-in/company.service";
import { EventService } from 'src/app/providers/event.service';
import { CompanyRequestService } from 'src/app/providers/logged-in/company-request.service';
//models
import { Company } from "../../../../models/company";
//pages
import { CompanyRequestFormPage } from "../company-request-form/company-request-form.page";


@Component({
  selector: 'app-company-requests',
  templateUrl: './company-requests.page.html',
  styleUrls: ['./company-requests.page.scss'],
})
export class CompanyRequestsPage implements OnInit {

  public loading: boolean = true;
  public company: Company;

  public borderLimit = false;

  public requests: Request[] = [];
  public company_id = null;
  public pageCount = 0;
  public currentPage = 1;
  public pages: number[] = [];

  constructor(
    public router: Router,
    public requestService: CompanyRequestService,
    public companyService: CompanyService,
    public eventService: EventService,
    public modalCtrl: ModalController
  ) { }

  ngOnInit() {
  }

  ionViewDidEnter() {
    if(!this.company)
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

  dismiss() {
    this.modalCtrl.dismiss();
  }

  logScrolling(e) {
    this.borderLimit = (e.detail.scrollTop > 20);
  }

  async requestDetail(request) {
    this.modalCtrl.dismiss().then(() => {
      setTimeout(() => {
        this.router.navigate(['request-view', request.request_uuid], {
          state: {
            model: request
          }
        });
      }, 100);
    });
    /*
    window.history.pushState({ navigationId: window.history.state.navigationId }, null, window.location.pathname);

    const modal = await this.modalCtrl.create({
      component: CompanyRequestViewPage,
      componentProps: {
        request_uuid: request.request_uuid,
        request: request
      }
    });
    modal.onDidDismiss().then(e => {

      if (!e.data || e.data.from != 'native-back-btn') {
        window['history-back-from'] = 'onDidDismiss';
        window.history.back();
      }
    });
    modal.present();*/
  }

  loadCompanyDetail() {
    this.companyService.view(this.company.company_id).subscribe(response => {
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

    if (this.company.company_id) {
      urlParams += '&company_id=' + this.company.company_id;
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

      if (!e.data || e.data.from != 'native-back-btn') {
        window['history-back-from'] = 'onDidDismiss';
        window.history.back();
      }

      if(e.data && e.data.refresh) {

        this.eventService.reloadStats$.next({
          company_id: this.company.company_id
        });

        this.loadRequests(this.currentPage);
      }
    });
    modal.present();
  }
}
