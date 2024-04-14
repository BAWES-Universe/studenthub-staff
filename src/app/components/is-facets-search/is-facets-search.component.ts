
import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { Subject } from 'rxjs'; 
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
//services
import { TranslateLabelService } from 'src/app/providers/translate-label.service';
import { EventService } from 'src/app/providers/event.service';


@Component({
    selector: 'is-facets-search',
    templateUrl: './is-facets-search.component.html',
    styleUrls: ['./is-facets-search.component.scss'],
})
export class IsFacetsSearchComponent implements OnInit {

    @Input() searchPlaceholder;
    @Input() search;

    public keywordChanged: Subject<string> = new Subject<string>();

    public searchQuery;

    //custom event to show/hide location 

    @Output() onChange: EventEmitter<any> = new EventEmitter();

    constructor(
        public eventService: EventService,
        public translateService: TranslateLabelService        
    ) {
        this.searchQuery = '';

        this.keywordChanged
            .pipe(
                debounceTime(500),// wait 500ms after the last event before emitting last event
                distinctUntilChanged() // only emit if value is different from previous value
            )
            .subscribe(value => this.search(value));

        //this.eventService.locationSelected$.subscribe(() => {
        //    this.handleChange('');
        //})
    }

    ngOnInit() { }

    onInput(event) {
        this.handleChange(event.target.value)
    }

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
}