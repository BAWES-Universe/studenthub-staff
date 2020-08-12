import { Component, Inject, forwardRef, Input } from '@angular/core';
import { BaseWidget } from 'angular-instantsearch';
import { capitalize, noop } from "angular-instantsearch/esm2015/utils";
import { connectCurrentRefinements } from "instantsearch.js/es/connectors";
import * as tslib_1 from "tslib";
import { Platform } from "@ionic/angular";
import { CurrencyPipe } from '@angular/common';
//services
import { AuthService } from '../../providers/auth.service';
import { TranslateLabelService } from '../../providers/translate-label.service';
//component
import { InstantSearchComponent } from '../instant-search/instant-search.component';


/**
 * Display filter selection
 */
@Component({
    selector: 'applied-filters',
    templateUrl: './applied-filters.component.html',
    styleUrls: ['./applied-filters.component.scss'],
})
export class AppliedFiltersComponent extends BaseWidget {

    @Input() loading;
    @Input() transformItems;
    @Input() attributes;
    @Input() currencies;

    @Input() labelWithFilter;
    @Input() labelWithoutFilter;

    public state;
    public total;

    public average = null;

    constructor(
        @Inject(forwardRef(() => InstantSearchComponent))
        public instantSearchParent,
        public authService: AuthService,
        public platform: Platform,
        public currencyPipe: CurrencyPipe,
        public _translateService: TranslateLabelService
    ) {
        super('AppliedFiltersComponent');

        this.state = {
            attributes: {},
            clearAllClick: noop,
            clearAllURL: noop,
            createURL: noop,
            refine: noop,
            items: []
        };

        if (this.instantSearchParent) {
            this.instantSearchParent.change.subscribe(() => {

                let lastResults = this.instantSearchParent.instantSearchInstance.helper.lastResults;

                if (lastResults) {

                    this.total = lastResults.nbHits;
                }
            });
        }
    }

    /**
     * Initialize widget
     */
    public ngOnInit() {

        let options = {
            includedAttributes: this.attributes
        };

        if (this.instantSearchParent) {
            this.createWidget(connectCurrentRefinements, options);

            setTimeout(() => { // to protect dual request
                super.ngOnInit();
            },500)
        }
    }

    /*_createClearAllURL = function () {
      return connectCurrentRefinedValues.createURL(connectCurrentRefinedValues.clearRefinements({ helper: helper, whiteList: restrictedTo, clearsQuery: clearsQuery }));
    };*/

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
     * @return boolean
     */
    isHidden() {
        return this.state.items && this.state.items.length === 0;
        /*&& (
            !this.instantSearchParent.instantSearchInstance.searchParameters.query ||
            this.instantSearchParent.instantSearchInstance.searchParameters.query.length == 0
        );*/
    }

    /**
     * remove current selection
     * @param currentSelection
     */
    toggleCurrentSelection(currentSelection) {
        this.instantSearchParent.instantSearchInstance.helper.setPage(0);//for security in case facet clear not updating page number
        currentSelection.refine(currentSelection);
    }

    /**
     * Return current selection comma(,) separated
     */
    currentSelections() {

        let buttons = [];

        /*if(this.instantSearchParent.instantSearchInstance.searchParameters.query && this.instantSearchParent.instantSearchInstance.searchParameters.query.length > 0) {
            a.push(this.instantSearchParent.instantSearchInstance.searchParameters.query);
        }*/

        for (let b of this.state.items) {

            let refinements = b.refinements;

            if (b.attribute == 'candidate_driving_license') {
                refinements = this.licenseTransformItems(b.refinements);
            }

            if (b.attribute == 'assigned') {
                refinements = this.assignedTransformItems(b.refinements);
            }

            for (let c of refinements) {

                c.attribute = b.attribute;
                c.refine = b.refine;//function to clear refinement

                buttons.push(c);
            }
        }

        return buttons;
    }

    licenseTransformItems = (items) => {

        return items.map(item => {
            if (item.name == "1" || item.label == "1")
                item.label = item.highlighted = item.name = this._translateService.transform('Have license');
            else if (item.name == "2" || item.label == "2")
                item.label = item.highlighted = item.name = this._translateService.transform('Not have license');
            else if (item.name == "0" || item.label == "0")
                item.label = item.highlighted = item.name = this._translateService.transform('No data');

            return item;
        });
    };

    assignedTransformItems = (items) => {

      return items.map(item => {
        if (item.name == '0' || item.label == '0') {
          item.label = item.highlighted = item.name = this._translateService.transform('Not Assigned');
        }
        else if (item.name == '1' || item.label == '1') {
          item.label = item.highlighted = item.name = this._translateService.transform('Assigned');
        }

        return item;
      });
    };
}
