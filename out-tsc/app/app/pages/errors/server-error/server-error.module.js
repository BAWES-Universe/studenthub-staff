import { __decorate } from "tslib";
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { ServerErrorPage } from './server-error.page';
const routes = [
    {
        path: '',
        component: ServerErrorPage
    }
];
let ServerErrorPageModule = class ServerErrorPageModule {
};
ServerErrorPageModule = __decorate([
    NgModule({
        imports: [
            CommonModule,
            FormsModule,
            IonicModule,
            RouterModule.forChild(routes)
        ],
        declarations: [ServerErrorPage]
    })
], ServerErrorPageModule);
export { ServerErrorPageModule };
//# sourceMappingURL=server-error.module.js.map