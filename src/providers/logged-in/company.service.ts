import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
// Services
import { AuthHttpService } from './authhttp.service';
// Models
import { Company } from '../../models/company';

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
  list(): Observable<any>{
    let url = this._companyEndpoint;
    return this._authhttp.get(url);
  }


}
