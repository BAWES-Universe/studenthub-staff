import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ModalPopPage } from './modal-pop.page';


const routes: Routes = [
    {
        path: 'modal-pop',
        component: ModalPopPage,
    }];

@NgModule({
    imports: [
        RouterModule.forChild(routes)
    ],
    exports: [RouterModule]
})
export class ModalPopRoutingModule { }
