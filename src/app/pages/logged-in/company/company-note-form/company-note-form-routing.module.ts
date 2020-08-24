import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CompanyNoteFormPage } from './company-note-form.page';

const routes: Routes = [
  {
    path: '',
    component: CompanyNoteFormPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CompanyNoteFormPageRoutingModule {}
