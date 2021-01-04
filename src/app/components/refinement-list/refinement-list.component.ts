import { Component, Inject, forwardRef, Input, Output, EventEmitter } from '@angular/core';
import { BaseWidget, NgAisInstantSearch } from 'angular-instantsearch';
import { connectRefinementList } from "instantsearch.js/es/connectors";
import { parseNumberInput, noop } from "angular-instantsearch/esm2015/utils"; 
//services
import { TranslateLabelService } from 'src/app/providers/translate-label.service';
import { EventService } from 'src/app/providers/event.service';


@Component({
    selector: 'refinement-list',
    templateUrl: './refinement-list.component.html',
    styleUrls: ['./refinement-list.component.scss'],
})
export class RefinementListComponent extends BaseWidget {

    @Input() label;
    @Input() searchable;
    @Input() searchPlaceholder;
    @Input() showMoreLabel;
    @Input() showLessLabel;
    @Input() showMoreLimit;
    @Input() operator;
    @Input() attribute;
    @Input() transformItems;

    @Output() change: EventEmitter<any> = new EventEmitter();

    public open: boolean = false;
    public autoHideContainer: boolean = false;

    public limit;
    public sortBy;
    public state;

    //NgAisInstantSearch

    constructor(
        @Inject(forwardRef(() => NgAisInstantSearch))
        public instantSearchParent,
        public eventService: EventService,
        public translateService: TranslateLabelService
    ) {
        super('RefinementListComponent');

        this.limit = 5;

        this.state = {
            canRefine: false,
            canToggleShowMore: true,    
            createURL: noop,
            isShowingMore: false,
            items: [],
            refine: noop,
            toggleShowMore: noop,
            searchForItems: noop,
            isFormSearch: false
        }; 

        this.updateState = (state, isFirstRendering) => {
            return Promise.resolve().then(() => {
                this.state = state;
            });        
        };
         
        this.eventService.filterCollapse$.subscribe(() => {
            this.open = false;
        });
    }

    public ngOnInit() {
        if(this.instantSearchParent) {
            this.createWidget(connectRefinementList, {
                limit: parseNumberInput(this.limit),
                showMoreLimit: parseNumberInput(this.showMoreLimit),
                attributeName: this.attribute,
                attribute: this.attribute,
                sortBy: this.sortBy,
                escapeFacetValues: true,
                showMore: true
            });
            super.ngOnInit();
        }
    }

    ngOnDestroy() {
        //don't destroy refinement list
    }

    /**
     * @return {?}
     */
    isHidden() {
        return this.state.canRefine == false && this.autoHideContainer;
        //state.items.length === 0
    }

    /**
     * @return {?}
     * */
    get items() { 
        return typeof this.transformItems === "function"
            ? this.transformItems(this.state.items)
            : this.state.items;
    }

    /**
     * @param {?} event
     * @param {?} item
     * @return {?}
     */
    refine(event, item) {
        event.preventDefault();
        event.stopPropagation();

        if (this.state.canRefine) {
            // update UI directly, it will update the checkbox state
 
            item.isRefined = !item.isRefined;

            // refine through Algolia API

            this.state.refine(item.value);

            if (
                this.isRefined() && 
                this.instantSearchParent.instantSearchInstance.helper.state &&
                this.instantSearchParent.instantSearchInstance.helper.state.disjunctiveFacetsRefinements && 
                !this.instantSearchParent.instantSearchInstance.helper.state.disjunctiveFacetsRefinements[this.attribute]
            )
                this.instantSearchParent.instantSearchInstance.helper.state.disjunctiveFacetsRefinements[this.attribute] = [];

            //this.change.emit();
        }
    }

    /**
     * Can show `show more` button or not 
     * @return boolean
     */
    canShowMore() { 
        return this.state.canToggleShowMore
            && typeof this.state.toggleShowMore != 'undefined';
    }

    /**
     * Is current filter value selected 
     */
    isRefined() {
        for (let i of this.state.items) {
            if (i && i.isRefined)
                return true;
        }
    }

    /** 
     * Toggle filter open/close 
     */
    toggleOpen() { 
        this.open = !this.open;
    }
} 