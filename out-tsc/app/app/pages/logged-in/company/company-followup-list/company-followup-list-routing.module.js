import { __decorate } from "tslib";
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CompanyFollowupListPage } from './company-followup-list.page';
const routes = [
    {
        path: '',
        component: CompanyFollowupListPage
    }
];
let CompanyFollowupListPageRoutingModule = class CompanyFollowupListPageRoutingModule {
};
CompanyFollowupListPageRoutingModule = __decorate([
    NgModule({
        imports: [RouterModule.forChild(routes)],
        exports: [RouterModule],
    })
], CompanyFollowupListPageRoutingModule);
export { CompanyFollowupListPageRoutingModule };
//# sourceMappingURL=company-followup-list-routing.module.js.map