import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SuggestionViewPageRoutingModule } from './suggestion-view-routing.module';

import { SuggestionViewPage } from './suggestion-view.page';
import { LoadingModalModule } from 'src/app/components/loading-modal/loading-modal.module';
import { PipesModule } from 'src/app/pipes/pipes.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LoadingModalModule,
    PipesModule,
    SuggestionViewPageRoutingModule
  ],
  declarations: [SuggestionViewPage]
})
export class SuggestionViewPageModule {}
