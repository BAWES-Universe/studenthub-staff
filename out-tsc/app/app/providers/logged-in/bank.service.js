import { __decorate } from "tslib";
import { Injectable } from '@angular/core';
let BankService = class BankService {
    constructor(_authhttp) {
        this._authhttp = _authhttp;
        this._bankEndpoint = '/banks';
    }
    /**
     * List of all banks without pagination
     * @returns {Observable<any>}
     */
    listAll() {
        return this._authhttp.get(this._bankEndpoint + '/all');
    }
};
BankService = __decorate([
    Injectable({
        providedIn: 'root'
    })
], BankService);
export { BankService };
//# sourceMappingURL=bank.service.js.map