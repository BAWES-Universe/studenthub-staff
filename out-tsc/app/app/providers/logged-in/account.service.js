import { __decorate } from "tslib";
import { Injectable } from '@angular/core';
let AccountService = class AccountService {
    constructor(_authhttp) {
        this._authhttp = _authhttp;
        this._accountEndpoint = "/account";
    }
    /**
     * Update password
     * @returns {Observable<any>}
     */
    updatePassword(params) {
        return this._authhttp.post(this._accountEndpoint + '/update-password', params);
    }
};
AccountService = __decorate([
    Injectable({
        providedIn: 'root'
    })
], AccountService);
export { AccountService };
//# sourceMappingURL=account.service.js.map