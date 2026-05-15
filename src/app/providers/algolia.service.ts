import { Injectable } from '@angular/core';
import algoliasearch from 'algoliasearch/lite';
import instantsearch from 'instantsearch.js';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AlgoliaService {
  readonly client = algoliasearch(environment.algoliaAppId, environment.algoliaSearchKey);

  createIndex(indexName: string) {
    return this.client.initIndex(indexName);
  }
}