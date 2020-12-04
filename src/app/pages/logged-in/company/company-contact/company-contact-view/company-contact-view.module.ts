import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CompanyContactViewPageRoutingModule } from './company-contact-view-routing.module';

import { CompanyContactViewPage } from './company-contact-view.page';
import { LoadingModalModule } from 'src/app/components/loading-modal/loading-modal.module';
import { PipesModule } from 'src/app/pipes/pipes.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PipesModule,
    LoadingModalModule,
    CompanyContactViewPageRoutingModule
  ],
  declarations: [CompanyContactViewPage]
})
export class CompanyContactViewPageModule {}
