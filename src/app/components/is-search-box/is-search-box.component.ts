import { Component, Inject, forwardRef, Input, Output, EventEmitter, Optional } from '@angular/core';
import { connectSearchBox } from 'instantsearch.js/es/connectors';
import { BaseWidget, NgAisIndex, NgAisInstantSearch } from 'angular-instantsearch';
import { Subject, timer, EMPTY } from 'rxjs';
import { debounceTime, distinctUntilChanged, debounce } from 'rxjs/operators';
// services
import { TranslateLabelService } from 'src/app/providers/translate-label.service';


@Component({
    selector: 'is-search-box',
    templateUrl: './is-search-box.component.html',
    styleUrls: ['./is-search-box.component.scss'],
})
export class IsSearchBoxComponent extends BaseWidget {

    @Input() placeholder;
    @Input() submitTitle;
    @Input() resetTitle;
    @Input() searchAsYouType;

    @Output() submit: EventEmitter<any> = new EventEmitter();
    @Output() reset: EventEmitter<any> = new EventEmitter();
    @Output() change: EventEmitter<any> = new EventEmitter();
    @Output() focus: EventEmitter<any> = new EventEmitter();
    @Output() blur: EventEmitter<any> = new EventEmitter();

    override state;

    modelChanged: Subject<{query: string, code: number }> = new Subject();

    /*= {
        query: "",
        refine: noop
    };*/

    constructor(
        @Inject(forwardRef(() => NgAisInstantSearch))
        public instantSearchInstance,
        @Optional()
        public parentIndex: NgAisIndex,
        public _translateService: TranslateLabelService
    ) {
        super('IsSearchBoxComponent');

        this.modelChanged.pipe(
            debounce(ev => ev.code != 13 ? timer(800) : EMPTY),
            //debounceTime(800),  // wait 1000ms after the last event before emitting last event
            distinctUntilChanged(),  // only emit if value is different from previous value
        ).subscribe(ev => {
            this.state.refine(ev.query);
        });
    }

    /**
     * Initialize widget
     */
    public ngOnInit() {
        if (this.instantSearchInstance) {
            this.createWidget(connectSearchBox);
            setTimeout( _ => { // to protect dual request
                super.ngOnInit();
            },500)
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
}
