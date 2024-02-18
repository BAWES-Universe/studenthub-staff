import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
// Services
import { AuthHttpService } from './authhttp.service';
//models
import { ComapanyRequest } from 'src/app/models/company.request';


@Injectable({
  providedIn: 'root'
})
export class CompanyRegistrationRequestService {
    
    private _endpoint = '/company-requests';
  
    constructor(private _authhttp: AuthHttpService) { }
  
    /**
     * load detail
     * @param company_request_uuid
     */
    view(company_request_uuid) {
      const url = this._endpoint + '/' + company_request_uuid + '?expand=country';
      return this._authhttp.get(url);
    }
  
    /**
     * List of all staff
     * @returns {Observable<any>}
     */
    list(page: number): Observable<any>{
      const url = this._endpoint + '?expand=country&page=' + page;
      return this._authhttp.getRaw(url);
    }
    
    /**
     * Reject
     * @param {ComapanyRequest} model
     * @returns {Observable<any>}
     */
    reject(model: ComapanyRequest): Observable<any>{
      const url = `${this._endpoint}/reject/${model.company_request_uuid}`;
      return this._authhttp.post(url, {});
    }

    /**
     * Approve
     * @param {ComapanyRequest} model
     * @returns {Observable<any>}
     */
    approve(model: ComapanyRequest): Observable<any>{
      const url = `${this._endpoint}/approve/${model.company_request_uuid}`;
      return this._authhttp.post(url, {});
    }
  }
  