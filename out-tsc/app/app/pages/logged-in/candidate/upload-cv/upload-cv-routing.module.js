import { __decorate } from "tslib";
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { UploadCvPage } from './upload-cv.page';
const routes = [
    {
        path: '',
        component: UploadCvPage
    }
];
let UploadCvPageRoutingModule = class UploadCvPageRoutingModule {
};
UploadCvPageRoutingModule = __decorate([
    NgModule({
        imports: [RouterModule.forChild(routes)],
        exports: [RouterModule],
    })
], UploadCvPageRoutingModule);
export { UploadCvPageRoutingModule };
//# sourceMappingURL=upload-cv-routing.module.js.map