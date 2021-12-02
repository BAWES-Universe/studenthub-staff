import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FeedbackBacklogPageRoutingModule } from './feedback-backlog-routing.module';

import { FeedbackBacklogPage } from './feedback-backlog.page';
import {LoadingModalModule} from 'src/app/components/loading-modal/loading-modal.module';
import { PipesModule } from 'src/app/pipes/pipes.module';
import { RequestListingModule } from 'src/app/components/request-listing/request-listing.module';


@NgModule({
  imports: [

    CommonModule,
    FormsModule,
    PipesModule,
    IonicModule,
    RequestListingModule,
    LoadingModalModule,
    FeedbackBacklogPageRoutingModule,
    LoadingModalModule
  ],
  declarations: [FeedbackBacklogPage]
})
export class FeedbackBacklogPageModule {}