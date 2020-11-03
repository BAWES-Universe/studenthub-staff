import { __decorate } from "tslib";
import { Injectable } from '@angular/core';
let CompanyService = class CompanyService {
    constructor(_authhttp) {
        this._authhttp = _authhttp;
        this._companyEndpoint = '/companies';
    }
    /**
     * List of all companies
     * @param page
     * @param searchParams
     */
    list(page, searchParams) {
        return this._authhttp.getRaw(this._companyEndpoint + '?page=' + page + searchParams + '&expand=subCompanies,subCompanies.stores,stores,subCompanies.stores.candidates,files,notes');
    }
    /**
     * List of all companies
     * @param page
     * @param searchParams
     */
    listWithContact(page, searchParams) {
        return this._authhttp.getRaw(this._companyEndpoint + '?page=' + page + searchParams + '&expand=subCompanies,companyContacts,companyContacts.companyContactEmails,companyContacts.companyContactPhones,subCompanies.companyContacts,subCompanies.companyContacts.companyContactEmails,subCompanies.companyContacts.companyContactPhones');
    }
    /**
     * List of all followup companies
     * @returns {Observable<any>}
     */
    listFollowups(page) {
        const url = this._companyEndpoint + '/followups?page=' + page + '&expand=subCompanies,subCompanies.stores,stores';
        return this._authhttp.getRaw(url);
    }
    /**
     * model detail
     * @param company_id
     */
    view(company_id) {
        return this._authhttp.get(this._companyEndpoint + '/' + company_id + '?expand=brands,subCompanies,subCompanies.stores,subCompanies.stores.mall,stores,stores.mall,subCompanies.stores.candidates,files,requests,notes,brands,parentTransfers,parentTransfers.profit,parentTransfers.childTransfers,parentTransfers.childTransfers.company,parentTransfers.totalCandidateTransferTotal,parentTransfers.totalPaid,parentTransfers.paidTransferCandidates,malls');
    }
    /**
     * model detail
     * @param id
     */
    companyDetail(id) {
        return this._authhttp.get(this._companyEndpoint + '/' + id + '?expand=files,requests,notes,brands');
    }
    /**
     * add followup note
     * @param note
     * @param company_id
     */
    addFollowupNote(note, company_id) {
        const url = `${this._companyEndpoint}/add-followup-note/${company_id}`;
        const params = {
            note: note
        };
        return this._authhttp.post(url, params);
    }
    /**
     * create file for company
     * @param {Company} model
     * @returns {Observable<any>}
     */
    createFile(model) {
        const url = `${this._companyEndpoint}/file-create/${model.company_id}`;
        const params = {
            file_title: model.file_title,
            file_description: model.file_description,
            file_s3_path: model.file_s3_path,
        };
        return this._authhttp.post(url, params);
    }
};
CompanyService = __decorate([
    Injectable({
        providedIn: 'root'
    })
], CompanyService);
export { CompanyService };
//# sourceMappingURL=company.service.js.map