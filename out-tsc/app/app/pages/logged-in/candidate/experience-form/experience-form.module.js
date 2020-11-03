import { __decorate } from "tslib";
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ExperienceFormPageRoutingModule } from './experience-form-routing.module';
import { ExperienceFormPage } from './experience-form.page';
let ExperienceFormPageModule = class ExperienceFormPageModule {
};
ExperienceFormPageModule = __decorate([
    NgModule({
        imports: [
            CommonModule,
            FormsModule,
            ReactiveFormsModule,
            IonicModule,
            ExperienceFormPageRoutingModule
        ],
        declarations: [ExperienceFormPage]
    })
], ExperienceFormPageModule);
export { ExperienceFormPageModule };
//# sourceMappingURL=experience-form.module.js.map