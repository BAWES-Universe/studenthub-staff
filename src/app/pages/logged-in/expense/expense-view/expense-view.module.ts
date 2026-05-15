import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ExpenseViewRoutingModule } from './expense-view-routing.module';

import { ExpenseViewPage } from './expense-view.page';
import { NgxSliderModule } from '@angular-slider/ngx-slider';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    NgxSliderModule,
    ExpenseViewRoutingModule
  ],
  declarations: [ExpenseViewPage]
})
export class ExpenseViewPageModule {}
