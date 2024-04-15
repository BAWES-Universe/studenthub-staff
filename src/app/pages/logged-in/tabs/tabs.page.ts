import {Component, Renderer2, ViewChild, OnInit, ViewEncapsulation, OnDestroy} from '@angular/core';
import { Platform, IonTabs, ActionSheetController, IonTabButton } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
// services
import { AuthService } from 'src/app/providers/auth.service';
import { EventService } from 'src/app/providers/event.service';
import { StatisticService } from 'src/app/providers/logged-in/statistic.service';
import {AccountService} from "../../../providers/logged-in/account.service";


@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss'],
  encapsulation: ViewEncapsulation.None
})
export class TabsPage implements OnInit, OnDestroy {

  @ViewChild('tabRef', { static: true }) tabRef: IonTabs;

  @ViewChild('browserTaskRef', { static: true }) browserTaskRef: IonTabButton;

  @ViewChild('mobileTaskRef', { static: true }) mobileTaskRef: IonTabButton;

  public companyFollowUp: any = 0;

  public companyUnderReview = 0;
  
  public totalRequest: any = 0;

  public internvalSubscribe;

  public statLoaded;

  constructor(
    public actionSheetCtrl: ActionSheetController,
    public eventService: EventService,
    public renderer: Renderer2,
    public platform: Platform,
    public router: Router,
    public route: ActivatedRoute,
    public statisticService: StatisticService,
    public authService: AuthService,
    public accountService: AccountService,
  ) { 
  }

  async ngOnInit() {
    const state = window.history.state;

    if (state && state.selectedTab) {
      this.tabRef.select(state.selectedTab).then();
    }
    //
    // // in case story not found.
    // if (!this.authService.story) {
    //this.getAccountInfo();
    // }

    // add event to scroll content to top on tab selection

    const tabBtns = Array.from(document.querySelectorAll('.tab-button'));

    Array.from(tabBtns).forEach(e => {
      e.addEventListener('click', _ => {
        this.tabSelected();
      });
    });

    this.eventSubscriptions();

    this.loadStats();

    this.internvalSubscribe = setInterval(() => {
      this.loadStats();
    }, 60 * 1000);//every min 
  }

  ngOnDestroy() {
    clearInterval(this.internvalSubscribe);
    this.internvalSubscribe = null;
  }

  ionViewWillEnter() {
    this.getAccountInfo();
  }

  /**
   * load current data
   */
  async loadStats() {

    this.statisticService.get(false).subscribe(response => {

      //skip for first time

      if(this.statLoaded && this.totalRequest != response.totalRequests) {
        this.eventService.requestCountUpdated$.next({});
      }

      this.statLoaded = true;

      this.companyFollowUp = response.requireFollowup;
      this.totalRequest = response.totalRequests;
      this.companyUnderReview = response.companyUnderReview;
 
      this.eventService.statistics = response;

      this.eventService.expiredIdCard$.next({
        assignedExpiredCivilID: response.assignedExpiredCivilID,
        expiredIdCount: response.totalExpiredCards
      });

      this.eventService.reviewRequired$.next(response.profileApprovalRequire);

      /*
      this.expiredIdCount = response.totalExpiredCards;

      this.assignedIncompleteCandidates = response.incompleteAssignedToWork;
      this.candidateBankInfo = response.missingBankInfo;
      this.totalCandidateToReview = response.profileApprovalRequire;
      this.assignedExpiredCivilID = response.assignedExpiredCivilID;
      this.assignedIdleCandidates = response.assignedIdleCandidates;

      this.companyMoreThen40DaysWithoutPayment = response.companyMoreThen40DaysWithoutPayment;*/
    },
      error => { },
      () => { });
  }

  logout() {
    this.authService.logout();
  }

  async showCandidateActions() {

    const actionSheet = await this.actionSheetCtrl.create({
      //header: 'Candidates',
      buttons: [{
        text: 'Part-timers',
        handler: () => {
          return this.router.navigate(['/candidate-search']);
        }
      }, {
        text: 'Full-timers',
        handler: () => {
          return this.router.navigate(['/fulltimer-search']);
        }
      }]
    });
    actionSheet.present();
  }

  /**
   * Scroll to top on tab selection
   */
  tabSelected() {

    const content = document.querySelector('.show-tab .scroll-content');

    if (content) {
      content.scrollTop = 0;
    }
  }

  async eventSubscriptions() {

    this.eventService.userLoggedOut$.subscribe(() => {
      /*if(this.platform.is('mobile')) {
        this.tabRef.select(this.mobileTaskRef.tab.)
      }
      this.tabRef.select('tasks').then();
      */
    });
  }

  async getAccountInfo() {
    this.accountService.accountInfo().subscribe( res => {
      if (res && res.story) {
        this.authService.story = res.story;
        this.authService.saveInStorage();
      }
    });
  }
}
