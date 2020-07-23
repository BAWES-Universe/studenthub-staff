import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import {AuthhttpService} from "./authhttp.service";

@Injectable({
  providedIn: 'root'
})
export class CountryService {

  private _countryEndpoint: string = "/countries";
  constructor(private _authhttp: AuthhttpService) { }

  /**
   * List of all universities
   * @returns {Observable<any>}
   */
  list(page: number): Observable<any> {
    let url = this._countryEndpoint + '?page=' + page;
    return this._authhttp.getRaw(url);
  }

  /**
   * detail
   * @returns {Observable<any>}
   */
  view(country_id): Observable<any> {
    return this._authhttp.get(this._countryEndpoint + '/' + country_id);
  }

  /**
   * List of all universities
   * @returns {Observable<any>}
   */
  listAll(): Observable<any> {
    let url = this._countryEndpoint + '/all';
    return this._authhttp.get(url);
  }
}

