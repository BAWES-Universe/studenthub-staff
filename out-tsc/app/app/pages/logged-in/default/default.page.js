import { __awaiter, __decorate } from "tslib";
import { Component } from '@angular/core';
let DefaultPage = class DefaultPage {
    constructor(navCtrl, authService, requestService, statisticService, _events) {
        this.navCtrl = navCtrl;
        this.authService = authService;
        this.requestService = requestService;
        this.statisticService = statisticService;
        this._events = _events;
        this.borderLimit = false;
        this.loading = false;
        this.pendingRequests = [];
        this.myRequests = [];
        this.activeRequests = [];
    }
    ngOnInit() {
        this.loadData();
    }
    ionViewDidEnter() {
        this.loadActiveRequests();
        this.loadPendingRequests();
        this.loadMyRequests();
    }
    loadActiveRequests() {
        this.requestService.listActiveRequests().subscribe(data => {
            this.activeRequests = data;
        });
    }
    loadPendingRequests() {
        this.requestService.listPendingRequests().subscribe(data => {
            this.pendingRequests = data;
        });
    }
    loadMyRequests() {
        this.requestService.listMyRequests().subscribe(data => {
            this.myRequests = data;
        });
    }
    /**
     * load current data
     */
    loadData() {
        return __awaiter(this, void 0, void 0, function* () {
            this.loading = true;
            this.statisticService.get().subscribe(response => {
                this.statistics = response;
                this._events.expiredIdCard$.next({
                    assignedExpiredCivilID: response.assignedExpiredCivilID,
                    expiredIdCount: response.totalExpiredCards
                });
                this._events.reviewRequired$.next(this.statistics.profileApprovalRequire);
            }, error => { }, () => { this.loading = false; });
        });
    }
    /**
     * show expired ids page
     */
    showExpiredIDs() {
        this.navCtrl.navigateForward('expired-id');
    }
    /**
     * show candidate which required to generate id
     */
    showCandidatesRequireNewID() {
        this.navCtrl.navigateForward('generate-id');
    }
    /**
     * show assigned candidate page
     */
    showAssignedCandidates() {
        this.navCtrl.navigateForward('candidate-list/assigned');
    }
    /**
     * show not assigned candidate page
     */
    showNotAssignedCandidates() {
        this.navCtrl.navigateForward('candidate-list/not-assigned');
    }
    logScrolling(e) {
        this.borderLimit = (e.detail.scrollTop > 20) ? true : false;
    }
    scrollToActive() {
        let el = document.getElementById('heading-active-request');
        el.scrollIntoView();
    }
    /**
     * scroll to pending request
     */
    scrollToPending() {
        let el = document.getElementById('heading-pending-request');
        el.scrollIntoView();
    }
};
DefaultPage = __decorate([
    Component({
        selector: 'app-default',
        templateUrl: './default.page.html',
        styleUrls: ['./default.page.scss'],
    })
], DefaultPage);
export { DefaultPage };
//# sourceMappingURL=default.page.js.map