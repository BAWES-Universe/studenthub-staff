import { Component, OnInit } from '@angular/core';
import { NavController, Platform } from '@ionic/angular';
//models
import { Staff } from 'src/app/models/staff';
//services
import { StaffService } from 'src/app/providers/logged-in/staff.service';
import { AuthService } from 'src/app/providers/auth.service';
import { AnalyticsService } from 'src/app/providers/analytics.service';


@Component({
  selector: 'app-team-list',
  templateUrl: './team-list.page.html',
  styleUrls: ['./team-list.page.scss'],
})
export class TeamListPage implements OnInit {

  public borderLimit = false;

  public totalCount = 0;
  public pageCount = 0;
  public currentPage = 1;
  public loading = false;
  public loadMore = false;
  public deleting = false;
  public staffs: Staff[] = [];

  constructor(
    public authService: AuthService,
    private staffService: StaffService,
    public analyticService: AnalyticsService,
    private navCtrl: NavController,
    public platform: Platform,
  ) { }

  ngOnInit() {
    this.analyticService.page('Team List Page');

    this.loadData(this.currentPage);
  }

  /**
   * load store list
   * @param page
   * @param loading
   */
  async loadData(page: number, loading = true) {

    this.loading = loading;

    this.staffService.list(this.currentPage, '&expand=totalCompletedRequests').subscribe(response => {

      this.pageCount = parseInt(response.headers.get('X-Pagination-Page-Count'));
      this.currentPage = parseInt(response.headers.get('X-Pagination-Current-Page'));
      this.totalCount = parseInt(response.headers.get('X-Pagination-Total-Count'));
      this.staffs = response.body;
    },
      error => {
      },
      () => {
        this.loading = false;
      }
    );
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

    this.staffService.list(this.currentPage, '&expand=totalCompletedRequests').subscribe(response => {

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
}
