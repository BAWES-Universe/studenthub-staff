import { __decorate } from "tslib";
import { Component, Output, EventEmitter } from '@angular/core';
/**
 * Display alert message to update app on new version availability
 */
let UpdateAlertComponent = class UpdateAlertComponent {
    constructor() {
        this.onRefresh = new EventEmitter();
        this.onClose = new EventEmitter();
    }
    ngOnInit() { }
    /**
     * Reload app
     */
    refresh() {
        this.onRefresh.emit();
    }
    /**
     * close update prompt
     */
    close() {
        this.onClose.emit();
    }
};
__decorate([
    Output()
], UpdateAlertComponent.prototype, "onRefresh", void 0);
__decorate([
    Output()
], UpdateAlertComponent.prototype, "onClose", void 0);
UpdateAlertComponent = __decorate([
    Component({
        selector: 'update-alert',
        templateUrl: './update-alert.component.html',
        styleUrls: ['./update-alert.component.scss'],
    })
], UpdateAlertComponent);
export { UpdateAlertComponent };
//# sourceMappingURL=update-alert.component.js.map