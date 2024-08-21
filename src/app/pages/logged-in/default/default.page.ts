import { Component, OnInit, ViewChild } from '@angular/core';
import {AlertController, ModalController, NavController, PopoverController} from '@ionic/angular';
//models
import { StaffLeave } from 'src/app/models/staff-leave';
// services
import { AuthService } from 'src/app/providers/auth.service';
import { EventService } from 'src/app/providers/event.service';
import { DailyStandupService } from 'src/app/providers/logged-in/daily-standup.service';
import { StatisticService } from 'src/app/providers/logged-in/statistic.service';
import {AccountService} from "../../../providers/logged-in/account.service";
//pages
import { LeaveRequestPage } from '../leave-request/leave-request.page';
import {MenuOptionPage} from "src/app/pages/logged-in/default/menu-option/menu-option.page";
import {ChangePasswordComponent} from "src/app/components/change-password/change-password.component";
import { AnalyticsService } from 'src/app/providers/analytics.service';


@Component({
  selector: 'app-default',
  templateUrl: './default.page.html',
  styleUrls: ['./default.page.scss'],
})
export class DefaultPage implements OnInit {

  public loadingSession: boolean = false;

  public savingAnswer = false;

  public borderLimit = false;

  public dailyStandupQuestion;

  public counter = null;

  public staff_work_session: {
    leave: any,
    session: any
    time: any
  } = {
    leave : null,
    session: null,
    time: null
  };

  public leave: StaffLeave;

  public loading = false;

  public statsLoaded = false; 

  constructor(
    public modalCtrl: ModalController,
    public navCtrl: NavController,
    public _alertCtrl: AlertController,
    public authService: AuthService,
    public accountService: AccountService,
    public dailyStandupService: DailyStandupService,
    public statisticService: StatisticService,
    public analyticService: AnalyticsService,
    public popoverCtrl: PopoverController,
    public eventsService: EventService,
  ) { }

  ngOnInit() {
    this.analyticService.page('Home Page');
 
    this.getAccountInfo();

    //check session

    this.getSession();

    //this.loadData(false);
  }

  /*ionViewDidEnter() {
    if(!this.statsLoaded)
      this.loadData(false);
  }*/

  handleRefresh(event = null) {
    this.loadData(true, true);

    if(event)
      event.target.complete();
  }

  /**
   * load current data
   */
  async loadData(loading = true, refresh = false) {

    if(loading)
      this.loading = true;

    this.statisticService.get(refresh).subscribe(response => {

      this.eventsService.statistics = response;

      this.eventsService.expiredIdCard$.next({
        assignedExpiredCivilID: response.assignedExpiredCivilID,
        expiredIdCount: response.totalExpiredCards
      });

      this.eventsService.reviewRequired$.next(this.eventsService.statistics.profileApprovalRequire);

      this.statsLoaded = true;
    },
      error => { },
      () => { this.loading = false; }
    );
  }

  /**
   * change theme
   */
  changeTheme() {
    if (!this.authService.theme || this.authService.theme == 'day') {
      this.authService.setTheme('night');
    } else {
      this.authService.setTheme('day');
    }
  }

  getSession() {
    this.loadingSession = true;

    this.dailyStandupService.getSession().subscribe(async response => {

      this.loadingSession = false;

      if(response) {
        this.staff_work_session.session = response.session;
        this.staff_work_session.leave = response.leave;
        this.getStandupQuestion();
      }

      this.leave = response.leave;
    });
  }

  startSession() {
    this.loadingSession = true;

    this.dailyStandupService.startSession().subscribe(async response => {

      if(response.operation == 'success') {
        this.getSession();

      } else {
        this.loadingSession = false;

        let prompt = await this._alertCtrl.create({
          message: this.authService.errorMessage(response.message),
          buttons: ["Ok"]
        });
        prompt.present();
      }
    });
  }

  endSession() {
    this.loadingSession = true;

    this.dailyStandupService.endSession().subscribe(async response => {

      this.loadingSession = false;

      if(response.operation == 'success') {
        this.staff_work_session.session = null;// response.model;
        this.staff_work_session.time = null;// response.model;
      }
    });
  }

  /*leaveRequest(model): Observable<any>{
    const url = `${this._endpoint}/leave-request`;
    return this._authhttp.post(url, {
      from_date: model.from_date,
      to_date: model.to_date,
      note: model.note,
    });
  }*/

  getStandupQuestion() {
    this.dailyStandupService.question().subscribe(async question => {
      this.dailyStandupQuestion = question;
      this.loadingSession = false;
    });
  }

