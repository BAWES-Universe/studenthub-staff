import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
// Services
import { AuthHttpService } from './authhttp.service';

/**
 * Manages Store Functionality on the server
 */
@Injectable()
export class UniversityService {
    private _universityEndpoint: string = "/universities";

    constructor(private _authhttp: AuthHttpService) { }

    /**
     * List of all universities
     * @returns {Observable<any>}
     */
    list(page: number): Observable<any> {
        let url = this._universityEndpoint + '?page=' + page;
        return this._authhttp.getRaw(url);
    }

    /**
     * List of all universities
     * @returns {Observable<any>}
     */
    listAll(): Observable<any> {
        let url = this._universityEndpoint + '/all';
        return this._authhttp.get(url);
    }
}

