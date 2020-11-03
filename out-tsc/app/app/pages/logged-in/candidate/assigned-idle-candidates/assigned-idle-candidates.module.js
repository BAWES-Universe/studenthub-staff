import { __decorate } from "tslib";
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { AssignedIdleCandidatesPageRoutingModule } from './assigned-idle-candidates-routing.module';
import { AssignedIdleCandidatesPage } from './assigned-idle-candidates.page';
import { LoadingModalModule } from 'src/app/components/loading-modal/loading-modal.module';
import { NoItemsModule } from 'src/app/components/no-items/no-items.module';
import { CandidateModule } from 'src/app/components/candidate/candidate.module';
let AssignedIdleCandidatesPageModule = class AssignedIdleCandidatesPageModule {
};
AssignedIdleCandidatesPageModule = __decorate([
    NgModule({
        imports: [
            CommonModule,
            FormsModule,
            IonicModule,
            CandidateModule,
            AssignedIdleCandidatesPageRoutingModule,
            LoadingModalModule,
            NoItemsModule
        ],
        declarations: [AssignedIdleCandidatesPage]
    })
], AssignedIdleCandidatesPageModule);
export { AssignedIdleCandidatesPageModule };
//# sourceMappingURL=assigned-idle-candidates.module.js.map