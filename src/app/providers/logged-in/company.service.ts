import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
//services
import { AuthHttpService } from './authhttp.service';
//models
import { File } from "../../models/file";


@Injectable({
  providedIn: 'root'
})
export class CompanyService {

  private _companyEndpoint = '/companies';

  constructor(private _authhttp: AuthHttpService) { }

  /**
   * List of all companies
   * @param page
   * @param status
   */
  list(page, status = 0): Observable<any> {
    return this._authhttp.getRaw(this._companyEndpoint + '?page=' + page + '&status=' + status + '&expand=subCompanies,subCompanies.stores,stores,subCompanies.stores.candidates,files,requests,notes');
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
    return this._authhttp.get(this._companyEndpoint + '/' + company_id + '?expand=brands,subCompanies,subCompanies.stores,stores,subCompanies.stores.candidates,files,requests,notes,brands,parentTransfers,parentTransfers.profit,parentTransfers.childTransfers,parentTransfers.childTransfers.company,parentTransfers.totalCandidateTransferTotal,parentTransfers.totalPaid,parentTransfers.paidTransferCandidates');
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
      note: note
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

}
