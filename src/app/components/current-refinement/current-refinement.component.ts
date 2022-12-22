import { Component, Inject, forwardRef, Input, ViewEncapsulation, Optional } from '@angular/core';
import { BaseWidget, NgAisIndex, NgAisInstantSearch } from 'angular-instantsearch';
import { noop } from "angular-instantsearch/esm2015/utils";
import { AgePipe } from 'src/app/pipes/age.pipe';
import { connectCurrentRefinements } from "instantsearch.js/es/connectors";
import { CurrentRefinementsRenderState } from 'instantsearch.js/es/connectors/current-refinements/connectCurrentRefinements';


@Component({
    selector: 'current-refinement',
    templateUrl: './current-refinement.component.html',
    styleUrls: ['./current-refinement.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class CurrentRefinementComponent extends BaseWidget {

    @Input() attribute;
    @Input() transformItems;

    public attributes;
    public clearsQuery;
    public state;

    constructor(
        @Inject(forwardRef(() => NgAisInstantSearch))
        public instantSearchInstance,
        @Optional()
        public parentIndex: NgAisIndex,
    ) {
        super('CurrentRefinementComponent');

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
    public ngOnInit() {

        this.attributes = [this.attribute];

        let options = {
            includedAttributes: this.attributes
        };

        //connectCurrentRefinedValues
        if(this.instantSearchInstance) { 
            this.createWidget(connectCurrentRefinements, options);
            super.ngOnInit();
        }
    }

    json() {
        return JSON.stringify(this.state.refinements, null, 4);
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

        //let helper = this.instantSearchInstance.instantSearchInstance.helper; 

        //on location clear, show results sorted by location 

        /*if(this.attribute == 'currentLocations.ar' || this.attribute == 'currentLocations.en') { 
            helper.setQueryParameter('getRankingInfo', true);
            helper.setQueryParameter('aroundLatLngViaIP', true);
            helper.setQueryParameter('aroundRadius', 'all');
        }*/

        this.instantSearchInstance.instantSearchInstance.helper.clearRefinements(this.attribute);
        this.instantSearchInstance.instantSearchInstance.refresh();
        
        event.preventDefault();
        event.stopPropagation();
    }

    /**
     * @return boolean 
     */
    isHidden() {
        return this.state.refinements && 
            this.state.refinements.filter(b => b.attributeName == this.attribute).length === 0;// && this.autoHideContainer;
    }

    birthTimestampItems(item) {
        const agePipe = new AgePipe();

        item.computedLabel = agePipe.transform(item.value);

        return item;
    }

    /**
     * Return current selection comma(,) separated 
     */
    currentSelections() {
        
        if(!this.state || !this.state.refinements) {
            return false;    
        }

        let a = [];

        for (let b of this.state.refinements) {
            
            if(this.attribute && b.attributeName != this.attribute)
                continue;
        
            if (b.attributeName == 'candidate_birth_timestamp') {
                b = this.birthTimestampItems(b);
            }

            else if (b.attributeName == 'candidate_driving_license') {
                b = this.licenseTransformItems(b);
            }

            else if (b.attributeName == 'assigned') {
                b = this.assignedTransformItems(b);
            }

            else if (b.attributeName == 'candidate_mom_kuwaiti') {
                b = this.kuwaitiMomTransformItems(b);
            }
            
           /* if (b.attributeName == 'candidate_committed') {
                b = this.committedTransformItems(b);
            }

            else if (b.attributeName == 'have_video') {
                b = this.haveVideoTransformItems(b);
            }

            else if (b.attributeName == 'have_resume') {
                b = this.haveResumeTransformItems(b);
            }*/

            a.push(b.computedLabel);
        }

        return a.join(', ');
    }

    committedTransformItems = (item) => {

        //if(!items)
        //    return [];

        //return items.map(item => {
            if (item.name == "Yes" || item.computedLabel == "Yes")
                item.computedLabel = item.highlighted = item.name = 'Committed';
            else if (item.name == "No" || item.computedLabel == "No")
                item.computedLabel = item.highlighted = item.name = 'Not committed';

            return item;
        //});
    };

    haveVideoTransformItems = (item) => {

        //if(!items)
        //    return [];

        //return items.map(item => {
            if (item.name == "Yes" || item.computedLabel == "Yes")
                item.computedLabel = item.highlighted = item.name = 'Have video';
            else if (item.name == "No" || item.computedLabel == "No")
                item.computedLabel = item.highlighted = item.name = 'Not have video';

            return item;
        //});
    };

    haveResumeTransformItems = (item) => {

        //if(!items)
        //    return [];

        //return items.map(item => {
            if (item.name == "Yes" || item.computedLabel == "Yes")
                item.computedLabel = item.highlighted = item.name = 'Have resume';
            else if (item.name == "No" || item.computedLabel == "No")
                item.computedLabel = item.highlighted = item.name = 'Not have resume';

            return item;
        //});
    };

    licenseTransformItems = (item) => {

        if(!item)
            return [];

        //return items.map(item => {
            if (item.name == "1" || item.computedLabel == "1")
                item.computedLabel = item.highlighted = item.name = 'Yes';
            else if (item.name == "2" || item.computedLabel == "2")
                item.computedLabel = item.highlighted = item.name = 'No';
            else if (item.name == "0" || item.computedLabel == "0")
                item.computedLabel = item.highlighted = item.name = 'No data';

            return item;
        //});
    };

    assignedTransformItems = (item) => {

        if(!item)
            return [];

      //return items.map(item => {
        if (item.name == '0' || item.computedLabel == '0') {
          item.computedLabel = item.highlighted = item.name = 'Not Assigned';
        }
        else if (item.name == '1' || item.computedLabel == '1') {
          item.computedLabel = item.highlighted = item.name = 'Assigned';
        }

        return item;
      //});
    };

    kuwaitiMomTransformItems = (item) => {

        if(!item)
            return [];

      //return items.map(item => {
        if (item.name == '1' || item.computedLabel == '1') {
          item.computedLabel = item.highlighted = item.name = 'Mom Kuwaiti';
        }
        else if (item.name == '2' || item.computedLabel == '2') {
          item.computedLabel = item.highlighted = item.name = 'Mom Not Kuwaiti';
        }

        return item;
        //});
    }
} 