import { __awaiter, __decorate } from "tslib";
import { Component } from '@angular/core';
//pages
import { StoreFormPage } from '../store-form/store-form.page';
import { StoreManagerFormPage } from '../store-manager-form/store-manager-form.page';
let StoreListPage = class StoreListPage {
    constructor(platform, activatedRoute, navCtrl, storeService, companyService, modalCtrl, alertCtrl, toastCtrl, mallService, authService, eventService) {
        this.platform = platform;
        this.activatedRoute = activatedRoute;
        this.navCtrl = navCtrl;
        this.storeService = storeService;
        this.companyService = companyService;
        this.modalCtrl = modalCtrl;
        this.alertCtrl = alertCtrl;
        this.toastCtrl = toastCtrl;
        this.mallService = mallService;
        this.authService = authService;
        this.eventService = eventService;
        this.pageCount = 0;
        this.currentPage = 1;
        this.loading = false;
        this.deleting = false;
        this.updating = false;
    }
    ngOnInit() {
        this.company_id = this.activatedRoute.snapshot.paramMap.get('id');
        this.loadData(this.currentPage);
        this.loadCompany();
        this.loadMall();
        this.eventService.reloadCandidateHistory$.subscribe(response => {
            this.loadData(this.currentPage);
            this.loadCompany();
        });
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
    /**
     * view detail
     */
    loadCompany() {
        this.companyService.companyDetail(this.company_id).subscribe(response => {
            this.company = response;
        });
    }
    /**
     * Make date readable by Safari
     * @param date
     */
    toDate(date) {
        if (date) {
            return new Date(date.replace(/-/g, '/'));
        }
    }
    /**
     * load store list
     * @param page
     */
    loadData(page) {
        return __awaiter(this, void 0, void 0, function* () {
            // Load list of ALL stores
            this.loading = true;
            this.storeService.getStoresBelongingToCompany(this.company_id, this.currentPage).subscribe(response => {
                this.pageCount = parseInt(response.headers.get('X-Pagination-Page-Count'));
                this.currentPage = parseInt(response.headers.get('X-Pagination-Current-Page'));
                this.stores = response.body;
            }, error => {
            }, () => {
                this.loading = false;
            });
        });
    }
    /**
     * When its selected
     */
    rowSelected(model) {
        // Load Detail Page
        this.navCtrl.navigateForward('store-view/' + model.store_id, {
            state: {
                model
            }
        });
    }
    selectStoreManager(event, store) {
        return __awaiter(this, void 0, void 0, function* () {
            window.history.pushState({ navigationId: window.history.state.navigationId }, null, window.location.pathname);
            event.preventDefault();
            event.stopPropagation();
            const modal = yield this.modalCtrl.create({
                component: StoreManagerFormPage,
                componentProps: {
                    company: this.company
                }
            });
            modal.onDidDismiss().then(e => {
                if (!e.data || e.data.from != 'native-back-btn') {
                    window['history-back-from'] = 'onDidDismiss';
                    window.history.back();
                }
                if (e.data && e.data.refresh) {
                    this.updateStoreManager(store, e.data.storeManager);
                }
            });
            return yield modal.present();
        });
    }
    /**
     * update store manager
     * @param store
     * @param storeManager
     */
    updateStoreManager(store, storeManager) {
        this.updating = true;
        this.storeService.updateStoreManager(store, storeManager).subscribe((data) => __awaiter(this, void 0, void 0, function* () {
            this.updating = false;
            if (data.operation == 'success') {
                store.storeManager = storeManager;
                store.store_manager_uuid = storeManager.contact_uuid;
            }
            if (data.operation == 'error') {
                const alert = yield this.alertCtrl.create({
                    header: 'Deletion Error!',
                    subHeader: data.message,
                    buttons: ['Okay']
                });
                alert.present();
            }
        }), () => {
            this.updating = false;
        });
    }
    /**
     * Loads the create page
     */
    create() {
        return __awaiter(this, void 0, void 0, function* () {
            window.history.pushState({ navigationId: window.history.state.navigationId }, null, window.location.pathname);
            const modal = yield this.modalCtrl.create({
                component: StoreFormPage,
                componentProps: {
                    company_id: this.company_id,
                    company: this.company,
                    brands: this.company.brands,
                    malls: this.malls
                }
            });
            modal.onDidDismiss().then(e => {
                if (!e.data || e.data.from != 'native-back-btn') {
                    window['history-back-from'] = 'onDidDismiss';
                    window.history.back();
                }
                if (e.data && e.data.refresh) {
                    this.loadData(this.currentPage);
                }
            });
            return yield modal.present();
        });
    }
    /**
     * Delete the provided model
     */
    delete(event, store) {
        return __awaiter(this, void 0, void 0, function* () {
            event.preventDefault();
            event.stopPropagation();
            const confirm = yield this.alertCtrl.create({
                header: 'Delete Store?',
                message: 'Are you sure you want to delete this Store?',
                buttons: [
                    {
                        text: 'Yes',
                        handler: () => {
                            this.loading = true;
                            this.storeService.delete(store).subscribe((jsonResp) => __awaiter(this, void 0, void 0, function* () {
                                this.loading = false;
                                if (jsonResp.operation == 'error') {
                                    const alert = yield this.alertCtrl.create({
                                        header: 'Deletion Error!',
                                        subHeader: jsonResp.message,
                                        buttons: ['OK']
                                    });
                                    alert.present();
                                }
                                if (jsonResp.operation == 'success') {
                                    const toast = yield this.toastCtrl.create({
                                        message: jsonResp.message,
                                        duration: 3000
                                    });
                                    toast.present();
                                }
                                this.loadData(this.currentPage);
                            }));
                        }
                    },
                    {
                        text: 'No',
                        handler: () => {
                            // this.loadData(this.currentPage);
                            // loader.dismiss();
                            console.log('no');
                        }
                    }
                ]
            });
            confirm.present();
        });
    }
    doInfinite(event) {
        this.loading = true;
        this.currentPage++;
        this.storeService.getStoresBelongingToCompany(this.company_id, this.currentPage).subscribe(response => {
            this.pageCount = parseInt(response.headers.get('X-Pagination-Page-Count'));
            this.currentPage = parseInt(response.headers.get('X-Pagination-Current-Page'));
            this.stores = this.stores.concat(response.body);
        }, error => {
        }, () => {
            this.loading = false;
            event.target.complete();
        });
    }
};
StoreListPage = __decorate([
    Component({
        selector: 'app-store-list',
        templateUrl: './store-list.page.html',
        styleUrls: ['./store-list.page.scss'],
    })
], StoreListPage);
export { StoreListPage };
//# sourceMappingURL=store-list.page.js.map