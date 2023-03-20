import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import {AlertController, NavController} from '@ionic/angular';
import { AnalyticsService } from 'src/app/providers/analytics.service';
// services
import { CandidateService } from 'src/app/providers/logged-in/candidate.service';


@Component({
  selector: 'app-assigned-expired-civil',
  templateUrl: './assigned-expired-civil.page.html',
  styleUrls: ['./assigned-expired-civil.page.scss'],
})
export class AssignedExpiredCivilPage implements OnInit {

  public borderLimit = false;

  public pageCount = 0;
  public total = 0;
  public currentPage = 1;

  public searchBar = '';

  public form: FormGroup;
  public candidatelistData = [];

  public candidates = [];

  public loading = false;
  public exporting = false;
  public renewLoader: boolean = false;

  public checkAll = null;

  constructor(
    public navCtrl: NavController,
    public alertCtrl: AlertController,
    public candidateService: CandidateService,
    public analyticService: AnalyticsService
  ) {
  }

  ngOnInit() {
    this.analyticService.page('Assigned Expired Civil Page');

    this.loadData(1);
  }

  /**
   * Load expired ID cards
   * @param page
   */
  async loadData(page) {

    if (!this.renewLoader)
      this.loading = true;

    this.candidateService.listAssignedExpiredIds(this.searchBar, page).subscribe(response => {

      this.pageCount = parseInt(response.headers.get('X-Pagination-Page-Count'));
      this.currentPage = parseInt(response.headers.get('X-Pagination-Current-Page'));
      this.total = parseInt(response.headers.get('X-Pagination-Total-Count'));

      this.candidatelistData = response.body;
    },
    error => { },
    () => {
      this.renewLoader = false;
      this.loading = false;
    });
  }

  /**
   * load more data on scroll to bottom
   * @param event
   */
  doInfinite(event) {
    this.loading = true;

    this.currentPage++;

    this.candidateService.listAssignedExpiredIds(this.searchBar, this.currentPage).subscribe(response => {

        this.pageCount = parseInt(response.headers.get('X-Pagination-Page-Count'));
        this.currentPage = parseInt(response.headers.get('X-Pagination-Current-Page'));

        this.candidatelistData = this.candidatelistData.concat(response.body);
      },
      error => {
      },
      () => {
        this.loading = false;
        event.target.complete();
      }
    );
  }

  /**
   * When its selected
   */
  rowSelected(model) {
    this.navCtrl.navigateForward('candidate-view/' + model.candidate_id, {
      state: {
        model
      }
    });
  }

  logScrolling(e) {
    this.borderLimit = (e.detail.scrollTop > 20);
  }

  /**
   * export id cards
   */
  async exportData() {
    const alert = await this.alertCtrl.create({
      header: 'Are you sure you want to export the file?',
      cssClass: 'custom-alert',
      buttons: [
        {
          text: 'No',
          cssClass: 'alert-button-cancel',
        },
        {
          text: 'Yes',
          cssClass: 'alert-button-confirm',
          handler: async () => {
            this.exporting = true;
            this.candidateService.export('&task=expired_civil_id', 1, 'assigned-expired-civil-candidates.xlsx').subscribe(response => {
              this.exporting = false;
            }, (err) => {
              this.exporting = false;
            }, () => {
              this.exporting = false;
            });
          }
        },
      ],
    });
    await alert.present();
  }
}
