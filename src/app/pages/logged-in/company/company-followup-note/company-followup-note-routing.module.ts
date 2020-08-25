import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CompanyFollowupNotePage } from './company-followup-note.page';

const routes: Routes = [
  {
    path: '',
    component: CompanyFollowupNotePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CompanyFollowupNotePageRoutingModule {}
