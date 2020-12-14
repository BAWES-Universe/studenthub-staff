import { NgModule } from '@angular/core';
import { FileSizePipe } from './filesize.pipe';
import { GroupByPipe } from './group-by.pipe';
import { StoreIdPipe } from './store-id.pipe';
import { TimeAgoPipe } from './timeago.pipe'; 

//import custom pipes here
@NgModule({
    declarations: [ 
        TimeAgoPipe,
        FileSizePipe,
        GroupByPipe,
        StoreIdPipe,
    ],
    imports: [],
    exports: [
        TimeAgoPipe,
        FileSizePipe,
        GroupByPipe,
        StoreIdPipe
    ]
})
export class PipesModule {}