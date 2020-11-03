import { __decorate, __param } from "tslib";
import { BaseWidget } from 'angular-instantsearch';
import { Component, Input, forwardRef, Inject, ContentChild, TemplateRef } from '@angular/core';
import { noop } from "angular-instantsearch/esm2015/utils";
import { connectInfiniteHits } from "instantsearch.js/es/connectors";
import { InstantSearchComponent } from '../instant-search/instant-search.component';
var __assign = Object.assign || function __assign(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s)
            if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
    }
    return t;
};
let IsInfiniteHitsComponent = class IsInfiniteHitsComponent extends BaseWidget {
    constructor(instantSearchParent) {
        super('IsInfiniteHits');
        this.instantSearchParent = instantSearchParent;
        // render options
        this.showMoreLabel = "Show more results";
        this.state = {
            hits: [],
            isLastPage: false,
            showMore: noop,
            results: []
        };
        /*this.updateState = (state, isFirstRendering) => {
 
            if (isFirstRendering)
                return;

            //to fix: https://www.pivotaltracker.com/story/show/168803810
            
            let hits;

            if(state['results']['page'] == 0) {
                hits = typeof this.transformItems === 'function'
                    ? this.transformItems(state['results']['hits'])
                    : state['results']['hits'];
            } else {
                hits = typeof this.transformItems === 'function'
                    ? this.transformItems(this.state.hits.concat(state['results']['hits']))
                    : this.state.hits.concat(state['results']['hits']);
            }

            this.state = Object.assign({}, state, {
                results: state['results'],
                hits: hits
            });
        };*/
    }
    /**
     * Initialize widget
     */
    ngOnInit() {
        if (this.instantSearchParent) {
            this.createWidget(connectInfiniteHits, {
                escapeHits: true
            });
            super.ngOnInit();
        }
    }
    /**
     * @param {?} event
     * @return {?}
     */
    showMore(event) {
        //event.preventDefault();
        this.state.showMore();
        //infinite scroll complete method to hide loader 
        //event.complete();
    }
};
__decorate([
    ContentChild(TemplateRef, { static: true })
], IsInfiniteHitsComponent.prototype, "template", void 0);
__decorate([
    Input()
], IsInfiniteHitsComponent.prototype, "showMoreLabel", void 0);
__decorate([
    Input()
], IsInfiniteHitsComponent.prototype, "transformItems", void 0);
IsInfiniteHitsComponent = __decorate([
    Component({
        selector: 'is-infinite-hits',
        templateUrl: './is-infinite-hits.component.html',
        styleUrls: ['./is-infinite-hits.component.scss'],
    }),
    __param(0, Inject(forwardRef(() => InstantSearchComponent)))
], IsInfiniteHitsComponent);
export { IsInfiniteHitsComponent };
//# sourceMappingURL=is-infinite-hits.component.js.map