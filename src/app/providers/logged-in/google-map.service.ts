import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
// Services
import { AuthHttpService } from './authhttp.service';


/**
 * Manages Google Map Functionality 
 */
@Injectable({
    providedIn: 'root'
})
export class GoogleMapService {

    public _googleMapEndpoint: string = "/google-map/";

    constructor(public _authhttp: AuthHttpService) { }

    /**
     * area by geo cordinates
     * @param latitude 
     * @param longitude 
     */
    areaByLocation(latitude, longitude, area = null): Observable<any> {
        let url = `${this._googleMapEndpoint}` + '/area-by-location?latitude=' + latitude + '&longitude=' + longitude;

        if (area)
            url += '&area=' + area;

        return this._authhttp.get(url);
    }

    /**
     * Places list by keyword 
     * @returns {Observable<any>}
     */
    getPlacePredictions(query: string, country_name: string): Observable<any> {
        let url = this._googleMapEndpoint + 'place-predictions?query=' + query + '&country_name=' + country_name;
        return this._authhttp.get(url);
    }

    /**
     * Return place detai 
     * @param place
     */
    placeDetail(place): Observable<any> {
        let country_name = place.terms[place.terms.length - 1].value;
        let url = this._googleMapEndpoint + 'place-detail/' + place.place_id + '?name=' + place.structured_formatting.main_text +
            '&country_name=' + country_name;
        return this._authhttp.get(url);
    }
}