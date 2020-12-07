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
   * get all company contacts
   * @param company_id 
   */
  list(page, query = '') : Observable<any>{
    const url = `${this._companyContactEndpoint}?expand=companyContactEmails,companyContactPhones,company&page=${page}&query=${query}`;
    return this._authhttp.getRaw(url);
  }

  /**
   * get given company contacts
   * @param company_id 
   */
  companyContacts(company_id, query = '') : Observable<any>{
    const url = `${this._companyContactEndpoint}?expand=companyContactEmails,companyContactPhones&company_id=${company_id}&query=${query}`;
    return this._authhttp.get(url);
  }
  
  /**
   * get company contact detail
   * @param contact_uuid 
   */
  view(contact_uuid) : Observable<any>{
    const url = `${this._companyContactEndpoint}/${contact_uuid}?expand=companyContactEmails,companyContactPhones`;
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
