import { __decorate } from "tslib";
import { Component } from '@angular/core';
let ServerErrorPage = class ServerErrorPage {
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
        this.router.navigate(['/default']);
    }
};
ServerErrorPage = __decorate([
    Component({
        selector: 'app-server-error',
        templateUrl: './server-error.page.html',
        styleUrls: ['./server-error.page.scss'],
    })
], ServerErrorPage);
export { ServerErrorPage };
//# sourceMappingURL=server-error.page.js.map