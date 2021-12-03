import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {AuthHttpService} from './authhttp.service';

@Injectable({
  providedIn: 'root'
})
export class StaffService {

  private staffEndpoint = '/staff';

  constructor(private _authhttp: AuthHttpService) { }

  /**
   * Return list of all staff
   * @returns {Observable<any>}
   */
  list(page: number = 1, urlParams = ''): Observable<any>{
    const url = `${this.staffEndpoint}?page=${page}${urlParams}`;
    return this._authhttp.getRaw(url);
  }

  /**
   * detail
   * @param staffID
   */
  detail(staffID: number): Observable<any>{
    const url = `${this.staffEndpoint}/${staffID}`;
    return this._authhttp.get(url);
  }
}
