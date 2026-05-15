import {
  AfterContentInit,
  Component,
  EventEmitter,
  Input,
  NgModule,
  OnChanges,
  OnDestroy,
  Output,
  SimpleChanges,
  TemplateRef,
  ContentChild,
  Directive
} from '@angular/core';
import { CommonModule } from '@angular/common';
import instantsearch from 'instantsearch.js';
import { connectInfiniteHits } from 'instantsearch.js/es/connectors';

type InstantSearchWidget = {
  init?: (options: any) => void;
  render?: (options: any) => void;
  dispose?: (options: any) => any;
};

function getAttributeValue(source: any, attribute: string) {
  if (!source || !attribute) {
    return undefined;
  }

  return attribute.split('.').reduce((value, key) => value?.[key], source);
}

function escapeHtml(value: any) {
  return String(value).replace(/[&<>"']/g, character => {
    const entities = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;',
    };

    return entities[character];
  });
}

export class NgAisIndex {}

@Directive()
export class BaseWidget implements OnDestroy {
  public autoHideContainer = true;
  public state: any;
  public updateState: (state: any, isFirstRendering: boolean) => void;
  protected widget: InstantSearchWidget;

  constructor(public widgetName: string) {}

  cx(...parts: string[]) {
    const base = `ais-${this.widgetName}`;

    if (parts.length === 0) {
      return base;
    }

    return parts
      .join(' ')
      .split(/\s+/)
      .filter(Boolean)
      .map(part => {
        if (part.startsWith('ais-') || part === 'skip-hover') {
          return part;
        }

        return `${base}-${part}`;
      })
      .join(' ');
  }

  getItemClass(item: any) {
    const classes = [this.cx('item')];

    if (item && item.isRefined) {
      classes.push('is-refined', this.cx('item--selected'));
    }

    return classes.join(' ');
  }

  createWidget(connector: any, options?: any) {
    const renderFn = (renderOptions: any, isFirstRendering: boolean) => {
      if (this.updateState) {
        this.updateState(renderOptions, isFirstRendering);
      } else {
        this.state = renderOptions;
      }
    };

    this.widget = connector(renderFn)(options || {});
    return this.widget;
  }

  ngOnInit() {
    const parent = (this as any).parentIndex || (this as any).instantSearchInstance;
    if (parent && this.widget) {
      parent.addWidgets([this.widget]);
    }
  }

  ngOnDestroy() {
    const parent = (this as any).parentIndex || (this as any).instantSearchInstance;
    if (parent && this.widget) {
      parent.removeWidgets([this.widget]);
    }
  }
}

export class TypedBaseWidget<
  TWidgetDescription = any,
  TConnectorParams = any
> extends BaseWidget {}

@Component({
  selector: 'instantsearch-root',
  template: '<ng-content></ng-content>'
})
export class NgAisInstantSearch implements AfterContentInit, OnChanges, OnDestroy {
  @Input() config: any;
  @Input('index-name') indexName: string;
  @Output() onRender = new EventEmitter<any>();

  public change = new EventEmitter<any>();
  public instantSearchInstance: any;
  public searchParameters: any;

  private widgets: InstantSearchWidget[] = [];
  private started = false;

  ngOnChanges(changes: SimpleChanges) {
    if (changes.config && this.config) {
      this.createInstantSearch();
    }
  }

  ngAfterContentInit() {
    setTimeout(() => this.start());
  }

  addWidgets(widgets: InstantSearchWidget[]) {
    if (!widgets || widgets.length === 0) {
      return;
    }

    const newWidgets = widgets.filter(widget => !this.widgets.includes(widget));
    if (newWidgets.length === 0) {
      return;
    }

    this.widgets.push(...newWidgets);

    if (this.instantSearchInstance) {
      this.instantSearchInstance.addWidgets(newWidgets);
    }
  }

  removeWidgets(widgets: InstantSearchWidget[]) {
    if (!widgets || widgets.length === 0) {
      return;
    }

    const removedWidgets = widgets.filter(widget => this.widgets.includes(widget));
    if (removedWidgets.length === 0) {
      return;
    }

    this.widgets = this.widgets.filter(widget => !removedWidgets.includes(widget));

    if (this.instantSearchInstance) {
      this.instantSearchInstance.removeWidgets(removedWidgets);
    }
  }

  ngOnDestroy() {
    if (this.instantSearchInstance && this.started) {
      this.instantSearchInstance.dispose();
    }
  }

  private createInstantSearch() {
    const widgets = [...this.widgets];

    if (this.instantSearchInstance) {
      if (widgets.length > 0) {
        this.instantSearchInstance.removeWidgets(widgets);
      }

      if (this.started) {
        this.instantSearchInstance.dispose();
      }
    }

    this.instantSearchInstance = instantsearch(this.config);
    this.searchParameters = this.config.searchParameters || {};
    this.instantSearchInstance.searchParameters = this.searchParameters;

    this.instantSearchInstance.on('render', () => {
      const helper = this.instantSearchInstance.helper;
      this.searchParameters = helper ? helper.state : this.searchParameters;
      this.instantSearchInstance.searchParameters = this.searchParameters;
      this.change.emit(this.instantSearchInstance);
      this.onRender.emit(this.instantSearchInstance);
    });

    if (widgets.length > 0) {
      this.instantSearchInstance.addWidgets(widgets);
    }

    if (this.started) {
      this.instantSearchInstance.start();
    }
  }

  private start() {
    this.started = true;
    if (this.instantSearchInstance && !this.instantSearchInstance.started) {
      this.instantSearchInstance.start();
    }
  }
}

@Component({
  selector: 'instantsearch-infinite-hits',
  template: `
    <ng-container
      *ngIf="template"
      [ngTemplateOutlet]="template"
      [ngTemplateOutletContext]="templateContext">
    </ng-container>
  `
})
export class AisInfiniteHitsComponent extends BaseWidget {
  @ContentChild(TemplateRef, { static: true }) template: TemplateRef<any>;

  public templateContext: any = {
    hits: [],
    results: null,
    showMore: () => {},
    state: null
  };

  constructor(parent: NgAisInstantSearch) {
    super('InfiniteHits');
    (this as any).instantSearchInstance = parent;

    this.updateState = (state) => {
      this.state = state;
      this.templateContext = {
        ...state,
        hits: state.hits || [],
        results: state.results || null,
        showMore: state.showMore || (() => {}),
        state
      };
    };
  }

  override ngOnInit() {
    this.createWidget(connectInfiniteHits, {});
    super.ngOnInit();
  }
}

@Component({
  selector: 'instantsearch-highlight',
  template: '<span [innerHTML]="value"></span>'
})
export class AisHighlightComponent {
  @Input() attribute: string;
  @Input() hit: any;

  get value() {
    if (!this.hit || !this.attribute) {
      return '';
    }

    const highlightedValue = getAttributeValue(this.hit._highlightResult, this.attribute)?.value;

    if (highlightedValue) {
      return highlightedValue;
    }

    if (this.attribute === 'highlighted' && this.hit.highlighted) {
      return this.hit.highlighted;
    }

    return escapeHtml(getAttributeValue(this.hit, this.attribute) || this.hit.label || '');
  }
}

@NgModule({
  declarations: [NgAisInstantSearch, AisInfiniteHitsComponent, AisHighlightComponent],
  exports: [NgAisInstantSearch, AisInfiniteHitsComponent, AisHighlightComponent],
  imports: [CommonModule]
})
export class InstantSearchModule {}
