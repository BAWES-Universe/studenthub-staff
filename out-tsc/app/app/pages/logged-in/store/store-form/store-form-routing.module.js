import { __decorate } from "tslib";
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { StoreFormPage } from './store-form.page';
const routes = [
    {
        path: '',
        component: StoreFormPage
    },
    {
        path: ':id',
        component: StoreFormPage
    }
];
let StoreFormPageRoutingModule = class StoreFormPageRoutingModule {
};
StoreFormPageRoutingModule = __decorate([
    NgModule({
        imports: [RouterModule.forChild(routes)],
        exports: [RouterModule],
    })
], StoreFormPageRoutingModule);
export { StoreFormPageRoutingModule };
//# sourceMappingURL=store-form-routing.module.js.map