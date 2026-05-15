import { Injectable, EventEmitter } from '@angular/core';
import instantsearch from 'instantsearch.js';
import { connectInfiniteHits } from 'instantsearch.js/es/connectors';
import { noop } from './utils';

/**
 * Replacement for NgAisInstantSearch from angular-instantsearch.
 * Provides access to the InstantSearch.js instance for child widgets.
 */
@Injectable({ providedIn: 'root' })
export class AlgoliaInstantSearchService {

  /** The raw InstantSearch.js instance */
  public instantSearchInstance: any = null;

  /** Fires whenever the search state changes */
  public change: EventEmitter<any> = new EventEmitter();

  /** Whether the instance is currently started */
  private started = false;

  /**
   * Create and start an InstantSearch instance
   */
  createInstance(config: any): void {
    if (this.instantSearchInstance) {
      this.instantSearchInstance.dispose();
    }

    this.instantSearchInstance = instantsearch({
      indexName: config.indexName,
      searchClient: config.searchClient,
      // @ts-ignore - future API
      initialUiState: config.initialUiState,
    });

    // Emit change events
    this.instantSearchInstance.on('render', () => {
      this.change.emit();
    });
  }

  /**
   * Start the InstantSearch instance (triggers first search)
   */
  start(): void {
    if (this.instantSearchInstance && !this.started) {
      this.instantSearchInstance.start();
      this.started = true;
    }
  }

  /**
   * Stop the InstantSearch instance
   */
  stop(): void {
    if (this.instantSearchInstance && this.started) {
      this.instantSearchInstance.dispose();
      this.started = false;
    }
  }

  /**
   * Add a widget to the InstantSearch instance
   */
  addWidget(widget: any): void {
    if (this.instantSearchInstance) {
      this.instantSearchInstance.addWidget(widget);
    }
  }

  /**
   * Remove a widget from the InstantSearch instance
   */
  removeWidget(widget: any): void {
    if (this.instantSearchInstance) {
      this.instantSearchInstance.removeWidget(widget);
    }
  }

  /**
   * Refresh the search
   */
  refresh(): void {
    if (this.instantSearchInstance) {
      this.instantSearchInstance.refresh();
    }
  }

  get helper(): any {
    return this.instantSearchInstance ? this.instantSearchInstance.helper : null;
  }
}
