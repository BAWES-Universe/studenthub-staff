import { __decorate } from "tslib";
import { Component, ViewChild } from '@angular/core';
import { IonContent } from '@ionic/angular';
let NoInternetPage = class NoInternetPage {
    constructor(router) {
        this.router = router;
        this.scrollPosition = 0;
    }
    ngOnInit() {
        if (navigator.onLine) {
            return this.refresh();
        }
        this.handler = _ => {
            this.refresh();
        };
        window.addEventListener('online', this.handler);
    }
    ionViewDidEnter() {
        this.content.scrollToPoint(0, this.scrollPosition);
    }
    ionViewWillLeave() {
        this.content.getScrollElement().then(ele => {
            this.scrollPosition = ele.scrollTop;
        });
        window.removeEventListener('online', this.handler);
    }
    /**
     * Open navigation page to check internet connectivity
     */
    refresh() {
        this.router.navigate(['/']);
    }
};
__decorate([
    ViewChild(IonContent, { static: true })
], NoInternetPage.prototype, "content", void 0);
NoInternetPage = __decorate([
    Component({
        selector: 'app-no-internet',
        templateUrl: './no-internet.page.html',
        styleUrls: ['./no-internet.page.scss'],
    })
], NoInternetPage);
export { NoInternetPage };
//# sourceMappingURL=no-internet.page.js.map