import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CompanyMallsPageRoutingModule } from './company-malls-routing.module';

import { CompanyMallsPage } from './company-malls.page';
import { LoadingModalModule } from 'src/app/components/loading-modal/loading-modal.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LoadingModalModule,
    CompanyMallsPageRoutingModule
  ],
  declarations: [CompanyMallsPage]
})
export class CompanyMallsPageModule {}
