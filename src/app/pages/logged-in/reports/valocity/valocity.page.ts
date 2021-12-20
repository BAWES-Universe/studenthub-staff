import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
//models
import { Staff } from 'src/app/models/staff';
//services
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

  constructor(
    public authService: AuthService,
    private staffService: StaffService,
    private navCtrl: NavController
  ) { }

  ngOnInit() {
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
    },
      error => {
      },
      () => {
        this.loading = false;
      }
    );
  }

  getUrlParams() {
    let urlParams = '&expand=totalClosedRequests,totalPendingRequests,timeForCompletedRequests,timeForCancelledRequests,totalInvitations';

    if(this.start_date) {
      const date = new Date(this.start_date);
      const month = date.getMonth() + 1;
      urlParams += '&start_date=' + date.getUTCFullYear() + '-' + month + '-' + date.getUTCDay();
    }

    if(this.end_date) {
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
    if(!staff.totalClosedRequests)
      return 0;

    const days = Math.ceil((staff.timeForCompletedRequests + staff.timeForCancelledRequests)/ (3600 * 24));
    return staff.totalClosedRequests/ days;
  }

  /**
   * no of hours spent on hours
   * @param staff
   * @returns
   */
  noOfHours(staff) {
    return (staff.timeForCompletedRequests + staff.timeForCancelledRequests)/ 3600;
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
