import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CompanyRequestViewRoutingModule } from './company-request-view-routing.module';

import { CompanyRequestViewPage } from './company-request-view.page';
import { LoadingModalModule } from 'src/app/components/loading-modal/loading-modal.module';
import { PipesModule } from 'src/app/pipes/pipes.module';
import { RecentActivityComponent } from 'src/app/components/recent-activity/recent-activity.component';
import { SuggestionModule } from 'src/app/components/suggestion/suggestion.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    PipesModule,
    IonicModule,
    SuggestionModule,
    LoadingModalModule,
    CompanyRequestViewRoutingModule
  ],
  declarations: [CompanyRequestViewPage, RecentActivityComponent]
})
export class CompanyRequestViewPageModule { }