  async saveAnswer() {

    const question_uuid = this.dailyStandupQuestion.question_uuid;
    const answer = this.dailyStandupQuestion.answer;

    this.savingAnswer = true;

    this.dailyStandupService.answer(question_uuid, answer).subscribe(async response => {
      this.savingAnswer = false;

      if(response.operation == 'success')
        this.getStandupQuestion();
      else {
        let prompt = await this._alertCtrl.create({
          message: this.authService.errorMessage(response.message),
          buttons: ["Ok"]
        });
        prompt.present();
      }

    },
      error => { },
      () => { this.loading = false; }
    );
  }

  /**
   * show expired ids page
   */
  showExpiredIDs() {
    this.navCtrl.navigateForward('expired-id');
  }

  /**
   * show candidate which required to generate id
   */
  showCandidatesRequireNewID() {
    this.navCtrl.navigateForward('generate-id');
  }

  showMinorCandidates() {
    this.navCtrl.navigateForward('candidate-list', {
      state: {
        filterMinor: true
      }
    });
  }

  /**
   * show assigned candidate page
   */
  showAssignedCandidates() {
    this.navCtrl.navigateForward('candidate-list/assigned');
  }

  /**
   * show not assigned candidate page
   */
  showNotAssignedCandidates() {
    this.navCtrl.navigateForward('candidate-list/not-assigned');
  }

  logScrolling(e) {
    this.borderLimit = (e.detail.scrollTop > 5);
  }

  openInterviewRequests(status = 0) {
    this.navCtrl.navigateForward('/request-interview-list', {
      state: {
        status: status
      }
    });
  }

  scrollToActive() {
    this.navCtrl.navigateForward('/view/company-request-dashboard', {
      state: {
        requestStatus: 'need-update'
      }
    });
  }

  /**
   * scroll to pending request
   */
  scrollToPending() {
    this.navCtrl.navigateForward('/view/company-request-dashboard');
  }
  /**
   * scroll to pending request
   */
  companyList() {
    this.navCtrl.navigateForward('/view/company-list', {
        state : {
          filter : 'last40days',
          value : '3'
        }
      }
    );
  }
  
  showUnverifiedEmails() {
    this.navCtrl.navigateForward('/company-contacts', {
      state : {
        filter_email_unverified : true
      }
    }
  );
  }
  
  companyListReview() {
    this.navCtrl.navigateForward('/company-registration-request-list');
    /*this.navCtrl.navigateForward('/view/company-list', {
        state : {
          filter : 'underReview',
          value : '9'
        }
      }
    );*/
  }

  async getAccountInfo() {
    this.accountService.accountInfo().subscribe( res => {
      if (res && res.story) {
        this.authService.story = res.story;
        this.authService.saveInStorage();
      }
    });
  }

  /**
   * return name initial for profile photo placeholder
   */
  getInitials() {
    if(!this.authService.name) 
      return "";
    
    const initials = this.authService.name.match(/\b\w/g) || [];
    return ((initials.shift() || '') + (initials.pop() || '')).toUpperCase();
  }

  logout() {
    this.authService.logout();
  }

  async leaveRequest() {
    window.history.pushState({ navigationId: window.history.state?.navigationId }, null, window.location.pathname);

    const modal = await this.modalCtrl.create({
      component: LeaveRequestPage,
      cssClass: "popup-modal"
    });
    modal.present();
    modal.onDidDismiss().then(e => {

      if (!e.data || e.data.from != 'native-back-btn') {
        window['history-back-from'] = 'onDidDismiss';
        window.history.back();
      }
    });
  }

  /**
   * Display Popover with Additional Actions (Change Password and Logout)
   * @param e
   */
  async openPopover(e) {
    const popover = await this.popoverCtrl.create({
      component: MenuOptionPage,
      event: e,
      cssClass: 'candidate-option',
      translucent: true,
      showBackdrop: false
    });
    popover.present();

    popover.onDidDismiss().then(e => {

      if (e.data && e.data.changePassword) {
        this.changePassword();
      }
    })
  }

  async changePassword() {
    const modal = await this.modalCtrl.create({
      component: ChangePasswordComponent,
      cssClass: 'modal-change-password'
    });

    await modal.present();
  }

  onCurrencyChange(event) {
    //this.authService.currency_pref = event;
    this.authService.saveInStorage();

    //reload 
    //this.handleRefresh();
    setTimeout(() => {
      window.location.reload();
    }, 200);
  }
}
