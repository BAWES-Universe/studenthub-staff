import { __decorate } from "tslib";
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { IncompleteCandidateListPage } from './incomplete-candidate-list.page';
const routes = [
    {
        path: ':segment',
        component: IncompleteCandidateListPage
    }, {
        path: '',
        component: IncompleteCandidateListPage
    }
];
let IncompleteCandidateListPageRoutingModule = class IncompleteCandidateListPageRoutingModule {
};
IncompleteCandidateListPageRoutingModule = __decorate([
    NgModule({
        imports: [RouterModule.forChild(routes)],
        exports: [RouterModule],
    })
], IncompleteCandidateListPageRoutingModule);
export { IncompleteCandidateListPageRoutingModule };
//# sourceMappingURL=incomplete-candidate-list-routing.module.js.map