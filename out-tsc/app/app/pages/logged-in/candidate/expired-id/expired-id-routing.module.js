import { __decorate } from "tslib";
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ExpiredIdPage } from './expired-id.page';
const routes = [
    {
        path: '',
        component: ExpiredIdPage
    }
];
let ExpiredIdPageRoutingModule = class ExpiredIdPageRoutingModule {
};
ExpiredIdPageRoutingModule = __decorate([
    NgModule({
        imports: [RouterModule.forChild(routes)],
        exports: [RouterModule],
    })
], ExpiredIdPageRoutingModule);
export { ExpiredIdPageRoutingModule };
//# sourceMappingURL=expired-id-routing.module.js.map