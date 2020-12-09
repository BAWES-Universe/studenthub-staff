import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NoteViewPage } from './note-view.page';

const routes: Routes = [
  {
    path: ':note_uuid',
    component: NoteViewPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NoteViewPageRoutingModule {}
