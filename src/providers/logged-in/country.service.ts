import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
// Services
import { AuthHttpService } from './authhttp.service';

/**
 * Manages Country 
 */
@Injectable()
export class CountryService {
    private _countryEndpoint: string = "/countries";

    constructor(private _authhttp: AuthHttpService) { }

    /**
     * List of all universities
     * @returns {Observable<any>}
     */
    list(page: number): Observable<any> {
        let url = this._countryEndpoint + '?page=' + page;
        return this._authhttp.getRaw(url);
    }

    /**
     * List of all universities
     * @returns {Observable<any>}
     */
    listAll(): Observable<any> {
        let url = this._countryEndpoint + '/all';
        return this._authhttp.get(url);
    }
}

