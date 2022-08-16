import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Platform } from '@ionic/angular';

// models
import { Staff } from 'src/app/models/staff';
// services
import { AuthService } from 'src/app/providers/auth.service';
import { StaffService } from 'src/app/providers/logged-in/staff.service';


@Component({
  selector: 'app-valocity',
  templateUrl: './valocity.page.html',
  styleUrls: ['./valocity.page.scss'],
})
export class ValocityPage implements OnInit {

  public start_date; // max date
  public end_date; // max date

  public borderLimit = false;

  public pageCount = 0;
  public currentPage = 1;
  public loading = false;
  public loadMore = false;

  public deleting = false;

  public staffs: Staff[] = [];

  totalPendingRequests = 0;
  totalClosedRequests = 0;
  totalInvitations = 0;
  totalNoOfHours = 0;
  totalVelocity = 0;
  totalCompletedStories = 0;

  constructor(
    public authService: AuthService,
    private staffService: StaffService,
    private navCtrl: NavController,
    public _platform: Platform,
  ) {
  }

  ngOnInit() {
    window.analytics.page('Valocity Page');

    this.loadData(this.currentPage);
  }

  /**
   * load store list
   * @param page
   * @param loading
   */
  async loadData(page: number, loading = true) {

    this.loading = loading;

    const urlParams = this.getUrlParams();

    this.staffService.list(this.currentPage, urlParams).subscribe(response => {

      this.pageCount = parseInt(response.headers.get('X-Pagination-Page-Count'));
      this.currentPage = parseInt(response.headers.get('X-Pagination-Current-Page'));
      this.staffs = response.body;
      this.totalRecord(this.staffs);
    },
      error => {
      },
      () => {
        this.loading = false;
      }
    );
  }

  /**
   * return url params
   * @returns 
   */
  getUrlParams() {
    let urlParams = '&expand=totalCompletedStories,timeForCompletedStories,totalInvitations';
//totalClosedRequests,totalPendingRequests,timeForCompletedRequests,timeForCancelledRequests,
    if (this.start_date) {
      const date = new Date(this.start_date);
      const month = date.getMonth() + 1;
      urlParams += '&start_date=' + date.getUTCFullYear() + '-' + month + '-' + date.getUTCDay();
    }

    if (this.end_date) {
      const date = new Date(this.end_date);
      const month = date.getMonth() + 1;
      urlParams += '&end_date=' + date.getUTCFullYear() + '-' + month + '-' + date.getUTCDay();
    }

    return urlParams;
  }

  /**
   * valocity of staff
   * @param staff
   */
  valocity(staff) {

    if (!staff.totalClosedRequests) {
      return 0;
    }

    if (!staff.timeForCompletedRequests) {
      return 0;
    }
    
    if (!staff.timeForCancelledRequests) {
      return 0;
    }

    const days = Math.ceil((staff.timeForCompletedRequests + staff.timeForCancelledRequests) / (3600 * 24));
    const velocity = staff.totalClosedRequests / days;
    this.totalVelocity += velocity;
    return velocity;
  }

  /**
   * valocity by story delivered
   * @param staff 
   * @returns 
   */
  valocityByStory(staff) {

    if (!staff.totalCompletedStories) {
      return 0;
    }

    const days = Math.ceil(staff.timeForCompletedStories / (3600 * 24));
    
    return staff.totalCompletedStories / days;
  }

  /**
   * no of hours spent on hours
   * @param staff
   * @returns
   */
  noOfHours(staff) {
    //return (staff.timeForCompletedRequests + staff.timeForCancelledRequests) / 3600;
    return staff.timeForCompletedStories > 0 ? staff.timeForCompletedStories / 3600: 0;
  }

  totalRecord(staffs) {
    this._platform.ready().then(() => {
      staffs.forEach ((staff, i) => {
        
        this.totalNoOfHours += staff.timeForCompletedStories / 3600;

        //this.totalNoOfHours += (staff.timeForCompletedRequests + staff.timeForCancelledRequests) / 3600;

        //this.totalClosedRequests += staff.totalClosedRequests;
        //this.totalPendingRequests += staff.totalPendingRequests;

        this.totalCompletedStories += staff.totalCompletedStories;

        this.totalInvitations += staff.totalInvitations;

        staff.valocity = this.valocityByStory(staff);

        this.totalVelocity += staff.valocity;
      });
    });
  }

  /**
   * When its selected
   */
  rowSelected(model) {
    // Load Detail Page
    this.navCtrl.navigateForward('team-view/' + model.staff_id, {
      state: {
        model
      }
    });
  }

  /**
   * load more
   * @param event
   */
  doInfinite(event) {
    this.loadMore = true;

    this.currentPage++;

    const urlParams = this.getUrlParams();

    this.staffService.list(this.currentPage, urlParams).subscribe(response => {

      this.pageCount = parseInt(response.headers.get('X-Pagination-Page-Count'));
      this.currentPage = parseInt(response.headers.get('X-Pagination-Current-Page'));

      this.staffs = this.staffs.concat(response.body);
      this.totalRecord(this.staffs);
    },
      error => {
      },
      () => {
        this.loadMore = false;
        event.target.complete();
      }
    );
  }

  logScrolling(e) {
    this.borderLimit = (e.detail.scrollTop > 20);
  }

  clearSelection() {
    this.start_date = this.end_date = null;
  }
}
