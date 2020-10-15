import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AllCompanyListPageRoutingModule } from './all-company-list-routing.module';

import { AllCompanyListPage } from './all-company-list.page';
import {LoadingModalModule} from 'src/app/components/loading-modal/loading-modal.module';
import {NoItemsModule} from 'src/app/components/no-items/no-items.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        AllCompanyListPageRoutingModule,
        LoadingModalModule,
        NoItemsModule
    ],
  declarations: [AllCompanyListPage]
})
export class AllCompanyListPageModule {}
