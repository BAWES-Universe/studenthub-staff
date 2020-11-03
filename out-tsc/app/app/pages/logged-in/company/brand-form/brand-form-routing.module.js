import { __decorate } from "tslib";
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { BrandFormPage } from './brand-form.page';
const routes = [
    {
        path: '',
        component: BrandFormPage
    }
];
let BrandFormPageRoutingModule = class BrandFormPageRoutingModule {
};
BrandFormPageRoutingModule = __decorate([
    NgModule({
        imports: [RouterModule.forChild(routes)],
        exports: [RouterModule],
    })
], BrandFormPageRoutingModule);
export { BrandFormPageRoutingModule };
//# sourceMappingURL=brand-form-routing.module.js.map