import { Injectable } from '@angular/core';
import { AuthHttpService } from './authhttp.service';
import { Observable } from 'rxjs';
import { Mall } from 'src/app/models/mall';

@Injectable({
  providedIn: 'root'
})
export class MallService {

  private mallEndpoint = '/malls';

  constructor(private authHttp: AuthHttpService) { }

  /**
   * load Mall detail
   * @param mallUUID
   */
  view(mallUUID) {
    return this.authHttp.get(this.mallEndpoint + '/' + mallUUID + '?expand=candidates,stores,stores.candidatesCount');
  }

  /**
   * List of all Mall
   * @returns {Observable<any>}
   */
  list(page: number): Observable<any>{
    return this.authHttp.getRaw(this.mallEndpoint + '?page=' + page);
  }

  /**
   * List of all Mall
   * @returns {Observable<any>}
   */
  fullList(): Observable<any>{
    return this.authHttp.get(this.mallEndpoint + '/all');
  }

  /**
   * create mall
   * @param model
   */
  create(model: Mall): Observable<any>{

    return this.authHttp.post(this.mallEndpoint, {
      name_en: model.mall_name_en,
      name_ar: model.mall_name_ar,
    });
  }

  /**
   * update mall
   * @param model
   */
  update(model: Mall): Observable<any>{
    return this.authHttp.patch(`${this.mallEndpoint}/${model.mall_uuid}`, {
      name_en: model.mall_name_en,
      name_ar: model.mall_name_ar,
    });
  }

  /**
   * delete mall
   * @param model
   */
  delete(model: Mall): Observable<any>{
    return this.authHttp.delete(`${this.mallEndpoint}/${model.mall_uuid}`);
  }
}
