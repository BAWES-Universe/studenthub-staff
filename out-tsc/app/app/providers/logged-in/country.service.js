import { __decorate } from "tslib";
import { Injectable } from '@angular/core';
let CountryService = class CountryService {
    constructor(_authhttp) {
        this._authhttp = _authhttp;
        this._countryEndpoint = "/countries";
    }
    /**
     * List of all universities
     * @returns {Observable<any>}
     */
    list(page) {
        let url = this._countryEndpoint + '?page=' + page;
        return this._authhttp.getRaw(url);
    }
    /**
     * detail
     * @returns {Observable<any>}
     */
    view(country_id) {
        return this._authhttp.get(this._countryEndpoint + '/' + country_id);
    }
    /**
     * List of all universities
     * @returns {Observable<any>}
     */
    listAll() {
        let url = this._countryEndpoint + '/all';
        return this._authhttp.get(url);
    }
};
CountryService = __decorate([
    Injectable({
        providedIn: 'root'
    })
], CountryService);
export { CountryService };
//# sourceMappingURL=country.service.js.map