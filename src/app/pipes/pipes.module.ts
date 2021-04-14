import { NgModule } from '@angular/core';
import { AgePipe } from './age.pipe';
import { CandidateAgePipe } from './candidate.age.pipe';
import { FileSizePipe } from './filesize.pipe';
import { GroupByPipe } from './group-by.pipe';
import { StoreIdPipe } from './store-id.pipe';
import { TimeAgoPipe } from './timeago.pipe'; 
import { DurationPipe } from './duration.pipe'; 


//import custom pipes here
@NgModule({
    declarations: [ 
        TimeAgoPipe,
        FileSizePipe,
        GroupByPipe,
        StoreIdPipe,
        AgePipe,
        CandidateAgePipe,
        DurationPipe
    ],
    imports: [],
    exports: [
        TimeAgoPipe,
        FileSizePipe,
        GroupByPipe,
        StoreIdPipe,
        AgePipe,
        CandidateAgePipe,
        DurationPipe
    ]
})
export class PipesModule {}