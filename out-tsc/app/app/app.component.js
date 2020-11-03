import { __awaiter, __decorate } from "tslib";
import { Component } from '@angular/core';
import { Plugins } from '@capacitor/core';
import { concat, interval } from 'rxjs';
import { first } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
const { SplashScreen } = Plugins;
let AppComponent = class AppComponent {
    constructor(updates, appRef, platform, eventService, _alertCtrl, popoverCtrl, navCtrl, modalCtrl, authService, translateService, candidateIdCardService, candidateService, statisticService) {
        this.updates = updates;
        this.appRef = appRef;
        this.platform = platform;
        this.eventService = eventService;
        this._alertCtrl = _alertCtrl;
        this.popoverCtrl = popoverCtrl;
        this.navCtrl = navCtrl;
        this.modalCtrl = modalCtrl;
        this.authService = authService;
        this.translateService = translateService;
        this.candidateIdCardService = candidateIdCardService;
        this.candidateService = candidateService;
        this.statisticService = statisticService;
        this.updatesAvailable = false;
        this.expiredIdCount = 0;
        this.assignedExpiredCivilID = 0;
        this.totalCandidateToReview = null;
        this.assignedIncompleteCandidates = null;
        this.candidateBankInfo = null;
        this.companyFollowUp = 0;
        this.initializeApp();
    }
    initializeApp() {
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
            if (this.platform.is('hybrid')) {
                SplashScreen.hide();
            }
            this.loadStats();
            this.setServiceWorker();
        });
    }
    ngOnInit() {
        return __awaiter(this, void 0, void 0, function* () {
            // Check for network connection
            this.eventService.internetOffline$.subscribe(() => __awaiter(this, void 0, void 0, function* () {
                const alert = yield this._alertCtrl.create({
                    header: 'No Internet Connection',
                    subHeader: 'Sorry, no Internet connectivity detected. Please reconnect and try again.',
                    buttons: ['Dismiss']
                });
                alert.present();
                this.navCtrl.navigateRoot(['/no-internet']);
            }));
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
            this.eventService.expiredIdCard$.subscribe((data = null) => {
                if (!data) {
                    return this.loadStats();
                }
                this.expiredIdCount = data.expiredIdCount;
                this.assignedExpiredCivilID = data.assignedExpiredCivilID;
            });
            this.eventService.reviewRequired$.subscribe(() => {
                this.loadStats();
            });
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
        }
        else {
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
        }
        catch (_a) {
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
    loadStats() {
        return __awaiter(this, void 0, void 0, function* () {
            this.statisticService.get().subscribe(response => {
                this.expiredIdCount = response.totalExpiredCards;
                this.assignedIncompleteCandidates = response.incompleteAssignedToWork;
                this.candidateBankInfo = response.missingBankInfo;
                this.totalCandidateToReview = response.profileApprovalRequire;
                this.companyFollowUp = response.requireFollowup;
                this.assignedExpiredCivilID = response.assignedExpiredCivilID;
            }, error => { }, () => { });
        });
    }
};
AppComponent = __decorate([
    Component({
        selector: 'app-root',
        templateUrl: 'app.component.html',
        styleUrls: ['app.component.scss']
    })
], AppComponent);
export { AppComponent };
//# sourceMappingURL=app.component.js.map