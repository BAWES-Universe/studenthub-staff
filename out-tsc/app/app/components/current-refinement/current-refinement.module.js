import { __decorate } from "tslib";
import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { NgAisModule } from 'angular-instantsearch';
import { TranslateModule } from '@ngx-translate/core';
import { CurrentRefinementComponent } from './current-refinement.component';
import { CommonModule } from '@angular/common';
let CurrentRefinementModule = class CurrentRefinementModule {
};
CurrentRefinementModule = __decorate([
    NgModule({
        declarations: [
            CurrentRefinementComponent
        ],
        imports: [
            IonicModule,
            CommonModule,
            NgAisModule,
            TranslateModule.forChild(),
        ],
        exports: [
            CurrentRefinementComponent
        ]
    })
], CurrentRefinementModule);
export { CurrentRefinementModule };
//# sourceMappingURL=current-refinement.module.js.map