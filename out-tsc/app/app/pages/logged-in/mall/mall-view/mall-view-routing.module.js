import { __decorate } from "tslib";
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MallViewPage } from './mall-view.page';
const routes = [
    {
        path: ':id',
        component: MallViewPage
    }
];
let MallViewPageRoutingModule = class MallViewPageRoutingModule {
};
MallViewPageRoutingModule = __decorate([
    NgModule({
        imports: [RouterModule.forChild(routes)],
        exports: [RouterModule],
    })
], MallViewPageRoutingModule);
export { MallViewPageRoutingModule };
//# sourceMappingURL=mall-view-routing.module.js.map