import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {AuthHttpService} from "./authhttp.service";

@Injectable({
  providedIn: 'root'
})
export class DailyStandupService {

  private _endpoint: string = "/daily-standup";

  constructor(private _authhttp: AuthHttpService) { }

  /**
   * return next question for standup
   * @returns {Observable<any>}
   */
  question(): Observable<any> {
    let url = this._endpoint + '/question';
    return this._authhttp.get(url);
  }

  /**
   * load current session
   * @returns
   */
  getSession(): Observable<any>{
    const url = `${this._endpoint}/session`;
    return this._authhttp.get(url);
  }

  /**
   * start session
   * @returns
   */
  startSession(): Observable<any>{
    const url = `${this._endpoint}/start-session`;
    return this._authhttp.post(url, {
    });
  }

  /**
   * end session
   * @returns
   */
  endSession(): Observable<any>{
    const url = `${this._endpoint}/end-session`;
    return this._authhttp.patch(url, {
    });
  }

  /**
   * leave request
   * @param model
   * @returns
   */
  leaveRequest(model): Observable<any>{
    const url = `${this._endpoint}/leave-request`;
    return this._authhttp.post(url, {
      from_date: model.from_date,
      to_date: model.to_date,
      note: model.note,
      type: model.type,
    });
  }

  /**
   * answer
   * @param question_uuid
   * @param answer
   * @returns
   */
  answer(question_uuid, answer): Observable<any>{
    const url = `${this._endpoint}/answer/${question_uuid}`;
    return this._authhttp.post(url, {
      answer: answer
    });
  }
}
