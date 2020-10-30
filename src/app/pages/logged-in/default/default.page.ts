import { Component, OnInit, ViewChild } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Request } from 'src/app/models/request';
// services
import { AuthService } from 'src/app/providers/auth.service';
import { EventService } from 'src/app/providers/event.service';
import { CompanyRequestService } from 'src/app/providers/logged-in/company-request.service';
import { StatisticService } from 'src/app/providers/logged-in/statistic.service';


@Component({
  selector: 'app-default',
  templateUrl: './default.page.html',
  styleUrls: ['./default.page.scss'],
})
export class DefaultPage implements OnInit {

  public borderLimit = false;
  
  public statistics: {
    totalPendingRequests: any;
    totalExpiredCards: any;
    assignedExpiredCivilID: any;
    activeRequests: any;
    requireFollowup: any;
    missingBankInfo: any;
    incompleteAssignedToWork: any;
    profileApprovalRequire: any;
  };

  public loading = false;

  public pendingRequests: Request[] = [];

  public myRequests: Request[] = [];

  public activeRequests: Request[] = [];

  constructor(
    public navCtrl: NavController,
    public authService: AuthService,
    public requestService: CompanyRequestService,
    public statisticService: StatisticService,
    private _events: EventService,
  ) { }

  ngOnInit() {
    this.loadData();
  }

  ionViewDidEnter() {
    this.loadActiveRequests();
    this.loadPendingRequests();
    this.loadMyRequests();
  }

  loadActiveRequests() {
    this.requestService.listActiveRequests().subscribe(data => {
      this.activeRequests = data;
    });
  }

  loadPendingRequests() {
    this.requestService.listPendingRequests().subscribe(data => {
      this.pendingRequests = data;
    });
  }

  loadMyRequests() {
    this.requestService.listMyRequests().subscribe(data => {
      this.myRequests = data;
    });
  }

  /**
   * load current data
   */
  async loadData() {
   
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
    this.borderLimit = (e.detail.scrollTop > 20) ? true : false;
  }

  scrollToActive() {
    let el = document.getElementById('heading-active-request');
    el.scrollIntoView();
  }

  /**
   * scroll to pending request
   */
  scrollToPending() {
    let el = document.getElementById('heading-pending-request');
    el.scrollIntoView();
  }
}
