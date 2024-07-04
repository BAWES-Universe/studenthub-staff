import { Injectable } from '@angular/core';
import { Observable, expand } from 'rxjs';
// Services
import { AuthHttpService } from './authhttp.service';
// Models
import { Contact } from 'src/app/models/contact';
import { CompanyContact } from 'src/app/models/company-contact';


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
  list(page, query = '', expand='contactEmails,contactPhones,company,companies'): Observable<any>{
    const url = `${this._endpoint}?expand=${expand}&page=${page}&query=${query}`;
    return this._authhttp.getRaw(url);
  }

  /**
   * get given company contacts
   * @param companyID
   * //notes,requests
   */
  companyContacts(companyID, query = '', expands= 'contactEmails,contactPhones,company'): Observable<any>{
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
   * load contact role detail
   * @param contact_uuid
   */
  viewCompanyContact(contact_uuid, company_id): Observable<any>{
    const url = `${this._endpoint}/view-company-contact?contact_uuid=${contact_uuid}&company_id=${company_id}`;
    return this._authhttp.get(url);
  }

  /**
   * check if email already exists
   * @param email
   */
  isEmailExists(email: string): Observable<any>{
    const url = `${this._endpoint}/is-email-exists?email=${email}`;
    return this._authhttp.get(url);
  }

  /**
   * add contact to team
   * @param companyContact
   */
  addToTeam(companyContact: CompanyContact): Observable<any>{
    const url = `${this._endpoint}/add-to-team`;

    const params = {
      allow_access: companyContact.allow_access,
      contact_position: companyContact.contact_position,
      contact_uuid: companyContact.contact_uuid,
      company_id: companyContact.company_id
    };

    return this._authhttp.patch(url, params);
  }

  /**
   * create contact
   * @param model
   * @param companyContact
   */
  create(model: Contact, companyContact: CompanyContact = null): Observable<any>{
    const postUrl = `${this._endpoint}`;

    const params = {
      company_id: companyContact?.company_id,
      allow_access: companyContact?.allow_access,
      contact_position: companyContact?.contact_position,
      name: model.contact_name,
      email: model.contact_email,
      password: model.contact_password,
      receive_suggestions: model.contact_receive_suggestions,
      receive_email: model.contact_receive_email,
      receive_notification: model.contact_receive_notification,
      emails: model.contactEmails,
      phones: model.contactPhones,
    };

    return this._authhttp.post(postUrl, params);
  }

  /**
   * Update university
   * @param {Contact} model
   * @returns {Observable<any>}
   */
  update(model: Contact, companyContact: CompanyContact = null): Observable<any>{
    const url = `${this._endpoint}/${model.contact_uuid}`;

    const params = {
      company_id: companyContact?.company_id,
      allow_access: companyContact?.allow_access,
      contact_position: companyContact?.contact_position,
      name: model.contact_name,
      email: model.contact_email,
      password: model.contact_password,
      receive_suggestions: model.contact_receive_suggestions,
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
  delete(model): Observable<any>{
    const url = `${this._endpoint}/${model.contact_uuid}`;
    return this._authhttp.delete(url);
  }

  /**
   * remove from team 
   * @param contact_uuid 
   * @param company_id 
   * @returns 
   */
  removeFromTeam(contact_uuid, company_id): Observable<any>{
    const url = `${this._endpoint}/remove-from-team/${contact_uuid}`;
    return this._authhttp.patch(url, {
      company_id: company_id
    });
  }

  /**
   * Deletes
   * @param {Contact} model
   * @returns {Observable<any>}
   */
  sendEmail(model): Observable<any>{
    const url = `${this._endpoint}/send-verification-email?contact_uuid=${model.contact_uuid}`;
    return this._authhttp.get(url);
  }

  /**
   * mark email verified 
   * @param model 
   * @returns 
   */
  markEmailVerified(model): Observable<any>{
    const url = `${this._endpoint}/mark-email-verified`;
    return this._authhttp.patch(url, {
      contact_uuid: model.contact_uuid
    });
  }

  /**
   * get login url and open in new window 
   * @param contact_uuid 
   * @returns 
   */
  login(contact_uuid): Observable<any>{
    let url = `${this._endpoint}/login/${contact_uuid}`;
    return this._authhttp.post(url, {});
  }
}
