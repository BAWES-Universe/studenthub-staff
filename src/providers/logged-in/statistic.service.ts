import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
// Services
import { AuthHttpService } from './authhttp.service';

/**
 * Manages Staff Functionality on the server
 */
@Injectable()
export class StatisticService {

  private _endpoint: string = "/statistics";

  constructor(private _authhttp: AuthHttpService) { }

  /**
   * Return statistics
   * @returns {Observable<any>}
   */
  get(): Observable<any>{
    let url = this._endpoint;
    return this._authhttp.get(url);
  }
}