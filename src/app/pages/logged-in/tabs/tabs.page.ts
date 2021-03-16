import { Component, Renderer2, ViewChild, OnInit, ViewEncapsulation } from '@angular/core';
import { Platform, IonTabs, ActionSheetController } from '@ionic/angular';
import { Router } from '@angular/router';
// services
import { AuthService } from 'src/app/providers/auth.service';
import { EventService } from 'src/app/providers/event.service';
import { StatisticService } from 'src/app/providers/logged-in/statistic.service';


@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss'],
  encapsulation: ViewEncapsulation.None
})
export class TabsPage implements OnInit {

  @ViewChild('tabRef', { static: true }) tabRef: IonTabs;

  public companyFollowUp: any = 0;

  public totalRequest: any = 0;

  public internvalSubscribe;

  constructor(
    public actionSheetCtrl: ActionSheetController,
    public eventService: EventService,
    public renderer: Renderer2,
    public platform: Platform,
    public router: Router,
    public statisticService: StatisticService,
    public authService: AuthService,
  ) {
  }

  async ngOnInit() {
    const state = window.history.state;

    if (state && state.selectedTab) {
      this.tabRef.select(state.selectedTab).then();
    } 

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
    }, 2 * 1000);//every 2 seconds
  }

  ngOnDestroy() {
    clearInterval(this.internvalSubscribe);
    this.internvalSubscribe = null;
  }

  /**
   * load current data
   */
  async loadStats() {

    this.statisticService.get().subscribe(response => {

      this.companyFollowUp = response.requireFollowup;
      this.totalRequest = response.totalRequests;

      this.eventService.statistics$.next(response);

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
          this.router.navigate(['/candidate-search']);
        }
      }, {
        text: 'Full-timers',
        handler: () => {
          this.router.navigate(['/fulltimer-search']);
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
      this.tabRef.select('tasks'); 
    });
  }
}
