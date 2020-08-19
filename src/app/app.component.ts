import { Component, OnInit, ApplicationRef } from '@angular/core';
import { AlertController, NavController, Platform } from '@ionic/angular';
import { Plugins } from '@capacitor/core';
import { SwUpdate } from '@angular/service-worker';
import { concat, interval } from 'rxjs';
import { first } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
// services
import { EventService } from './providers/event.service';
import { AuthService } from './providers/auth.service';
import { CandidateIdCardService } from './providers/logged-in/candidate.id.card.service';
import { TranslateLabelService } from './providers/translate-label.service';
import {CandidateService} from './providers/logged-in/candidate.service';
import {StatisticService} from './providers/logged-in/statistic.service';


const { SplashScreen } = Plugins;

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent implements OnInit {

  public updatesAvailable = false;
  public expiredIdCount = 0;
  public totalCandidateToReview = null;
  public printIdCount: any = 0;

  constructor(
    public updates: SwUpdate,
    public appRef: ApplicationRef,
    private platform: Platform,
    private eventService: EventService,
    private _alertCtrl: AlertController,
    private navCtrl: NavController,
    public authService: AuthService,
    public translateService: TranslateLabelService,
    public candidateIdCardService: CandidateIdCardService,
    public candidateService: CandidateService,
    public statisticService: StatisticService,
  ) {
    this.initializeApp();
  }

  initializeApp() {

    // this language will be used as a fallback when a translation isn't found in the current language
    this.translateService.setDefaultLang('en');

    this.platform.ready().then(() => {

      if (this.platform.is('hybrid')) {
        SplashScreen.hide();
      }

      this.loadStats();
      this.setServiceWorker();
    });
  }

  async ngOnInit() {

    // Check for network connection
    this.eventService.internetOffline$.subscribe(async () => {
      const alert = await this._alertCtrl.create({
        header: 'No Internet Connection',
        subHeader: 'Sorry, no Internet connectivity detected. Please reconnect and try again.',
        buttons: ['Dismiss']
      });
      alert.present();
      this.navCtrl.navigateRoot(['/no-internet']);
    });

    // On Login Event, set root to Internal app page
    this.eventService.userLogined$.subscribe(userEventData => {
      this.navCtrl.navigateRoot(['/default']);
    });

    this.eventService.error500$.subscribe(userEventData => {
      this.navCtrl.navigateRoot(['/server-error']);
    });

    this.eventService.error404$.subscribe(userEventData => {
      this.navCtrl.navigateRoot(['/not-found']);
    });

    this.eventService.accountAssignmentRemoved$.subscribe(userEventData => {
      this.navCtrl.navigateRoot(['/server-error']);
    });

    // On Logout Event, set root to Login Page
    this.eventService.userLoggedOut$.subscribe((logoutReason) => {
      // Set root to Login Page
      this.navCtrl.navigateRoot(['/login']);

      // Show Message explaining logout reason if there's one set
      if (logoutReason) {
        console.log(logoutReason);
      }
    });

    this.eventService.expiredIdCard$.subscribe((userEventData) => {
      this.updateExpiredIdCount();
    });
    this.eventService.printIdCard$.subscribe((userEventData) => {
      this.printIdCount = userEventData;
    });
    this.eventService.reviewRequired$.subscribe((userEventData) => {
      this.loadStats();
    });
  }

  /**
   * update expired count
   */
  updateExpiredIdCount() {
    this.candidateIdCardService.totalExpiredIds().subscribe(result => {
      this.expiredIdCount = result.total;
    });
  }

  clearCandidateSelection() {
    this.candidateIdCardService.candidates = [];
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

  /**
   * keep checking for service worker update
   */
  setServiceWorker() {

    // service worker watcher
    if (!this.platform.is('capacitor')) {
      if ('serviceWorker' in navigator && environment.serviceWorker && window.location.hostname != 'localhost') {

        navigator.serviceWorker.register('./ngsw-worker.js');

        // Allow the app to stabilize first, before starting polling for updates with `interval()`.
        const appIsStable$ = this.appRef.isStable.pipe(first(isStable => isStable === true));
        const updateInterval$ = interval(60 * 1000); // every minute
        const updateIntervalOnceAppIsStable$ = concat(appIsStable$, updateInterval$);

        updateIntervalOnceAppIsStable$.subscribe(() => {
          this.updates.checkForUpdate().then((e) => {
          });
        });

        this.updates.available.subscribe((e) => {
          this.updatesAvailable = true;
        });

        this.updates.activated.subscribe((e) => {
          this.updatesAvailable = false;
        }, reason => {
          console.error('service worker update activation failed', reason);
        });
      }
    }
  }

  /**
   * When user select refresh on udpate available prompt
   */
  onUpdateAlertRefresh() {

    if (!this.updatesAvailable) {
      return this.updatesAvailable = false;
    }

    try {
      this.updates.activateUpdate().then(() => {
      });
    } catch {
    }

    window.location.reload();
  }

  /**
   * When user select close on udpate available prompt
   */
  onUpdateAlertClose() {
    this.updatesAvailable = false;
  }


  logout() {
    this.authService.logout();
  }

  /**
   * load current data
   */
  async loadStats() {

    this.statisticService.get().subscribe(response => {
        this.eventService.expiredIdCard$.next();
        this.eventService.printIdCard$.next(response.id_need_generated);
        this.totalCandidateToReview = response.candidate_review_required;
      },
      error => {},
      () => {}
    );
  }
}
