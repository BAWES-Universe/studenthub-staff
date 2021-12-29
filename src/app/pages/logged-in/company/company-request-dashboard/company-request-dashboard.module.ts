import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CompanyRequestDashboardPageRoutingModule } from './company-request-dashboard-routing.module';

import { CompanyRequestDashboardPage } from './company-request-dashboard.page';
import { LoadingModalModule } from 'src/app/components/loading-modal/loading-modal.module';
import { PipesModule } from 'src/app/pipes/pipes.module';
import { RequestListingModule } from 'src/app/components/request-listing/request-listing.module';
import {StoryItemModule} from 'src/app/components/story-item/story-item.module';
import { RequestFilterComponent } from 'src/app/components/request-filter/request-filter.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LoadingModalModule,
    PipesModule,
    RequestListingModule,
    StoryItemModule,
    CompanyRequestDashboardPageRoutingModule
  ],
  declarations: [
    CompanyRequestDashboardPage,
    RequestFilterComponent
  ]
})
export class CompanyRequestDashboardPageModule {}
