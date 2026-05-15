import { AfterViewInit, Component, EventEmitter, Inject, Input, OnDestroy, OnInit, Output, PLATFORM_ID } from '@angular/core';
import { VERSION as ANGULAR_VERSION } from '@angular/core';
import InstantSearch from 'instantsearch.js/es/lib/InstantSearch';

@Component({
  selector: 'app-instantsearch',
  template: '<ng-content></ng-content>',
})
export class NgAisInstantSearch implements OnInit, AfterViewInit, OnDestroy {
  @Input() config: any;
  @Input() instanceName = 'default';
  @Input('index-name') indexName: string;
  @Output() change: EventEmitter<any> = new EventEmitter();
  @Output() onRender: EventEmitter<any> = new EventEmitter();

  public instantSearchInstance: any;

  constructor(@Inject(PLATFORM_ID) public platformId: Object) {}

  ngOnInit() {
    if (typeof this.config.searchClient.addAlgoliaAgent === 'function') {
      this.config.searchClient.addAlgoliaAgent(`angular (${ANGULAR_VERSION.full})`);
      this.config.searchClient.addAlgoliaAgent('studenthub-staff-instantsearch');
    }

    this.instantSearchInstance = new InstantSearch(this.config);
    this.instantSearchInstance.on('render', this.emitRenderState);
  }

  ngAfterViewInit() {
    this.instantSearchInstance.start();
  }

  ngOnDestroy() {
    if (this.instantSearchInstance) {
      this.instantSearchInstance.removeListener('render', this.emitRenderState);
      this.instantSearchInstance.dispose();
    }
  }

  addWidgets(widgets: any[]) {
    this.instantSearchInstance.addWidgets(widgets);
  }

  removeWidgets(widgets: any[]) {
    this.instantSearchInstance.removeWidgets(widgets);
  }

  refresh() {
    this.instantSearchInstance.refresh();
  }

  private emitRenderState = () => {
    const payload = {
      results: this.instantSearchInstance.helper.lastResults,
      state: this.instantSearchInstance.helper.state,
    };

    this.change.emit(payload);
    this.onRender.emit(payload);
  };
}
