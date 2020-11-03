import { __decorate } from "tslib";
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CompanyContactListPage } from './company-contact-list.page';
const routes = [
    {
        path: '',
        component: CompanyContactListPage
    }
];
let CompanyContactListPageRoutingModule = class CompanyContactListPageRoutingModule {
};
CompanyContactListPageRoutingModule = __decorate([
    NgModule({
        imports: [RouterModule.forChild(routes)],
        exports: [RouterModule],
    })
], CompanyContactListPageRoutingModule);
export { CompanyContactListPageRoutingModule };
//# sourceMappingURL=company-contact-list-routing.module.js.map