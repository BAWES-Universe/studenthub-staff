import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CompanyNotesPage } from './company-notes.page';

const routes: Routes = [
  {
    path: ':company_id',
    component: CompanyNotesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CompanyNotesPageRoutingModule {}
