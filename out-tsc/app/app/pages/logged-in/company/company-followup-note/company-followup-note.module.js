import { __decorate } from "tslib";
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { CompanyFollowupNotePageRoutingModule } from './company-followup-note-routing.module';
import { CompanyFollowupNotePage } from './company-followup-note.page';
let CompanyFollowupNotePageModule = class CompanyFollowupNotePageModule {
};
CompanyFollowupNotePageModule = __decorate([
    NgModule({
        imports: [
            CommonModule,
            FormsModule,
            IonicModule,
            CompanyFollowupNotePageRoutingModule
        ],
        declarations: [CompanyFollowupNotePage]
    })
], CompanyFollowupNotePageModule);
export { CompanyFollowupNotePageModule };
//# sourceMappingURL=company-followup-note.module.js.map