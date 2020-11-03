import { __decorate } from "tslib";
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DefaultPage } from './default.page';
const routes = [
    {
        path: '',
        component: DefaultPage
    }
];
let DefaultPageRoutingModule = class DefaultPageRoutingModule {
};
DefaultPageRoutingModule = __decorate([
    NgModule({
        imports: [RouterModule.forChild(routes)],
        exports: [RouterModule],
    })
], DefaultPageRoutingModule);
export { DefaultPageRoutingModule };
//# sourceMappingURL=default-routing.module.js.map