import { __decorate } from "tslib";
import { NgModule } from '@angular/core';
import { FileSizePipe } from './filesize.pipe';
import { TimeAgoPipe } from './timeago.pipe';
//import custom pipes here
let PipesModule = class PipesModule {
};
PipesModule = __decorate([
    NgModule({
        declarations: [
            TimeAgoPipe,
            FileSizePipe
        ],
        imports: [],
        exports: [
            TimeAgoPipe,
            FileSizePipe
        ]
    })
], PipesModule);
export { PipesModule };
//# sourceMappingURL=pipes.module.js.map