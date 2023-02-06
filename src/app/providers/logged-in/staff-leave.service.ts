import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {AuthHttpService} from "./authhttp.service";

@Injectable({
  providedIn: 'root'
})
export class StaffLeaveService {

  private _endpoint: string = "/staff-leave";

  constructor(private _authhttp: AuthHttpService) { }

  /**
   * leave request
   * @param model
   * @returns
   */
  create(model): Observable<any>{
    const url = `${this._endpoint}`;
    return this._authhttp.post(url, {
      from_date: model.from_date,
      to_date: model.to_date,
      note: model.note,
      type: model.type,
      file: model.file,
    });
  }

  /**
   * leave request
   * @param page
   * @returns
   */
  list(page): Observable<any>{
    return this._authhttp.getRaw(this._endpoint + '?page=' + page);
  }

  /**
   * leave request
   * @param page
   * @returns
   */
  delete(UUID): Observable<any>{
    return this._authhttp.delete(this._endpoint + '/' + UUID);
  }
}
