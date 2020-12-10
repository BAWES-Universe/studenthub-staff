import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { PipesModule } from 'src/app/pipes/pipes.module';
import { CompanyComponent } from './company.component';


@NgModule({
    declarations: [CompanyComponent],
    imports: [
        CommonModule,
        IonicModule,
        PipesModule
    ],
    exports: [CompanyComponent]
})
export class CompanyModule { }
