import { __decorate } from "tslib";
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { UniversityViewPageRoutingModule } from './university-view-routing.module';
import { UniversityViewPage } from './university-view.page';
import { LoadingModalModule } from "../../../../components/loading-modal/loading-modal.module";
let UniversityViewPageModule = class UniversityViewPageModule {
};
UniversityViewPageModule = __decorate([
    NgModule({
        imports: [
            CommonModule,
            FormsModule,
            IonicModule,
            UniversityViewPageRoutingModule,
            LoadingModalModule
        ],
        declarations: [UniversityViewPage]
    })
], UniversityViewPageModule);
export { UniversityViewPageModule };
//# sourceMappingURL=university-view.module.js.map