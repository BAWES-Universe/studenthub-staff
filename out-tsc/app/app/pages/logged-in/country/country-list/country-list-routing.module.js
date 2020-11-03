import { __decorate } from "tslib";
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CountryListPage } from './country-list.page';
const routes = [
    {
        path: '',
        component: CountryListPage
    }
];
let CountryListPageRoutingModule = class CountryListPageRoutingModule {
};
CountryListPageRoutingModule = __decorate([
    NgModule({
        imports: [RouterModule.forChild(routes)],
        exports: [RouterModule],
    })
], CountryListPageRoutingModule);
export { CountryListPageRoutingModule };
//# sourceMappingURL=country-list-routing.module.js.map