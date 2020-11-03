import { __decorate } from "tslib";
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
let IsFacetsSearchComponent = class IsFacetsSearchComponent {
    constructor(eventService, translateService) {
        this.eventService = eventService;
        this.translateService = translateService;
        this.keywordChanged = new Subject();
        //custom event to show/hide location 
        this.onChange = new EventEmitter();
        this.searchQuery = '';
        this.keywordChanged
            .pipe(debounceTime(500), // wait 500ms after the last event before emitting last event
        distinctUntilChanged() // only emit if value is different from previous value
        )
            .subscribe(value => this.search(value));
        //this.eventService.locationSelected$.subscribe(() => {
        //    this.handleChange('');
        //})
    }
    ngOnInit() { }
    /**
     * clear searchbar on location selection
     * @param value
     */
    handleChange(value) {
        this.onChange.emit(value);
        this.searchQuery = value;
        this.keywordChanged.next(this.searchQuery);
    }
    /**
     * handle search query submit
     * @param event
     */
    handleSubmit(event) {
        event.preventDefault();
        this.search(this.searchQuery);
    }
};
__decorate([
    Input()
], IsFacetsSearchComponent.prototype, "searchPlaceholder", void 0);
__decorate([
    Input()
], IsFacetsSearchComponent.prototype, "search", void 0);
__decorate([
    Output()
], IsFacetsSearchComponent.prototype, "onChange", void 0);
IsFacetsSearchComponent = __decorate([
    Component({
        selector: 'is-facets-search',
        templateUrl: './is-facets-search.component.html',
        styleUrls: ['./is-facets-search.component.scss'],
    })
], IsFacetsSearchComponent);
export { IsFacetsSearchComponent };
//# sourceMappingURL=is-facets-search.component.js.map