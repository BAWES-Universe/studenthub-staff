import { __decorate } from "tslib";
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { NotFoundPage } from './not-found.page';
const routes = [
    {
        path: '',
        component: NotFoundPage
    }
];
let NotFoundPageModule = class NotFoundPageModule {
};
NotFoundPageModule = __decorate([
    NgModule({
        imports: [
            CommonModule,
            FormsModule,
            IonicModule,
            RouterModule.forChild(routes)
        ],
        declarations: [NotFoundPage]
    })
], NotFoundPageModule);
export { NotFoundPageModule };
//# sourceMappingURL=not-found.module.js.map