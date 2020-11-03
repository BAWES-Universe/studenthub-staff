import { __decorate } from "tslib";
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import * as algoliasearchProxy from 'algoliasearch';
const algoliasearch = algoliasearchProxy.default || algoliasearchProxy;
let AlgoliaService = class AlgoliaService {
    constructor(_authhttp) {
        this._authhttp = _authhttp;
        this._apiEndpoint = "/algolia";
    }
    /**
     * return tempory secret key to view data
     * @returns {Promise<any>}
     */
    getKey(isExpired = false) {
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
    list(indexName, searchParameters = {}) {
        return Observable.create((observer) => {
            this.getKey(false).then(keyData => {
                const client = algoliasearch(keyData.appId, keyData.securedApiKey, {});
                let index = client.initIndex(indexName);
                index.search(searchParameters, (err, content) => {
                    if (content) {
                        observer.next(content);
                        observer.complete();
                    }
                    else if (err && err.statusCode == 400) {
                        this.getKey(true).then(keyData => {
                            const client = algoliasearch(keyData.appId, keyData.securedApiKey, {});
                            let index = client.initIndex(indexName);
                            index.search(searchParameters, (err, content) => {
                                if (content) {
                                    observer.next(content);
                                }
                                else {
                                    return throwError(err);
                                }
                                observer.complete();
                            });
                        });
                    }
                    else {
                        return throwError(err);
                    }
                });
            });
        });
    }
    getCurrentTimeUTC() {
        //The offset is in minutes -- convert it to ms
        return (new Date()).getTime() / 1000; // + tmLoc.getTimezoneOffset() * 60000;
    }
};
AlgoliaService = __decorate([
    Injectable({
        providedIn: 'root'
    })
], AlgoliaService);
export { AlgoliaService };
//# sourceMappingURL=algolia.service.js.map