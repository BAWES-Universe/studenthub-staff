import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AlertController, IonContent, ModalController, NavController } from '@ionic/angular';
// models
import { Request } from 'src/app/models/request';
// services
import { CompanyRequestService } from 'src/app/providers/logged-in/company-request.service';
import { EventService } from 'src/app/providers/event.service';
import { StoryService } from '../../../../providers/logged-in/story.service';
//components
import { RequestFilterComponent } from 'src/app/components/request-filter/request-filter.component';


@Component({
  selector: 'app-company-request-dashboard',
  templateUrl: './company-request-dashboard.page.html',
  styleUrls: ['./company-request-dashboard.page.scss'],
})
export class CompanyRequestDashboardPage implements OnInit {

  @ViewChild(IonContent, { static: true }) content: IonContent;

  public loading = false;

  public borderLimit = false;

  public activeRequests: Request[] = [];

  public scrollPosition = 0;

  public total = 0;
  public contact_uuid = null;
  public pageCount = 0;
  public currentPage = 1;
  public stories: any[] = [];

  storyPageCount = 0;
  storyCurrentPage = 0;
  storyTotal = 0;
  storyStatus = 'all';

  public section = 'part';
  public segment = 'request';

  public filters = {
    storyStatus: null,//'9' for unstarted
    requestStatus: null,//'started',
    position_type: null,
    startDate: null,
    endDate: null,
  };

  public query = '';

  public alertRequestCountUpdated;

  constructor(
    public requestService: CompanyRequestService,
    public eventService: EventService,
    public navCtrl: NavController,
    public alertCtrl: AlertController,
    public modalCtrl: ModalController,
    public activatedRoute: ActivatedRoute,
    private storyService: StoryService,
  ) {
  }

  ngOnInit() {
    this.contact_uuid = this.activatedRoute.snapshot.paramMap.get('id');

    window.analytics.page('Company Request Dashboard Page');

    const state = window.history.state;

    if(state && state.requestStatus) {
      this.filters.requestStatus = state.requestStatus;
    } else {
      this.loadAllRequest();
    }

    this.eventService.companyRequestUpdate$.subscribe(() => {
      this.loadAllRequest();
    });

    this.eventService.requestCountUpdated$.subscribe(async () => {

      this.alertRequestCountUpdated = true;

      /*this.alertRequestCountUpdated = await this.alertCtrl.create({
        header: 'Request count updated',
        subHeader: 'Refresh to view latest update',
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
            cssClass: 'secondary',
            handler: (data) => {
              this.alertRequestCountUpdated = null;
            }
          }, {
            text: 'Refresh',
            handler: (data) => {
              this.loadAllRequest();
              this.alertRequestCountUpdated = null;
            }
          }
        ]
      });
      this.alertRequestCountUpdated.present();*/
    });

    this.eventService.companyRequestCancelled$.subscribe(() => {
      this.loadStories(1);
    });

    this.eventService.companyRequestDelivered$.subscribe((request: any) => {
      this.loadStories(1);
    });

    this.eventService.storyStatusUpdated$.subscribe(() => {
      this.loadStories(1);
    });
  }

  ionViewWillEnter() {
    this.content.scrollToPoint(0, this.scrollPosition);

    const state = window.history.state;

    if(state && state.requestStatus) {
      this.filters.requestStatus = state.requestStatus;

      this.loadAllRequest();
    }
  }

  ionViewWillLeave() {
    this.content.getScrollElement().then(ele => {
      this.scrollPosition = ele.scrollTop;
    });
  }

  closeAlert() {
    this.alertRequestCountUpdated = false;
  }

  loadAllRequest() {
    this.alertRequestCountUpdated = false;
    this.loadRequests();
    this.loadStories(1);
  }

  /**
   * load part time request
   */
  loadRequests() {

    let param = this.urlParams();

    this.requestService.listActiveWithPages(1, param).subscribe(response => {
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
      state: {
        from: 'company-request-dashboard'
      }
    });
  }

