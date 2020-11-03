import { __decorate } from "tslib";
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CandidateReviewListPage } from './candidate-review-list.page';
const routes = [
    {
        path: '',
        component: CandidateReviewListPage
    }
];
let CandidateReviewListPageRoutingModule = class CandidateReviewListPageRoutingModule {
};
CandidateReviewListPageRoutingModule = __decorate([
    NgModule({
        imports: [RouterModule.forChild(routes)],
        exports: [RouterModule],
    })
], CandidateReviewListPageRoutingModule);
export { CandidateReviewListPageRoutingModule };
//# sourceMappingURL=candidate-review-list-routing.module.js.map