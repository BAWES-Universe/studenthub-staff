import { __decorate } from "tslib";
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { NoInternetPage } from './no-internet.page';
const routes = [
    {
        path: '',
        component: NoInternetPage
    }
];
let NoInternetPageModule = class NoInternetPageModule {
};
NoInternetPageModule = __decorate([
    NgModule({
        imports: [
            CommonModule,
            IonicModule,
            RouterModule.forChild(routes)
        ],
        declarations: [NoInternetPage]
    })
], NoInternetPageModule);
export { NoInternetPageModule };
//# sourceMappingURL=no-internet.module.js.map