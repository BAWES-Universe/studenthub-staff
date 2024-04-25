import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
//services
import {AuthHttpService} from './authhttp.service';
//models
import {Store} from '../../models/store';
import { CompanyContact } from 'src/app/models/company-contact';
//import { StoreManager } from 'src/app/models/store-manager';


@Injectable({
  providedIn: 'root'
})
export class StoreService {

  private _storeEndpoint = '/stores';

  constructor(private _authhttp: AuthHttpService) { }

  /**
   * Return list of all stores
   * Pass comma-separated fields if you wish to only get specific fields from api
   * @param {string} fields list of fields you wish to get, ALL by default
   * @param {string} expand list of extra fields/relations you want. None by default
   * @returns {Observable<any>}
   */
  list(fields: string = '', expand: string = ''): Observable<any>{

    let append = '';

    if (fields) {
      append = `?fields=${fields}`;
    }

    if (expand) {
      append = append ? `${append}&expand=${expand}` : `?expand=${expand}`;
    }

    const url = `${this._storeEndpoint}${append}`;
    return this._authhttp.get(url);
  }

  /**
   * List of all stores belonging to company along with candidates within them
   * @returns {Observable<any>}
   */
  getStoresBelongingToCompany(companyId: number, page): Observable<any>{
    const url = `${this._storeEndpoint}?companyId=${companyId}&page=${page}&expand=storeManager`;
    return this._authhttp.getRaw(url);
  }

  /**
   * detail
   * @param story_id
   */
  detail(story_id: number): Observable<any>{
    const url = `${this._storeEndpoint}/${story_id}?expand=storeManager,candidates`;
    return this._authhttp.get(url);
  }

  /**
   * Create
   * @param {Store} model
   * @returns {Observable<any>}
   */
  create(model: Store): Observable<any>{
    return this._authhttp.post(this._storeEndpoint, {
      company_id: model.company_id,
      name: model.store_name,
      location: model.store_location,
      brand_uuid: model.brand_uuid,
      mall_uuid: model.mall_uuid,
      storeManager: model.storeManager
    });
  }

  /**
   * Update
   * @param {Store} model
   * @returns {Observable<any>}
   */
  update(model: Store): Observable<any>{
    return this._authhttp.patch(`${this._storeEndpoint}/${model.store_id}`, {
      company_id: model.company_id,
      name: model.store_name,
      location: model.store_location,
      brand_uuid: model.brand_uuid,
      mall_uuid: model.mall_uuid,
      storeManager: model.storeManager
    });
  }

  /**
   * get login url and open in new window 
   * @param store_id 
   * @returns 
   */
  login(store_id): Observable<any>{
    let url = `${this._storeEndpoint}/login/${store_id}`;
    return this._authhttp.post(url, {});
  }
  
  /**
   * update store manager
   * @param model
   * @param companyContact
   */
  updateStoreManager(model: Store, companyContact: CompanyContact): Observable<any>{
    const url = `${this._storeEndpoint}/update-manager/${model.store_id}`;
    return this._authhttp.patch(url, {
      contact_uuid: companyContact.contact_uuid
    });
  }

  /**
   * remove store manager from store
   * @param model
   */
  removeStoreManager(model: Store): Observable<any>{
    const url = `${this._storeEndpoint}/remove-manager/${model.store_id}`;
    return this._authhttp.delete(url);
  }

  /**
   * Delete
   * @param {Store} model
   * @returns {Observable<any>}
   */
  delete(model: Store): Observable<any>{
    return this._authhttp.delete(`${this._storeEndpoint}/${model.store_id}`);
  }
}
