import { __decorate } from "tslib";
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { UploadFilePageRoutingModule } from './upload-file-routing.module';
import { UploadFilePage } from './upload-file.page';
let UploadFilePageModule = class UploadFilePageModule {
};
UploadFilePageModule = __decorate([
    NgModule({
        imports: [
            CommonModule,
            ReactiveFormsModule,
            IonicModule,
            UploadFilePageRoutingModule
        ],
        declarations: [UploadFilePage]
    })
], UploadFilePageModule);
export { UploadFilePageModule };
//# sourceMappingURL=upload-file.module.js.map