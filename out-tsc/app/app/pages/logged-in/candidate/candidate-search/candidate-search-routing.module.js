import { __decorate } from "tslib";
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CandidateSearchPage } from './candidate-search.page';
const routes = [
    {
        path: '',
        component: CandidateSearchPage
    }
];
let CandidateSearchPageRoutingModule = class CandidateSearchPageRoutingModule {
};
CandidateSearchPageRoutingModule = __decorate([
    NgModule({
        imports: [RouterModule.forChild(routes)],
        exports: [RouterModule],
    })
], CandidateSearchPageRoutingModule);
export { CandidateSearchPageRoutingModule };
//# sourceMappingURL=candidate-search-routing.module.js.map