import { __decorate } from "tslib";
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CompanyRequestListPage } from './company-request-list.page';
const routes = [
    {
        path: '',
        component: CompanyRequestListPage
    }
];
let CompanyRequestListPageRoutingModule = class CompanyRequestListPageRoutingModule {
};
CompanyRequestListPageRoutingModule = __decorate([
    NgModule({
        imports: [RouterModule.forChild(routes)],
        exports: [RouterModule],
    })
], CompanyRequestListPageRoutingModule);
export { CompanyRequestListPageRoutingModule };
//# sourceMappingURL=company-request-list-routing.module.js.map