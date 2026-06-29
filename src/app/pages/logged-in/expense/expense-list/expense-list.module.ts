import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ExpenseListRoutingModule } from './expense-list-routing.module';

import { ExpenseListPage } from './expense-list.page';
import { NgxSliderModule } from '@angular-slider/ngx-slider';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    NgxSliderModule,
    ExpenseListRoutingModule
  ],
  declarations: [ExpenseListPage]
})
export class ExpenseListPageModule {}
