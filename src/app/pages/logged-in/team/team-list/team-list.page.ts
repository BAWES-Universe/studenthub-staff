import { Component, OnInit } from '@angular/core';
import {AlertController, ModalController, NavController, Platform, ToastController} from '@ionic/angular';

import {StaffService} from 'src/app/providers/logged-in/staff.service';

import {Staff} from 'src/app/models/staff';

@Component({
  selector: 'app-team-list',
  templateUrl: './team-list.page.html',
  styleUrls: ['./team-list.page.scss'],
})
export class TeamListPage implements OnInit {

  public borderLimit = false;

  public pageCount = 0;
  public currentPage = 1;
  public loading = false;
  public loadMore = false;
  public deleting = false;
  public staffs: Staff[] = [];

  constructor(
    private staffService: StaffService,
    private navCtrl: NavController,
    private modalCtrl: ModalController,
    private alertCtrl: AlertController,
    public platform: Platform,
    private toastCtrl: ToastController
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

    this.staffService.list(this.currentPage).subscribe(response => {

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
    this.staffService.list(this.currentPage).subscribe(response => {

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
