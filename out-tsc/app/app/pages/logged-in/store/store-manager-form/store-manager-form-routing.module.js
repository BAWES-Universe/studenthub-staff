import { __decorate } from "tslib";
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { StoreManagerFormPage } from './store-manager-form.page';
const routes = [
    {
        path: '',
        component: StoreManagerFormPage
    }
];
let StoreManagerFormPageRoutingModule = class StoreManagerFormPageRoutingModule {
};
StoreManagerFormPageRoutingModule = __decorate([
    NgModule({
        imports: [RouterModule.forChild(routes)],
        exports: [RouterModule],
    })
], StoreManagerFormPageRoutingModule);
export { StoreManagerFormPageRoutingModule };
//# sourceMappingURL=store-manager-form-routing.module.js.map