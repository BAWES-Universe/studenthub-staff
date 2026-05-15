import { Injectable } from '@angular/core';
import { Observable, Observer } from 'rxjs';
import algoliasearch from 'algoliasearch/lite';
import { AuthHttpService } from './authhttp.service';

@Injectable({
  providedIn: 'root'
})
export class AlgoliaService {
  public appId: string;
  public securedApiKey: string;
  public securedApiKeyValidUntil: number;
  private _apiEndpoint: string = '/algolia';

  constructor(private _authhttp: AuthHttpService) {}

  getKey(isExpired = false): Promise<any> {
    if (isExpired) {
      this.securedApiKey = null;
      this.securedApiKeyValidUntil = null;
    }
    if (this.securedApiKey && this.appId) {
      return Promise.resolve({
        securedApiKey: this.securedApiKey,
        securedApiKeyValidUntil: this.securedApiKeyValidUntil,
        appId: this.appId,
      });
    }
    return new Promise((resolve, reject) => {
      this._authhttp.get(this._apiEndpoint + '/key').subscribe({
        next: (response: any) => {
          this.securedApiKey = response.securedApiKey;
          this.securedApiKeyValidUntil = response.securedApiKeyValidUntil;
          this.appId = response.appId;
          resolve(response);
        },
        error: (err) => reject(err),
      });
    });
  }

  list(indexName: string, searchParameters = {}): Observable<any> {
    return new Observable((observer: Observer<any>) => {
      this.getKey(false).then((keyData: any) => {
        const client = algoliasearch(keyData.appId, keyData.securedApiKey);
        client.searchForFacetValues({ indexName, ...searchParameters })
          .then((content) => {
            observer.next(content);
            observer.complete();
          })
          .catch((err: any) => {
            if (err.statusCode === 400) {
              this.getKey(true).then((newKeyData: any) => {
                const newClient = algoliasearch(newKeyData.appId, newKeyData.securedApiKey);
                newClient.searchForFacetValues({ indexName, ...searchParameters })
                  .then((content) => {
                    observer.next(content);
                    observer.complete();
                  })
                  .catch((retryErr: any) => observer.error(retryErr));
              });
            } else {
              observer.error(err);
            }
          });
      });
    });
  }
}
