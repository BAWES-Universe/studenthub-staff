import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthHttpService } from './authhttp.service';
import {File} from "../../models/file";

@Injectable({
  providedIn: 'root'
})
export class CompanyService {

  private _companyEndpoint = '/companies';

  constructor(private _authhttp: AuthHttpService) { }

  /**
   * List of all companies
   * @returns {Observable<any>}
   */
  list(page): Observable<any>{
    return this._authhttp.getRaw(this._companyEndpoint + '?page=' + page + '&expand=subCompanies,subCompanies.stores,stores,subCompanies.stores.candidates,files');
  }

  /**
   * model detail
   * @param company_id
   */
  view(company_id) {
    return this._authhttp.get(this._companyEndpoint + '/' + company_id + '?expand=brands,subCompanies,subCompanies.stores,stores,subCompanies.stores.candidates,files');
  }

  /**
   * model detail
   * @param id
   */
  companyDetail(id) {
    return this._authhttp.get(this._companyEndpoint + '/' + id + '?expand=files');
  }

  /**
   * create file for company
   * @param {Company} model
   * @returns {Observable<any>}
   */
  createFile(model: File): Observable<any>{
    const url = `${this._companyEndpoint}/file-create/${model.company_id}`;
    const params = {
      file_title: model.file_title,
      file_description: model.file_description,
      file_s3_path: model.file_s3_path,
    };

    return this._authhttp.post(url, params);
  }

}
