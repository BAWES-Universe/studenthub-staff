import { __decorate } from "tslib";
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ExperienceFormPage } from './experience-form.page';
const routes = [
    {
        path: '',
        component: ExperienceFormPage
    }
];
let ExperienceFormPageRoutingModule = class ExperienceFormPageRoutingModule {
};
ExperienceFormPageRoutingModule = __decorate([
    NgModule({
        imports: [RouterModule.forChild(routes)],
        exports: [RouterModule],
    })
], ExperienceFormPageRoutingModule);
export { ExperienceFormPageRoutingModule };
//# sourceMappingURL=experience-form-routing.module.js.map