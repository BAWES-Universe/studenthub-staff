import { __decorate } from "tslib";
import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { IsFacetsSearchComponent } from './is-facets-search.component';
import { NgAisModule } from 'angular-instantsearch';
import { TranslateModule } from '@ngx-translate/core';
let IsFacetsSearchModule = class IsFacetsSearchModule {
};
IsFacetsSearchModule = __decorate([
    NgModule({
        declarations: [
            IsFacetsSearchComponent
        ],
        imports: [
            IonicModule,
            NgAisModule,
            TranslateModule.forChild(),
        ],
        exports: [
            IsFacetsSearchComponent
        ]
    })
], IsFacetsSearchModule);
export { IsFacetsSearchModule };
//# sourceMappingURL=is-facets-search.module.js.map