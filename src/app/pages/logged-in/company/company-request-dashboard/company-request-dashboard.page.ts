import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IonContent, ModalController, NavController } from '@ionic/angular';
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
    requestStatus: 'started',
    position_type: null,
    startDate: null,
    endDate: null,
  };

  public query = '';

  constructor(
    public requestService: CompanyRequestService,
    public eventService: EventService,
    public navCtrl: NavController,
    public modalCtrl: ModalController,
    public activatedRoute: ActivatedRoute,
    private storyService: StoryService,
  ) {
  }

  ngOnInit() {
    this.contact_uuid = this.activatedRoute.snapshot.paramMap.get('id');

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
    this.loadStories(1);
  }

  /**
   * load part time request
   */
  loadRequests() {

    let param = this.urlParams();
    console.log(param);
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

    let param = '&expand=request,request.company,latestStoryActivity';

    if (this.storyStatus) {
      param += '&story_status=' + this.storyStatus;
    }

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
    // this.loadMore = true;

    this.currentPage++;

    let param = '&expand=request,request.company,latestStoryActivity';

    if (this.storyStatus) {
      param += '&story_status=' + this.storyStatus;
    }

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
        filters: Object.assign({}, this.filters)
      }
    });

    await modal.present();

    const { data } = await modal.onWillDismiss();

    if(data && (
        data.requestStatus != this.filters.requestStatus ||
        data.position_type != this.filters.position_type ||
        data.startDate != this.filters.startDate ||
        data.endDate != this.filters.endDate
    )) {
      this.filters = data;

      this.loadAllRequest();
    }
  }

  searchFilter(event) {

    this.query = event.target.value;
    this.loadAllRequest();
  }
}
