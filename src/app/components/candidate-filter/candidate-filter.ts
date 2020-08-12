import { Component, forwardRef, Inject } from '@angular/core';
// services
import { InstantSearchComponent } from '../instant-search/instant-search.component';
import { TranslateLabelService } from '../../providers/translate-label.service';


/**
 * Display candidate filter
 */
@Component({
    selector: 'candidate-filter',
    templateUrl: 'candidate-filter.html',
    styleUrls: ['./candidate-filter.scss']
})
export class CandidateFilterComponent {

    public current_language;

    public arrRefined = [];

    genderTransformItems = (items) => {

        return items.map(item => {
            if (item.name == '1' || item.label == '1') {
                item.label = item.highlighted = item.name = this.translateLabel.transform('Male');
            }
            else if (item.name == '2' || item.label == '2') {
                item.label = item.highlighted = item.name = this.translateLabel.transform('Female');
            }
            else if (item.name == '3' || item.label == '3') {
                item.label = item.highlighted = item.name = this.translateLabel.transform('Other');
            }

            return item;
        }).filter(item => ['Male', 'Female', 'Other'].indexOf(item.label) > -1);
    }

  assignedTransformItems = (items) => {

        return items.map(item => {
            if (item.name == '0' || item.label == '0') {
                item.label = item.highlighted = item.name = this.translateLabel.transform('Not Assigned');
            }
            else if (item.name == '1' || item.label == '1') {
                item.label = item.highlighted = item.name = this.translateLabel.transform('Assigned');
            }

            return item;
        }).filter(item => ['Assigned', 'Not Assigned'].indexOf(item.label) > -1);
    }

    booleanTransformItems = (items) => {

        return items.map(item => {
            if (item.name == '1' || item.label == '1') {
                item.label = item.highlighted = item.name = this.translateLabel.transform('Yes');
            }
            else if (item.name == '0' || item.label == '0') {
                item.label = item.highlighted = item.name = this.translateLabel.transform('No');
            }

            return item;
        });
    }

    constructor(
        @Inject(forwardRef(() => InstantSearchComponent))
        public instantSearchParent,
        public translateLabel: TranslateLabelService
    ) {
        //this.current_language = this.translateLabel.currentLang;
    }

    ngOnInit() {

        this.instantSearchParent.change.subscribe(() => {

            if (!this.instantSearchParent.instantSearchInstance.helper) {
                return null;
            }

            this.arrRefined = [];

            Object.keys(
                this.instantSearchParent.instantSearchInstance.helper.state.disjunctiveFacetsRefinements
            ).forEach(key => {
                if (this.instantSearchParent.instantSearchInstance.helper.state.disjunctiveFacetsRefinements[key].length > 0) {
                    this.arrRefined[key] = true;
                }
            });

            setTimeout(_ => {
                this.sortRefinementLists();
            }, 200);
        });
    }

    /**
     * sort refinement list to show selected filters on top in group
     */
    sortRefinementLists() {

        const parents = document.querySelectorAll('.filter-groups') as any as Array<HTMLElement>;

        // get all children element and convert into array
        // for newer browser you can use `Array.from` instead
        // of `[].slice.call()`

        parents.forEach(parent => {

            [].slice.call(parent.children)
                // sort them using custom sort function
                .sort(function (a, b) {

                    if (!a) {
                        return null;
                    }

                    let p = a.getAttribute('data-sort-order');

                    if (a.classList.contains('is-refined')) {
                        p -= 10; // just random number to show on top
                    }

                    let q = b.getAttribute('data-sort-order');

                    if (b.classList.contains('is-refined')) {
                        q -= 10; // just random number to show on top
                    }
                    return parseInt(p) - parseInt(q);

                    // iterate and append again in new sorted order
                }).forEach(function (ele) {
                    parent.appendChild(ele);
                });
        });
    }
}
