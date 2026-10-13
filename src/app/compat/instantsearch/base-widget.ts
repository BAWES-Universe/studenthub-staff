import { Directive, Input } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { noop } from './utils';

function bem(widgetName: string) {
  return function cx(element?: string, subElement?: string): string {
    let cssClass = `ais-${widgetName}`;

    if (element) {
      cssClass += `-${element}`;
    }

    if (subElement) {
      cssClass += `--${subElement}`;
    }

    return cssClass;
  };
}

@Directive()
export class BaseWidget {
  @Input() autoHideContainer: boolean;

  public state: any = {};
  public widget: any;
  public updateState: (state: any, isFirstRendering?: boolean) => any;
  public cx: (element?: string, subElement?: string) => string;
  public parentIndex: any;
  public instantSearchInstance: any;

  constructor(widgetName: string) {
    this.cx = bem(widgetName);
    this.updateState = (state, isFirstRendering) => {
      if (isFirstRendering) {
        return Promise.resolve().then(() => {
          this.state = state;
        });
      }

      this.state = state;
    };
  }

  get parent() {
    return this.parentIndex || this.instantSearchInstance;
  }

  createWidget(connector: any, options: any = {}, additionalWidgetProperties: any = {}) {
    this.widget = {
      ...connector(this.updateState, noop)(options),
      ...additionalWidgetProperties,
    };
  }

  ngOnInit() {
    this.parent.addWidgets([this.widget]);
  }

  ngOnDestroy() {
    if (isPlatformBrowser(this.instantSearchInstance.platformId)) {
      this.parent.removeWidgets([this.widget]);
    }
  }

  getItemClass(item: any): string {
    const className = this.cx('item');
    return item.isRefined ? `${className} ${this.cx('item', 'selected')}` : className;
  }
}

@Directive()
export class TypedBaseWidget<TWidgetDescription = any, TConnectorParams = any> extends BaseWidget {
  declare public state: TWidgetDescription extends { renderState: infer TState } ? TState : any;

  createWidget(connector: any, options: TConnectorParams, additionalWidgetProperties: any = {}) {
    super.createWidget(connector, options, additionalWidgetProperties);
  }
}
