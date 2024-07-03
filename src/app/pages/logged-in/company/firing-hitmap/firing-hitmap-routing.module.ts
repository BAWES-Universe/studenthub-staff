import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FiringHitmapPage } from './firing-hitmap.page';

const routes: Routes = [
  {
    path: '',
    component: FiringHitmapPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FiringHitmapPageRoutingModule {}
