import { __decorate } from "tslib";
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CandidateComponent } from './candidate.component';
import { IonicModule } from '@ionic/angular';
let CandidateModule = class CandidateModule {
};
CandidateModule = __decorate([
    NgModule({
        declarations: [
            CandidateComponent
        ],
        imports: [
            CommonModule,
            IonicModule
        ],
        exports: [
            CandidateComponent
        ]
    })
], CandidateModule);
export { CandidateModule };
//# sourceMappingURL=candidate.module.js.map