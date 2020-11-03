import { __decorate } from "tslib";
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CompanyNoteFormPage } from './company-note-form.page';
const routes = [
    {
        path: '',
        component: CompanyNoteFormPage
    }
];
let CompanyNoteFormPageRoutingModule = class CompanyNoteFormPageRoutingModule {
};
CompanyNoteFormPageRoutingModule = __decorate([
    NgModule({
        imports: [RouterModule.forChild(routes)],
        exports: [RouterModule],
    })
], CompanyNoteFormPageRoutingModule);
export { CompanyNoteFormPageRoutingModule };
//# sourceMappingURL=company-note-form-routing.module.js.map