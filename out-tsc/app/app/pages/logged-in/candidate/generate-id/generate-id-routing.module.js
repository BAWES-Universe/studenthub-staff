import { __decorate } from "tslib";
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { GenerateIdPage } from './generate-id.page';
const routes = [
    {
        path: '',
        component: GenerateIdPage
    }
];
let GenerateIdPageRoutingModule = class GenerateIdPageRoutingModule {
};
GenerateIdPageRoutingModule = __decorate([
    NgModule({
        imports: [RouterModule.forChild(routes)],
        exports: [RouterModule],
    })
], GenerateIdPageRoutingModule);
export { GenerateIdPageRoutingModule };
//# sourceMappingURL=generate-id-routing.module.js.map