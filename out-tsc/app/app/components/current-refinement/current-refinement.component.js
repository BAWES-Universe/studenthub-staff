import { __decorate, __param } from "tslib";
import { Component, Inject, forwardRef, Input, ViewEncapsulation } from '@angular/core';
import { BaseWidget } from 'angular-instantsearch';
import { capitalize, noop } from "angular-instantsearch/esm2015/utils";
import { connectCurrentRefinements } from "instantsearch.js/es/connectors";
import * as tslib_1 from "tslib";
import { InstantSearchComponent } from '../instant-search/instant-search.component';
let CurrentRefinementComponent = class CurrentRefinementComponent extends BaseWidget {
    constructor(instantSearchParent, _translateService) {
        super('CurrentRefinementComponent');
        this.instantSearchParent = instantSearchParent;
        this._translateService = _translateService;
        this.clearsQuery = false;
        this.state = {
            attributes: {},
            clearAllClick: noop,
            clearAllURL: noop,
            createURL: noop,
            refine: noop,
            items: []
        };
    }
    /**
     * Initialize widget
     */
    ngOnInit() {
        this.attributes = [this.attribute];
        let options = {
            includedAttributes: this.attributes
        };
        //connectCurrentRefinedValues
        if (this.instantSearchParent) {
            this.createWidget(connectCurrentRefinements, options);
            super.ngOnInit();
        }
    }
    /**
     * Return current selection for given attribute
     */
    refinements() {
        /** @type {?} */
        var items = typeof this.transformItems === "function"
            ? this.transformItems(this.state.items)
            : this.state.items;
        // group refinements by category? (attribute && type)
        return items.reduce(function (res, _a) {
            var type = _a.type, attribute = _a.attribute, refinement = tslib_1.__rest(_a, ["type", "attribute"]);
            /** @type {?} */
            var match = res.find(function (r) { return r.attribute === attribute && r.type === type; });
            if (match) {
                match.items.push(tslib_1.__assign({ type: type, attribute: attribute }, refinement));
            }
            else {
                res.push({
                    type: type,
                    attribute: attribute,
                    label: capitalize(attribute),
                    items: [tslib_1.__assign({ type: type, attribute: attribute }, refinement)]
                });
            }
            return res;
        }, []);
    }
    json() {
        return JSON.stringify(this.refinements, null, 4);
    }
    /**
     * @param {?} event
     * @param array refinement
     * @return null
     */
    handleClick(event, refinement) {
        event.preventDefault();
        event.stopPropagation();
        this.state.refine(refinement);
    }
    /**
     * @param {?} event
     * @return null
     */
    handleClearAllClick(event) {
        //let helper = this.instantSearchParent.instantSearchInstance.helper; 
        //on location clear, show results sorted by location 
        /*if(this.attribute == 'currentLocations.ar' || this.attribute == 'currentLocations.en') {
            helper.setQueryParameter('getRankingInfo', true);
            helper.setQueryParameter('aroundLatLngViaIP', true);
            helper.setQueryParameter('aroundRadius', 'all');
        }*/
        this.instantSearchParent.instantSearchInstance.helper.clearRefinements(this.attribute);
        this.instantSearchParent.instantSearchInstance.refresh();
        event.preventDefault();
        event.stopPropagation();
    }
    /**
     * @return boolean
     */
    isHidden() {
        return this.state.items.length === 0; // && this.autoHideContainer;
    }
    /**
     * Return current selection comma(,) separated
     */
    currentSelections() {
        let a = [];
        for (let b of this.state.items) {
            let refinements = typeof this.transformItems === "function"
                ? this.transformItems(b.refinements) : b.refinements;
            for (let c of refinements) {
                a.push(c.label);
            }
        }
        return a.join(', ');
    }
};
__decorate([
    Input()
], CurrentRefinementComponent.prototype, "attribute", void 0);
__decorate([
    Input()
], CurrentRefinementComponent.prototype, "transformItems", void 0);
CurrentRefinementComponent = __decorate([
    Component({
        selector: 'current-refinement',
        templateUrl: './current-refinement.component.html',
        styleUrls: ['./current-refinement.component.scss'],
        encapsulation: ViewEncapsulation.None
    }),
    __param(0, Inject(forwardRef(() => InstantSearchComponent)))
], CurrentRefinementComponent);
export { CurrentRefinementComponent };
//# sourceMappingURL=current-refinement.component.js.map