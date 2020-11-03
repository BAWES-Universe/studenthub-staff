import { __awaiter, __decorate } from "tslib";
import { Component } from '@angular/core';
import { MallFormPage } from "../mall-form/mall-form.page";
let MallViewPage = class MallViewPage {
    constructor(activatedRoute, mallService, modalCtrl, navCtrl) {
        this.activatedRoute = activatedRoute;
        this.mallService = mallService;
        this.modalCtrl = modalCtrl;
        this.navCtrl = navCtrl;
        this.loading = false;
    }
    ngOnInit() {
        this.mallUUID = this.activatedRoute.snapshot.paramMap.get('id');
        this.loadData();
    }
    loadData() {
        this.loading = true;
        this.mallService.view(this.mallUUID).subscribe(res => {
            this.loading = false;
            this.mall = res;
        });
    }
    /**
     * Loads Form in modal to update
     */
    update() {
        return __awaiter(this, void 0, void 0, function* () {
            window.history.pushState({ navigationId: window.history.state.navigationId }, null, window.location.pathname);
            const modal = yield this.modalCtrl.create({
                component: MallFormPage,
                componentProps: {
                    model: this.mall,
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
    /**
     * On candidate selected from list
     */
    rowSelected(store) {
        this.navCtrl.navigateForward('store-view/' + store.store_id);
    }
};
MallViewPage = __decorate([
    Component({
        selector: 'app-mall-view',
        templateUrl: './mall-view.page.html',
        styleUrls: ['./mall-view.page.scss'],
    })
], MallViewPage);
export { MallViewPage };
//# sourceMappingURL=mall-view.page.js.map