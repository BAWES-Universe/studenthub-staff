import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CompanyBrandsPageRoutingModule } from './company-brands-routing.module';

import { CompanyBrandsPage } from './company-brands.page';
import { LoadingModalModule } from 'src/app/components/loading-modal/loading-modal.module';
import { NoItemsModule } from 'src/app/components/no-items/no-items.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LoadingModalModule,
    NoItemsModule,
    CompanyBrandsPageRoutingModule
  ],
  declarations: [CompanyBrandsPage]
})
export class CompanyBrandsPageModule {}
