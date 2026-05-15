import { Component, TemplateRef, ContentChild, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { connectInfiniteHits } from 'instantsearch.js/es/connectors';
import { BaseWidget } from './base-widget';
import { noop } from './utils';

/**
 * Replacement for <ais-infinite-hits> from angular-instantsearch.
 * Uses connectInfiniteHits connector and provides template context.
 *
 * Usage:
 *   <app-ais-infinite-hits class="cv-list">
 *     <ng-template let-hits="hits" let-results="results" let-showMore="showMore">
 *       <div *ngFor="let hit of hits">{{ hit.name }}</div>
 *     </ng-template>
 *   </app-ais-infinite-hits>
 */
@Component({
  selector: 'app-ais-infinite-hits',
  template: `
    <ng-container *ngIf="templateRef"
      [ngTemplateOutlet]="templateRef"
      [ngTemplateOutletContext]="{
        hits: state.hits,
        results: state.results,
        showMore: state.showMore,
        isLastPage: state.isLastPage
      }">
    </ng-container>
  `
})
export class AisInfiniteHitsComponent extends BaseWidget implements OnInit, OnDestroy {

  @ContentChild(TemplateRef) templateRef: TemplateRef<any>;

  public state: any = {
    hits: [],
    results: {},
    showMore: noop,
    isLastPage: true,
    sendEvent: noop,
  };

  constructor(private cdr: ChangeDetectorRef) {
    super('InfiniteHits');
  }

  ngOnInit(): void {
    this.createWidget(connectInfiniteHits, {
      escapeHTML: true,
      transformItems: (items: any[]) => items,
    });

    this.updateState = (state: any, isFirstRendering: boolean) => {
      this.state = {
        hits: state.hits,
        results: state.results,
        showMore: state.showMore,
        isLastPage: state.isLastPage,
        sendEvent: state.sendEvent || noop,
      };
      this.cdr.detectChanges();
    };

    super.ngOnInit();
  }
}
