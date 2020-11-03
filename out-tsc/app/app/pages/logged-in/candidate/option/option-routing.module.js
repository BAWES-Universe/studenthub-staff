import { __decorate } from "tslib";
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { OptionPage } from './option.page';
const routes = [
    {
        path: '',
        component: OptionPage
    }
];
let OptionPageRoutingModule = class OptionPageRoutingModule {
};
OptionPageRoutingModule = __decorate([
    NgModule({
        imports: [RouterModule.forChild(routes)],
        exports: [RouterModule],
    })
], OptionPageRoutingModule);
export { OptionPageRoutingModule };
//# sourceMappingURL=option-routing.module.js.map