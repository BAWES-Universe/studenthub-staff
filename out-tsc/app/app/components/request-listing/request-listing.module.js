import { __decorate } from "tslib";
import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RequestListingComponent } from './request-listing.component';
import { PipesModule } from "../../pipes/pipes.module";
let RequestListingModule = class RequestListingModule {
};
RequestListingModule = __decorate([
    NgModule({
        declarations: [
            RequestListingComponent
        ],
        imports: [
            CommonModule,
            IonicModule,
            PipesModule,
        ],
        exports: [
            RequestListingComponent
        ]
    })
], RequestListingModule);
export { RequestListingModule };
//# sourceMappingURL=request-listing.module.js.map