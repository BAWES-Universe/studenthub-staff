import { __decorate } from "tslib";
import { Injectable } from '@angular/core';
/**
 * Manages Company Brand Functionality on the server
 */
let BrandService = class BrandService {
    constructor(_authhttp) {
        this._authhttp = _authhttp;
        this._brandEndpoint = '/brands';
    }
    /**
     * load brand detail
     * @param brand_uuid
     */
    view(brand_uuid) {
        const url = this._brandEndpoint + '/' + brand_uuid + '?expand=candidates,stores';
        return this._authhttp.get(url);
    }
    /**
     * List of all staff
     * @returns {Observable<any>}
     */
    list(page) {
        const url = this._brandEndpoint + '?page=' + page;
        return this._authhttp.getRaw(url);
    }
    /**
     * Create Brand
     * @param {Brand} model
     * @returns {Observable<any>}
     */
    create(model) {
        const postUrl = `${this._brandEndpoint}`;
        const params = {
            name_en: model.brand_name_en,
            name_ar: model.brand_name_ar,
            company_id: model.company_id,
            logo: model.brand_logo,
        };
        return this._authhttp.post(postUrl, params);
    }
    /**
     * Update Brand
     * @param {Brand} model
     * @returns {Observable<any>}
     */
    update(model) {
        const url = `${this._brandEndpoint}/${model.brand_uuid}`;
        const params = {
            name_en: model.brand_name_en,
            name_ar: model.brand_name_ar,
            company_id: model.company_id,
            logo: model.brand_logo,
        };
        return this._authhttp.patch(url, params);
    }
    /**
     * Delete Brand
     * @param {Brand} model
     * @returns {Observable<any>}
     */
    delete(model) {
        const url = `${this._brandEndpoint}/${model.brand_uuid}`;
        return this._authhttp.delete(url);
    }
};
BrandService = __decorate([
    Injectable({
        providedIn: 'root'
    })
], BrandService);
export { BrandService };
//# sourceMappingURL=brand.service.js.map