import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ExpenseFormPage } from './expense-form.page';

const routes: Routes = [
  {
    path: '',
    component: ExpenseFormPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ExpenseFormPageRoutingModule {}
