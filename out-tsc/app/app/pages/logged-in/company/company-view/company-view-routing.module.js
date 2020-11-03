import { __decorate } from "tslib";
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CompanyViewPage } from './company-view.page';
const routes = [
    {
        path: ':company_id',
        component: CompanyViewPage
    }
];
let CompanyViewPageRoutingModule = class CompanyViewPageRoutingModule {
};
CompanyViewPageRoutingModule = __decorate([
    NgModule({
        imports: [RouterModule.forChild(routes)],
        exports: [RouterModule],
    })
], CompanyViewPageRoutingModule);
export { CompanyViewPageRoutingModule };
//# sourceMappingURL=company-view-routing.module.js.map