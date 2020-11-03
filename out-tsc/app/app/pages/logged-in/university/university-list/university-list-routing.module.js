import { __decorate } from "tslib";
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { UniversityListPage } from './university-list.page';
const routes = [
    {
        path: '',
        component: UniversityListPage
    }
];
let UniversityListPageRoutingModule = class UniversityListPageRoutingModule {
};
UniversityListPageRoutingModule = __decorate([
    NgModule({
        imports: [RouterModule.forChild(routes)],
        exports: [RouterModule],
    })
], UniversityListPageRoutingModule);
export { UniversityListPageRoutingModule };
//# sourceMappingURL=university-list-routing.module.js.map