import { __decorate } from "tslib";
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CountryViewPage } from './country-view.page';
const routes = [
    {
        path: ':id',
        component: CountryViewPage
    }
];
let CountryViewPageRoutingModule = class CountryViewPageRoutingModule {
};
CountryViewPageRoutingModule = __decorate([
    NgModule({
        imports: [RouterModule.forChild(routes)],
        exports: [RouterModule],
    })
], CountryViewPageRoutingModule);
export { CountryViewPageRoutingModule };
//# sourceMappingURL=country-view-routing.module.js.map