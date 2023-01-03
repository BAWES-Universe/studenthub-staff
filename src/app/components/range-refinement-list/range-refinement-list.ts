import { Component, Input, Inject, forwardRef, EventEmitter, Output, ChangeDetectorRef, Optional } from '@angular/core';
import { connectRange } from 'instantsearch.js/es/connectors';
import { RangeRenderState } from 'instantsearch.js/es/connectors/range/connectRange';
import { BaseWidget, NgAisIndex, NgAisInstantSearch } from 'angular-instantsearch';
import { parseNumberInput, noop } from 'angular-instantsearch/esm2015/utils';
import { Options } from 'ng5-slider';


@Component({
    selector: 'range-refinement-list',
    templateUrl: 'range-refinement-list.html',
    styleUrls: ['./range-refinement-list.scss']
})
export class RangeRefinementComponent extends BaseWidget {

    @Input() title;
    @Input() subTitle;

    @Input() pips;
    @Input() tooltips;
    @Input() attribute;
    @Input() min;
    @Input() max;
    @Input() precision;
    @Input() currencies;

    @Output() change: EventEmitter<any> = new EventEmitter();


    public override state: RangeRenderState = {
        range: {min: 0, max: 1},
        refine: noop,
        canRefine: null,
        sendEvent: noop,
        format: noop,
        start: [0, 1],
    };

    slider;

    handleChange;
    formatTooltip;

    open = false;
    dirty = false;

    value;

    average = 0;

    options: Options = {
        floor: 0,
        ceil: 1,
    }

    constructor(
        @Inject(forwardRef(() => NgAisInstantSearch))
        public instantSearchInstance,
        @Optional()
        public parentIndex: NgAisIndex,
    ) {
        super('RangeRefinementComponent');

        // render options
        this.pips = true;
        this.tooltips = true;
        this.precision = 2;

        /*this.state = {
            range: {min: 0, max: 1},
            refine: noop,
            start: [0, 1],
        };*/

        this.updateState = (state: RangeRenderState, isFirstRendering) => {

            // update component inner state
            if(isFirstRendering)
                this.state = state;
            else {
                this.state.range = state.range;
                this.state.start = state.start;
            }

            // update the slider state
            const { range: {min, max}, start, } = state;
            //const min = state.range.min, max = 0;

            //setTimeout(_ => {

                this.min = (min === max) ? 0 : Math.ceil(min);
                this.max = Math.ceil(max);

                const disabled = this.min === this.max;

                let lower;
                let upper;

                if (this.state.start[0] == -Infinity) {
                    lower = this.min;
                } else {
                    lower = this.state.start[0];
                }

                if (this.state.start[1] == Infinity) {
                     upper = this.max;
                } else {
                     upper = this.state.start[1];
                }

                if (this.state.start[0] == -Infinity && this.state.start[1] == Infinity) {
                    this.dirty = false;
                } else {
                    this.dirty = true;
                }

                this.value = disabled ? { lower: lower, upper: upper + 0.0001 } : { lower: lower, upper: upper };

                // Due to change detection rules in Angular, we need to re-create the options object to apply the change
                const newOptions: Options = Object.assign({}, this.options);
                newOptions.ceil = Math.max(this.max, this.value.upper);
                newOptions.floor = Math.min(this.min, this.value.lower);

                //newOptions.animate = false;
                //newOptions.rightToLeft = this.translateLabel.currentLang == 'ar';
                this.options = newOptions;

                this.setLabel(); // update label
            //}
        };

        this.handleChange = (e) => {

           // let range = [e.detail.value.lower, e.detail.value.upper];
                //[this.value.lower, this.value.upper]

             //   this.state.range.lower = [this.value.lower, this.value.upper];
            this.state.refine([this.value.lower, this.value.upper]);
            //this.change.emit();
        };

        this.formatTooltip = (value) => {
            return value.toFixed(parseNumberInput(this.precision));
        };
    }

    /**
     * on range change by user
     * @param ev
     */
    onChange(ev) {
        this.setLabel();
        this.handleChange();
    }

    /**
     * @return {?}
     */
    override ngOnInit() {
        this.createWidget(connectRange, {
            attributeName: this.attribute,
            attribute: this.attribute,
            max: parseNumberInput(this.max),
            min: parseNumberInput(this.min),
            precision: parseNumberInput(this.precision),
        });
        super.ngOnInit();
    }

    /**
     * @return {?}
     */
    get step() {
        // compute step from the precision value
        /** @type {?} */
        const precision = parseNumberInput(this.precision) || 2;
        return 1 / Math.pow(10, precision);
    }

    /**
     * Set value range label
     */
    setLabel() {
      this.average = (Math.floor(this.min) + Math.floor(this.max)) / 2;
    }

    /**
     * Clear range selection
     */
    handleClearAllClick(event) {

        //to fix: https://www.pivotaltracker.com/story/show/170494756

        if (
            this.instantSearchInstance.searchParameters && this.instantSearchInstance.searchParameters.disjunctiveFacetsRefinements
            && this.instantSearchInstance.searchParameters.disjunctiveFacetsRefinements[this.attribute]
        ) {
            this.instantSearchInstance.searchParameters.disjunctiveFacetsRefinements[this.attribute] = [];
        }

        //clear value

        this.value = { lower: this.min, upper: this.max };

        this.dirty = false;

        //update list

        this.handleChange();
        event.preventDefault();
        event.stopPropagation();
    }

    /**
     * Toggle filter open/close
     */
    toggleOpen() {
        this.open = !this.open;
    }
}
