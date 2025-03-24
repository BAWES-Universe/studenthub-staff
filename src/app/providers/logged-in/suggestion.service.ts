import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
//services
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
  listAll(params: string = ''): Observable<any> {
    //
    let url = this._endpoint + '?expand=feedback,feedback.updatedBy,feedbacks,feedbacks.updatedBy,note,candidate,fulltimer,updatedBy' + params;
    return this._authhttp.get(url);
  }

  /**
   * list with pagination
   * @param page
   * @param params
   * @returns
   */
  list(page: number, params: string = ''): Observable<any> {
    let url = this._endpoint + '?expand=note,feedback,feedback.updatedBy,feedbacks,feedbacks.updatedBy,candidate,fulltimer,updatedBy&withPagination=1&page=' + page + params;
    return this._authhttp.getRaw(url);
  }

  /**
   * get suggestion details
   * @returns {Observable<any>}
   */
  view(suggestion_uuid): Observable<any> {
    let url = this._endpoint + '/' + suggestion_uuid + '?expand=note,feedbacks,feedbacks.updatedBy,candidate,fulltimer,updatedBy';
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
      candidate_id: params.candidate_id,
      story_uuid: params.story_uuid,
    });
  }

  /**
   * reschedule CV/Resume email
   * @param suggestion_uuid
   * @returns {Observable<any>}
   */
  rescheduleCVResumeEmail(suggestion_uuid: string) {
    const url = `${this._endpoint}/reschedule-cv-email/${suggestion_uuid}`;
    return this._authhttp.patch(url, {});
  }

  /**
   * mail suggestions
   * @param params
   * @returns {Observable<any>}
   */
  mailSuggestions(params: string = ''): Observable<any> {
    const url = `${this._endpoint}/mail-suggestions?` + params;
    return this._authhttp.patch(url, {});
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
