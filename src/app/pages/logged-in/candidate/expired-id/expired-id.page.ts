import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import {AlertController, LoadingController, NavController} from '@ionic/angular';
// services
import { CandidateIdCardService } from 'src/app/providers/logged-in/candidate.id.card.service';
import { EventService } from 'src/app/providers/event.service';
import {CandidateService} from "../../../../providers/logged-in/candidate.service";
import { AnalyticsService } from 'src/app/providers/analytics.service';


@Component({
  selector: 'app-expired-id',
  templateUrl: './expired-id.page.html',
  styleUrls: ['./expired-id.page.scss'],
})
export class ExpiredIdPage implements OnInit {

  public pageCount = 0;
  public totalCount = 0;
  public currentPage = 1;

  public searchBar = '';

  public form: FormGroup;
  public candidatelistData = [];

  public candidates = [];

  public loading = false;
  public renewLoader: boolean = false;
  public exporting: boolean = false;

  public checkAll = null;

  public borderLimit: boolean = false;

  constructor(
    public candidateIdCardService: CandidateIdCardService,
    public candidateService: CandidateService,
    private _fb: FormBuilder,
    private _alertCtrl: AlertController,
    private _events: EventService,
    public analyticService: AnalyticsService,
    private _nav: NavController
  ) {
  }

  ngOnInit() {
    this.analyticService.page('Expired Id Page');

    this.form = this._fb.group({
      candidates: [],
    });

    this.loadData(1);

    this._events.reloadCandidateHistory$.subscribe(e => {
      this.loadData(1);
    });
  }

  /**
   * Renew id cards
   */
  async renew() {

    if (this.candidates.length == 0) {
      const prompt = await this._alertCtrl.create({
        message: 'Please select candidate(s)',
        buttons: ['Ok']
      });
      prompt.present();
      return false;
    }

    this.renewLoader = true;

    this.candidateIdCardService.renew(this.candidates).subscribe(jsonResponse => {

      this.candidates = [];

      // refresh list
      this.currentPage = 1;
      this.loadData(this.currentPage);

      this._events.expiredIdCard$.next({});
    }, () => {
      this.renewLoader = false;
    });
  }

  onCandidateToggle(event) {
    let candidate_id = event.target.value;

    if(event.detail.checked) {
      this.candidates.push(candidate_id);
    } else {
      this.candidates = this.candidates.filter(c => c != candidate_id);
    }
  }

  /**
   * Load expired ID cards
   * @param page
   */
  async loadData(page) {

    // Load list of candidates
    if (!this.renewLoader)
      this.loading = true;

    this.candidateIdCardService.listExpiredIds(this.searchBar, page).subscribe(response => {
      this.pageCount = parseInt(response.headers.get('X-Pagination-Page-Count'));
      this.currentPage = parseInt(response.headers.get('X-Pagination-Current-Page'));
      this.totalCount = parseInt(response.headers.get('X-Pagination-Total-Count'));

      this.candidatelistData = response.body;
    },
      error => { },
      () => {
        this.renewLoader = false;
        this.loading = false;
      });
  }

  doInfinite(event) {
    this.loading = true;

    this.currentPage++;
    this.candidateIdCardService.listExpiredIds(this.searchBar, this.currentPage).subscribe(response => {

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

  detail(obj) {
    this._nav.navigateForward('candidate-view/' + obj.candidate_id);
  }

  selectAll() {
    this.checkAll = !(this.checkAll);
  }

  /**
   * Make date readable by Safari
   * @param date
   */
   toDate(date) {
    if (!date)
      return null;

    if (date) {
      return new Date(date.replace(/-/g, '/'));
    }
  }

  logScrolling(e) {
    this.borderLimit = (e.detail.scrollTop > 20);
  }

  /**
   * export id cards
   */
  async exportData() {
    const alert = await this._alertCtrl.create({
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
            this.candidateService.export('&task=expired_ids', 1, 'expired-ids.xlsx').subscribe(response => {
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
