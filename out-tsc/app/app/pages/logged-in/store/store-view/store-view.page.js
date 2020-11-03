import { __awaiter, __decorate } from "tslib";
import { Component } from '@angular/core';
//page
import { StoreFormPage } from "../store-form/store-form.page";
import { StoreManagerFormPage } from '../store-manager-form/store-manager-form.page';
let StoreViewPage = class StoreViewPage {
    constructor(navCtrl, modalCtrl, alertCtrl, activatedRoute, aws, storeService, eventService, mallService, authService) {
        this.navCtrl = navCtrl;
        this.modalCtrl = modalCtrl;
        this.alertCtrl = alertCtrl;
        this.activatedRoute = activatedRoute;
        this.aws = aws;
        this.storeService = storeService;
        this.eventService = eventService;
        this.mallService = mallService;
        this.authService = authService;
        this.store_id = null;
        this.loading = false;
        this.updating = false;
    }
    ngOnInit() {
        this.store_id = this.activatedRoute.snapshot.paramMap.get('id');
        const state = window.history.state;
        // if (state['model']) {
        //   this.store = state['model'];
        // } else {
        this.loadData();
        this.loadMall();
        // }
        this.eventService.reloadCandidateHistory$.subscribe(response => {
            this.loadData();
        });
    }
    /**
     * On candidate selected from list
     */
    candidateSelected(candidate) {
        this.navCtrl.navigateForward('candidate-view/' + candidate.candidate_id, {
            state: {
                model: candidate
            }
        });
    }
    /**
     * Loads Form in modal to update
     */
    update() {
        return __awaiter(this, void 0, void 0, function* () {
            window.history.pushState({ navigationId: window.history.state.navigationId }, null, window.location.pathname);
            const modal = yield this.modalCtrl.create({
                component: StoreFormPage,
                componentProps: {
                    model: this.store,
                    brands: this.store.company.brands,
                    malls: this.malls
                }
            });
            modal.onDidDismiss().then(e => {
                if (!e.data || e.data.from != 'native-back-btn') {
                    window['history-back-from'] = 'onDidDismiss';
                    window.history.back();
                }
                if (e.data && e.data.refresh) {
                    this.loadData();
                }
            });
            return yield modal.present();
        });
    }
    selectStoreManager() {
        return __awaiter(this, void 0, void 0, function* () {
            window.history.pushState({ navigationId: window.history.state.navigationId }, null, window.location.pathname);
            const modal = yield this.modalCtrl.create({
                component: StoreManagerFormPage,
                componentProps: {
                    company: this.store.company
                }
            });
            modal.onDidDismiss().then(e => {
                if (!e.data || e.data.from != 'native-back-btn') {
                    window['history-back-from'] = 'onDidDismiss';
                    window.history.back();
                }
                if (e.data && e.data.refresh) {
                    this.updateStoreManager(e.data.storeManager);
                }
            });
            return yield modal.present();
        });
    }
    /**
     * update store manager
     * @param storeManager
     */
    updateStoreManager(storeManager) {
        this.updating = true;
        this.storeService.updateStoreManager(this.store, storeManager).subscribe((data) => __awaiter(this, void 0, void 0, function* () {
            this.updating = false;
            if (data.operation == 'success') {
                this.store.storeManager = storeManager;
                this.store.store_manager_uuid = storeManager.contact_uuid;
            }
            if (data.operation == 'error') {
                const alert = yield this.alertCtrl.create({
                    header: 'Selection Error!',
                    subHeader: this.authService.errorMessage(data.message),
                    buttons: ['Okay']
                });
                alert.present();
            }
        }), () => {
            this.updating = false;
        });
    }
    loadData() {
        this.loading = true;
        this.storeService.detail(this.store_id).subscribe(response => {
            this.loading = false;
            this.store = response;
        });
    }
    /**
     * @param $event
     * @param candidate
     */
    loadLogo($event, candidate) {
        candidate.candidate_personal_photo = null;
    }
    /**
     * load all mails
     */
    loadMall() {
        return __awaiter(this, void 0, void 0, function* () {
            this.mallService.fullList().subscribe(response => {
                this.malls = response;
            });
        });
    }
};
StoreViewPage = __decorate([
    Component({
        selector: 'app-store-view',
        templateUrl: './store-view.page.html',
        styleUrls: ['./store-view.page.scss'],
    })
], StoreViewPage);
export { StoreViewPage };
//# sourceMappingURL=store-view.page.js.map