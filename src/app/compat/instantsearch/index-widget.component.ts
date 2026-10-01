import { Component, Inject, Input, OnDestroy, OnInit, Optional, SkipSelf, forwardRef } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import indexWidget from 'instantsearch.js/es/widgets/index/index';
import { NgAisInstantSearch } from './instantsearch.component';

@Component({
  selector: 'app-instantsearch-index',
  template: '<ng-content></ng-content>',
})
export class NgAisIndex implements OnInit, OnDestroy {
  @Input() indexName: string;
  @Input() indexId: string;

  public widget: any;

  constructor(
    @SkipSelf()
    @Inject(forwardRef(() => NgAisIndex))
    @Optional()
    public parentIndex: NgAisIndex,
    @Inject(forwardRef(() => NgAisInstantSearch))
    public instantSearchInstance: NgAisInstantSearch
  ) {}

  get parent() {
    return this.parentIndex || this.instantSearchInstance;
  }

  ngOnInit() {
    this.widget = {
      ...indexWidget({
        indexName: this.indexName,
        indexId: this.indexId,
      }),
      $$widgetType: 'ais.index',
    };

    this.parent.addWidgets([this.widget]);
  }

  ngOnDestroy() {
    if (isPlatformBrowser(this.instantSearchInstance.platformId)) {
      this.parent.removeWidgets([this.widget]);
    }
  }

  addWidgets(widgets: any[]) {
    this.widget.addWidgets(widgets);
  }

  removeWidgets(widgets: any[]) {
    this.widget.removeWidgets(widgets);
  }
}

