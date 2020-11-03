import { __decorate } from "tslib";
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CandidateFormPage } from './candidate-form.page';
const routes = [
    {
        path: '',
        component: CandidateFormPage
    },
    {
        path: ':id',
        component: CandidateFormPage
    }
];
let CandidateFormPageRoutingModule = class CandidateFormPageRoutingModule {
};
CandidateFormPageRoutingModule = __decorate([
    NgModule({
        imports: [RouterModule.forChild(routes)],
        exports: [RouterModule],
    })
], CandidateFormPageRoutingModule);
export { CandidateFormPageRoutingModule };
//# sourceMappingURL=candidate-form-routing.module.js.map