import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CompanyFilterPageRoutingModule } from './company-filter-routing.module';

import { CompanyFilterPage } from './company-filter.page';
import {LoadingModalModule} from 'src/app/components/loading-modal/loading-modal.module';
import {NoItemsModule} from 'src/app/components/no-items/no-items.module';
import {CompanyModule} from 'src/app/components/company/company.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        CompanyFilterPageRoutingModule,
        LoadingModalModule,
        NoItemsModule,
        CompanyModule
    ],
  declarations: [CompanyFilterPage]
})
export class CompanyFilterPageModule {}
