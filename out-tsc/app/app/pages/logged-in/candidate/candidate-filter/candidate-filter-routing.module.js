import { __decorate } from "tslib";
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CandidateFilterPage } from './candidate-filter.page';
const routes = [
    {
        path: '',
        component: CandidateFilterPage
    }
];
let CandidateFilterPageRoutingModule = class CandidateFilterPageRoutingModule {
};
CandidateFilterPageRoutingModule = __decorate([
    NgModule({
        imports: [RouterModule.forChild(routes)],
        exports: [RouterModule],
    })
], CandidateFilterPageRoutingModule);
export { CandidateFilterPageRoutingModule };
//# sourceMappingURL=candidate-filter-routing.module.js.map