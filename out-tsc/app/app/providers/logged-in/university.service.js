import { __decorate } from "tslib";
import { Injectable } from '@angular/core';
let UniversityService = class UniversityService {
    constructor(_authhttp) {
        this._authhttp = _authhttp;
        this._universityEndpoint = "/universities";
    }
    /**
     * List of all universities
     * @returns {Observable<any>}
     */
    list(page) {
        let url = this._universityEndpoint + '?page=' + page;
        return this._authhttp.getRaw(url);
    }
    /**
     * List of all universities
     * @returns {Observable<any>}
     */
    view(university_id) {
        return this._authhttp.get(this._universityEndpoint + '/' + university_id);
    }
    /**
     * List of all universities
     * @returns {Observable<any>}
     */
    listAll() {
        let url = this._universityEndpoint + '/all';
        return this._authhttp.get(url);
    }
};
UniversityService = __decorate([
    Injectable({
        providedIn: 'root'
    })
], UniversityService);
export { UniversityService };
//# sourceMappingURL=university.service.js.map