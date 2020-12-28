import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
// services
import { AuthHttpService } from './authhttp.service';
// models
import { File } from '../../models/file';
import { Company } from 'src/app/models/company';
import { Note } from 'src/app/models/note';


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
    return this._authhttp.getRaw(this._companyEndpoint + '?page=' + page + searchParams + '&expand=subCompanies,stores,transferInLast40Days,subCompanies.stores,subCompanies.stores.candidateWorkHistoryByLast40Days,stores.candidateWorkHistoryByLast40Days');
  }

  /**
   * List of all companies
   * @param page
   * @param searchParams
   */
  listWithContact(page, searchParams): Observable<any> {
    return this._authhttp.getRaw(this._companyEndpoint + '?page=' + page + searchParams + '&expand=subCompanies,companyContacts,companyContacts.companyContactEmails,companyContacts.companyContactPhones,subCompanies.companyContacts,subCompanies.companyContacts.companyContactEmails,subCompanies.companyContacts.companyContactPhones,requests');
  }

  /**
   * update follow up
   * @param model
   */
  updateFollowup(model: Company): Observable<any> {
    const url = `${this._companyEndpoint}/update-followup/${model.company_id}`;
    const params = {
      followup: model.company_followup
    };
    return this._authhttp.patch(url, params);
  }

  /**
   * update follow up interval in weeks
   * @param company_id
   * @param company_followup_interval_weeks
   */
  updateFollowupInterval(company_id, company_followup_interval_weeks): Observable<any> {
    const url = `${this._companyEndpoint}/update-followup-interval/${company_id}`;
    const params = {
      followup_interval_weeks: company_followup_interval_weeks
    };
    return this._authhttp.patch(url, params);
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
   * @param companyID
   * @param expands
   */
  view(
    companyID,
    expands= 'brands,subCompanies,subCompanies.stores,subCompanies.stores.mall,subCompanies.stores.brand,stores,stores.mall,stores.brand,subCompanies.stores.candidates,files,requests,notes,brands,parentTransfers,parentTransfers.profit,parentTransfers.childTransfers,parentTransfers.childTransfers.company,parentTransfers.totalCandidateTransferTotal,parentTransfers.totalPaid,parentTransfers.paidTransferCandidates,malls,notes.createdBy,notes.updatedBy,companyContacts'
  ) {
    return this._authhttp.get(this._companyEndpoint + '/' + companyID + '?expand=' + expands);
  }

  /**
   * model detail
   * @param companyID
   */
  stats(companyID) {
    return this._authhttp.get(this._companyEndpoint + '/' + companyID + '?expand=stats');
  }

  /**
   * detail with all candidates
   * @returns {Observable<any>}
   */
  getWithCandidates(companyID): Observable<any> {
    let url = `${this._companyEndpoint}/${companyID}?expand=candidates,candidates.store,candidates.company`;
    return this._authhttp.get(url);
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
   */
  addFollowupNote(note: Note): Observable<any> {
    const url = `${this._companyEndpoint}/add-followup-note/${note.company_id}`;
    const params = {
      note: note.note_text,
      type: note.note_type
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
  create(model: Company): Observable<any> {
    const postUrl = `${this._companyEndpoint}`;
    const params = {
      parent: model.parent_company_id,
      name: model.company_name,
      email: model.company_email,
      password: model.company_password_hash,
      bonus_commission: model.company_bonus_commission,
      hourly_rate: model.company_hourly_rate,
      common_name_en: model.company_common_name_en,
      common_name_ar: model.company_common_name_ar,
      description_en: model.company_description_en,
      description_ar: model.company_description_ar,
      website: model.company_website,
      logo: model.company_logo,
      followup_interval_weeks: model.company_followup_interval_weeks,
      followup: model.company_followup
    };

    return this._authhttp.post(postUrl, params);
  }

  /**
   * Update company
   * @param {Company} model
   * @returns {Observable<any>}
   */
  update(model: Company): Observable<any> {
    const params = {
      parent: model.parent_company_id,
      name: model.company_name,
      email: model.company_email,
      bonus_commission: model.company_bonus_commission,
      hourly_rate: model.company_hourly_rate,
      common_name_en: model.company_common_name_en,
      common_name_ar: model.company_common_name_ar,
      description_en: model.company_description_en,
      description_ar: model.company_description_ar,
      website: model.company_website,
      logo: model.company_logo,
      followup_interval_weeks: model.company_followup_interval_weeks,
      followup: model.company_followup
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

  /**
   * change company status
   * @param model
   * @param status
   */
  changeStatus(model: Company, status: number = 10): Observable<any> {
    const url = `${this._companyEndpoint}/change-status/${model.company_id}`;
    return this._authhttp.patch(url, { status });
  }
}
