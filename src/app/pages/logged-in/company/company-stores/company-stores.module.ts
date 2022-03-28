import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CompanyStoresPageRoutingModule } from './company-stores-routing.module';

import { CompanyStoresPage } from './company-stores.page';
import { LoadingModalModule } from 'src/app/components/loading-modal/loading-modal.module';
import { NoItemsModule } from 'src/app/components/no-items/no-items.module';
import { StoreModule } from 'src/app/components/store/store.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LoadingModalModule,
    NoItemsModule,
    StoreModule,
    CompanyStoresPageRoutingModule
  ],
  declarations: [CompanyStoresPage]
})
export class CompanyStoresPageModule {}
