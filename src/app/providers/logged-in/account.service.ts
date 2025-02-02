import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
//services
import {AuthHttpService} from "./authhttp.service";
//models
import { Staff } from 'src/app/models/staff';


@Injectable({
  providedIn: 'root'
})
export class AccountService {

  private _accountEndpoint: string = "/account";

  constructor(private _authhttp: AuthHttpService) {
  }

  /**
   * Update password
   * @returns {Observable<any>}
   */
  updatePassword(params): Observable<any> {
    return this._authhttp.post(this._accountEndpoint + '/update-password', params);
  }

  /**
   * Update password
   * @returns {Observable<any>}
   */
  validatePassword(params): Observable<any> {
    return this._authhttp.post(this._accountEndpoint + '/validate-password', params);
  }

  /**
   * Update staff
   * @param {Staff} model
   * @returns {Observable<any>}
   */
  update(model: Staff): Observable<any>{
    let url = `${this._accountEndpoint}`;
    let params = {
      "name": model.staff_name,
      'staff_photo': model.staff_photo,
      "staff_notification": model.staff_notification,
      "staff_job_title": model.staff_job_title,
      "enable_two_step_auth": model.enable_two_step_auth
    };

    return this._authhttp.patch(url, params);
  }

  /**
   * get account info
   */
  accountInfo(): Observable<any> {
    return this._authhttp.get(this._accountEndpoint);
  }
}
