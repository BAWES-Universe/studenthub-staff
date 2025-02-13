import { Component, Inject, forwardRef, Input, Optional } from '@angular/core';
import { TypedBaseWidget, NgAisIndex, NgAisInstantSearch } from 'angular-instantsearch';
import connectCurrentRefinements, {
  CurrentRefinementsWidgetDescription,
  CurrentRefinementsConnectorParams
} from 'instantsearch.js/es/connectors/current-refinements/connectCurrentRefinements';

import { Platform } from "@ionic/angular";
import { CurrencyPipe, DatePipe } from '@angular/common';
import { AgePipe } from 'src/app/pipes/age.pipe';

//services
import { AuthService } from '../../providers/auth.service';


/**
 * Display filter selection
 * Ref: https://www.algolia.com/doc/api-reference/widgets/current-refinements/angular/
 */
@Component({
    selector: 'applied-filters',
    templateUrl: './applied-filters.component.html',
    styleUrls: ['./applied-filters.component.scss'],
})
export class AppliedFiltersComponent extends TypedBaseWidget<CurrentRefinementsWidgetDescription, CurrentRefinementsConnectorParams> {
    public state: CurrentRefinementsWidgetDescription['renderState']; // Rendering options
    @Input() loading;
    @Input() transformItems;
    @Input() attributes;
    @Input() currencies;

    @Input() labelWithFilter;
    @Input() labelWithoutFilter;


    public total;

    public average = null;

  constructor(
    @Inject(forwardRef(() => NgAisIndex))
    @Optional()
    public parentIndex: NgAisIndex,
    @Inject(forwardRef(() => NgAisInstantSearch))
    public instantSearchInstance: NgAisInstantSearch,
    public authService: AuthService,
    public platform: Platform,
    public currencyPipe: CurrencyPipe
  ) {
    super('AppliedFiltersComponent');

        if (this.instantSearchInstance) {
            this.instantSearchInstance.change.subscribe(() => {
              // console.log(this.instantSearchInstance);
                let lastResults = this.instantSearchInstance.instantSearchInstance.helper.lastResults;

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
        // console.log(this.state);
        let options = {
            includedAttributes: this.attributes
        };

        if (this.instantSearchInstance) {
            this.createWidget(connectCurrentRefinements, options);
            setTimeout(() => { // to protect dual request
                super.ngOnInit();
            },500);
        }
    }

    /**
     * @return boolean
     */
    isHidden() {
        return this.state && this.state['items'] && this.state['items'].length === 0;
        /*&& (
            !this.instantSearchInstance.instantSearchInstance.searchParameters.query ||
            this.instantSearchInstance.instantSearchInstance.searchParameters.query.length == 0
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
            if (item.value == "Yes" || item.computedLabel == "Yes")
                item.label = 'Committed';
            else if (item.value == "No" || item.computedLabel == "No")
                item.label = 'Not committed';

            return item;
        //});
    };

    haveVideoTransformItems = (item) => {

        //if(!items)
        //    return [];

        //return items.map(item => {
            if (item.value == "Yes" || item.computedLabel == "Yes")
                item.label = 'Have video';
            else if (item.value == "No" || item.computedLabel == "No")
                item.label = 'Not have video';

            return item;
        //});
    };

    haveResumeTransformItems = (item) => {

        //if(!items)
        //    return [];

        //return items.map(item => {
            if (item.value == "Yes" || item.computedLabel == "Yes")
                item.label = 'Have resume';
            else if (item.value == "No" || item.computedLabel == "No")
                item.label = 'Not have resume';

            return item;
        //});
    };

    licenseTransformItems = (item) => {

        if(!item)
            return [];

        //return items.map(item => {
            if (item.value == "1" || item.computedLabel == "1")
                item.label = 'Have license';
            else if (item.value == "2" || item.computedLabel == "2")
                item.label = 'Not have license';
            else if (item.value == "0" || item.computedLabel == "0")
                item.label = 'No data';

            return item;
        //});
    };

    assignedTransformItems = (item) => {

        if(!item)
            return [];

      //return items.map(item => {
        if (item.value == 'No' || item.value == '0' || item.computedLabel == '0') {
          item.label = 'Not Assigned';
        }
        else if (item.value == 'Yes' || item.value == '1' || item.computedLabel == '1') {
          item.label = 'Assigned';
        }

        return item;
      //});
    };

    kuwaitiMomTransformItems = (item) => {

        if(!item)
            return [];

      //return items.map(item => {
        if (item.value == '1' || item.computedLabel == '1') {
          item.label = 'Mom Kuwaiti';
        }
        else if (item.value == '2' || item.computedLabel == '2') {
          item.label = 'Mom Not Kuwaiti';
        }

        return item;
        //});
    }

    genderTransformItems = (item) => {

        if(!item)
            return [];

        if (item.value == '1' || item.label == '1') {
            item.label = 'Male';
        }
        else if (item.value == '2' || item.label == '2') {
            item.label = 'Female';
        }
        else if (item.value == '3' || item.label == '3') {
            item.label = 'Other';
        }

        return item;
    }

    birthTimestampItems(item) {
      // console.log(item);
        const agePipe = new AgePipe();
        const label = item.operator == '>='? 'Age Upto' : 'Age From';
        item.label =  label + ' ' + agePipe.transform(item.value);
        return item;
    }

    dateTimestampItems(item) {

        const agePipe = new DatePipe('en-US');

        item.label =  item.operator + ' ' + agePipe.transform(new Date(item.value * 1000), 'yyyy-MM-dd');

        return item;
    }

    /**
     * Return current selection comma(,) separated
     */
    currentSelections() {

        let buttons = [];

        /*if(this.instantSearchInstance.instantSearchInstance.searchParameters.query && this.instantSearchInstance.instantSearchInstance.searchParameters.query.length > 0) {
            a.push(this.instantSearchInstance.instantSearchInstance.searchParameters.query);
        }*/

        for (let a of this.state.items) {
            for(let b of a.refinements) {

                if (b.attribute == 'candidate_committed') {
                    b = this.committedTransformItems(b);
                }

                else if (b.attribute == 'have_video') {
                    b = this.haveVideoTransformItems(b);
                }

                else if (b.attribute == 'have_resume') {
                    b = this.haveResumeTransformItems(b);
                }

                else if (b.attribute == 'candidate_created_at_timestamp' || b.attribute == 'start_date_timestamp') {
                    b = this.dateTimestampItems(b);
                }

                else if(b.attribute == 'candidate_birth_timestamp' || b.attribute == 'candidate_updated_at_timestamp' || b.attribute == 'fulltimer_birth_timestamp') {
                    b = this.birthTimestampItems(b);
                }

                //else if (b.attribute == 'candidate_gender') {
                //    b = this.genderTransformItems(b);
                //}

                else if (b.attribute == 'candidate_driving_license') {
                    b = this.licenseTransformItems(b);
                }
                else if (b.attribute == 'fulltimer_driving_license') {
                    b = this.licenseTransformItems(b);
                }

                else if (b.attribute == 'assigned' || b.attribute == 'fulltimer_employed') {
                    b = this.assignedTransformItems(b);
                }

                else if (b.attribute == 'candidate_mom_kuwaiti') {
                    b = this.kuwaitiMomTransformItems(b);
                }

                buttons.push(b);
            }
        }

        return buttons;
    }

}
