import { Component, Inject, forwardRef, Optional, OnInit } from '@angular/core';
import { TypedBaseWidget, NgAisInstantSearch, NgAisIndex } from 'angular-instantsearch';

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
      @Inject(forwardRef(() => NgAisIndex))
      @Optional()
      public parentIndex: NgAisIndex,
      @Inject(forwardRef(() => NgAisInstantSearch))
      public instantSearchInstance: NgAisInstantSearch
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
  