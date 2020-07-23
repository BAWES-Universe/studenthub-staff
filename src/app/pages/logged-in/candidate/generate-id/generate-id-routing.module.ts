import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GenerateIdPage } from './generate-id.page';

const routes: Routes = [
  {
    path: '',
    component: GenerateIdPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GenerateIdPageRoutingModule {}
