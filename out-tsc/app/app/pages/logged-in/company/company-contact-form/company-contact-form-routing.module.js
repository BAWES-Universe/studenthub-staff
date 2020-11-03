import { __decorate } from "tslib";
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CompanyContactFormPage } from './company-contact-form.page';
const routes = [
    {
        path: '',
        component: CompanyContactFormPage
    }
];
let CompanyContactFormPageRoutingModule = class CompanyContactFormPageRoutingModule {
};
CompanyContactFormPageRoutingModule = __decorate([
    NgModule({
        imports: [RouterModule.forChild(routes)],
        exports: [RouterModule],
    })
], CompanyContactFormPageRoutingModule);
export { CompanyContactFormPageRoutingModule };
//# sourceMappingURL=company-contact-form-routing.module.js.map