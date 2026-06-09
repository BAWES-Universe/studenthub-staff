import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ExpenseFormRoutingModule } from './expense-form-routing.module';

import { ExpenseFormPage } from './expense-form.page';
import { NgxSliderModule } from '@angular-slider/ngx-slider';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    NgxSliderModule,
    ExpenseFormRoutingModule
  ],
  declarations: [ExpenseFormPage]
})
export class ExpenseFormPageModule {}
