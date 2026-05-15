// Fix #32
import { Injectable } from '@angular/core';
@Injectable({providedIn:'root'})
export class AlgoliaService {
  client: any;
  search(q: string) { return this.client.search(q); }
}
