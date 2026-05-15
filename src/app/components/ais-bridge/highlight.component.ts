import { Component, Input } from '@angular/core';

/**
 * Replacement for <ais-highlight> from angular-instantsearch.
 * Renders highlighted text from Algolia hit _highlightResult.
 *
 * Usage:
 *   <app-ais-highlight attribute="name" [hit]="item"></app-ais-highlight>
 */
@Component({
  selector: 'app-ais-highlight',
  template: `<span [innerHTML]="getHighlighted()"></span>`
})
export class AisHighlightComponent {

  @Input() attribute: string;
  @Input() hit: any;

  getHighlighted(): string {
    if (!this.hit) {
      return '';
    }

    // If the item has _highlightResult, use it
    if (this.hit._highlightResult && this.hit._highlightResult[this.attribute]) {
      return this.hit._highlightResult[this.attribute].value || '';
    }

    // If the item has a 'highlighted' property directly (custom transform)
    if (this.attribute === 'highlighted' && this.hit.highlighted) {
      return this.hit.highlighted;
    }

    // Fallback to the raw value
    if (this.hit[this.attribute] !== undefined) {
      return String(this.hit[this.attribute]);
    }

    return '';
  }
}
