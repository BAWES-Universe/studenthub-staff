import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
// services
import { AuthHttpService } from 'src/app/providers/logged-in/authhttp.service';


@Injectable({
  providedIn: 'root'
})
export class CountryService {

  constructor(
    private http: AuthHttpService
  ) { }

  /**
   * country list
   * @param page
   * @param query
   */
  list(page, query = null): Observable<any> {
    let url = `/countries?page=${page}`;
    if (query) {
      url += `&keyword=${query}`;
    }
    return this.http.getRaw(url);
  }
}
