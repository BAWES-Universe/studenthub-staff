import { Injectable } from '@angular/core';
import {AuthhttpService} from "./authhttp.service";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  private _accountEndpoint: string = "/account";

  constructor(private _authhttp: AuthhttpService) {
  }

  /**
   * Update password
   * @returns {Observable<any>}
   */
  updatePassword(params): Observable<any> {
    return this._authhttp.post(this._accountEndpoint + '/update-password', params);
  }
}
