import { __decorate } from "tslib";
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CompanyRequestFormPage } from './company-request-form.page';
const routes = [
    {
        path: '',
        component: CompanyRequestFormPage
    }
];
let CompanyRequestFormPageRoutingModule = class CompanyRequestFormPageRoutingModule {
};
CompanyRequestFormPageRoutingModule = __decorate([
    NgModule({
        imports: [RouterModule.forChild(routes)],
        exports: [RouterModule],
    })
], CompanyRequestFormPageRoutingModule);
export { CompanyRequestFormPageRoutingModule };
//# sourceMappingURL=company-request-form-routing.module.js.map