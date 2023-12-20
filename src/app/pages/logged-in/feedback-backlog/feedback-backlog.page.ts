import { Component, OnInit, ViewChild } from '@angular/core';
import {IonContent, NavController} from "@ionic/angular";
import {ActivatedRoute} from "@angular/router";
//models
import { Request } from 'src/app/models/request';
//services
import { CompanyRequestService } from 'src/app/providers/logged-in/company-request.service';
import { EventService } from 'src/app/providers/event.service';


@Component({
  selector: 'app-feedback-backlog',
  templateUrl: './feedback-backlog.page.html',
  styleUrls: ['./feedback-backlog.page.scss'],
})
export class FeedbackBacklogPage implements OnInit {
  
  @ViewChild(IonContent, { static: true }) content: IonContent;

  public loading: boolean = false;

  public borderLimit = false;

  public activeRequests: Request[] = [];

  public scrollPosition = 0;

  public total = 0;
  public contact_uuid = null;
  public pageCount = 0;
  public currentPage = 1;

  public section = 'part';


  public filters: {
    companyName: string,
    followupInterval: number,
  } = {
      companyName: null,
      followupInterval : 1
  };

  constructor(
    public requestService: CompanyRequestService,
    public eventService: EventService,
    public navCtrl: NavController,
    public activatedRoute: ActivatedRoute,
  ) {
    this.contact_uuid = this.activatedRoute.snapshot.paramMap.get('id');
  }

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
    const urlParams = this.urlParams();

    this.requestService.listAllRequestsThatHaveSuggestedCadidates(1, urlParams).subscribe(response => {
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
   * Return url string to filter list
   */
  urlParams() {
    let urlParams = '';

    if (this.filters.companyName) {
      urlParams += '&company_name=' + this.filters.companyName;
    }
    if (this.filters.followupInterval) {
      urlParams += '&followup_interval=' + this.filters.companyName;
    }

    urlParams += '&expand=storyOwners,staffs,staff,company';

    return urlParams;
  }

  resetFilter() {
    this.filters = {
      companyName: null,
      followupInterval : 1
    };
  }

  
  searchByName($event) {
    this.filters.companyName = $event.detail.value;
    this.loadRequests(); // reload all result
  }

  /**
   * load more on scroll to bottom
   * @param event
   */
  doInfinite(event) {
    const urlParams = this.urlParams();

    this.loading = true;

    this.currentPage++;
    this.requestService.listAllRequestsThatHaveSuggestedCadidates(this.currentPage,urlParams).subscribe(response => {
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
