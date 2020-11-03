import { __decorate } from "tslib";
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
let EventService = class EventService {
    constructor() {
        this.setOneSignal$ = new Subject();
        this.profileUpdated$ = new Subject();
        this.error404$ = new Subject();
        this.error500$ = new Subject();
        this.userLogined$ = new Subject();
        this.pageSelected$ = new Subject();
        this.internetOffline$ = new Subject();
        this.internetOnline$ = new Subject();
        this.userLoggedOut$ = new Subject();
        this.accountAssignmentRemoved$ = new Subject();
        this.reloadCandidateHistory$ = new Subject();
        this.reloadCandiate$ = new Subject();
        this.filterCollapse$ = new Subject();
        this.expiredIdCard$ = new Subject();
        this.reviewRequired$ = new Subject();
        this.companyRequestUpdate$ = new Subject();
    }
};
EventService = __decorate([
    Injectable({
        providedIn: 'root'
    })
], EventService);
export { EventService };
//# sourceMappingURL=event.service.js.map