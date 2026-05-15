import { Component, OnInit } from '@angular/core';
import { TypedBaseWidget } from '../ais-bridge/base-widget';
import { AlgoliaInstantSearchService } from '../ais-bridge/algolia-instantsearch.service';

import connectPagination, {
  PaginationWidgetDescription,
  PaginationConnectorParams
} from 'instantsearch.js/es/connectors/pagination/connectPagination';
 
@Component({
  selector: 'bawes-ais-pagination',
  templateUrl: './bawes-ais-pagination.component.html',
  styleUrls: ['./bawes-ais-pagination.component.scss'],
})
export class BawesAisPaginationComponent extends TypedBaseWidget<PaginationWidgetDescription, PaginationConnectorParams> implements OnInit {
    
  //public state: PaginationWidgetDescription['renderState']; // Rendering options

    constructor(
      public instantSearchInstance: AlgoliaInstantSearchService
    ) {
      super('Pagination');
    }

    ngOnInit() {
      let a = this.createWidget(connectPagination, {
        // instance options
      });
      super.ngOnInit();
    }

    doInfinite(event) {

      //const remainingValidity = this.instantSearchInstance.instantSearchInstance. getSecuredApiKeyRemainingValidity('YourSecuredAPIkey');
          
      if(this.state)
       this.state.refine(this.state.currentRefinement + 1);

      event.target.complete();
    }
  }
  