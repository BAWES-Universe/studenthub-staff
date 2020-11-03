import { __decorate } from "tslib";
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CompanyRequestViewPage } from './company-request-view.page';
const routes = [
    {
        path: ':request_uuid',
        component: CompanyRequestViewPage
    }
];
let CompanyRequestViewRoutingModule = class CompanyRequestViewRoutingModule {
};
CompanyRequestViewRoutingModule = __decorate([
    NgModule({
        imports: [RouterModule.forChild(routes)],
        exports: [RouterModule],
    })
], CompanyRequestViewRoutingModule);
export { CompanyRequestViewRoutingModule };
//# sourceMappingURL=company-request-view-routing.module.js.map