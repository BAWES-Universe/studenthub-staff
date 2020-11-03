import { __decorate } from "tslib";
import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SelectSearchPageComponent } from './select-search-page/select-search-page.component';
import { SelectSearchInputComponent } from './select-search-input/select-search-input.component';
let SelectSearchModule = class SelectSearchModule {
};
SelectSearchModule = __decorate([
    NgModule({
        declarations: [SelectSearchInputComponent, SelectSearchPageComponent],
        entryComponents: [SelectSearchPageComponent],
        imports: [IonicModule, FormsModule, CommonModule],
        exports: [SelectSearchInputComponent]
    })
], SelectSearchModule);
export { SelectSearchModule };
//# sourceMappingURL=select-search.module.js.map