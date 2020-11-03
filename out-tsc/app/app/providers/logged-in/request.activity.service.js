import { __decorate } from "tslib";
import { Injectable } from '@angular/core';
let RequestActivityService = class RequestActivityService {
    constructor(authhttp) {
        this.authhttp = authhttp;
        this.requestEndpoint = '/request-activity/';
    }
    /**
     * List requests activity
     * @returns {Observable<any>}
     */
    list(page = 1, uuid = null) {
        const url = this.requestEndpoint + 'request-activities/' + uuid + '?page=' + page + '&expand=staff';
        return this.authhttp.getRaw(url);
    }
};
RequestActivityService = __decorate([
    Injectable({
        providedIn: 'root'
    })
], RequestActivityService);
export { RequestActivityService };
//# sourceMappingURL=request.activity.service.js.map