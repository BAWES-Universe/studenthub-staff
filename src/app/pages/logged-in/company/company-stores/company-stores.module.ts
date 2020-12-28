import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CompanyStoresPageRoutingModule } from './company-stores-routing.module';

import { CompanyStoresPage } from './company-stores.page';
import { LoadingModalModule } from 'src/app/components/loading-modal/loading-modal.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LoadingModalModule,
    CompanyStoresPageRoutingModule
  ],
  declarations: [CompanyStoresPage]
})
export class CompanyStoresPageModule {}
