import { __decorate } from "tslib";
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CompanyFollowupNotePage } from './company-followup-note.page';
const routes = [
    {
        path: '',
        component: CompanyFollowupNotePage
    }
];
let CompanyFollowupNotePageRoutingModule = class CompanyFollowupNotePageRoutingModule {
};
CompanyFollowupNotePageRoutingModule = __decorate([
    NgModule({
        imports: [RouterModule.forChild(routes)],
        exports: [RouterModule],
    })
], CompanyFollowupNotePageRoutingModule);
export { CompanyFollowupNotePageRoutingModule };
//# sourceMappingURL=company-followup-note-routing.module.js.map