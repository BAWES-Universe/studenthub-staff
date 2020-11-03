import { __decorate, __param } from "tslib";
import { Component, Inject, forwardRef, Input, Output, EventEmitter } from '@angular/core';
import { BaseWidget } from 'angular-instantsearch';
import { connectRefinementList } from "instantsearch.js/es/connectors";
import { parseNumberInput, noop } from "angular-instantsearch/esm2015/utils";
//component 
import { InstantSearchComponent } from '../instant-search/instant-search.component';
let RefinementListComponent = class RefinementListComponent extends BaseWidget {
    //NgAisInstantSearch
    constructor(instantSearchParent, eventService, translateService) {
        super('RefinementListComponent');
        this.instantSearchParent = instantSearchParent;
        this.eventService = eventService;
        this.translateService = translateService;
        this.change = new EventEmitter();
        this.open = false;
        this.autoHideContainer = false;
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
    ngOnInit() {
        if (this.instantSearchParent) {
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
            if (this.isRefined() &&
                this.instantSearchParent.instantSearchInstance.helper.state &&
                this.instantSearchParent.instantSearchInstance.helper.state.disjunctiveFacetsRefinements &&
                !this.instantSearchParent.instantSearchInstance.helper.state.disjunctiveFacetsRefinements[this.attribute])
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
};
__decorate([
    Input()
], RefinementListComponent.prototype, "label", void 0);
__decorate([
    Input()
], RefinementListComponent.prototype, "searchable", void 0);
__decorate([
    Input()
], RefinementListComponent.prototype, "searchPlaceholder", void 0);
__decorate([
    Input()
], RefinementListComponent.prototype, "showMoreLabel", void 0);
__decorate([
    Input()
], RefinementListComponent.prototype, "showLessLabel", void 0);
__decorate([
    Input()
], RefinementListComponent.prototype, "showMoreLimit", void 0);
__decorate([
    Input()
], RefinementListComponent.prototype, "operator", void 0);
__decorate([
    Input()
], RefinementListComponent.prototype, "attribute", void 0);
__decorate([
    Input()
], RefinementListComponent.prototype, "transformItems", void 0);
__decorate([
    Output()
], RefinementListComponent.prototype, "change", void 0);
RefinementListComponent = __decorate([
    Component({
        selector: 'refinement-list',
        templateUrl: './refinement-list.component.html',
        styleUrls: ['./refinement-list.component.scss'],
    }),
    __param(0, Inject(forwardRef(() => InstantSearchComponent)))
], RefinementListComponent);
export { RefinementListComponent };
//# sourceMappingURL=refinement-list.component.js.map