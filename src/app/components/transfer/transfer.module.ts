import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { PipesModule } from 'src/app/pipes/pipes.module';
 
import { TransferComponent } from './transfer.component';


@NgModule({
    declarations: [TransferComponent],
    imports: [ 
        CommonModule,
        IonicModule,
        PipesModule
    ],
    exports: [TransferComponent]
})
export class TransferModule { }