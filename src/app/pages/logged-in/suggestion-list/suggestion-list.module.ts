import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SuggestionListPageRoutingModule } from './suggestion-list-routing.module';

import { SuggestionListPage } from './suggestion-list.page';
import {LoadingModalModule} from 'src/app/components/loading-modal/loading-modal.module';
import { PipesModule } from 'src/app/pipes/pipes.module';
import { SuggestionModule } from 'src/app/components/suggestion/suggestion.module';

@NgModule({
  imports: [

    CommonModule,
    FormsModule,
    PipesModule,
    IonicModule,
    SuggestionModule,
    LoadingModalModule,
    SuggestionListPageRoutingModule,
    LoadingModalModule
  ],
  declarations: [SuggestionListPage]
})
export class  SuggestionListPageModule {}