import { __decorate } from "tslib";
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SkillFormPage } from './skill-form.page';
const routes = [
    {
        path: '',
        component: SkillFormPage
    }
];
let SkillFormPageRoutingModule = class SkillFormPageRoutingModule {
};
SkillFormPageRoutingModule = __decorate([
    NgModule({
        imports: [RouterModule.forChild(routes)],
        exports: [RouterModule],
    })
], SkillFormPageRoutingModule);
export { SkillFormPageRoutingModule };
//# sourceMappingURL=skill-form-routing.module.js.map