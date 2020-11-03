import { __decorate } from "tslib";
import { Component, Input } from '@angular/core';
let RequestListingComponent = class RequestListingComponent {
    constructor(authService) {
        this.authService = authService;
        this.showStatus = true;
    }
    ngOnInit() {
    }
    /**
     * Make date readable by Safari
     * @param date
     */
    toDate(date) {
        if (date) {
            return new Date(date.replace(/-/g, '/'));
        }
    }
};
__decorate([
    Input()
], RequestListingComponent.prototype, "request", void 0);
__decorate([
    Input()
], RequestListingComponent.prototype, "showStatus", void 0);
RequestListingComponent = __decorate([
    Component({
        selector: 'request-listing',
        templateUrl: './request-listing.component.html',
        styleUrls: ['./request-listing.component.scss'],
    })
], RequestListingComponent);
export { RequestListingComponent };
//# sourceMappingURL=request-listing.component.js.map