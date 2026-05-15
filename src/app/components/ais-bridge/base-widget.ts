import { OnInit, OnDestroy, inject } from '@angular/core';
import { AlgoliaInstantSearchService } from './algolia-instantsearch.service';
import { cx, noop } from './utils';

/**
 * Replacement for BaseWidget from angular-instantsearch.
 * Base class for all custom Algolia widget components.
 */
export class BaseWidget implements OnInit, OnDestroy {

  public widgetName: string;
  public autoHideContainer: boolean = false;
  public updateState: (state: any, isFirstRendering: boolean) => void = noop;

  private widget: any = null;

  /** Injected AlgoliaInstantSearchService - subclasses can override injection */
  public instantSearchInstance: AlgoliaInstantSearchService;

  constructor(widgetName: string) {
    this.widgetName = widgetName;
    this.instantSearchInstance = inject(AlgoliaInstantSearchService);
  }

  /**
   * Create an instantsearch.js widget using a connector
   */
  public createWidget(connector: any, options: any = {}): any {
    this.widget = connector(this.updateState, noop)(options);
    return this.widget;
  }

  public ngOnInit(): void {
    if (this.widget && this.instantSearchInstance) {
      this.instantSearchInstance.addWidget(this.widget);
    }
  }

  public ngOnDestroy(): void {
    if (this.widget && this.instantSearchInstance) {
      this.instantSearchInstance.removeWidget(this.widget);
    }
  }

  /**
   * Generate BEM-style CSS class names
   */
  public cx(suffix?: string): string {
    return cx(this.widgetName, suffix);
  }
}

/**
 * Replacement for TypedBaseWidget from angular-instantsearch.
 * Generic typed version of BaseWidget.
 */
export class TypedBaseWidget<TWidgetDescription, TConnectorParams> extends BaseWidget {
  public state: TWidgetDescription extends { renderState: infer R } ? R : any;

  constructor(widgetName: string) {
    super(widgetName);
  }
}
