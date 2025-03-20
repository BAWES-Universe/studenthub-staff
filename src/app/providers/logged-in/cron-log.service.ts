import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthHttpService } from './authhttp.service';


@Injectable({
  providedIn: 'root'
})
export class CronLogService {

  private _cronLogEndpoint: string = "/cron-log";
  
  constructor(private _authhttp: AuthHttpService) { }

  /**
   * List of all universities
   * @returns {Observable<any>}
   */
  list(): Observable<any> {
    let url = this._cronLogEndpoint;
    return this._authhttp.get(url);
  }
}
