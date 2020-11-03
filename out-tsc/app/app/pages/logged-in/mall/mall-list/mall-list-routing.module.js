import { __decorate } from "tslib";
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MallListPage } from './mall-list.page';
const routes = [
    {
        path: '',
        component: MallListPage
    }
];
let MallListPageRoutingModule = class MallListPageRoutingModule {
};
MallListPageRoutingModule = __decorate([
    NgModule({
        imports: [RouterModule.forChild(routes)],
        exports: [RouterModule],
    })
], MallListPageRoutingModule);
export { MallListPageRoutingModule };
//# sourceMappingURL=mall-list-routing.module.js.map