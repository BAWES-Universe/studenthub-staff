import { __decorate } from "tslib";
import { Injectable } from '@angular/core';
let CompanyRequestService = class CompanyRequestService {
    constructor(authhttp) {
        this.authhttp = authhttp;
        this.companyRequestEndpoint = '/requests';
    }
    /**
     * List all requests
     * @returns {Observable<any>}
     */
    list(companyID) {
        const url = this.companyRequestEndpoint + '?company_id=' + companyID +
            '&expand=requestCreatedBy,requestUpdatedBy,contact,requestActivities,requestActivities.staff';
        return this.authhttp.get(url);
    }
    /**
     * List all requests with page
     * @returns {Observable<any>}
     */
    listWithPagination(page) {
        const url = this.companyRequestEndpoint + '?page=' + page +
            '&expand=requestCreatedBy,requestUpdatedBy,contact,company,company.companyContact,requestActivities,requestActivities.staff';
        return this.authhttp.getRaw(url);
    }
    /**
     * load pending requests
     */
    listPendingRequests() {
        const url = this.companyRequestEndpoint + '/pending?expand=staff,lastActivity,lastActivity.staff,company';
        return this.authhttp.get(url);
    }
    /**
     * requests managed by current user
     */
    listMyRequests() {
        const url = this.companyRequestEndpoint + '/my?expand=staff,lastActivity,lastActivity.staff,company';
        return this.authhttp.get(url);
    }
    /**
     * requests started/active but not by login user
     */
    listActiveRequests() {
        const url = this.companyRequestEndpoint + '/active?expand=staff,lastActivity,lastActivity.staff,company';
        return this.authhttp.get(url);
    }
    /**
     * create request
     * @param model
     */
    create(model) {
        return this.authhttp.post(this.companyRequestEndpoint, {
            company_id: model.company_id,
            contact_uuid: model.contact_uuid,
            position_type: model.request_position_type,
            position_title: model.request_position_title,
            number_of_employees: model.request_number_of_employees,
            additional_info: model.request_additional_info
        });
    }
    /**
     * start request
     * @param model
     */
    start(model) {
        const url = `${this.companyRequestEndpoint}/start/${model.request_uuid}`;
        return this.authhttp.patch(url, {});
    }
    /**
     * cancel request
     * @param model
     */
    cancel(model) {
        const url = `${this.companyRequestEndpoint}/cancel/${model.request_uuid}`;
        return this.authhttp.patch(url, {
            feedback: model.request_feedback
        });
    }
    /**
     * deliver request
     * @param model
     */
    deliver(model) {
        const url = `${this.companyRequestEndpoint}/deliver/${model.request_uuid}`;
        return this.authhttp.patch(url, {
            feedback: model.request_feedback
        });
    }
    /**
     * update request
     * @param model
     */
    update(model) {
        return this.authhttp.patch(`${this.companyRequestEndpoint}/${model.request_uuid}`, {
            company_id: model.company_id,
            contact_uuid: model.contact_uuid,
            position_type: model.request_position_type,
            position_title: model.request_position_title,
            number_of_employees: model.request_number_of_employees,
            additional_info: model.request_additional_info
        });
    }
    /**
     * delete request
     * @param model
     */
    delete(model) {
        return this.authhttp.delete(`${this.companyRequestEndpoint}/${model.request_uuid}`);
    }
    /**
     * view request
     * @param id
     */
    view(id) {
        const url = this.companyRequestEndpoint + '/' + id +
            '?expand=requestCreatedBy,requestUpdatedBy,contact,company,company.companyContact,requestActivities,requestActivities.staff';
        return this.authhttp.get(url);
    }
    /**
     * add activity
     * @param params
     */
    addActivity(params) {
        let url = this.companyRequestEndpoint + '/add-activity';
        return this.authhttp.post(url, params);
    }
};
CompanyRequestService = __decorate([
    Injectable({
        providedIn: 'root'
    })
], CompanyRequestService);
export { CompanyRequestService };
//# sourceMappingURL=company-request.service.js.map