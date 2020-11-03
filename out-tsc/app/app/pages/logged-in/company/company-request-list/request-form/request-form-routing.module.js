import { __decorate } from "tslib";
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { RequestFormPage } from './request-form.page';
const routes = [
    {
        path: '',
        component: RequestFormPage
    }, {
        path: ':id',
        component: RequestFormPage
    }
];
let RequestFormPageRoutingModule = class RequestFormPageRoutingModule {
};
RequestFormPageRoutingModule = __decorate([
    NgModule({
        imports: [RouterModule.forChild(routes)],
        exports: [RouterModule],
    })
], RequestFormPageRoutingModule);
export { RequestFormPageRoutingModule };
//# sourceMappingURL=request-form-routing.module.js.map