import { __decorate } from "tslib";
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { UniversityViewPage } from './university-view.page';
const routes = [
    {
        path: ':id',
        component: UniversityViewPage
    }
];
let UniversityViewPageRoutingModule = class UniversityViewPageRoutingModule {
};
UniversityViewPageRoutingModule = __decorate([
    NgModule({
        imports: [RouterModule.forChild(routes)],
        exports: [RouterModule],
    })
], UniversityViewPageRoutingModule);
export { UniversityViewPageRoutingModule };
//# sourceMappingURL=university-view-routing.module.js.map