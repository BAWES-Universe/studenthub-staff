import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AlertController, IonContent, ModalController, NavController } from '@ionic/angular';
// models
import {Request, Story} from 'src/app/models/request';
// services
import { CompanyRequestService } from 'src/app/providers/logged-in/company-request.service';
import { EventService } from 'src/app/providers/event.service';
import { StoryService } from '../../../../providers/logged-in/story.service';
import { AnalyticsService } from 'src/app/providers/analytics.service';
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

  public noStories = false;
  public noRequests = false;

  public requests: Request[] = [];

  public scrollPosition = 0;

  public total = 0;
  public contact_uuid = null;
  public pageCount = 0;
  public currentPage = 1;
  public stories: Story[] = [];

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
    story_position_type: null,
    startDate: null,
    endDate: null,
  };

  public query = '';

  public storyQuery = '';

  public alertRequestCountUpdated;

  constructor(
    public requestService: CompanyRequestService,
    public eventService: EventService,
    public navCtrl: NavController,
    public alertCtrl: AlertController,
    public modalCtrl: ModalController,
    public activatedRoute: ActivatedRoute,
    private storyService: StoryService,
    public analyticService: AnalyticsService
  ) {
  }

  async ngOnInit() {
    this.contact_uuid = this.activatedRoute.snapshot.paramMap.get('id');

    const state = window.history.state;

    if(state && state.requestStatus) {
      this.filters.requestStatus = state.requestStatus;
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

    // this.eventService.storyStatusUpdated$.subscribe(() => {
    //   this.loadStories(1);
    // });

    this.analyticService.page('Company Request Dashboard Page');
  }

  ionViewWillEnter() {
    this.content.scrollToPoint(0, this.scrollPosition);

    const state = window.history.state;

    if(state && state.requestStatus) {
      this.filters.requestStatus = state.requestStatus;
    }
    
    if(this.requests.length == 0)
      this.loadRequests();
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

    this.loading = true; 
    
    this.requestService.listWithPagination(1, param).subscribe(response => {

      this.requests = response.body;

      this.pageCount = parseInt(response.headers.get('X-Pagination-Page-Count'));
      this.currentPage = parseInt(response.headers.get('X-Pagination-Current-Page'));
      this.total = parseInt(response.headers.get('X-Pagination-Total-Count'));
      this.loading = false;

      if(this.total == 0) {
        this.noRequests = true;
      } else {
        this.noRequests = false;
      }
    });
  }

  logScrolling(e) {
    this.borderLimit = (e.detail.scrollTop > 209);
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

    this.requestService.listWithPagination(this.currentPage, param).subscribe(response => {
      this.requests = this.requests.concat(response.body);
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

  urlParamsStories() {
    let urlParams = '&followup_interval=1';

    if (this.contact_uuid) {
      urlParams += '&contact_uuid=' + this.contact_uuid;
    }

    if (this.storyQuery) {
      urlParams += '&query=' + this.storyQuery;
    }

    if (this.filters.requestStatus) {
      urlParams += '&request_status=' + this.filters.requestStatus;
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

    if (this.filters.position_type && this.segment == 'request') {
      urlParams += '&position_type=' + this.filters.position_type;
    }

    if (this.filters.story_position_type && this.segment == 'story') {
      urlParams += '&position_type=' + this.filters.story_position_type;
    }

    if (this.filters.storyStatus) {
      urlParams += '&story_status=' + this.filters.storyStatus;
    }

    urlParams += '&expand=staff,request,request.company,latestStoryActivity';
    
    //'&expand=storyOwners,staffs,staff,requestCreatedBy,requestUpdatedBy,contact,company,company.companyContact,requestActivities,requestActivities.staff';

    return urlParams;
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

    if (this.filters.position_type && this.segment == 'request') {
      urlParams += '&position_type=' + this.filters.position_type;
    }

    if (this.filters.story_position_type && this.segment == 'story') {
      urlParams += '&position_type=' + this.filters.story_position_type;
    }

    if (this.filters.storyStatus) {
      urlParams += '&story_status=' + this.filters.storyStatus;
    }

    urlParams += '&expand=storyOwners,staffs,staff,company';
    
    //'&expand=storyOwners,staffs,staff,requestCreatedBy,requestUpdatedBy,contact,company,company.companyContact,requestActivities,requestActivities.staff';

    return urlParams;
  }

  segmentChanged(event) {
    this.segment = event.target.value;

    if (this.segment == 'request') {
      if(this.total == 0)
        this.loadRequests();
    } else {
      if(this.storyTotal == 0)
        this.loadStories(1);
    }
  }

  handleRefresh(event) {
    if (this.segment == 'request') {
      this.loadRequests();
    } else {
      this.loadStories(1);
    }

    event.target.complete();
  }

  /**
   * load store list
   * @param page
   * @param loading
   */
  async loadStories(page: number, loading = true) {

    this.loading = loading;

    let param = this.urlParamsStories();
    
    this.storyService.list(this.currentPage, param).subscribe(response => {

      this.storyPageCount = parseInt(response.headers.get('X-Pagination-Page-Count'));
      this.storyCurrentPage = parseInt(response.headers.get('X-Pagination-Current-Page'));
      this.storyTotal = parseInt(response.headers.get('X-Pagination-Total-Count'));

      this.stories = response.body;

      if(this.storyTotal == 0) {
        this.noStories = true;
      } else {
        this.noStories = false;
      }
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

    this.storyCurrentPage++;

    let param = this.urlParamsStories();
     
    this.storyService.list(this.storyCurrentPage, param).subscribe(response => {

      this.storyPageCount = parseInt(response.headers.get('X-Pagination-Page-Count'));
      this.storyCurrentPage = parseInt(response.headers.get('X-Pagination-Current-Page'));

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
        data.story_position_type != this.filters.story_position_type ||
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

    if (this.segment == 'request') {
      this.query = event.target.value;
      this.loadRequests();
    } else {
      this.storyQuery = event.target.value;
      this.loadStories(1);
    }
  }

  getPosition(pos) {
    if (pos == 2) {
      return 'Part-time';
    } else if (pos == 1) {
      return 'Full-time';
    }
  }

  getStoryStatus(status) {
    switch(status) {
      case '0':
        return 'Pending';
      case '1':
        return 'Started';
      case '2':
        return 'Finished';
      case '3':
        return 'Delivered';
      case '4':
        return 'Rejected';
      case '5':
        return 'Accepted';
      case '6':
        return 'Cancelled';
      case '7':
        return 'Re-Work';
      case '9':
        return 'Unstarted';
      case '10':
        return 'Latest';
    }
  }

  getDate(date) {
    const d = new Date(date);
    const month = d.getMonth() + 1;
    return d.getFullYear() + '-' + month + '-' + d.getDate();
  }

  clearRequestStatus() {
    this.filters.requestStatus = null; 
    this.loadRequests();
  }

  clearPositionType() {
    this.filters.position_type = null; 
    this.loadRequests();
  }

  clearStartDate() {
    this.filters.startDate = null;
    this.loadRequests();
  }

  clearEndDate() {
    this.filters.endDate = null;
    this.loadRequests();
  }

  clearStoryStatus() {
    this.filters.storyStatus = null;
    this.loadStories(1);
  }

  clearStoryPositionType() {
    this.filters.story_position_type = null; 
    this.loadStories(1);
  }

  resetFilter(tab) {
    if (tab == 'request') {
      this.filters = {
        storyStatus: this.filters.storyStatus,
        requestStatus: null,
        position_type: null,
        story_position_type: this.filters.story_position_type,
        startDate: null,
        endDate: null,
      };
      this.loadRequests();
    } else {
      this.filters = {
        storyStatus: null,
        requestStatus: this.filters.requestStatus,
        position_type: this.filters.position_type,
        story_position_type: null,
        startDate: this.filters.startDate,
        endDate: this.filters.endDate,
      };
      this.loadStories(1);
    }
  }
}
