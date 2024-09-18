import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VoiceMailViewPage } from './voice-mail-view.page';

const routes: Routes = [
  {
    path: '',
    component: VoiceMailViewPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VoiceMailViewPageRoutingModule {}
