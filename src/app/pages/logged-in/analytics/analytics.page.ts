import { Component, OnInit } from '@angular/core';
import {NavController, Platform} from '@ionic/angular';
import {AuthService} from '../../../providers/auth.service';
import {StaffService} from '../../../providers/logged-in/staff.service';
import {Staff} from '../../../models/staff';

@Component({
  selector: 'app-analytics',
  templateUrl: './analytics.page.html',
  styleUrls: ['./analytics.page.scss'],
})
export class AnalyticsPage implements OnInit {

  public borderLimit = false;

  public pageCount = 0;
  public currentPage = 1;
  public loading = false;
  public loadMore = false;
  public deleting = false;
  public staffs: Staff[] = [];
  public records = [];
  constructor(
    public authService: AuthService,
    private staffService: StaffService,
    private navCtrl: NavController,
    public platform: Platform,
  ) {
  }

  ngOnInit() {
    this.loadData(this.currentPage);
  }

  logScrolling(e) {
    this.borderLimit = (e.detail.scrollTop > 20);
  }

  /**
   * load store list
   * @param page
   * @param loading
   */
  async loadData(page: number, loading = true) {

    this.loading = loading;
    const params = '&role=1&expand=totalCompletedRequests,activeStory,activeStory.request,activeStory.request,activeStory.request.company';
    this.staffService.list(this.currentPage, params).subscribe(response => {
        this.pageCount = parseInt(response.headers.get('X-Pagination-Page-Count'), 10);
        this.currentPage = parseInt(response.headers.get('X-Pagination-Current-Page'), 10);
        this.staffs = response.body;
      },
      error => { },
      () => {
        this.loading = false;
      }
    );
  }

  getTimeSpent(time) {
    let seconds = 0;
    let minutes = 0;
    let hours = 0;
    let days = 0;
    let months = 0;
    seconds = time;
    if (seconds > 60) {
      minutes = (time / 60);
    }
    if (minutes > 60) {
      hours = (minutes / 60 );
    }
    if (hours > 24) {
      days = (hours / 24 );
    }
    if (days > 31) {
      months = (days / 31 );
    }

    if (months) {
      return months.toFixed(2) + ' months';
    }
    if (days) {
      return days.toFixed(2) + ' days';
    }
    if (hours) {
      return hours.toFixed(2) + ' hours';
    }
    if (minutes) {
      return minutes.toFixed(2) + ' minutes';
    }
    if (seconds) {
      return seconds.toFixed(2) + ' seconds';
    }

  }
}
