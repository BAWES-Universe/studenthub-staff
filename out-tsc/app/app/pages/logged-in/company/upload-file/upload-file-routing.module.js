import { __decorate } from "tslib";
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { UploadFilePage } from './upload-file.page';
const routes = [
    {
        path: '',
        component: UploadFilePage
    }
];
let UploadFilePageRoutingModule = class UploadFilePageRoutingModule {
};
UploadFilePageRoutingModule = __decorate([
    NgModule({
        imports: [RouterModule.forChild(routes)],
        exports: [RouterModule],
    })
], UploadFilePageRoutingModule);
export { UploadFilePageRoutingModule };
//# sourceMappingURL=upload-file-routing.module.js.map