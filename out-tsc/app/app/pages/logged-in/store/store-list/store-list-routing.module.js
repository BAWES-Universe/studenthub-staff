import { __decorate } from "tslib";
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { StoreListPage } from './store-list.page';
const routes = [
    {
        path: '',
        component: StoreListPage
    }, {
        path: ':id',
        component: StoreListPage
    }
];
let StoreListPageRoutingModule = class StoreListPageRoutingModule {
};
StoreListPageRoutingModule = __decorate([
    NgModule({
        imports: [RouterModule.forChild(routes)],
        exports: [RouterModule],
    })
], StoreListPageRoutingModule);
export { StoreListPageRoutingModule };
//# sourceMappingURL=store-list-routing.module.js.map