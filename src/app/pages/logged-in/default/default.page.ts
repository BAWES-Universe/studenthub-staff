import { Component, OnInit, ViewChild } from '@angular/core';
import { NavController } from '@ionic/angular';
// services
import { AuthService } from 'src/app/providers/auth.service';
import { EventService } from 'src/app/providers/event.service';
import { StatisticService } from 'src/app/providers/logged-in/statistic.service';


@Component({
  selector: 'app-default',
  templateUrl: './default.page.html',
  styleUrls: ['./default.page.scss'],
})
export class DefaultPage implements OnInit {

  public borderLimit = false;

  public statistics: {
    id_need_generated: any;
    totalExpiredCards: any;
    assignedExpiredCivilID: any;
    activeRequests: any;
    requireFollowup: any;
    last40daysNoRequest: any;
    missingBankInfo: any;
    incompleteAssignedToWork: any;
    profileApprovalRequire: any;
    assignedIdleCandidates: any;
    companyMoreThen40DaysWithoutPayment: any;
  };

  public loading = false;

  constructor(
    public navCtrl: NavController,
    public authService: AuthService,
    public statisticService: StatisticService,
    private _events: EventService,
  ) { }

  ngOnInit() {
    this._events.statistics$.subscribe((response: {
        id_need_generated: any;
        totalExpiredCards: any;
        assignedExpiredCivilID: any;
        activeRequests: any;
        requireFollowup: any;
        last40daysNoRequest: any;
        missingBankInfo: any;
        incompleteAssignedToWork: any;
        profileApprovalRequire: any;
        assignedIdleCandidates: any;
        companyMoreThen40DaysWithoutPayment: any;
    }) => {
      this.statistics = response;
    });
  }

  /**
   * load current data
   */
  async loadData(loading = true) {

    if(loading)
      this.loading = true;

    this.statisticService.get().subscribe(response => {

      this.statistics = response;

      this._events.expiredIdCard$.next({
        assignedExpiredCivilID: response.assignedExpiredCivilID,
        expiredIdCount: response.totalExpiredCards
      });

      this._events.reviewRequired$.next(this.statistics.profileApprovalRequire);
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

  scrollToActive() {
    this.navCtrl.navigateForward('/view/company-request-dashboard');
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

  logout() {
    this.authService.logout();
  }
}
