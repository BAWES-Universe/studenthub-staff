import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CandidateIdRequestListPageRoutingModule } from './candidate-id-request-list-routing.module';

import { CandidateIdRequestListPage } from './candidate-id-request-list.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CandidateIdRequestListPageRoutingModule
  ],
  declarations: [CandidateIdRequestListPage]
})
export class CandidateIdRequestListPageModule {}
