import { Component, Input, OnInit, OnDestroy, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { AlgoliaInstantSearchService } from './algolia-instantsearch.service';

/**
 * Replacement for <ais-instantsearch> from angular-instantsearch.
 * Creates and manages an InstantSearch.js instance.
 *
 * Usage:
 *   <app-ais-instantsearch [config]="instantSearchConfig">
 *     <!-- child widgets -->
 *   </app-ais-instantsearch>
 */
@Component({
  selector: 'app-ais-instantsearch',
  template: `<ng-content></ng-content>`,
  providers: [AlgoliaInstantSearchService]
})
export class AisInstantsearchComponent implements OnInit, OnDestroy {

  @Input() config: any;
  @Output() onRender = new EventEmitter<any>();

  constructor(
    public searchService: AlgoliaInstantSearchService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    if (this.config) {
      this.searchService.createInstance(this.config);

      this.searchService.change.subscribe(() => {
        this.onRender.emit();
        this.cdr.detectChanges();
      });

      this.searchService.start();
    }
  }

  ngOnDestroy(): void {
    this.searchService.stop();
  }

  /** Alias for compatibility with code that accesses instantSearchInstance */
  get instantSearchInstance(): any {
    return this.searchService.instantSearchInstance;
  }

  /** Alias for compatibility with code that accesses helper */
  get helper(): any {
    return this.searchService.helper;
  }
}
