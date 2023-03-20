import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalController, NavController, Platform, IonContent } from '@ionic/angular';
// services
import { TranslateLabelService } from 'src/app/providers/translate-label.service';
import { AuthService } from 'src/app/providers/auth.service';
import { EventService } from 'src/app/providers/event.service';
// models
import { InvitationService } from 'src/app/providers/logged-in/invitation.service';
import {CandidateWorkingHour} from 'src/app/models/candidate';
import {CandidateWorkingHourService} from 'src/app/providers/logged-in/candidate-working-hour.service';
import {ActivatedRoute} from "@angular/router";
import { AnalyticsService } from 'src/app/providers/analytics.service';


declare var window;

@Component({
  selector: 'app-log-date-list-page',
  templateUrl: './log-date-list.page.html',
  styleUrls: ['./log-date-list.page.scss'],
})
export class LogDateListPage implements OnInit {

  @ViewChild(IonContent, { static: true }) content: IonContent;

  public loading = false;

  public pageCount = 0;
  public currentPage = 1;
  public totalCount = 0;
  public candidate_id = null;

  public candidateWorkingHourData: CandidateWorkingHour[];

  constructor(
    public platform: Platform,
    public navCtrl: NavController,
    public modalCtrl: ModalController,
    public authService: AuthService,
    public candidateWorkingHour: CandidateWorkingHourService,
    public eventService: EventService,
    public invitationService: InvitationService,
    public translateService: TranslateLabelService,
    public analyticService: AnalyticsService,
    public activateRoute: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.candidate_id = this.activateRoute.snapshot.paramMap.get('candidate_id');
    this.analyticService.page('Candidate Working Hours');
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
    const param = `&candidate_id=${this.candidate_id}`;
    this.candidateWorkingHour.list(this.currentPage, param).subscribe(response => {
      this.loading =  false;
      this.pageCount = parseInt(response.headers.get('X-Pagination-Page-Count'));
      this.currentPage = parseInt(response.headers.get('X-Pagination-Current-Page'));
      this.totalCount = parseInt(response.headers.get('X-Pagination-Total-Count'));
      this.candidateWorkingHourData = response.body;
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
    const param = `&candidate_id=${this.candidate_id}`;
    this.candidateWorkingHour.list(this.currentPage, param).subscribe(response => {

        this.pageCount = parseInt(response.headers.get('X-Pagination-Page-Count'));
        this.currentPage = parseInt(response.headers.get('X-Pagination-Current-Page'));
        this.totalCount = parseInt(response.headers.get('X-Pagination-Total-Count'));
        this.candidateWorkingHourData = this.candidateWorkingHourData.concat(response.body);
        event.target.complete();
    },
    error => { },
    () => {
      this.loading = false;
    });
  }

  getStartTime(hour) {
    return hour.dateListByCandidate[0].start_time;
  }

  getEndTime(hour) {
    return hour.dateListByCandidate[hour.dateListByCandidate.length - 1].end_time;
  }

  secondsToTime(secs){
    var h = Math.floor(secs / (60 * 60));

    var divisor_for_minutes = secs % (60 * 60);
    var m = Math.floor(divisor_for_minutes / 60);

    var divisor_for_seconds = divisor_for_minutes % 60;
    var s = Math.ceil(divisor_for_seconds);

    return `${h?`${h}:`:""}${m?`${m}:${s}`:`${s}s`}`
  }
}

