import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FulltimerNotesPage } from './fulltimer-notes.page';

const routes: Routes = [
  {
    path: ':fulltimer_uuid',
    component: FulltimerNotesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FulltimerNotesPageRoutingModule {}
