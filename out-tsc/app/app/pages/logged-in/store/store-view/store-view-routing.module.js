import { __decorate } from "tslib";
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { StoreViewPage } from './store-view.page';
const routes = [
    {
        path: ':id',
        component: StoreViewPage
    }
];
let StoreViewPageRoutingModule = class StoreViewPageRoutingModule {
};
StoreViewPageRoutingModule = __decorate([
    NgModule({
        imports: [RouterModule.forChild(routes)],
        exports: [RouterModule],
    })
], StoreViewPageRoutingModule);
export { StoreViewPageRoutingModule };
//# sourceMappingURL=store-view-routing.module.js.map