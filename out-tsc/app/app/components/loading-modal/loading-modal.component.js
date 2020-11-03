import { __decorate } from "tslib";
import { Component, Input } from '@angular/core';
let LoadingModalComponent = class LoadingModalComponent {
    constructor() {
    }
    ngOnInit() {
    }
};
__decorate([
    Input()
], LoadingModalComponent.prototype, "type", void 0);
__decorate([
    Input()
], LoadingModalComponent.prototype, "loading", void 0);
LoadingModalComponent = __decorate([
    Component({
        selector: 'loading-modal',
        templateUrl: './loading-modal.component.html',
        styleUrls: ['./loading-modal.component.scss'],
    })
], LoadingModalComponent);
export { LoadingModalComponent };
//# sourceMappingURL=loading-modal.component.js.map