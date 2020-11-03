import { __decorate } from "tslib";
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AssignedIdleCandidatesPage } from "./assigned-idle-candidates.page";
const routes = [
    {
        path: ':segment',
        component: AssignedIdleCandidatesPage
    }, {
        path: '',
        component: AssignedIdleCandidatesPage
    }
];
let AssignedIdleCandidatesPagePageRoutingModule = class AssignedIdleCandidatesPagePageRoutingModule {
};
AssignedIdleCandidatesPagePageRoutingModule = __decorate([
    NgModule({
        imports: [RouterModule.forChild(routes)],
        exports: [RouterModule],
    })
], AssignedIdleCandidatesPagePageRoutingModule);
export { AssignedIdleCandidatesPagePageRoutingModule };
//# sourceMappingURL=assigned-idle-candidates-routing.module.js.map