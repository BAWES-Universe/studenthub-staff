import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TagFormPage } from './tag-form.page';

const routes: Routes = [
  {
    path: '',
    component: TagFormPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TagFormPageRoutingModule {}
