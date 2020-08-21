import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import {AuthHttpService} from "./authhttp.service";
import {Store} from "../../models/store";

@Injectable({
  providedIn: 'root'
})
export class StoreService {

  private _storeEndpoint: string = "/stores";

  constructor(private _authhttp: AuthHttpService) { }

  /**
   * Return list of all stores
   * Pass comma-separated fields if you wish to only get specific fields from api
   * @param {string} fields list of fields you wish to get, ALL by default
   * @param {string} expand list of extra fields/relations you want. None by default
   * @returns {Observable<any>}
   */
  list(fields: string = "", expand: string = ""): Observable<any>{
    let append = "";
    if(fields){
      append = `?fields=${fields}`
    }
    if(expand){
      append = append ? `${append}&expand=${expand}` : `?expand=${expand}`
    }

    let url = `${this._storeEndpoint}${append}`;
    return this._authhttp.get(url);
  }

  /**
   * List of all stores belonging to company along with candidates within them
   * @returns {Observable<any>}
   */
  getStoresBelongingToCompany(companyId: number, page): Observable<any>{
    let url = `${this._storeEndpoint}?companyId=${companyId}&page=${page}&expand=candidates`;
    return this._authhttp.getRaw(url);
  }

  /**
   * detail
   * @param story_id
   */
  detail(story_id: number): Observable<any>{
    let url = `${this._storeEndpoint}/${story_id}?expand=candidates`;
    return this._authhttp.get(url);
  }

  /**
   * Create
   * @param {Store} model
   * @returns {Observable<any>}
   */
  create(model: Store): Observable<any>{
    let postUrl = `${this._storeEndpoint}`;
    let params = {
      "company_id": model.company_id,
      "name": model.store_name,
    };

    return this._authhttp.post(postUrl, params);
  }

  /**
   * Update
   * @param {Store} model
   * @returns {Observable<any>}
   */
  update(model: Store): Observable<any>{
    let url = `${this._storeEndpoint}/${model.store_id}`;
    let params = {
      "company_id": model.company_id,
      "name": model.store_name
    };

    return this._authhttp.patch(url, params);
  }

  /**
   * Delete
   * @param {Store} model
   * @returns {Observable<any>}
   */
  delete(model: Store): Observable<any>{
    let url = `${this._storeEndpoint}/${model.store_id}`;
    return this._authhttp.delete(url);
  }
}
