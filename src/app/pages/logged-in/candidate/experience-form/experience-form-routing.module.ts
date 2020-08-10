import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ExperienceFormPage } from './experience-form.page';

const routes: Routes = [
  {
    path: '',
    component: ExperienceFormPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ExperienceFormPageRoutingModule {}
