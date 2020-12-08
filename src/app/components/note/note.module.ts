import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
 
import { NoteComponent } from './note.component';


@NgModule({
    declarations: [NoteComponent],
    imports: [ 
        CommonModule,
        IonicModule
    ],
    exports: [NoteComponent]
})
export class NoteModule { }