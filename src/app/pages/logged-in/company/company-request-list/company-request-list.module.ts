import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CompanyRequestListPageRoutingModule } from './company-request-list-routing.module';

import { CompanyRequestListPage } from './company-request-list.page';
import { LoadingModalModule } from 'src/app/components/loading-modal/loading-modal.module';
import { PipesModule } from 'src/app/pipes/pipes.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LoadingModalModule,
    PipesModule,
    CompanyRequestListPageRoutingModule
  ],
  declarations: [CompanyRequestListPage]
})
export class CompanyRequestListPageModule {}
