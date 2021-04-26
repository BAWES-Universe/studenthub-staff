import { Component, OnInit, ViewChild } from '@angular/core';
//models
import { Request } from 'src/app/models/request';
//services
import { CompanyRequestService } from 'src/app/providers/logged-in/company-request.service';
import {IonContent, NavController} from "@ionic/angular";
import { EventService } from 'src/app/providers/event.service';


@Component({
  selector: 'app-company-request-dashboard',
  templateUrl: './company-request-dashboard.page.html',
  styleUrls: ['./company-request-dashboard.page.scss'],
})
export class CompanyRequestDashboardPage implements OnInit {

  @ViewChild(IonContent, { static: true }) content: IonContent;

  public loading: boolean = false;

  public borderLimit = false;

  public activeRequests: Request[] = [];

  public scrollPosition = 0;

  public total = 0;
  public pageCount = 0;
  public currentPage = 1;


  public section = 'part';

  constructor(
    public requestService: CompanyRequestService,
    public eventService: EventService,
    public navCtrl: NavController
  ) { }

  ngOnInit() {
    this.loadAllRequest();
    this.eventService.companyRequestUpdate$.subscribe(() => {
      this.loadAllRequest();
    });
  }

  ionViewWillEnter() {
    this.content.scrollToPoint(0, this.scrollPosition);
  }

  ionViewWillLeave() {
    this.content.getScrollElement().then(ele => {
      this.scrollPosition = ele.scrollTop;
    });
  }

  loadAllRequest() {
    this.loadRequests();
  }

  /**
   * load part time request
   */
  loadRequests() {
    this.requestService.listActiveWithPages(1, '&followup_interval=1').subscribe(response => {
      this.activeRequests = response.body;
      this.pageCount = parseInt(response.headers.get('X-Pagination-Page-Count'));
      this.currentPage = parseInt(response.headers.get('X-Pagination-Current-Page'));
      this.total = parseInt(response.headers.get('X-Pagination-Total-Count'));
      this.loading = false;
    });
  }

  logScrolling(e) {
    this.borderLimit = (e.detail.scrollTop > 20);
  }

  /**
   * open request detail page
   * @param request
   */
  requestDetail(request) {
    this.navCtrl.navigateForward('/request-view/' + request.request_uuid, {
      state : {
        from: 'company-request-dashboard'
      }
    });
  }

  /**
   * load more on scroll to bottom
   * @param event
   */
  doInfinite(event) {

    this.loading = true;

    this.currentPage++;
    this.requestService.listActiveWithPages(this.currentPage,'&followup_interval=1').subscribe(response => {
        this.activeRequests = this.activeRequests.concat(response.body);
        this.pageCount = parseInt(response.headers.get('X-Pagination-Page-Count'));
        this.currentPage = parseInt(response.headers.get('X-Pagination-Current-Page'));
        this.total = parseInt(response.headers.get('X-Pagination-Total-Count'));
      },
      error => { },
      () => {
        this.loading = false;
        event.target.complete();
      }
    );
  }
}
