import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalController, NavController, Platform, IonContent } from '@ionic/angular';
// services
import { TranslateLabelService } from 'src/app/providers/translate-label.service';
import { AuthService } from 'src/app/providers/auth.service';
import { EventService } from 'src/app/providers/event.service';
// models
import {CandidateWorkingHour} from 'src/app/models/candidate';
import {CandidateWorkingHourService} from 'src/app/providers/logged-in/candidate-working-hour.service';
import {ActivatedRoute} from '@angular/router';


declare var window;

@Component({
  selector: 'app-log-hour-list-page',
  templateUrl: './log-hour-list.page.html',
  styleUrls: ['./log-hour-list.page.scss'],
})
export class LogHourListPage implements OnInit {

  @ViewChild(IonContent, { static: true }) content: IonContent;

  public loading = false;

  public pageCount = 0;
  public currentPage = 1;
  public totalCount = 0;
  public totalHours = 0;
  public hour;
  public candidate_id;
  public candidateWorkingHourData: CandidateWorkingHour[];

  constructor(
    public platform: Platform,
    public activateRoute: ActivatedRoute,
    public navCtrl: NavController,
    public authService: AuthService,
    public candidateWorkingHour: CandidateWorkingHourService,
    public eventService: EventService,
    public translateService: TranslateLabelService,
  ) { }

  ngOnInit() {
    this.hour = this.activateRoute.snapshot.paramMap.get('hour');
    this.candidate_id = this.activateRoute.snapshot.paramMap.get('candidate_id');
    window.analytics.page('Candidate Working Hours');
  }

  ionViewWillEnter() {
    this.loadData();
  }

  ionViewWillLeave() {
    this.content.scrollToPoint(0, 0);
  }

  /**
   * load invitations for request
   */
  loadData() {
    this.loading = true;
    const param = `&date=${this.hour}&candidate_id=${this.candidate_id}`;
    this.candidateWorkingHour.listByHour(this.currentPage, param).subscribe(response => {
      this.loading =  false;
      this.pageCount = parseInt(response.headers.get('X-Pagination-Page-Count'));
      this.currentPage = parseInt(response.headers.get('X-Pagination-Current-Page'));
      this.totalCount = parseInt(response.headers.get('X-Pagination-Total-Count'));
      this.candidateWorkingHourData = response.body;
      this.countTotal();
    });
  }

  /**
   * broadcast scroll event
   * @param e
   */
  logScrolling(e) {
    // this.eventService.tabScrolled$.next({ scrollTop: e.detail.scrollTop });
  }

  /**
   * load more data on scroll to bottom
   * @param event
   */
  doInfinite(event) {

    this.loading = true;

    this.currentPage++;
    const param = `&date=${this.hour}&candidate_id=${this.candidate_id}`;
    this.candidateWorkingHour.listByHour(this.currentPage, param).subscribe(response => {

        this.pageCount = parseInt(response.headers.get('X-Pagination-Page-Count'));
        this.currentPage = parseInt(response.headers.get('X-Pagination-Current-Page'));
        this.totalCount = parseInt(response.headers.get('X-Pagination-Total-Count'));
        this.candidateWorkingHourData = this.candidateWorkingHourData.concat(response.body);
        this.countTotal();
        event.target.complete();
    },
    error => { },
    () => {
      this.loading = false;
    });
  }

  countTotal() {
    this.totalHours = this.candidateWorkingHourData.reduce((partialSum, a) => partialSum + a.total_time, 0);
  }

}

