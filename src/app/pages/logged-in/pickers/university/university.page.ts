import { Component, OnInit } from '@angular/core';
import {ModalController} from "@ionic/angular";
import {UniversityService} from "src/app/providers/logged-in/university.service";
import {University} from "src/app/models/university";
import { AnalyticsService } from 'src/app/providers/analytics.service';

@Component({
  selector: 'app-university',
  templateUrl: './university.page.html',
  styleUrls: ['./university.page.scss'],
})
export class UniversityPage implements OnInit {

  public pageCount = 0;
  public currentPage = 1;
  public searchBar;
  public loading = false;
  public universities: University[];

  public borderLimit = false;

  constructor(
    public modalCtrl: ModalController,
    public universityService: UniversityService,
    public analyticService: AnalyticsService
  ) {}

  ngOnInit() {
    this.analyticService.page('University List Page');

    this.loadData(this.currentPage);
  }

  /**
   * load university data
   * @param page
   */
  async loadData(page: number) {
    // Load list of university
    this.loading = true;

    this.universityService.list(page, this.searchBar).subscribe(response => {

        this.pageCount = parseInt(response.headers.get('X-Pagination-Page-Count'));
        this.currentPage = parseInt(response.headers.get('X-Pagination-Current-Page'));

        this.universities = response.body;

      },
      error => {},
      () => {this.loading = false; }
    );
  }

  /**
   * close modal
   * @param data
   */
  dismiss(data = {}) {
    this.modalCtrl.getTop().then(overlay => {
      if (overlay)
        this.modalCtrl.dismiss(data);
    });
  }

  /**
   * on university selection
   * @param university
   */
  async rowSelected(university) {
    this.dismiss({
      university
    });
  }

  /**
   * load more on scroll to bottom
   * @param event
   */
  doInfinite(event) {
    this.loading = true;
    this.currentPage++;
    this.universityService.list(this.currentPage,this.searchBar).subscribe(response => {

          this.pageCount = parseInt(response.headers.get('X-Pagination-Page-Count'));
          this.currentPage = parseInt(response.headers.get('X-Pagination-Current-Page'));

          this.universities = this.universities.concat(response.body);
        },
        error => {},
        () => {
          this.loading = false;
          event.target.complete();
        }
    );
  }

  logScrolling(e) {
    this.borderLimit = (e.detail.scrollTop > 20);
  }
}
