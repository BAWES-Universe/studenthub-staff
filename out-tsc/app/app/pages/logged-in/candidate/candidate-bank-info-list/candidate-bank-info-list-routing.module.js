import { __decorate } from "tslib";
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CandidateBankInfoListPage } from './candidate-bank-info-list.page';
const routes = [
    {
        path: ':segment',
        component: CandidateBankInfoListPage
    }, {
        path: '',
        component: CandidateBankInfoListPage
    }
];
let CandidateBankInfoListRoutingModule = class CandidateBankInfoListRoutingModule {
};
CandidateBankInfoListRoutingModule = __decorate([
    NgModule({
        imports: [RouterModule.forChild(routes)],
        exports: [RouterModule],
    })
], CandidateBankInfoListRoutingModule);
export { CandidateBankInfoListRoutingModule };
//# sourceMappingURL=candidate-bank-info-list-routing.module.js.map