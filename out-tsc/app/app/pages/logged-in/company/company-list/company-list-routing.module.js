import { __decorate } from "tslib";
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CompanyListPage } from './company-list.page';
const routes = [
    {
        path: '',
        component: CompanyListPage
    }
];
let CompanyListPageRoutingModule = class CompanyListPageRoutingModule {
};
CompanyListPageRoutingModule = __decorate([
    NgModule({
        imports: [RouterModule.forChild(routes)],
        exports: [RouterModule],
    })
], CompanyListPageRoutingModule);
export { CompanyListPageRoutingModule };
//# sourceMappingURL=company-list-routing.module.js.map