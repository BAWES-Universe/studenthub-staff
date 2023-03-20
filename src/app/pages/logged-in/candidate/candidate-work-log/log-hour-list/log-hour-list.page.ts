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
import { AnalyticsService } from 'src/app/providers/analytics.service';


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
  public candidateId;
  public candidateWorkingHourData: CandidateWorkingHour;

  constructor(
    public platform: Platform,
    public activateRoute: ActivatedRoute,
    public navCtrl: NavController,
    public authService: AuthService,
    public candidateWorkingHour: CandidateWorkingHourService,
    public eventService: EventService,
    public translateService: TranslateLabelService,
    public analyticService: AnalyticsService
  ) { }

  ngOnInit() {
    this.hour = this.activateRoute.snapshot.paramMap.get('hour');
    this.candidateId = this.activateRoute.snapshot.paramMap.get('candidate_id');
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
    this.candidateWorkingHour.detail(this.hour, this.candidateId).subscribe(response => {
      this.loading =  false;
      this.candidateWorkingHourData = response;
    });
  }

  /**
   * broadcast scroll event
   * @param e
   */
  logScrolling(e) {
    // this.eventService.tabScrolled$.next({ scrollTop: e.detail.scrollTop });
  }

  getStartTime() {
    return this.candidateWorkingHourData.dateListByCandidate[0].start_time;
  }

  getEndTime() {
    return this.candidateWorkingHourData.dateListByCandidate[this.candidateWorkingHourData.dateListByCandidate.length - 1].end_time;
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

