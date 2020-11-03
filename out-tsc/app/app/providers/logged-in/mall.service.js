import { __decorate } from "tslib";
import { Injectable } from '@angular/core';
let MallService = class MallService {
    constructor(authHttp) {
        this.authHttp = authHttp;
        this.mallEndpoint = '/malls';
    }
    /**
     * load Mall detail
     * @param mallUUID
     */
    view(mallUUID) {
        return this.authHttp.get(this.mallEndpoint + '/' + mallUUID + '?expand=candidates,stores,stores.candidatesCount');
    }
    /**
     * List of all Mall
     * @returns {Observable<any>}
     */
    list(page) {
        return this.authHttp.getRaw(this.mallEndpoint + '?page=' + page);
    }
    /**
     * List of all Mall
     * @returns {Observable<any>}
     */
    fullList() {
        return this.authHttp.get(this.mallEndpoint + '/all');
    }
    /**
     * create mall
     * @param model
     */
    create(model) {
        return this.authHttp.post(this.mallEndpoint, {
            name_en: model.mall_name_en,
            name_ar: model.mall_name_ar,
        });
    }
    /**
     * update mall
     * @param model
     */
    update(model) {
        return this.authHttp.patch(`${this.mallEndpoint}/${model.mall_uuid}`, {
            name_en: model.mall_name_en,
            name_ar: model.mall_name_ar,
        });
    }
    /**
     * delete mall
     * @param model
     */
    delete(model) {
        return this.authHttp.delete(`${this.mallEndpoint}/${model.mall_uuid}`);
    }
};
MallService = __decorate([
    Injectable({
        providedIn: 'root'
    })
], MallService);
export { MallService };
//# sourceMappingURL=mall.service.js.map