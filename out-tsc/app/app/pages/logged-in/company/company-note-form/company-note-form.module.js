import { __decorate } from "tslib";
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { CompanyNoteFormPageRoutingModule } from './company-note-form-routing.module';
import { CompanyNoteFormPage } from './company-note-form.page';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
let CompanyNoteFormPageModule = class CompanyNoteFormPageModule {
};
CompanyNoteFormPageModule = __decorate([
    NgModule({
        imports: [
            CommonModule,
            FormsModule,
            IonicModule,
            ReactiveFormsModule,
            CKEditorModule,
            CompanyNoteFormPageRoutingModule
        ],
        declarations: [CompanyNoteFormPage]
    })
], CompanyNoteFormPageModule);
export { CompanyNoteFormPageModule };
//# sourceMappingURL=company-note-form.module.js.map