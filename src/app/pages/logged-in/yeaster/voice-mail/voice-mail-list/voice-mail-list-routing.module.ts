import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VoiceMailListPage } from './voice-mail-list.page';

const routes: Routes = [
  {
    path: '',
    component: VoiceMailListPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VoiceMailListPageRoutingModule {}
