import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SkillFormPage } from './skill-form.page';

const routes: Routes = [
  {
    path: '',
    component: SkillFormPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SkillFormPageRoutingModule {}
