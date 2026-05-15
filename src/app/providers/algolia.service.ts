// Fix for Issue #32 - Replace angular-instantsearch with instantsearch.js
import { Injectable } from '@angular/core';
import algoliasearch from 'algoliasearch/lite';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AlgoliaService {
  readonly client = algoliasearch(environment.algoliaAppId, environment.algoliaSearchKey);

  createIndex(indexName: string) {
    return this.client.initIndex(indexName);
  }

  async search(indexName: string, query: string, filters?: string) {
    const index = this.createIndex(indexName);
    return index.search(query, { filters });
  }
}
