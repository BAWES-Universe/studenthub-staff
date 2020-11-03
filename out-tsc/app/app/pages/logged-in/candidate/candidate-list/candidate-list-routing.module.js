import { __decorate } from "tslib";
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CandidateListPage } from './candidate-list.page';
const routes = [
    {
        path: ':segment',
        component: CandidateListPage
    }, {
        path: '',
        component: CandidateListPage
    }
];
let CandidateListPageRoutingModule = class CandidateListPageRoutingModule {
};
CandidateListPageRoutingModule = __decorate([
    NgModule({
        imports: [RouterModule.forChild(routes)],
        exports: [RouterModule],
    })
], CandidateListPageRoutingModule);
export { CandidateListPageRoutingModule };
//# sourceMappingURL=candidate-list-routing.module.js.map