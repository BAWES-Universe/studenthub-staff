import { Component, ContentChild, Inject, Input, OnInit, Optional, TemplateRef, forwardRef } from '@angular/core';
import { connectInfiniteHitsWithInsights } from 'instantsearch.js/es/connectors';
import { TypedBaseWidget } from './base-widget';
import { noop } from './utils';
import { NgAisIndex } from './index-widget.component';
import { NgAisInstantSearch } from './instantsearch.component';

@Component({
  selector: 'app-infinite-hits',
  template: `
    <div [class]="cx()">
      <ng-container *ngTemplateOutlet="template; context: state"></ng-container>

      <button
        [ngClass]="[cx('loadPrevious'), state.isFirstPage ? cx('loadPrevious', 'disabled') : '']"
        (click)="showPreviousHandler($event)"
        [disabled]="state.isFirstPage"
        *ngIf="showPrevious && !template"
      >
        {{ showPreviousLabel }}
      </button>

      <div *ngIf="!template">
        <ul [class]="cx('list')">
          <li [class]="cx('item')" *ngFor="let hit of state.hits">
            <app-instantsearch-highlight attribute="name" [hit]="hit"></app-instantsearch-highlight>
          </li>
        </ul>
      </div>

      <button
        [ngClass]="[cx('loadMore'), state.isLastPage ? cx('loadMore', 'disabled') : '']"
        (click)="showMoreHandler($event)"
        [disabled]="state.isLastPage"
        *ngIf="!template"
      >
        {{ showMoreLabel }}
      </button>
    </div>
  `,
})
export class InstantSearchInfiniteHitsComponent extends TypedBaseWidget implements OnInit {
  @ContentChild(TemplateRef, { static: false }) template: TemplateRef<any>;
  @Input() escapeHTML: boolean;
  @Input() showPrevious = false;
  @Input() showPreviousLabel = 'Show previous results';
  @Input() showMoreLabel = 'Show more results';
  @Input() transformItems: any;

  public override state: any = {
    hits: [],
    results: undefined,
    currentPageHits: [],
    isFirstPage: false,
    isLastPage: false,
    showMore: noop,
    showPrevious: noop,
    sendEvent: noop,
    bindEvent: () => '',
  };

  constructor(
    @Inject(forwardRef(() => NgAisIndex))
    @Optional()
    public override parentIndex: NgAisIndex,
    @Inject(forwardRef(() => NgAisInstantSearch))
    public override instantSearchInstance: NgAisInstantSearch
  ) {
    super('InfiniteHits');

    this.updateState = (state, isFirstRendering) => {
      if (isFirstRendering) {
        return;
      }

      this.state = state;
    };
  }

  ngOnInit() {
    this.createWidget(connectInfiniteHitsWithInsights, {
      escapeHTML: this.escapeHTML,
      transformItems: this.transformItems,
    }, {
      $$widgetType: 'ais.infiniteHits',
    });

    super.ngOnInit();
  }

  showMoreHandler(event: Event) {
    event.preventDefault();
    this.state.showMore();
  }

  showPreviousHandler(event: Event) {
    event.preventDefault();
    this.state.showPrevious();
  }
}

