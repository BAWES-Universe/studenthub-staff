import { __decorate } from "tslib";
import { Component } from '@angular/core';
let NotFoundPage = class NotFoundPage {
    constructor(modalCtrl, loadingCtrl, router) {
        this.modalCtrl = modalCtrl;
        this.loadingCtrl = loadingCtrl;
        this.router = router;
    }
    ngOnInit() {
    }
    ionViewWillEnter() {
        this.modalCtrl.getTop().then(overlay => {
            if (overlay) {
                overlay.dismiss();
            }
        });
        this.loadingCtrl.getTop().then(overlay => {
            if (overlay) {
                overlay.dismiss();
            }
        });
    }
    /**
     * Open dashboard
     */
    dashboard() {
        this.router.navigate(['/']);
    }
};
NotFoundPage = __decorate([
    Component({
        selector: 'app-not-found',
        templateUrl: './not-found.page.html',
        styleUrls: ['./not-found.page.scss'],
    })
], NotFoundPage);
export { NotFoundPage };
//# sourceMappingURL=not-found.page.js.map