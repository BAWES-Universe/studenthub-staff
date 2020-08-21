import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
// Services
import { AuthHttpService } from './authhttp.service';
// Models
import { CompanyContact } from 'src/app/models/company-contact';


@Injectable({
  providedIn: 'root'
})
export class CompanyContactService {

  private _companyContactEndpoint: string = "/company-contacts";

  constructor(private _authhttp: AuthHttpService) { }

  /**
   * get company contacts
   * @param company_id 
   */
  companyContacts(company_id) : Observable<any>{
    const url = `${this._companyContactEndpoint}?expand=companyContactEmails,companyContactPhones&company_id=${company_id}`;
    return this._authhttp.get(url);
  }

  /**
   * Create university
   * @param {CompanyContact} model
   * @returns {Observable<any>}
   */
  create(model: CompanyContact): Observable<any>{
    let postUrl = `${this._companyContactEndpoint}`;

    let params = {
      "company_id": model.company_id,
      "name": model.contact_name,
      "position": model.contact_position,
      "note": model.contact_note,
      "emails": model.companyContactEmails,
      "phones": model.companyContactPhones
    };

    return this._authhttp.post(postUrl, params);
  }

  /**
   * Update university
   * @param {CompanyContact} model
   * @returns {Observable<any>}
   */
  update(model: CompanyContact): Observable<any>{
    let url = `${this._companyContactEndpoint}/${model.contact_uuid}`;
    let params = {
      "company_id": model.company_id,
      "name": model.contact_name,
      "position": model.contact_position,
      "note": model.contact_note,
      "emails": model.companyContactEmails,
      "phones": model.companyContactPhones
    };

    return this._authhttp.patch(url, params);
  }

  /**
   * Deletes university
   * @param {CompanyContact} model
   * @returns {Observable<any>}
   */
  delete(model: CompanyContact): Observable<any>{
    let url = `${this._companyContactEndpoint}/${model.contact_uuid}`;
    return this._authhttp.delete(url);
  }
}
