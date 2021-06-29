import { Component, Inject, forwardRef, Input } from '@angular/core';
import { BaseWidget, NgAisInstantSearch } from 'angular-instantsearch';
import { noop } from "angular-instantsearch/esm2015/utils";
import { connectCurrentRefinedValues } from "instantsearch.js/es/connectors";
import { Platform } from "@ionic/angular";
import { CurrencyPipe } from '@angular/common';
import { AgePipe } from 'src/app/pipes/age.pipe';
//services
import { AuthService } from '../../providers/auth.service';


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
        @Inject(forwardRef(() => NgAisInstantSearch))
        public instantSearchParent,
        public authService: AuthService,
        public platform: Platform,
        public currencyPipe: CurrencyPipe
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
            this.createWidget(connectCurrentRefinedValues, options);

            setTimeout(() => { // to protect dual request
                super.ngOnInit();
            },500)
        }
    }

    /**
     * @return boolean
     */
    isHidden() {
        return this.state && this.state.refinements && this.state.refinements.length === 0;
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
        this.state.refine(currentSelection);
    }

    committedTransformItems = (item) => {

        //if(!items)
        //    return [];

        //return items.map(item => {
            if (item.name == "Yes" || item.computedLabel == "Yes")
                item.appliedLabel = 'Committed';
            else if (item.name == "No" || item.computedLabel == "No")
                item.appliedLabel = 'Not committed';

            return item;
        //});
    };

    haveVideoTransformItems = (item) => {

        //if(!items)
        //    return [];

        //return items.map(item => {
            if (item.name == "Yes" || item.computedLabel == "Yes")
                item.appliedLabel = 'Have video';
            else if (item.name == "No" || item.computedLabel == "No")
                item.appliedLabel = 'Not have video';

            return item;
        //});
    };

    haveResumeTransformItems = (item) => {

        //if(!items)
        //    return [];

        //return items.map(item => {
            if (item.name == "Yes" || item.computedLabel == "Yes")
                item.appliedLabel = 'Have resume';
            else if (item.name == "No" || item.computedLabel == "No")
                item.appliedLabel = 'Not have resume';

            return item;
        //});
    };

    licenseTransformItems = (item) => {

        if(!item)
            return [];

        //return items.map(item => {
            if (item.name == "1" || item.computedLabel == "1")
                item.appliedLabel = 'Have license';
            else if (item.name == "2" || item.computedLabel == "2")
                item.appliedLabel = 'Not have license';
            else if (item.name == "0" || item.computedLabel == "0")
                item.appliedLabel = 'No data';

            return item;
        //});
    };

    assignedTransformItems = (item) => {

        if(!item)
            return [];

      //return items.map(item => {
        if (item.name == '0' || item.computedLabel == '0') {
          item.appliedLabel = 'Not Assigned';
        }
        else if (item.name == '1' || item.computedLabel == '1') {
          item.appliedLabel = 'Assigned';
        }

        return item;
      //});
    };

    kuwaitiMomTransformItems = (item) => {

        if(!item)
            return [];

      //return items.map(item => {
        if (item.name == '1' || item.computedLabel == '1') {
          item.appliedLabel = 'Mom Kuwaiti';
        }
        else if (item.name == '2' || item.computedLabel == '2') {
          item.appliedLabel = 'Mom Not Kuwaiti';
        }

        return item;
        //});
    }

    genderTransformItems = (item) => {

        if(!item)
            return [];

        if (item.name == '1' || item.label == '1') {
            item.appliedLabel = 'Male';
        }
        else if (item.name == '2' || item.label == '2') {
            item.appliedLabel = 'Female';
        }
        else if (item.name == '3' || item.label == '3') {
            item.appliedLabel = 'Other';
        }

        return item;
    }

    birthTimestampItems(item) {
        const agePipe = new AgePipe();

        item.appliedLabel =  item.operator + ' ' + agePipe.transform(item.numericValue);

        return item;
    }

    /**
     * Return current selection comma(,) separated
     */
    currentSelections() {

        let buttons = [];

        /*if(this.instantSearchParent.instantSearchInstance.searchParameters.query && this.instantSearchParent.instantSearchInstance.searchParameters.query.length > 0) {
            a.push(this.instantSearchParent.instantSearchInstance.searchParameters.query);
        }*/

        for (let b of this.state.refinements) {

            if (b.attributeName == 'candidate_committed') {
                b = this.committedTransformItems(b);
            }

            else if (b.attributeName == 'have_video') {
                b = this.haveVideoTransformItems(b);
            }

            else if (b.attributeName == 'have_resume') {
                b = this.haveResumeTransformItems(b);
            }

            else if(b.attributeName == 'candidate_birth_timestamp' || b.attributeName == 'candidate_updated_at_timestamp') {
                b = this.birthTimestampItems(b);
            }

            //else if (b.attributeName == 'candidate_gender') {
            //    b = this.genderTransformItems(b);
            //}

            else if (b.attributeName == 'candidate_driving_license') {
                b = this.licenseTransformItems(b);
            }

            else if (b.attributeName == 'assigned') {
                b = this.assignedTransformItems(b);
            }

            else if (b.attributeName == 'candidate_mom_kuwaiti') {
                b = this.kuwaitiMomTransformItems(b);
            }

            buttons.push(b);
        }

        return buttons;
    }

}
