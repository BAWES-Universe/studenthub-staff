import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { highlight } from 'instantsearch.js/es/helpers';

function getPropertyByPath(object: any, path: string) {
  return path
    .replace(/\[(\d+)]/g, '.$1')
    .split('.')
    .reduce((current, key) => (current ? current[key] : undefined), object);
}

@Component({
  selector: 'app-instantsearch-highlight',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<span class="ais-Highlight" [innerHtml]="content"></span>',
})
export class InstantSearchHighlightComponent {
  @Input() attribute: string;
  @Input() hit: any;
  @Input() tagName = 'mark';

  get content() {
    if (!this.hit || !this.attribute) {
      return '';
    }

    const highlightAttributeResult = getPropertyByPath(this.hit._highlightResult, this.attribute);
    const fallback = getPropertyByPath(this.hit, this.attribute);

    if (!highlightAttributeResult) {
      return fallback || '';
    }

    return highlight({
      attribute: this.attribute,
      highlightedTagName: this.tagName,
      hit: this.hit,
    });
  }
}
