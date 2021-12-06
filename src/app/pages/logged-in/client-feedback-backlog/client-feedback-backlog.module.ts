import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ClientFeedbackBacklogPageRoutingModule } from './client-feedback-backlog-routing.module';

import { ClientFeedbackBacklogPage } from './client-feedback-backlog.page';
import { SuggestionModule } from 'src/app/components/suggestion/suggestion.module';
import { LoadingModalModule } from 'src/app/components/loading-modal/loading-modal.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SuggestionModule,
    LoadingModalModule,
    ClientFeedbackBacklogPageRoutingModule
  ],
  declarations: [ClientFeedbackBacklogPage]
})
export class ClientFeedbackBacklogPageModule {}
