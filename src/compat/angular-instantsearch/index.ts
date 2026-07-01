import {
  AfterContentInit,
  ChangeDetectorRef,
  Component,
  ContentChild,
  Directive,
  EventEmitter,
  forwardRef,
  Inject,
  Injectable,
  Input,
  NgModule,
  OnChanges,
  OnDestroy,
  OnInit,
  Optional,
  Output,
  SimpleChanges,
  TemplateRef,
  ViewRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import instantsearch from 'instantsearch.js';
import { connectInfiniteHits } from 'instantsearch.js/es/connectors';
import configure from 'instantsearch.js/es/widgets/configure/configure';

@Injectable()
export class NgAisIndex {}

@Injectable()
export class NgAisInstantSearch implements OnDestroy {
  public instantSearchInstance: any;
  public change = new EventEmitter<void>();
  public searchParameters: any = {};

  private readonly widgets = new Set<any>();
  protected started = false;

  setInstance(instance: any): void {
    this.instantSearchInstance = instance;

    if (this.widgets.size > 0) {
      this.instantSearchInstance.addWidgets(Array.from(this.widgets));
    }
  }

  protected clearInstance(): void {
    this.instantSearchInstance = undefined;
    this.searchParameters = {};
    this.started = false;
  }

  registerWidget(widget: any): void {
    if (!widget) {
      return;
    }

    this.widgets.add(widget);

    if (this.instantSearchInstance) {
      this.instantSearchInstance.addWidgets([widget]);
    }
  }

  unregisterWidget(widget: any): void {
    if (!widget) {
      return;
    }

    this.widgets.delete(widget);

    if (this.instantSearchInstance) {
      this.instantSearchInstance.removeWidgets([widget]);
    }
  }

  start(): void {
    if (!this.instantSearchInstance || this.started) {
      return;
    }

    this.started = true;
    this.instantSearchInstance.start();
    this.syncSearchParameters();
  }

  syncSearchParameters(): void {
    const helperState = this.instantSearchInstance?.helper?.state;
    if (!helperState) {
      return;
    }

    this.searchParameters = {
      ...helperState,
      disjunctiveFacetsRefinements: {
        ...(helperState.disjunctiveFacetsRefinements || {}),
      },
      numericRefinements: {
        ...(helperState.numericRefinements || {}),
      },
      facetFilters: Array.isArray(helperState.facetFilters)
        ? [...helperState.facetFilters]
        : helperState.facetFilters,
    };

    this.change.emit();
  }

  ngOnDestroy(): void {
    this.change.complete();
  }
}

@Directive()
export class BaseWidget {
  public state: any;
  public autoHideContainer = false;

  protected updateState?: (state: any, isFirstRendering: boolean) => void;
  protected instantSearchInstance?: NgAisInstantSearch;
  private widget: any;

  constructor(private readonly widgetType: string) {}

  protected createWidget(connector: any, widgetParams: Record<string, unknown> = {}): any {
    const render = (state: any, isFirstRendering: boolean) => {
      if (this.updateState) {
        this.updateState(state, isFirstRendering);
      } else {
        this.state = state;
      }

      this.ngAisInstantSearch?.syncSearchParameters();
    };

    this.widget = connector(render, () => undefined)(widgetParams);
    return this.widget;
  }

  protected get ngAisInstantSearch(): NgAisInstantSearch | undefined {
    return this.instantSearchInstance;
  }

  cx(part?: string): string {
    const base = `ais-${this.widgetType}`;
    return part ? `${base}-${part}` : base;
  }

  getItemClass(item: any): string {
    const classes = [this.cx('item')];
    if (item?.isRefined) {
      classes.push('is-refined');
    }
    return classes.join(' ');
  }

  ngOnInit(): void {
    if (this.widget) {
      this.ngAisInstantSearch?.registerWidget(this.widget);
    }
  }

  ngOnDestroy(): void {
    if (this.widget) {
      this.ngAisInstantSearch?.unregisterWidget(this.widget);
    }
  }
}

export class TypedBaseWidget<TDescription = any, TParams = any> extends BaseWidget {
  declare public state: any;
}

@Component({
  selector: 'ais-instantsearch',
  template: '<ng-content></ng-content>',
  providers: [
    {
      provide: NgAisInstantSearch,
      useExisting: forwardRef(() => AisInstantsearchComponent),
    },
    {
      provide: NgAisIndex,
      useExisting: forwardRef(() => AisInstantsearchComponent),
    },
  ],
})
export class AisInstantsearchComponent
  extends NgAisInstantSearch
  implements OnChanges, AfterContentInit, OnDestroy
{
  @Input() config: any;
  @Input('index-name') indexName?: string;
  @Output() onRender = new EventEmitter<any>();

  private disposed = false;
  private currentConfig?: any;
  private currentIndexName?: string;
  private renderGeneration = 0;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['config'] || changes['indexName']) {
      this.initialize();
    }
  }

  ngAfterContentInit(): void {
    this.initialize();
    this.start();
  }

  override ngOnDestroy(): void {
    this.disposed = true;
    this.instantSearchInstance?.dispose();
    this.clearInstance();
    this.onRender.complete();
    super.ngOnDestroy();
  }

  private initialize(): void {
    const resolvedIndexName = this.config?.indexName || this.indexName;
    if (!this.config?.searchClient || !resolvedIndexName) {
      if (this.instantSearchInstance) {
        this.renderGeneration += 1;
        this.instantSearchInstance.dispose();
        this.clearInstance();
        this.currentConfig = undefined;
        this.currentIndexName = undefined;
      }
      return;
    }

    if (
      this.instantSearchInstance &&
      this.currentConfig === this.config &&
      this.currentIndexName === resolvedIndexName
    ) {
      return;
    }

    const wasStarted = this.started;
    if (this.instantSearchInstance) {
      this.instantSearchInstance.dispose();
      this.clearInstance();
    }

    this.currentConfig = this.config;
    this.currentIndexName = resolvedIndexName;
    const renderGeneration = ++this.renderGeneration;

    const instance = instantsearch({
      indexName: resolvedIndexName,
      searchClient: this.config.searchClient,
    });

    if (this.config.searchParameters && Object.keys(this.config.searchParameters).length > 0) {
      instance.addWidgets([configure(this.config.searchParameters)]);
      this.searchParameters = {
        ...this.config.searchParameters,
      };
    }

    instance.on('render', () => {
      if (this.disposed || renderGeneration !== this.renderGeneration) {
        return;
      }

      this.syncSearchParameters();
      this.onRender.emit({ instantSearchInstance: instance });
    });

    this.setInstance(instance);
    if (wasStarted) {
      this.start();
    }
  }
}

