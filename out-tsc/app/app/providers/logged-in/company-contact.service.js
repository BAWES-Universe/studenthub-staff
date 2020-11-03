import { __decorate } from "tslib";
import { Injectable } from '@angular/core';
let CompanyContactService = class CompanyContactService {
    constructor(_authhttp) {
        this._authhttp = _authhttp;
        this._companyContactEndpoint = "/company-contacts";
    }
    /**
     * get all company contacts
     * @param company_id
     */
    list(page, query = '') {
        const url = `${this._companyContactEndpoint}?expand=companyContactEmails,companyContactPhones,company&page=${page}&query=${query}`;
        return this._authhttp.getRaw(url);
    }
    /**
     * get given company contacts
     * @param company_id
     */
    companyContacts(company_id, query = '') {
        const url = `${this._companyContactEndpoint}?expand=companyContactEmails,companyContactPhones&company_id=${company_id}&query=${query}`;
        return this._authhttp.get(url);
    }
    /**
     * Create university
     * @param {CompanyContact} model
     * @returns {Observable<any>}
     */
    create(model) {
        let postUrl = `${this._companyContactEndpoint}`;
        let params = {
            "company_id": model.company_id,
            "name": model.contact_name,
            "position": model.contact_position,
            "note": model.contact_note,
            "emails": model.companyContactEmails,
            "phones": model.companyContactPhones
        };
        return this._authhttp.post(postUrl, params);
    }
    /**
     * Update university
     * @param {CompanyContact} model
     * @returns {Observable<any>}
     */
    update(model) {
        let url = `${this._companyContactEndpoint}/${model.contact_uuid}`;
        let params = {
            "company_id": model.company_id,
            "name": model.contact_name,
            "position": model.contact_position,
            "note": model.contact_note,
            "emails": model.companyContactEmails,
            "phones": model.companyContactPhones
        };
        return this._authhttp.patch(url, params);
    }
    /**
     * Deletes university
     * @param {CompanyContact} model
     * @returns {Observable<any>}
     */
    delete(model) {
        let url = `${this._companyContactEndpoint}/${model.contact_uuid}`;
        return this._authhttp.delete(url);
    }
};
CompanyContactService = __decorate([
    Injectable({
        providedIn: 'root'
    })
], CompanyContactService);
export { CompanyContactService };
//# sourceMappingURL=company-contact.service.js.map