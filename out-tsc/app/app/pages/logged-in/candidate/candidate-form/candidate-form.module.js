import { __decorate } from "tslib";
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { CandidateFormPageRoutingModule } from './candidate-form-routing.module';
import { CandidateFormPage } from './candidate-form.page';
import { ImageUploadComponent } from "src/app/components/image-upload/image-upload.component";
import { SelectSearchModule } from "src/app/components/select-search/select-search.module";
import { LoadingModalModule } from "../../../../components/loading-modal/loading-modal.module";
let CandidateFormPageModule = class CandidateFormPageModule {
};
CandidateFormPageModule = __decorate([
    NgModule({
        imports: [
            CommonModule,
            ReactiveFormsModule,
            IonicModule,
            CandidateFormPageRoutingModule,
            SelectSearchModule,
            LoadingModalModule
        ],
        declarations: [CandidateFormPage, ImageUploadComponent]
    })
], CandidateFormPageModule);
export { CandidateFormPageModule };
//# sourceMappingURL=candidate-form.module.js.map