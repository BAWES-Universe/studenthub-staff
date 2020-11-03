import { __decorate } from "tslib";
import { Injectable } from '@angular/core';
let StatisticService = class StatisticService {
    constructor(_authhttp) {
        this._authhttp = _authhttp;
        this._endpoint = "/statistics";
    }
    /**
     * Return statistics
     * @returns {Observable<any>}
     */
    get() {
        let url = this._endpoint;
        return this._authhttp.get(url);
    }
};
StatisticService = __decorate([
    Injectable({
        providedIn: 'root'
    })
], StatisticService);
export { StatisticService };
//# sourceMappingURL=statistic.service.js.map