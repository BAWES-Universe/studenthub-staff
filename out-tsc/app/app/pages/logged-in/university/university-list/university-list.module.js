import { __decorate } from "tslib";
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { UniversityListPageRoutingModule } from './university-list-routing.module';
import { UniversityListPage } from './university-list.page';
import { LoadingModalModule } from "../../../../components/loading-modal/loading-modal.module";
let UniversityListPageModule = class UniversityListPageModule {
};
UniversityListPageModule = __decorate([
    NgModule({
        imports: [
            CommonModule,
            FormsModule,
            IonicModule,
            UniversityListPageRoutingModule,
            LoadingModalModule
        ],
        declarations: [UniversityListPage]
    })
], UniversityListPageModule);
export { UniversityListPageModule };
//# sourceMappingURL=university-list.module.js.map