@Component({
  selector: 'ais-infinite-hits',
  template: `
    <ng-container
      *ngIf="template && templateContext"
      [ngTemplateOutlet]="template"
      [ngTemplateOutletContext]="templateContext"
    ></ng-container>
  `,
})
export class AisInfiniteHitsComponent implements OnInit, OnDestroy {
  @ContentChild(TemplateRef, { static: true }) template?: TemplateRef<unknown>;

  templateContext: Record<string, unknown> = {
    hits: [],
    results: null,
    showMore: () => undefined,
  };

  private widget: any;

  constructor(
    @Inject(forwardRef(() => NgAisInstantSearch))
    private readonly instantSearch: NgAisInstantSearch,
    @Optional()
    public parentIndex: NgAisIndex,
    private readonly cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.widget = connectInfiniteHits((state: any) => {
      this.templateContext = {
        $implicit: state.items,
        hits: state.items,
        results: state.results,
        showMore: () => state.showMore(),
      };

      this.instantSearch.syncSearchParameters();

      if (!(this.cdr as ViewRef).destroyed) {
        this.cdr.detectChanges();
      }
    }, () => undefined)({});

    this.instantSearch.registerWidget(this.widget);
  }

  ngOnDestroy(): void {
    this.instantSearch.unregisterWidget(this.widget);
  }
}

@Component({
  selector: 'ais-highlight',
  template: '{{ text }}',
})
export class AisHighlightComponent implements OnChanges {
  @Input() attribute = '';
  @Input() hit: any;

  text = '';

  ngOnChanges(): void {
    const value = this.attribute ? this.hit?.[this.attribute] : this.hit;
    this.text = value == null ? '' : String(value);
  }
}

@NgModule({
  declarations: [
    AisHighlightComponent,
    AisInfiniteHitsComponent,
    AisInstantsearchComponent,
  ],
  imports: [CommonModule],
  exports: [
    AisHighlightComponent,
    AisInfiniteHitsComponent,
    AisInstantsearchComponent,
  ],
})
export class NgAisModule {}
