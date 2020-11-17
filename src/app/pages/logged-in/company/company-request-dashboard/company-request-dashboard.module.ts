import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CompanyRequestDashboardPageRoutingModule } from './company-request-dashboard-routing.module';

import { CompanyRequestDashboardPage } from './company-request-dashboard.page';
import { LoadingModalModule } from 'src/app/components/loading-modal/loading-modal.module';
import { PipesModule } from 'src/app/pipes/pipes.module';
import { RequestListingModule } from 'src/app/components/request-listing/request-listing.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LoadingModalModule,
    PipesModule,
    RequestListingModule,
    CompanyRequestDashboardPageRoutingModule
  ],
  declarations: [CompanyRequestDashboardPage]
})
export class CompanyRequestDashboardPageModule {}
