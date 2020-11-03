import { __decorate } from "tslib";
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { IonicModule } from '@ionic/angular';
import { CompanyViewPageRoutingModule } from './company-view-routing.module';
import { CompanyViewPage } from './company-view.page';
import { LoadingModalModule } from 'src/app/components/loading-modal/loading-modal.module';
import { PipesModule } from 'src/app/pipes/pipes.module';
let CompanyViewPageModule = class CompanyViewPageModule {
};
CompanyViewPageModule = __decorate([
    NgModule({
        imports: [
            CommonModule,
            FormsModule,
            ReactiveFormsModule,
            LoadingModalModule,
            IonicModule,
            PipesModule,
            CKEditorModule,
            CompanyViewPageRoutingModule
        ],
        declarations: [CompanyViewPage]
    })
], CompanyViewPageModule);
export { CompanyViewPageModule };
//# sourceMappingURL=company-view.module.js.map