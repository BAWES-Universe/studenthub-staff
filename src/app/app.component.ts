import { Component, OnInit, NgZone, ApplicationRef } from '@angular/core';
import {
  AlertController,
  NavController,
  Platform,
  PopoverController,
  ModalController,
  ToastController
} from '@ionic/angular';
import { SwUpdate, VersionReadyEvent } from '@angular/service-worker';
import { concat, interval } from 'rxjs';
import { filter, first, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { DOCUMENT } from '@angular/common';
import { App, URLOpenListenerEvent } from '@capacitor/app';
import { SplashScreen } from '@capacitor/splash-screen';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage-angular';
// services
import { EventService } from './providers/event.service';
import { AuthService } from './providers/auth.service';
import { TranslateLabelService } from './providers/translate-label.service';
import {StoryService} from './providers/logged-in/story.service';
import {CompanyRequestService} from './providers/logged-in/company-request.service';
import { AuthService as Auth0Service } from '@auth0/auth0-angular';
import { StorageService } from './providers/storage.service';


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent implements OnInit {

  public updatesAvailable = false;

  constructor(
    public router: Router,
    public updates: SwUpdate,
    public appRef: ApplicationRef,
    private platform: Platform,
    private eventService: EventService,
    private _alertCtrl: AlertController,
    public popoverCtrl: PopoverController,
    private navCtrl: NavController,
    public modalCtrl: ModalController,
    public authService: AuthService,
    public storyService: StoryService,
    public requestService: CompanyRequestService,
    public translateService: TranslateLabelService,
    public toastCtrl: ToastController,
    public auth: Auth0Service,
    public storage: Storage,
    public storageService: StorageService,
    public zone: NgZone,
  ) {
    this.initializeApp();
  }

  async initializeApp() {
    if(!this.storageService._storage)
      this.storageService._storage = await this.storage.create();

    App.addListener('appUrlOpen', (event) => {
      this.zone.run(() => {
          // Example url: https://beerswift.app/tabs/tab2
          // slug = /tabs/tab2

          // If no match, do nothing - let regular routing
          // logic take over

          //if (event.url?.startsWith(callbackUri)) {
            // If the URL is an authentication callback URL..
            if (
              event.url.includes('state=') &&
              (event.url.includes('error=') || event.url.includes('code='))
            ) {
              // Call handleRedirectCallback and close the browser
              this.auth
                .handleRedirectCallback(event.url)
                //.pipe(mergeMap(() => Browser.close()))
                .subscribe((result) => {
                });
            } else {
              const slug = event.url.split(".co").pop();

              if (slug) {
                //this.navCtrl.
                this.router.navigateByUrl(slug);
              }

              //Browser.close();
            }
          //}
      });
    });

    // this language will be used as a fallback when a translation isn't found in the current language
    this.translateService.setDefaultLang('en');

    window.onpopstate = e => {

      if (window['history-back-from'] == 'onDidDismiss') {
        window['history-back-from'] = null;
        return false;
      }

      this.popoverCtrl.getTop().then(overlay => {

        if (overlay) {
          this.popoverCtrl.dismiss({
            'from': 'native-back-btn'
          });
        }

        this.modalCtrl.getTop().then(overlay => {

          if (overlay) {
            this.modalCtrl.dismiss({
              'from': 'native-back-btn'
            });
          }
        });
      });
    };

    this.platform.ready().then(() => {

      /**
       * todo: need to test in mobile app
       * when user comming back from auth0
       */
      this.auth.isAuthenticated$.subscribe(isAuthenticated => {

        if(!isAuthenticated || this.authService.isLogged) return null;

        //this.auth.idTokenClaims$.subscribe(r => {
        this.auth.getAccessTokenSilently().subscribe(r => {
          this.authService.useTokenForAuth(r).then();
        });
      });

      if (this.platform.is('hybrid')) {
        SplashScreen.hide();
      }

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

    this.eventService.errorStorage$.subscribe(() => {
      this.navCtrl.navigateRoot(['app-error']);
    });

    // On Login Event, set root to Internal app page
    this.eventService.userLogined$.subscribe((userEventData:any) => {

      if (userEventData && userEventData?.redirect == true) {
        this.navCtrl.navigateRoot(['/view/tasks']);
      }
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

      this.auth.isAuthenticated$.subscribe(isAuthenticated => {
        if(isAuthenticated) {
          this.auth.logout({ returnTo: document.location.origin });
        }
      })

      // Show Message explaining logout reason if there's one set
      if (logoutReason) {
        console.log(logoutReason);
      }
    });

    this.eventService.changeStoryStatus$.subscribe(async ({status, story}) => {
      await this.changeStoryStatus(status, story);
    });

    this.eventService.changeRequestStatus$.subscribe(async ({status, request}) => {
      await this.changeRequestStatus(status, request);
    });
    
    this.eventService.createStory$.subscribe(async ({request}) => {
      await this.createStory(request);
    });
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

    if (
      !this.platform.is('capacitor') && 'serviceWorker' in navigator &&
      environment.serviceWorker && window.location.hostname != 'localhost'
    ) {
      // Allow the app to stabilize first, before starting polling for updates with `interval()`.
      const appIsStable$ = this.appRef.isStable.pipe(first(isStable => isStable === true));
      const updateInterval$ = interval(24 * 60 * 60 * 1000);// 24 hour
      const updateIntervalOnceAppIsStable$ = concat(appIsStable$, updateInterval$);

      updateIntervalOnceAppIsStable$.subscribe(() => {
        this.updates.checkForUpdate().then((e) => {
          console.log('checking for update');
        });
      });
      
      const updatesAvailable = this.updates.versionUpdates.pipe(
        filter((evt): evt is VersionReadyEvent => {
          return evt.type === 'VERSION_READY';
        }),
        map(evt => ({
          type: 'UPDATE_AVAILABLE',
          current: evt.currentVersion,
          available: evt.latestVersion,
        })));
 
      updatesAvailable.subscribe(() => {
        this.updatesAvailable = true;
      });
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

  /**
   * @param status
   * @param story
   */
  async changeStoryStatus(status, story) {

    this.storyService.changeStoryStatus(status, story.story_uuid).subscribe(async response => {

      // On Success
      if (response.operation == 'success') {

        if (status == 0 || status == 3) {
          this.authService.story = null;
          this.authService.saveInStorage();
        }

        this.loadStoryData(story);
      }

      if (response.operation == 'error') {
        const prompt = await this._alertCtrl.create({
          message: this.authService.errorMessage(response.message),
          buttons: ['Okay']
        });
        prompt.present();

        /// in case if its alrady working
        if (response.data) {
          this.navCtrl.navigateForward(['story-view', response.data.story_uuid]);
        }
      }
    }, () => {

    });
  }

  loadStoryData(story) {
    this.storyService.detail(story.story_uuid, '?expand=staff,storyActivities,storyActivities.staff,request,request.contact,request.staffs,request.company').subscribe(res => {
      if (story.story_status == 1 && story.staff_id == this.authService.staff_id &&
        ['cancelled', 'delivered'].indexOf(res.request.request_status) == -1)
      {
        this.authService.story = res;
        this.authService.saveInStorage();
      }

      this.eventService.storyStatusUpdated$.next({
        story: res
      });
    });
  }

  async changeRequestStatus(status, request) {
    this.requestService.statusUpdate(request).subscribe(async response => {
      // On Success
      if (response.operation == 'success') {
        this.loadRequestData(request);
      }

      if (response.operation == 'error') {
        const prompt = await this._alertCtrl.create({
          message: this.authService.errorMessage(response.message),
          buttons: ['Okay']
        });
        prompt.present();
      }
    }, () => {

    });
  }

  loadRequestData(request) {
    this.requestService.view(request.request_uuid).subscribe(data => {
      this.eventService.companyRequestUpdate$.next({
        request: data
      });
    }, () => {
    }, () => {
    });
  }

  async createStory(request) {
    const alert = await this._alertCtrl.create({
      header: 'Provide number of employee for this story',
      inputs: [
        {
          placeholder: 'number of employers',
          name: 'employee',
          type: 'number',
          min: 1,
          max: 15,
        }
      ],
      buttons: [
        {
          text: 'Cancel',
        },
        {
          text: 'Submit',
          handler: async (data) => {
            if (!data.employee) {
              this.toastCtrl.create({
                message: this.authService.errorMessage('Please provide employee'),
                duration: 3000
              }).then(toast => {
                toast.present();
              });
              return false;
            }

            this.createStoryForRequest(data.employee, request);
          }
        }
      ]
    });
    alert.present();
  }

  /**
   * @param employee
   * @param request
   */
  async createStoryForRequest(employee, request: any) {

    const params = {
      request_uuid: request.request_uuid,
      employee
    };

    this.storyService.create(params).subscribe(async response => {

        // On Success
        if (response.operation == 'success') {
          this.loadRequestData(request);
        }

        // On Failure
        if (response.operation == 'error') {
          const prompt = await this._alertCtrl.create({
            message: this.authService.errorMessage(response.message),
            buttons: ['Okay']
          });
          prompt.present();
        }
      }, () => {
      },
      () => {
      }
    );
  }
}
