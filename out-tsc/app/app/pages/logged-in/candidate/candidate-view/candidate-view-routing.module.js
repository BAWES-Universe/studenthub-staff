import { __decorate } from "tslib";
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CandidateViewPage } from './candidate-view.page';
const routes = [
    {
        path: ':id',
        component: CandidateViewPage
    }
];
let CandidateViewPageRoutingModule = class CandidateViewPageRoutingModule {
};
CandidateViewPageRoutingModule = __decorate([
    NgModule({
        imports: [RouterModule.forChild(routes)],
        exports: [RouterModule],
    })
], CandidateViewPageRoutingModule);
export { CandidateViewPageRoutingModule };
//# sourceMappingURL=candidate-view-routing.module.js.map