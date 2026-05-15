import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AisInstantsearchComponent } from './instantsearch.component';
import { AisInfiniteHitsComponent } from './infinite-hits.component';
import { AisHighlightComponent } from './highlight.component';
import { AlgoliaInstantSearchService } from './algolia-instantsearch.service';

@NgModule({
  declarations: [
    AisInstantsearchComponent,
    AisInfiniteHitsComponent,
    AisHighlightComponent,
  ],
  imports: [
    CommonModule,
  ],
  providers: [
    AlgoliaInstantSearchService,
  ],
  exports: [
    AisInstantsearchComponent,
    AisInfiniteHitsComponent,
    AisHighlightComponent,
  ]
})
export class AisBridgeModule {}
