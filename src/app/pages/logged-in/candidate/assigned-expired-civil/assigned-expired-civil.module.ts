import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AssignedExpiredCivilPageRoutingModule } from './assigned-expired-civil-routing.module';

import { AssignedExpiredCivilPage } from './assigned-expired-civil.page';
import { LoadingModalModule } from 'src/app/components/loading-modal/loading-modal.module';
import { NoItemsModule } from 'src/app/components/no-items/no-items.module';
import { CandidateModule } from 'src/app/components/candidate/candidate.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    LoadingModalModule,
    NoItemsModule,
    CandidateModule,
    AssignedExpiredCivilPageRoutingModule
  ],
  declarations: [AssignedExpiredCivilPage]
})
export class AssignedExpiredCivilPageModule {}
