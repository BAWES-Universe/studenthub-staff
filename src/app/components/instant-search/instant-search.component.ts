import {Component, Input, EventEmitter, Output, OnInit, AfterViewInit, OnDestroy} from '@angular/core';
import instantsearch from 'instantsearch.js/es';


/**
 * Component to cope with secure key update after expiration
 */
@Component({
    selector: 'instant-search',
    templateUrl: './instant-search.component.html',
    styleUrls: ['./instant-search.component.scss'],
})
export class InstantSearchComponent implements OnInit, AfterViewInit, OnDestroy {

    @Input() searchParameters = {};
    @Input() instantSearchInstance;
    @Input() config;

    @Output() change: EventEmitter<any> = new EventEmitter();

    instanceName = 'default';

    constructor(
    ) {
        // add default searchParameters with highlighting config
        if (!this.searchParameters) {
            this.searchParameters = {};
        }
        this.searchParameters = Object.assign(this.searchParameters, {
            highlightPreTag: '__ais-highlight__',
            highlightPostTag: '__/ais-highlight__'
        });
    }

    ngOnInit() {
        this.createInstantSearchInstance(this.config);
    }

    ngAfterViewInit() {
        if (this.instantSearchInstance && !this.instantSearchInstance.started) {
            this.instantSearchInstance.start();
        }
    }

    ngOnDestroy() {
          // this.instantSearchInstance.removeListener('render', this.onRender);
          // this.instantSearchInstance.dispose();
    }

    createInstantSearchInstance(config) {

        // remove URLSync widget if on SSR
        /*if (!common.isPlatformBrowser(this.platformId)) {
            if (typeof config.urlSync !== "undefined")
                delete config.urlSync;
            if (typeof config.routing !== "undefined")
                delete config.routing;
        }*/
        // instantsearch

        this.instantSearchInstance = instantsearch(config);
        this.instantSearchInstance.on('render', this.onRender);
    }

    onRender = _ => {
        this.change.emit({
            helper: this.instantSearchInstance.helper,
            results: this.instantSearchInstance.helper.lastResults,
            state: this.instantSearchInstance.helper.state
        });
    }

    addWidget(widget) {
        this.instantSearchInstance.addWidgets([widget]);
    }

    removeWidget(widget) {
        this.instantSearchInstance.removeWidget(widget);
    }

    refresh() {
        this.instantSearchInstance.refresh();
    }
}





