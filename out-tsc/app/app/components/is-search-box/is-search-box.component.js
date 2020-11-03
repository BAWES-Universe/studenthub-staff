import { __decorate, __param } from "tslib";
import { Component, Inject, forwardRef, Input, Output, EventEmitter } from '@angular/core';
import { connectSearchBox } from 'instantsearch.js/es/connectors';
import { BaseWidget } from 'angular-instantsearch';
import { InstantSearchComponent } from '../instant-search/instant-search.component';
import { Subject, timer, EMPTY } from 'rxjs';
import { distinctUntilChanged, debounce } from 'rxjs/operators';
let IsSearchBoxComponent = class IsSearchBoxComponent extends BaseWidget {
    /*= {
        query: "",
        refine: noop
    };*/
    constructor(instantSearchParent, _translateService) {
        super('IsSearchBoxComponent');
        this.instantSearchParent = instantSearchParent;
        this._translateService = _translateService;
        this.submit = new EventEmitter();
        this.reset = new EventEmitter();
        this.change = new EventEmitter();
        this.focus = new EventEmitter();
        this.blur = new EventEmitter();
        this.modelChanged = new Subject();
        this.modelChanged.pipe(debounce(ev => ev.code != 13 ? timer(800) : EMPTY), 
        //debounceTime(800),  // wait 1000ms after the last event before emitting last event
        distinctUntilChanged()).subscribe(ev => {
            this.state.refine(ev.query);
        });
    }
    /**
     * Initialize widget
     */
    ngOnInit() {
        if (this.instantSearchParent) {
            this.createWidget(connectSearchBox);
            setTimeout(_ => {
                super.ngOnInit();
            }, 500);
        }
    }
    ngOnDestroy() {
        // don't destroy search box
    }
    handleChange(event) {
        if (this.searchAsYouType) {
            this.modelChanged.next({
                code: event.keyCode,
                query: event.target.value
            });
        }
    }
    handleSubmit(event) {
        // send submit event to parent component
        this.submit.emit(event);
        event.preventDefault();
        if (!this.searchAsYouType) {
            this.state.refine(this.state.query);
        }
    }
    handleReset(event) {
        // send reset event to parent component
        this.reset.emit(event);
        // reset search
        this.state.refine('');
    }
};
__decorate([
    Input()
], IsSearchBoxComponent.prototype, "placeholder", void 0);
__decorate([
    Input()
], IsSearchBoxComponent.prototype, "submitTitle", void 0);
__decorate([
    Input()
], IsSearchBoxComponent.prototype, "resetTitle", void 0);
__decorate([
    Input()
], IsSearchBoxComponent.prototype, "searchAsYouType", void 0);
__decorate([
    Output()
], IsSearchBoxComponent.prototype, "submit", void 0);
__decorate([
    Output()
], IsSearchBoxComponent.prototype, "reset", void 0);
__decorate([
    Output()
], IsSearchBoxComponent.prototype, "change", void 0);
__decorate([
    Output()
], IsSearchBoxComponent.prototype, "focus", void 0);
__decorate([
    Output()
], IsSearchBoxComponent.prototype, "blur", void 0);
IsSearchBoxComponent = __decorate([
    Component({
        selector: 'is-search-box',
        templateUrl: './is-search-box.component.html',
        styleUrls: ['./is-search-box.component.scss'],
    }),
    __param(0, Inject(forwardRef(() => InstantSearchComponent)))
], IsSearchBoxComponent);
export { IsSearchBoxComponent };
//# sourceMappingURL=is-search-box.component.js.map