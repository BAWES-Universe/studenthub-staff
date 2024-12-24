import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
//services
import { AuthHttpService } from './authhttp.service';

@Injectable({
  providedIn: 'root'
})
export class CandidateWorkingHourService {

  private _endpoint = '/candidate-working-hours';

  constructor(private _authhttp: AuthHttpService) { }

  /**
   * Return invitations
   * @returns {Observable<any>}
   */
  list(page: number, param = null): Observable<any>{
    const url = this._endpoint + `/date?page=${page}&expand=dateListByCandidate${param}`;//company,
    return this._authhttp.getRaw(url);
  }

  /**
   * Return invitations
   * @returns {Observable<any>}
   */
  listByHour(page: number, param = null): Observable<any>{
    const url = this._endpoint + `/hour?page=${page}&expand=store,store.company${param}`;
    return this._authhttp.getRaw(url);
  }

  /**
   * @param date
   * @param candidateId
   */
  detail(date, candidateId): Observable<any>{
    const url = `${this._endpoint}/date/${date}/${candidateId}?expand=dateListByCandidate`;//company,
    return this._authhttp.get(url);
  }

  listAppeal(page: number, param: string = ""): Observable<any>{
    const url = this._endpoint + `/appeals?page=${page}&expand=candidate,candidateWorkingDate${param}`;
    return this._authhttp.getRaw(url);
  }

  appealDetail(appeal_uuid: string): Observable<any>{
    const url = this._endpoint + `/appeal/${appeal_uuid}?expand=originalHour,correctedHours,candidate`;
    return this._authhttp.get(url);
  }

  appealUpdate(appeal_uuid: string, values: any): Observable<any>{
    const url = this._endpoint + `/appeal-update/${appeal_uuid}`;
    return this._authhttp.post(url, {
      update: values.update,
      detail: values.detail
    });
  }
}
