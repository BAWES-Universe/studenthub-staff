import { __decorate } from "tslib";
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MallFormPage } from './mall-form.page';
const routes = [
    {
        path: '',
        component: MallFormPage
    }
];
let MallFormPageRoutingModule = class MallFormPageRoutingModule {
};
MallFormPageRoutingModule = __decorate([
    NgModule({
        imports: [RouterModule.forChild(routes)],
        exports: [RouterModule],
    })
], MallFormPageRoutingModule);
export { MallFormPageRoutingModule };
//# sourceMappingURL=mall-form-routing.module.js.map