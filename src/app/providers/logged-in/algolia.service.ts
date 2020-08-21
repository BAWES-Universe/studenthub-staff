import { Injectable } from '@angular/core';
import { Observable, Observer, throwError } from 'rxjs';
import * as algoliasearchProxy from 'algoliasearch';
// Services
import { AuthHttpService } from "./authhttp.service";


const algoliasearch = algoliasearchProxy.default || algoliasearchProxy;

@Injectable({ 
  providedIn: 'root' 
})
export class AlgoliaService {

  public appId;
  public securedApiKey;
  public securedApiKeyValidUntil;

  public sourceSaveSearch: any;
  public searchParameters: any;

  public recentSearch: any;

  private _apiEndpoint: string = "/algolia";

  constructor(
    private _authhttp: AuthHttpService
  ) {
  }

  /**
   * return tempory secret key to view data 
   * @returns {Promise<any>}
   */
  getKey(isExpired = false): Promise<any> {

    //on key expire 

    if (isExpired) {
      this.securedApiKey = null;
      this.securedApiKeyValidUntil = null;
    }

    return new Promise((resolve, reject) => {

      if (this.securedApiKey && this.appId) {

        return resolve({
          securedApiKey: this.securedApiKey,
          securedApiKeyValidUntil: this.securedApiKeyValidUntil,
          appId: this.appId
        });
      }

      let url = this._apiEndpoint + '/key';

      this._authhttp.get(url).subscribe(response => {

        this.securedApiKey = response.securedApiKey;
        this.securedApiKeyValidUntil = response.securedApiKeyValidUntil;
        this.appId = response.appId;

        resolve(response);
      });
    });
  }

  /**
   * list items from algolia index 
   * @param indexName string  
   * @param searchParameters
   */
  list(indexName, searchParameters = {}): Observable<any> {

    return Observable.create((observer: Observer<any>) => {

      this.getKey(false).then(keyData => {

        const client = algoliasearch(keyData.appId, keyData.securedApiKey, {});

        let index = client.initIndex(indexName);

        index.search(searchParameters, (err, content) => {

          if (content) {
            observer.next(content);
            observer.complete();
          } else if (err && err.statusCode == 400) {

            this.getKey(true).then(keyData => {

              const client = algoliasearch(keyData.appId, keyData.securedApiKey, {});

              let index = client.initIndex(indexName);

              index.search(searchParameters, (err, content) => {

                if (content) {
                  observer.next(content);
                } else {
                  return throwError(err);
                }

                observer.complete();
              });
            });
          } else {
            return throwError(err);
          }
        });
      });
    });
  }

  getCurrentTimeUTC() {
    //The offset is in minutes -- convert it to ms
    return (new Date()).getTime() / 1000;// + tmLoc.getTimezoneOffset() * 60000;
  }

  /**
   * remove expired transfer state to reduce memory usage 
   * @param transferState 
   *
  removeExpiredTransferStates(transferState) {
      let savedStates = JSON.parse(transferState.toJson());

      for (let [key, value] of Object.entries(savedStates)) {

          let resultBody = JSON.parse(value + '');

          let index;
          let XRequestedAt;

          if(resultBody && resultBody['url']) {
              index = resultBody['url'].indexOf("x-requested-at=");
              XRequestedAt = parseInt(resultBody['url'].substr(index + 15));
          }

          if (XRequestedAt && ((new Date().getTime()) - XRequestedAt) > environment.algoliaCacheDuration) {
              transferState.remove(key); 
          } 
      } 
  }*/
}
