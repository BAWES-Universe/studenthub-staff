import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
// services
import { AuthHttpService } from './authhttp.service';
// models
import { File } from '../../models/file';
import {Company} from 'src/app/models/company';


@Injectable({
  providedIn: 'root'
})
export class CompanyService {

  private _companyEndpoint = '/companies';

  constructor(private _authhttp: AuthHttpService) { }

  /**
   * List of all companies
   * @param page
   * @param searchParams
   */
  list(page, searchParams): Observable<any> {
    return this._authhttp.getRaw(this._companyEndpoint + '?page=' + page + searchParams + '&expand=subCompanies,subCompanies.stores,stores,subCompanies.stores.candidates,files,notes');
  }

  /**
   * List of all companies
   * @param page
   * @param searchParams
   */
  listWithContact(page, searchParams): Observable<any> {
    return this._authhttp.getRaw(this._companyEndpoint + '?page=' + page + searchParams + '&expand=subCompanies,companyContacts,companyContacts.companyContactEmails,companyContacts.companyContactPhones,subCompanies.companyContacts,subCompanies.companyContacts.companyContactEmails,subCompanies.companyContacts.companyContactPhones');
  }

  /**
   * List of all followup companies
   * @returns {Observable<any>}
   */
  listFollowups(page): Observable<any> {
    const url = this._companyEndpoint + '/followups?page=' + page + '&expand=subCompanies,subCompanies.stores,stores';
    return this._authhttp.getRaw(url);
  }

  /**
   * model detail
   * @param company_id
   */
  view(company_id) {
    return this._authhttp.get(this._companyEndpoint + '/' + company_id + '?expand=brands,subCompanies,subCompanies.stores,subCompanies.stores.mall,stores,stores.mall,subCompanies.stores.candidates,files,requests,notes,brands,parentTransfers,parentTransfers.profit,parentTransfers.childTransfers,parentTransfers.childTransfers.company,parentTransfers.totalCandidateTransferTotal,parentTransfers.totalPaid,parentTransfers.paidTransferCandidates,malls');
  }

  /**
   * model detail
   * @param id
   */
  companyDetail(id) {
    return this._authhttp.get(this._companyEndpoint + '/' + id + '?expand=files,requests,notes,brands');
  }

  /**
   * add followup note
   * @param note
   * @param company_id
   */
  addFollowupNote(note: string, company_id: number): Observable<any> {
    const url = `${this._companyEndpoint}/add-followup-note/${company_id}`;
    const params = {
      note
    };
    return this._authhttp.post(url, params);
  }

  /**
   * create file for company
   * @param {Company} model
   * @returns {Observable<any>}
   */
  createFile(model: File): Observable<any> {
    const url = `${this._companyEndpoint}/file-create/${model.company_id}`;
    const params = {
      file_title: model.file_title,
      file_description: model.file_description,
      file_s3_path: model.file_s3_path,
    };

    return this._authhttp.post(url, params);
  }


  /**
   * Create company
   * @param {Company} model
   * @returns {Observable<any>}
   */
  create(model: Company): Observable<any>{
    const postUrl = `${this._companyEndpoint}`;
    const params = {
      parent: model.parent_company_id,
      name: model.company_name,
      email: model.company_email,
      password: model.company_password_hash,
      bonus_commission: model.company_bonus_commission,
      hourly_rate: model.company_hourly_rate,
      common_name_en : model.company_common_name_en,
      common_name_ar : model.company_common_name_ar,
      description_en : model.company_description_en,
      description_ar : model.company_description_ar,
      website : model.company_website,
      logo : model.company_logo,
    };

    return this._authhttp.post(postUrl, params);
  }

  /**
   * Update company
   * @param {Company} model
   * @returns {Observable<any>}
   */
  update(model: Company): Observable<any>{
    const params = {
      parent: model.parent_company_id,
      name: model.company_name,
      email: model.company_email,
      bonus_commission: model.company_bonus_commission,
      hourly_rate: model.company_hourly_rate,
      common_name_en : model.company_common_name_en,
      common_name_ar : model.company_common_name_ar,
      description_en : model.company_description_en,
      description_ar : model.company_description_ar,
      website : model.company_website,
      logo : model.company_logo,
    };

    return this._authhttp.patch(`${this._companyEndpoint}/${model.company_id}`, params);
  }
  /**
   * Reset Password
   * @param {Company} model
   * @returns {Observable<any>}
   */
  resetPassword(model: Company): Observable<any> {
    const url = `${this._companyEndpoint}/reset-password/${model.company_id}`;
    return this._authhttp.patch(url, {});
  }
}
