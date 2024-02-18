import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
//services
import { AuthHttpService } from './logged-in/authhttp.service';


@Injectable({
  providedIn: 'root'
})
export class CurrencyService {

  constructor(
    private http: AuthHttpService
  ) { }

  /**
   * currency list
   * @param page
   * @param query
   */
  list(page, query = null): Observable<any> {
    let url = `/currency?page=${page}`;
    if (query) {
      url += `&keyword=${query}`;
    }
    return this.http.getRaw(url);
  }
}