  /**
   * load more on scroll to bottom
   * @param event
   */
  doInfinite(event) {

    let param = this.urlParams();

    this.loading = true;

    this.currentPage++;

    this.requestService.listActiveWithPages(this.currentPage, param).subscribe(response => {
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

  /**
   * Return url string to filter list
   */
  urlParams() {
    let urlParams = '&followup_interval=1';

    if (this.contact_uuid) {
      urlParams += '&contact_uuid=' + this.contact_uuid;
    }

    if (this.query) {
      urlParams += '&query=' + this.query;
    }

    if (this.filters.requestStatus) {
      urlParams += '&request_status=' + this.filters.requestStatus;
    }

    if (this.filters.storyStatus) {
      urlParams += '&story_status=' + this.filters.storyStatus;
    }

    if (this.filters.startDate) {
      const d = new Date(this.filters.startDate);
      const month = d.getMonth() + 1;
      urlParams += '&start_date=' + d.getFullYear() + '-' + month + '-' + d.getDate();
    }

    if (this.filters.endDate) {
      const d = new Date(this.filters.endDate);
      const month = d.getMonth() + 1;
      urlParams += '&end_date=' + d.getFullYear() + '-' + month + '-' + d.getDate();
    }

    if (this.filters.position_type) {
      urlParams += '&position_type=' + this.filters.position_type;
    }

    return urlParams;
  }

  segmentChanged(event) {
    this.segment = event.target.value;
  }

  /**
   * load store list
   * @param page
   * @param loading
   */
  async loadStories(page: number, loading = true) {

    this.loading = loading;

    let param = this.urlParams();
    param += '&expand=staff,request,request.company,latestStoryActivity';
    param += '&query=' + this.query;

    this.storyService.list(this.currentPage, param).subscribe(response => {

      this.storyPageCount = parseInt(response.headers.get('X-Pagination-Page-Count'));
      this.storyCurrentPage = parseInt(response.headers.get('X-Pagination-Current-Page'));
      this.storyTotal = parseInt(response.headers.get('X-Pagination-Total-Count'));
      this.stories = response.body;
    },
      error => {
      },
      () => {
        this.loading = false;
      }
    );
  }

  /**
   * load more
   * @param event
   */
  doInfiniteStories(event) {

    this.currentPage++;

    let param = this.urlParams();
    param += '&expand=staff,request,request.company,latestStoryActivity';

    this.storyService.list(this.currentPage, param).subscribe(response => {

      this.pageCount = parseInt(response.headers.get('X-Pagination-Page-Count'));
      this.currentPage = parseInt(response.headers.get('X-Pagination-Current-Page'));

      this.stories = this.stories.concat(response.body);
    },
      error => {
      },
      () => {
        // this.loadMore = false;
        event.target.complete();
      }
    );
  }

  /**
   * When its selected
   */
  rowSelected(model) {
    // Load Detail Page
    this.navCtrl.navigateForward('story-view/' + model.story_uuid, {
      state: {
        model
      }
    });
  }

  /**
   * open filter
   * @returns
   */
  async openFilter() {

    const modal = await this.modalCtrl.create({
      component: RequestFilterComponent,
      cssClass: 'modal-request-filter',
      componentProps: {
        filters: Object.assign({}, this.filters),
        tab: this.segment
      }
    });

    await modal.present();

    const { data } = await modal.onWillDismiss();

    if(data && (
        data.storyStatus != this.filters.storyStatus ||
        data.requestStatus != this.filters.requestStatus ||
        data.position_type != this.filters.position_type ||
        data.startDate != this.filters.startDate ||
        data.endDate != this.filters.endDate
    )) {
      this.filters = data;
      if (this.segment == 'request') {
        this.loadRequests();
      } else {
        this.loadStories(1);
      }
    }
  }

  searchFilter(event) {
    this.query = event.target.value;
    if (this.segment == 'request') {
      this.loadAllRequest();
    } else {
      this.loadStories(1);
    }
  }
}
