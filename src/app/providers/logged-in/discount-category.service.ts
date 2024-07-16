import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
// Services
import { AuthHttpService } from './authhttp.service';
// Models
import { DiscountCategory } from '../../models/discount-category';


@Injectable({
  providedIn: 'root'
})
export class DiscountCategoryCategoryService {

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
   * @param category_id 
   */
  view(category_id: number): Observable<any>{
    let url = this._discountEndpoint + '/' + category_id + '?expand=';
    return this._authhttp.get(url);
  }

  /**
   * Create discount
   * @param {DiscountCategory} model
   * @returns {Observable<any>}
   */
  create(model: DiscountCategory): Observable<any>{
    let postUrl = `${this._discountEndpoint}`;
    let params = {
      "name_en": model.name_en,
      "name_ar": model.name_ar,
      image: model.image,
    };

    return this._authhttp.post(postUrl, params);
  }

  /**
   * Update discount
   * @param {DiscountCategory} model
   * @returns {Observable<any>}
   */
  update(model: DiscountCategory): Observable<any>{
    let url = `${this._discountEndpoint}/${model.category_id}`;
    let params = {
      "name_en": model.name_en,
      "name_ar": model.name_ar,
      image: model.image,
    };
    return this._authhttp.patch(url, params);
  }

  /**
   * Deletes discount
   * @param {DiscountCategory} model
   * @returns {Observable<any>}
   */
  delete(model: DiscountCategory): Observable<any>{
    let url = `${this._discountEndpoint}/${model.category_id}`;
    return this._authhttp.delete(url);
  }
}
