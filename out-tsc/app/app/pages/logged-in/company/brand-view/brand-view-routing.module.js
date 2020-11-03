import { __decorate } from "tslib";
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { BrandViewPage } from './brand-view.page';
const routes = [
    {
        path: ':id',
        component: BrandViewPage
    }
];
let BrandViewPageRoutingModule = class BrandViewPageRoutingModule {
};
BrandViewPageRoutingModule = __decorate([
    NgModule({
        imports: [RouterModule.forChild(routes)],
        exports: [RouterModule],
    })
], BrandViewPageRoutingModule);
export { BrandViewPageRoutingModule };
//# sourceMappingURL=brand-view-routing.module.js.map