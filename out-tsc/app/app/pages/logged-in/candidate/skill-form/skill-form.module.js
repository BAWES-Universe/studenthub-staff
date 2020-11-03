import { __decorate } from "tslib";
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { SkillFormPageRoutingModule } from './skill-form-routing.module';
import { SkillFormPage } from './skill-form.page';
import { TranslateModule } from '@ngx-translate/core';
let SkillFormPageModule = class SkillFormPageModule {
};
SkillFormPageModule = __decorate([
    NgModule({
        imports: [
            CommonModule,
            FormsModule,
            IonicModule,
            TranslateModule.forChild(),
            SkillFormPageRoutingModule
        ],
        declarations: [SkillFormPage]
    })
], SkillFormPageModule);
export { SkillFormPageModule };
//# sourceMappingURL=skill-form.module.js.map