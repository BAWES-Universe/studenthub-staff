import { __awaiter, __decorate } from "tslib";
import { Component } from '@angular/core';
import { Mall } from 'src/app/models/mall';
import { MallFormPage } from '../mall-form/mall-form.page';
let MallListPage = class MallListPage {
    constructor(mallService, navCtrl, modalCtrl, alertCtrl, platform, toastCtrl) {
        this.mallService = mallService;
        this.navCtrl = navCtrl;
        this.modalCtrl = modalCtrl;
        this.alertCtrl = alertCtrl;
        this.platform = platform;
        this.toastCtrl = toastCtrl;
        this.pageCount = 0;
        this.currentPage = 1;
        this.loading = false;
        this.loadMore = false;
        this.deleting = false;
        this.malls = [];
    }
    ngOnInit() {
        this.loadData(this.currentPage);
    }
    /**
     * load store list
     * @param page
     * @param loading
     */
    loadData(page, loading = true) {
        return __awaiter(this, void 0, void 0, function* () {
            this.loading = loading;
            this.mallService.list(this.currentPage).subscribe(response => {
                this.pageCount = parseInt(response.headers.get('X-Pagination-Page-Count'));
                this.currentPage = parseInt(response.headers.get('X-Pagination-Current-Page'));
                this.malls = response.body;
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
        this.navCtrl.navigateForward('mall-view/' + model.mall_uuid, {
            state: {
                model
            }
        });
    }
    /**
     * Loads the create page
     */
    create($event, mall = new Mall()) {
        return __awaiter(this, void 0, void 0, function* () {
            $event.preventDefault();
            $event.stopPropagation();
            window.history.pushState({ navigationId: window.history.state.navigationId }, null, window.location.pathname);
            const modal = yield this.modalCtrl.create({
                component: MallFormPage,
                componentProps: {
                    model: mall
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
    delete(event, mall) {
        return __awaiter(this, void 0, void 0, function* () {
            event.preventDefault();
            event.stopPropagation();
            const confirm = yield this.alertCtrl.create({
                header: 'Delete Mall?',
                message: 'Are you sure you want to delete this Mall?',
                buttons: [
                    {
                        text: 'Yes',
                        handler: () => {
                            this.loading = true;
                            this.mallService.delete(mall).subscribe((jsonResp) => __awaiter(this, void 0, void 0, function* () {
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
                            console.log('no');
                        }
                    }
                ]
            });
            confirm.present();
        });
    }
    /**
     * load more
     * @param event
     */
    doInfinite(event) {
        this.loadMore = true;
        this.currentPage++;
        this.mallService.list(this.currentPage).subscribe(response => {
            this.pageCount = parseInt(response.headers.get('X-Pagination-Page-Count'));
            this.currentPage = parseInt(response.headers.get('X-Pagination-Current-Page'));
            this.malls = this.malls.concat(response.body);
        }, error => {
        }, () => {
            this.loadMore = false;
            event.target.complete();
        });
    }
};
MallListPage = __decorate([
    Component({
        selector: 'app-mall-list',
        templateUrl: './mall-list.page.html',
        styleUrls: ['./mall-list.page.scss'],
    })
], MallListPage);
export { MallListPage };
//# sourceMappingURL=mall-list.page.js.map