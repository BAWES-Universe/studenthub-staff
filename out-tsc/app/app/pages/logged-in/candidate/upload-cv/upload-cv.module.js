import { __decorate } from "tslib";
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { UploadCvPageRoutingModule } from './upload-cv-routing.module';
import { UploadCvPage } from './upload-cv.page';
import { TranslateModule } from '@ngx-translate/core';
let UploadCvPageModule = class UploadCvPageModule {
};
UploadCvPageModule = __decorate([
    NgModule({
        imports: [
            CommonModule,
            FormsModule,
            IonicModule,
            TranslateModule.forChild(),
            UploadCvPageRoutingModule
        ],
        declarations: [UploadCvPage]
    })
], UploadCvPageModule);
export { UploadCvPageModule };
//# sourceMappingURL=upload-cv.module.js.map