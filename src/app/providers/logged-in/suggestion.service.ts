import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthHttpService } from './authhttp.service';


@Injectable({
  providedIn: 'root'
})
export class SuggestionService {

  private _endpoint = '/suggestions';

  constructor(private _authhttp: AuthHttpService) { }

  /**
   * List of all suggestions
   * @returns {Observable<any>}
   */
  list(params: string = ''): Observable<any> {
    let url = this._endpoint + '?expand=note,candidate,fulltimer' + params;
    return this._authhttp.get(url);
  }

  /**
   * create new suggestion for request with note
   * @param params 
   */
  create(params) {
    return this._authhttp.post(this._endpoint, {
      suggestion: params.suggestion,
      request_uuid: params.request_uuid,
      fulltimer_uuid: params.fulltimer_uuid,
      candidate_id: params.candidate_id
    });
  }

  /**
   * accept suggestion for request
   * @param suggestion_id 
   * @param reason 
   */
  accept(suggestion_id: string, reason: string = ''): Observable<any> {
    const url = `${this._endpoint}/accept/${suggestion_id}`;
    const params = {
      reason: reason
    };
    return this._authhttp.patch(url, params);
  }

  /**
   * reject suggestion for request
   * @param suggestion_id 
   * @param reason 
   */
  reject(suggestion_id: string, reason: string = ''): Observable<any> {
    const url = `${this._endpoint}/reject/${suggestion_id}`;
    const params = {
      reason: reason
    };
    return this._authhttp.patch(url, params);
  }
}
