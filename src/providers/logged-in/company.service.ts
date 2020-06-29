import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
// Services
import { AuthHttpService } from './authhttp.service';

/**
 * Manages Company Functionality on the server
 */
@Injectable()
export class CompanyService {

  private _companyEndpoint: string = "/companies";

  constructor(private _authhttp: AuthHttpService) { }

  /**
   * List of all companies
   * @returns {Observable<any>}
   */
  list(page): Observable<any>{
    let url = this._companyEndpoint + '?page=' + page;
    return this._authhttp.getRaw(url);
  }


}
