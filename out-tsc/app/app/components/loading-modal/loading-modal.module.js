import { __decorate } from "tslib";
import { LoadingModalComponent } from "./loading-modal.component";
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { NgModule } from "@angular/core";
let LoadingModalModule = class LoadingModalModule {
};
LoadingModalModule = __decorate([
    NgModule({
        declarations: [
            LoadingModalComponent
        ],
        imports: [
            CommonModule,
            FormsModule,
            IonicModule
        ],
        exports: [
            LoadingModalComponent,
        ]
    })
], LoadingModalModule);
export { LoadingModalModule };
//# sourceMappingURL=loading-modal.module.js.map