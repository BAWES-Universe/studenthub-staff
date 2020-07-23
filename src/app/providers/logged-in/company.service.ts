import { Injectable } from '@angular/core';
import { Observable } from "rxjs";
import { AuthhttpService } from "./authhttp.service";

@Injectable({
  providedIn: 'root'
})
export class CompanyService {

  private _companyEndpoint: string = "/companies";

  constructor(private _authhttp: AuthhttpService) { }

  /**
   * List of all companies
   * @returns {Observable<any>}
   */
  list(page): Observable<any>{
    return this._authhttp.getRaw(this._companyEndpoint + '?page=' + page+'&expand=subCompanies,subCompanies.stores,stores');
  }

  /**
   * model detail
   * @param company_id
   */
  view(company_id) {
    return this._authhttp.get(this._companyEndpoint + '/' + company_id + '?expand=subCompanies,subCompanies.stores,stores');
  }
}
