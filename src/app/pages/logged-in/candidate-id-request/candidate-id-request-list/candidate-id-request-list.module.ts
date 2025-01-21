import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CandidateIdRequestListPageRoutingModule } from './candidate-id-request-list-routing.module';

import { CandidateIdRequestListPage } from './candidate-id-request-list.page';
import { PipesModule } from 'src/app/pipes/pipes.module';
import { NoItemsModule } from 'src/app/components/no-items/no-items.module';
import { LoadingModalModule } from 'src/app/components/loading-modal/loading-modal.module';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule,
    CandidateIdRequestListPageRoutingModule,
    LoadingModalModule,
    NoItemsModule,
    PipesModule,
  ],
  declarations: [CandidateIdRequestListPage]
})
export class CandidateIdRequestListPageModule {}
