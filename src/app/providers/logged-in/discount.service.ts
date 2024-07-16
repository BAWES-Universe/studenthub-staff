import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
// Services
import { AuthHttpService } from './authhttp.service';
// Models
import { Discount } from '../../models/discount';


@Injectable({
  providedIn: 'root'
})
export class DiscountService {

  private _discountEndpoint: string = "/discounts";

  constructor(private _authhttp: AuthHttpService) { }

  /**
   * List of all discount
   * @returns {Observable<any>}
   */
  list(page: number): Observable<any>{
    let url = this._discountEndpoint + '?expand=&page=' + page;
    return this._authhttp.getRaw(url);
  }
  
  /**
   * return discount detail 
   * @param discount_uuid 
   */
  view(discount_uuid: number): Observable<any>{
    let url = this._discountEndpoint + '/' + discount_uuid + '?expand=';
    return this._authhttp.get(url);
  }

  /**
   * Create discount
   * @param {Discount} model
   * @returns {Observable<any>}
   */
  create(model: Discount): Observable<any>{
    let postUrl = `${this._discountEndpoint}`;
    let params = {
      "category_id": model.category_id,
      "company_id": model.company_id,
      "store_id": model.store_id,
      "description_en": model.description_en,
      description_ar: model.description_ar,
      how_to_apply_en: model.how_to_apply_en,
      how_to_apply_ar: model.how_to_apply_ar,
      image: model.image,
      valid_until: model.valid_until
    };

    return this._authhttp.post(postUrl, params);
  }

  /**
   * Update discount
   * @param {Discount} model
   * @returns {Observable<any>}
   */
  update(model: Discount): Observable<any>{
    let url = `${this._discountEndpoint}/${model.discount_uuid}`;
    let params = {
      "category_id": model.category_id,
      "company_id": model.company_id,
      "store_id": model.store_id,
      "description_en": model.description_en,
      description_ar: model.description_ar,
      how_to_apply_en: model.how_to_apply_en,
      how_to_apply_ar: model.how_to_apply_ar,
      image: model.image,
      valid_until: model.valid_until
    };
    return this._authhttp.patch(url, params);
  }

  /**
   * Deletes discount
   * @param {Discount} model
   * @returns {Observable<any>}
   */
  delete(model: Discount): Observable<any>{
    let url = `${this._discountEndpoint}/${model.discount_uuid}`;
    return this._authhttp.delete(url);
  }
}
