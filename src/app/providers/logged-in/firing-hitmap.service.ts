import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
//services
import { AuthHttpService } from './authhttp.service';


@Injectable({
  providedIn: 'root'
})
export class FiringHitmapService {

  private _endpoint = '/firing-hitmap';

  constructor(private _authhttp: AuthHttpService) { }

  list(params: string = ""): Observable<any>{
    const url = this._endpoint + '?' + params;
    return this._authhttp.get(url);
  }
}
