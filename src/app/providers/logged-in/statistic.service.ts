import { Injectable } from '@angular/core';
import {Observable} from "rxjs";

import {AuthhttpService} from "./authhttp.service";

@Injectable({
  providedIn: 'root'
})
export class StatisticService {

  private _endpoint: string = "/statistics";

  constructor(private _authhttp: AuthhttpService) { }

  /**
   * Return statistics
   * @returns {Observable<any>}
   */
  get(): Observable<any>{
    let url = this._endpoint;
    return this._authhttp.get(url);
  }
}
