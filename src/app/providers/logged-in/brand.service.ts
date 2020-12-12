import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
// Services
import { AuthHttpService } from './authhttp.service';
// Models
import { Brand } from '../../models/brand';


/**
 * Manages Company Brand Functionality on the server
 */
@Injectable({
  providedIn: 'root'
})
export class BrandService {

  private _brandEndpoint = '/brands';

  constructor(private _authhttp: AuthHttpService) { }

  /**
   * load brand detail
   * @param brand_uuid
   */
  view(brand_uuid) {
    const url = this._brandEndpoint + '/' + brand_uuid + '?expand=candidates,stores';
    return this._authhttp.get(url);
  }

  /**
   * List of all staff
   * @returns {Observable<any>}
   */
  list(page: number): Observable<any>{
    const url = this._brandEndpoint + '?page=' + page;
    return this._authhttp.getRaw(url);
  }

  /**
   * List of all staff
   * @returns {Observable<any>}
   */
  listByCompany(id: number): Observable<any>{
    const url = this._brandEndpoint + '/company/' + id;
    return this._authhttp.get(url);
  }

  /**
   * Create Brand
   * @param {Brand} model
   * @returns {Observable<any>}
   */
  create(model: Brand): Observable<any>{
    const postUrl = `${this._brandEndpoint}`;

    const params = {
      name_en: model.brand_name_en,
      name_ar: model.brand_name_ar,
      company_id: model.company_id,
      logo: model.brand_logo,
    };

    return this._authhttp.post(postUrl, params);
  }

  /**
   * Update Brand
   * @param {Brand} model
   * @returns {Observable<any>}
   */
  update(model: Brand): Observable<any>{
    const url = `${this._brandEndpoint}/${model.brand_uuid}`;

    const params = {
      name_en: model.brand_name_en,
      name_ar: model.brand_name_ar,
      company_id: model.company_id,
      logo: model.brand_logo,
    };

    return this._authhttp.patch(url, params);
  }

  /**
   * Delete Brand
   * @param {Brand} model
   * @returns {Observable<any>}
   */
  delete(model: Brand): Observable<any>{
    const url = `${this._brandEndpoint}/${model.brand_uuid}`;
    return this._authhttp.delete(url);
  }
}
