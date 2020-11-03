import { __decorate } from "tslib";
import { Injectable } from '@angular/core';
let StoreService = class StoreService {
    constructor(_authhttp) {
        this._authhttp = _authhttp;
        this._storeEndpoint = '/stores';
    }
    /**
     * Return list of all stores
     * Pass comma-separated fields if you wish to only get specific fields from api
     * @param {string} fields list of fields you wish to get, ALL by default
     * @param {string} expand list of extra fields/relations you want. None by default
     * @returns {Observable<any>}
     */
    list(fields = '', expand = '') {
        let append = '';
        if (fields) {
            append = `?fields=${fields}`;
        }
        if (expand) {
            append = append ? `${append}&expand=${expand}` : `?expand=${expand}`;
        }
        const url = `${this._storeEndpoint}${append}`;
        return this._authhttp.get(url);
    }
    /**
     * List of all stores belonging to company along with candidates within them
     * @returns {Observable<any>}
     */
    getStoresBelongingToCompany(companyId, page) {
        return this._authhttp.getRaw(`${this._storeEndpoint}?companyId=${companyId}&page=${page}&expand=candidates`);
    }
    /**
     * detail
     * @param story_id
     */
    detail(story_id) {
        return this._authhttp.get(`${this._storeEndpoint}/${story_id}?expand=storeManager,candidates,brand,company,company.brands,mall`);
    }
    /**
     * Create
     * @param {Store} model
     * @returns {Observable<any>}
     */
    create(model) {
        return this._authhttp.post(this._storeEndpoint, {
            company_id: model.company_id,
            name: model.store_name,
            location: model.store_location,
            brand_uuid: model.brand_uuid,
            mall_uuid: model.mall_uuid
        });
    }
    /**
     * Update
     * @param {Store} model
     * @returns {Observable<any>}
     */
    update(model) {
        return this._authhttp.patch(`${this._storeEndpoint}/${model.store_id}`, {
            company_id: model.company_id,
            name: model.store_name,
            location: model.store_location,
            brand_uuid: model.brand_uuid,
            mall_uuid: model.mall_uuid
        });
    }
    /**
     * update store manager
     * @param model
     * @param companyContact
     */
    updateStoreManager(model, companyContact) {
        return this._authhttp.patch(`${this._storeEndpoint}/update-manager/${model.store_id}`, {
            contact_uuid: companyContact.contact_uuid
        });
    }
    /**
     * Delete
     * @param {Store} model
     * @returns {Observable<any>}
     */
    delete(model) {
        return this._authhttp.delete(`${this._storeEndpoint}/${model.store_id}`);
    }
};
StoreService = __decorate([
    Injectable({
        providedIn: 'root'
    })
], StoreService);
export { StoreService };
//# sourceMappingURL=store.service.js.map