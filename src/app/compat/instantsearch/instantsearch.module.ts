import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NgAisInstantSearch } from './instantsearch.component';
import { NgAisIndex } from './index-widget.component';
import { InstantSearchHighlightComponent } from './highlight.component';
import { InstantSearchInfiniteHitsComponent } from './infinite-hits.component';

@NgModule({
  declarations: [
    NgAisInstantSearch,
    NgAisIndex,
    InstantSearchHighlightComponent,
    InstantSearchInfiniteHitsComponent,
  ],
  exports: [
    NgAisInstantSearch,
    NgAisIndex,
    InstantSearchHighlightComponent,
    InstantSearchInfiniteHitsComponent,
  ],
  imports: [CommonModule],
})
export class InstantSearchCompatModule {}

