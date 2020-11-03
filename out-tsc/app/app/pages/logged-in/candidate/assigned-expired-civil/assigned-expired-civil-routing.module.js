import { __decorate } from "tslib";
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AssignedExpiredCivilPage } from './assigned-expired-civil.page';
const routes = [
    {
        path: '',
        component: AssignedExpiredCivilPage
    }
];
let AssignedExpiredCivilPageRoutingModule = class AssignedExpiredCivilPageRoutingModule {
};
AssignedExpiredCivilPageRoutingModule = __decorate([
    NgModule({
        imports: [RouterModule.forChild(routes)],
        exports: [RouterModule],
    })
], AssignedExpiredCivilPageRoutingModule);
export { AssignedExpiredCivilPageRoutingModule };
//# sourceMappingURL=assigned-expired-civil-routing.module.js.map