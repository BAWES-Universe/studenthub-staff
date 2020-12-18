import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CompanyRequestsPageRoutingModule } from './company-requests-routing.module';

import { CompanyRequestsPage } from './company-requests.page';
import { LoadingModalModule } from 'src/app/components/loading-modal/loading-modal.module';
import { PipesModule } from 'src/app/pipes/pipes.module';
import { RequestListingModule } from 'src/app/components/request-listing/request-listing.module';
import {NoItemsModule} from 'src/app/components/no-items/no-items.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LoadingModalModule,
    PipesModule,
    RequestListingModule,
    NoItemsModule,
    CompanyRequestsPageRoutingModule
  ],
  declarations: [CompanyRequestsPage]
})
export class CompanyRequestsPageModule {}
