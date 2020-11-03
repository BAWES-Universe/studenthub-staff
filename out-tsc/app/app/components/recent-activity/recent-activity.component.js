import { __decorate } from "tslib";
import { Component, Input } from '@angular/core';
let RecentActivityComponent = class RecentActivityComponent {
    constructor() { }
    ngOnInit() { }
    /**
     * format date for safari
     * @param value
     */
    toDate(value) {
        if (!value)
            return;
        return new Date(value.replace(/-/g, '/') + ' UTC');
    }
};
__decorate([
    Input()
], RecentActivityComponent.prototype, "activity", void 0);
__decorate([
    Input()
], RecentActivityComponent.prototype, "request", void 0);
RecentActivityComponent = __decorate([
    Component({
        selector: 'app-recent-activity',
        templateUrl: './recent-activity.component.html',
        styleUrls: ['./recent-activity.component.scss'],
    })
], RecentActivityComponent);
export { RecentActivityComponent };
//# sourceMappingURL=recent-activity.component.js.map