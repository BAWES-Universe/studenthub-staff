import { Injectable } from '@angular/core';
import { Observable } from "rxjs";
//services
import { AuthHttpService } from "./authhttp.service";


@Injectable({
  providedIn: 'root'
})
export class StatisticService {

  private _endpoint: string = "/statistics";

  constructor(private _authhttp: AuthHttpService) { }

  /**
   * Return statistics
   * @returns {Observable<any>}
   */
  get(refresh: boolean = false): Observable<any> {
    let url = this._endpoint + '?refresh=' + refresh;
    return this._authhttp.get(url);
  }
}
