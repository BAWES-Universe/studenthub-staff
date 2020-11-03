import { __decorate } from "tslib";
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AllCompanyListPage } from './all-company-list.page';
const routes = [
    {
        path: '',
        component: AllCompanyListPage
    }
];
let AllCompanyListPageRoutingModule = class AllCompanyListPageRoutingModule {
};
AllCompanyListPageRoutingModule = __decorate([
    NgModule({
        imports: [RouterModule.forChild(routes)],
        exports: [RouterModule],
    })
], AllCompanyListPageRoutingModule);
export { AllCompanyListPageRoutingModule };
//# sourceMappingURL=all-company-list-routing.module.js.map