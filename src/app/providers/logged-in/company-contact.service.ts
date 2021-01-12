import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
// Services
import { AuthHttpService } from './authhttp.service';
// Models
import { Contact } from 'src/app/models/contact';


@Injectable({
  providedIn: 'root'
})
export class CompanyContactService {

  private _endpoint = '/company-contacts';

  constructor(private _authhttp: AuthHttpService) { }

  /**
   * get all company contacts
   * @param company_id
   */
  list(page, query = ''): Observable<any>{
    const url = `${this._endpoint}?expand=contactEmails,contactPhones,company&page=${page}&query=${query}`;
    return this._authhttp.getRaw(url);
  }

  /**
   * get given company contacts
   * @param companyID
   */
  companyContacts(companyID, query = '', expands= 'contactEmails,contactPhones,company,notes,requests,contactStats'): Observable<any>{
    const url = `${this._endpoint}?company_id=${companyID}&query=${query}&expand=${expands}`;
    return this._authhttp.get(url);
  }

  /**
   * get company contact detail
   * @param contact_uuid
   */
  view(contact_uuid): Observable<any>{
    const url = `${this._endpoint}/${contact_uuid}?expand=contactEmails,contactPhones,company`;
    return this._authhttp.get(url);
  }

  /**
   * Create university
   * @param {Contact} model
   * @returns {Observable<any>}
   */
  create(model: Contact): Observable<any>{
    const postUrl = `${this._endpoint}`;

    const params = {
    //  company_id: model.company_id,
      name: model.contact_name,
      email: model.contact_email,
      password: model.contact_password,
      receive_email: model.contact_receive_email,
      receive_notification: model.contact_receive_notification,
      position: model.contact_position,
      emails: model.contactEmails,
      phones: model.contactPhones
    };

    return this._authhttp.post(postUrl, params);
  }

  /**
   * Update university
   * @param {Contact} model
   * @returns {Observable<any>}
   */
  update(model: Contact): Observable<any>{
    const url = `${this._endpoint}/${model.contact_uuid}`;

    const params = {
    //  company_id: model.company_id,
      name: model.contact_name,
      position: model.contact_position,
      email: model.contact_email,
      password: model.contact_password,
      receive_email: model.contact_receive_email,
      receive_notification: model.contact_receive_notification,
      emails: model.contactEmails,
      phones: model.contactPhones
    };

    return this._authhttp.patch(url, params);
  }

  /**
   * Deletes 
   * @param {Contact} model
   * @returns {Observable<any>}
   */
  delete(model: Contact): Observable<any>{
    const url = `${this._endpoint}/${model.contact_uuid}`;
    return this._authhttp.delete(url);
  }
}
