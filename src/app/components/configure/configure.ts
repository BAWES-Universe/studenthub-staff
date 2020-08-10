import { connectConfigure } from 'instantsearch.js/es/connectors';
import {BaseWidget} from 'angular-instantsearch';
import {SearchParameters} from 'angular-instantsearch/instantsearch/instantsearch';
import {InstantSearchComponent} from '../instant-search/instant-search.component';

import {
  Component,
  Input,
  Inject,
  forwardRef,
  KeyValueDiffer,
  KeyValueDiffers,
  Testability, ContentChild, TemplateRef,
} from '@angular/core';
import {isObject} from "rxjs/internal-compatibility";

export function noop(...args: any[]): void {}

@Component({
  selector: 'is-configure',
  template: '',
})
export class NgAisConfigure extends BaseWidget {

  private internalSearchParameters: SearchParameters;

  private differ: KeyValueDiffer<string, any>; // SearchParameters (I don't know how to get the values of the type)

  @ContentChild(TemplateRef, { static: true }) template;

  public state: { refine: Function } = {
    refine: noop,
  };

  constructor(
    private differs: KeyValueDiffers,
    @Inject(forwardRef(() => InstantSearchComponent))
    public instantSearchParent: any
  ) {
    super('Configure');
  }

  @Input()
  set searchParameters(values: SearchParameters) {

    if (!values || !isObject(values)) {
      return;
    }

    this.internalSearchParameters = values;

    if (!this.differ && values) {
      this.differ = this.differs.find(values).create();
    }
  }

  public ngOnInit() {
    if (this.internalSearchParameters && isObject(this.internalSearchParameters)) {
      this.createWidget(connectConfigure, {
        searchParameters: this.internalSearchParameters,
      });
    } else {
      this.createWidget(connectConfigure, {
        searchParameters: {},
      });
    }

    super.ngOnInit();
  }

  ngDoCheck() {
    if (this.differ) {
      const changes = this.differ.diff(this.internalSearchParameters);
      
      if (changes) {
        this.state.refine(this.internalSearchParameters);
      }
    }
  }
}
