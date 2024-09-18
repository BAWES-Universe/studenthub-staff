import { Injectable } from '@angular/core';
import { AuthHttpService } from './authhttp.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class YeasterService {
  private _endpoint: string = "/yeaster";

  constructor(private _authhttp: AuthHttpService) { }

  /**
   * get detail
   * @param mail_id 
   */
  view(mail_id): Observable<any>{
    let url = this._endpoint + '/' + mail_id;
    return this._authhttp.get(url);
  }

  download(mail_id): Observable<any>{
    let url = this._endpoint + '/download/' + mail_id;
    return this._authhttp.get(url);
  }

  list(page, limit): Observable<any>{
    let url = this._endpoint + '?page=' + page + "&limit=" + limit;
    return this._authhttp.get(url);
  }
}
