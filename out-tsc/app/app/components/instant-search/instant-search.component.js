import { __decorate } from "tslib";
import { Component, Input, EventEmitter, Output } from '@angular/core';
import instantsearch from 'instantsearch.js/es';
/**
 * Component to cope with secure key update after expiration
 */
let InstantSearchComponent = class InstantSearchComponent {
    constructor() {
        this.searchParameters = {};
        this.change = new EventEmitter();
        this.instanceName = 'default';
        this.onRender = _ => {
            this.change.emit({
                helper: this.instantSearchInstance.helper,
                results: this.instantSearchInstance.helper.lastResults,
                state: this.instantSearchInstance.helper.state
            });
        };
        // add default searchParameters with highlighting config
        if (!this.searchParameters) {
            this.searchParameters = {};
        }
        this.searchParameters = Object.assign(this.searchParameters, {
            highlightPreTag: '__ais-highlight__',
            highlightPostTag: '__/ais-highlight__'
        });
    }
    ngOnInit() {
        this.createInstantSearchInstance(this.config);
    }
    ngAfterViewInit() {
        if (this.instantSearchInstance && !this.instantSearchInstance.started) {
            this.instantSearchInstance.start();
        }
    }
    ngOnDestroy() {
        // this.instantSearchInstance.removeListener('render', this.onRender);
        // this.instantSearchInstance.dispose();
    }
    createInstantSearchInstance(config) {
        // remove URLSync widget if on SSR
        /*if (!common.isPlatformBrowser(this.platformId)) {
            if (typeof config.urlSync !== "undefined")
                delete config.urlSync;
            if (typeof config.routing !== "undefined")
                delete config.routing;
        }*/
        // instantsearch
        this.instantSearchInstance = instantsearch(config);
        this.instantSearchInstance.on('render', this.onRender);
    }
    addWidget(widget) {
        this.instantSearchInstance.addWidget(widget);
    }
    removeWidget(widget) {
        this.instantSearchInstance.removeWidget(widget);
    }
    refresh() {
        this.instantSearchInstance.refresh();
    }
};
__decorate([
    Input()
], InstantSearchComponent.prototype, "searchParameters", void 0);
__decorate([
    Input()
], InstantSearchComponent.prototype, "instantSearchInstance", void 0);
__decorate([
    Input()
], InstantSearchComponent.prototype, "config", void 0);
__decorate([
    Output()
], InstantSearchComponent.prototype, "change", void 0);
InstantSearchComponent = __decorate([
    Component({
        selector: 'instant-search',
        templateUrl: './instant-search.component.html',
        styleUrls: ['./instant-search.component.scss'],
    })
], InstantSearchComponent);
export { InstantSearchComponent };
//# sourceMappingURL=instant-search.component.js.map