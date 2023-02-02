import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ExpenseViewPageRoutingModule } from './expense-view-routing.module';

import { ExpenseViewPage } from './expense-view.page';
import {CandidateModule} from "../../../../components/candidate/candidate.module";
import {LoadingModalModule} from "../../../../components/loading-modal/loading-modal.module";
import { NoItemsModule } from 'src/app/components/no-items/no-items.module';
import { StoreModule } from 'src/app/components/store/store.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ExpenseViewPageRoutingModule,
    CandidateModule,
    NoItemsModule,
    LoadingModalModule,
    StoreModule
  ],
  declarations: [ExpenseViewPage]
})
export class ExpenseViewPageModule {}
