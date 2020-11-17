import { Component, ViewChild, OnInit } from '@angular/core';
import {
  Platform,
  NavController,
  PopoverController,
  IonContent
} from '@ionic/angular';
import { Plugins } from '@capacitor/core';
// import { Storage } from '@ionic/storage';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { TransferState, makeStateKey } from '@angular/platform-browser';
import * as algoliasearchProxy from 'algoliasearch/index';
import * as VERSION from 'algoliasearch/src/version';
import * as encodeProxy from 'querystring-es3/encode';
import { environment } from '../../../../../environments/environment';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
// services
import { CandidateService } from '../../../../providers/logged-in/candidate.service';
import { TranslateLabelService } from '../../../../providers/translate-label.service';
import { AuthService } from '../../../../providers/auth.service';
import { EventService } from '../../../../providers/event.service';
import { AlgoliaService } from 'src/app/providers/logged-in/algolia.service';

const { Storage } = Plugins;

const algoliasearch = algoliasearchProxy.default || algoliasearchProxy;
const encode = encodeProxy.default || encodeProxy;


@Component({
  selector: 'app-candidate-filter',
  templateUrl: './candidate-filter.page.html',
  styleUrls: ['./candidate-filter.page.scss'],
})
export class CandidateFilterPage implements OnInit {

  @ViewChild(IonContent, { static: true }) content: IonContent;

  @ViewChild('instantSearch', { static: false }) instantSearch;

  public borderLimit = false;

  public loading: boolean;

  public noCandidateList: boolean;

  public helper;
  public nbHits = 0;

  public instantSearchConfig;

  public isMobile: boolean;

  public hits;
  public nbPages;

  public refresh = false;

  public refreshingCandidates = false;
  public dirty = false;

  public sourceSaveSearch;
  public searchParameters;

  public showSearchBox = true;

  public lastRefinements;

  public lastQueryId;

  public scrollPosition: number = 0;

  public eleInfinite;

  constructor(
    private httpClient: HttpClient,
    private transferState: TransferState,
    public router: Router,
    public platform: Platform,
    private location: Location,
    public navCtrl: NavController,
    public popoverCtrl: PopoverController,
    public auth: AuthService,
    public algoliaService: AlgoliaService,
    public candidateService: CandidateService,
    // public storage: Storage,
    public eventService: EventService,
    public translateService: TranslateLabelService
  ) {
  }

  async ngOnInit() {

    this.platform.ready().then(() => {
      if (this.platform.is('mobile')) {
        this.isMobile = true;
      }
    });
  }

  /**
   * initialize search parameters from state
   */
  initializeSearchParameters() {

    if (this.candidateService.algoliaConfig) {

      this.searchParameters = this.candidateService.algoliaConfig.searchParameters;

      this.nbHits = this.candidateService.algoliaConfig.nbHits;
      this.nbPages = this.candidateService.algoliaConfig.nbPages;
    }
  }

  /**
   * Refresh candidate list
   */
  async refreshCandidates() {

    //clear old result

    if (!this.instantSearch)
      return null;

    this.nbPages = 0;
    this.loading = true;
    this.refreshingCandidates = true;

    // refresh result to view jobs after user remove from hidden

    if (this.instantSearchConfig)
      this.instantSearchConfig.searchParameters = this.searchParameters;

    this.instantSearch.instantSearchInstance.searchParameters = this.searchParameters;
    this.instantSearch.instantSearchInstance.helper.state.filters = this.searchParameters['filters'];
    this.instantSearch.instantSearchInstance.helper.state.numericRefinements = this.searchParameters['numericRefinements'];
    this.instantSearch.instantSearchInstance.helper.state.facetsRefinements = this.searchParameters['facetsRefinements'];
    this.instantSearch.instantSearchInstance.helper.state.disjunctiveFacetsRefinements = this.searchParameters['disjunctiveFacetsRefinements'];

    //this.instantSearch.instantSearchInstance.helper.clearCache();

    this.instantSearch.instantSearchInstance.helper.setPage(0);
    this.instantSearch.instantSearchInstance.refresh();
  }

  ionViewWillEnter() {
    this.initializeSearchParameters();

    this.content.scrollToPoint(0, this.scrollPosition);
  }

  ionViewDidEnter() { 
    if (!this.instantSearchConfig) { // on first time app load
      this.setConfig();
    }
  }

  ionViewWillLeave() {
    this.content.getScrollElement().then(ele => {
      this.scrollPosition = ele.scrollTop;
    });
  }

  /**
   * set loader on scroll to bottom if have more data
   * @param e
   */
  doInfinite(e) {

    //if already loading

    if (this.loading) {
      e.target.complete();
      return false;
    }

    this.loading = true;
    this.eleInfinite = event.target;

    return true;
  }

  /**
   * Set algolia config
   */
  async setConfig() {
 
    this.loading = true;

    this.algoliaService.getKey().then(response => {

      this.instantSearchConfig = {
        indexName: environment.algoliaCandidateIndex,
        //searchParameters: this.searchParameters,
        searchClient: this.createSSRSearchClient({
          makeStateKey,
          HttpHeaders,
          transferState: this.transferState,
          httpClient: this.httpClient,
          apiKey: response.securedApiKey,
          appId: response.appId
        })
      };
    });
  }

  /**
   * @param {?} __0
   * @return {?}
   */
  createSSRSearchClient(_a) {

    const appId = _a.appId,
      apiKey = _a.apiKey,
      httpClient = _a.httpClient,
      HttpHeaders = _a.HttpHeaders,
      transferState = _a.transferState,
      makeStateKey = _a.makeStateKey;
    /** @type {?} */
    const client = algoliasearch(appId, apiKey, {});
    client.addAlgoliaAgent('angular-instantsearch ' + VERSION);

    client._request = (rawUrl, opts, fromResetKey = false) => {

      if (this.instantSearchConfig.searchClient)
        opts.headers[
          'x-algolia-api-key'
        ] = this.instantSearchConfig.searchClient.apiKey;

      /** @type {?} */
      let headers = new HttpHeaders();
      headers = headers.set(
        'content-type',
        opts.method === 'POST'
          ? 'application/x-www-form-urlencoded'
          : 'application/json'
      );
      headers = headers.set('accept', 'application/json');

      /** @type {?} */
      let url = rawUrl + (rawUrl.includes('?') ? '&' : '?') + encode(opts.headers);
      url += '&x-requested-at=' + new Date().getTime();

      const transferStateKey = makeStateKey('pogi-source-ais(' + opts.body + ')');

      /**
       * let's don't show cached result for
       * https://www.pivotaltracker.com/story/show/161446775
       * --------------------------------------------------------------
       */
      if (transferState.hasKey(transferStateKey)) {
        //@type {?}
        var resp = JSON.parse(transferState.get(transferStateKey, {}));

        let index;
        let XRequestedAt;

        if (resp && resp.url) {
          index = resp.url.indexOf("x-requested-at=");
          XRequestedAt = parseInt(resp.url.substr(index + 15));
        }

        if (!XRequestedAt || ((new Date().getTime()) - XRequestedAt) > environment.algoliaCacheDuration) {
          transferState.remove(transferStateKey);
          return client._request(rawUrl, opts);//call again after removing transfer state
        }

        this._processAlgoliaResponse(resp);

        return Promise.resolve({
          statusCode: resp.status,
          body: resp.body,
          headers: resp.headers
        });
      }

      return new Promise((resolve, reject) => {

        // no loading when filtering facet values from filter search bar

        if (rawUrl.indexOf('/facets/') === -1) {
          setTimeout(_ => {
            this.loading = true;

            if (
              opts.jsonBody &&
              opts.jsonBody.requests &&
              opts.jsonBody.requests[0].params &&
              opts.jsonBody.requests[0].params.indexOf('page=0') != -1
            ) {
              this.refreshingCandidates = true;
            }
          });
        }

        if (this.algoliaService.getCurrentTimeUTC() > this.algoliaService.securedApiKeyValidUntil) {
          return this.resetKey(opts, rawUrl, resolve);
        }

        httpClient
          .request(opts.method, url, {
            headers: headers,
            body: opts.body,
            observe: 'response'
          })
          .subscribe(
            resp => {

              this._processAlgoliaResponse(resp, transferState, transferStateKey);

              resolve({
                statusCode: resp.status,
                body: resp.body,
                headers: resp.headers
              });
            },
            resp => {

              // http 400 = secure key expired

              if (fromResetKey || resp.status != 400) {
                this._handleError(resp);

                return resolve({
                  statusCode: resp.status,
                  body: resp.body,
                  headers: resp.headers
                });
              }

              this.resetKey(opts, rawUrl, resolve);

            }
          );
      });
    };
    return client;
  }

  resetKey(opts, rawUrl, resolve) {

    // on fail get new key and call again

    this.algoliaService.getKey(true).then(response => {

      // update config

      this.instantSearchConfig = {
        indexName: environment.algoliaCandidateIndex,
        searchClient: this.createSSRSearchClient({
          makeStateKey,
          HttpHeaders,
          transferState: this.transferState,
          httpClient: this.httpClient,
          apiKey: response.securedApiKey,
          appId: response.appId
        })
      };

      // update old key

      opts.headers['x-algolia-api-key'] = response.securedApiKey; // this.instantSearchConfig.searchClient.apiKey;

      opts.jsonBody.apiKey = response.securedApiKey;

      opts.body = JSON.stringify(opts.jsonBody);

      this.instantSearchConfig.searchClient
        ._request(rawUrl, opts, true)
        .then(resp => {

          resolve({
            statusCode: resp.status,
            body: resp.body,
            headers: resp.headers
          });
        });
    });
  }

  /**
   * process response from algolia
   * @param resp
   * @param transferState
   * @param transferStateKey
   */
  _processAlgoliaResponse(resp, transferState = null, transferStateKey = null) {

    setTimeout(_ => {
      this.loading = false;
      this.refreshingCandidates = false;
    }, 1);

    if (this.eleInfinite) {
      this.eleInfinite.complete();
    }

    if (transferStateKey)
      transferState.set(transferStateKey, JSON.stringify(resp));

    if (resp.body.results) {

      this.hits = resp.body.results[0].hits;
      this.nbPages = resp.body.results[0].nbPages;
      this.nbHits = resp.body.results[0].nbHits;

      if (resp.body.results[0].nbHits == 0) {
        this.noCandidateList = true;
      } else {
        this.noCandidateList = false;
      }
    }

    this.refresh = true;

    // either need candidates in result or query in searchbox

    if (
      !this.noCandidateList || 
      (
        this.instantSearch.instantSearchInstance && 
        this.instantSearch.instantSearchInstance.helper.state.query && 
        this.instantSearch.instantSearchInstance.helper.state.query.length > 0
      )
    ) {
      setTimeout(_ => {
        this.showSearchBox = true;
      }, 1);
    } else {
      setTimeout(_ => {
        this.showSearchBox = false;
      }, 1);
    }
  }

  /**
   * Handles Caught Errors from All Authorized Requests Made to Server
   * @returns {Observable}
   */
  private _handleError(error: any) {

    const errMsg = (error.message) ? error.message :
      error.status ? `${error.status} - ${error.statusText}` : 'Server error';

    // Handle No Internet Connection Error

    if (error.status == 0) {
      // if(!navigator.onLine)
      return this.eventService.internetOffline$.next();
    }

    if (!navigator.onLine) {
      return this.eventService.internetOffline$.next();
    }

    // Handle internal server error - 500
    if (error.status === 500) {
      return this.eventService.error500$.next();
    }

    // Handle page not found - 404 error
    if (error.status === 404) {
      return this.eventService.error404$.next();
    }

    alert('Error: ' + errMsg);
  }

  /**
   * Dismiss filter
   */
  dismiss() {

    if (this.refresh) {
      if(!this.candidateService.algoliaConfig) {
        this.candidateService.algoliaConfig = {};
      }

      this.candidateService.algoliaConfig.instantSearchConfig = this.instantSearchConfig;
      this.candidateService.algoliaConfig.searchParameters = this.instantSearch ? this.instantSearch.instantSearchInstance.helper.state : this.searchParameters;
      this.candidateService.algoliaConfig.refresh = this.refresh;
 
      this.router.navigate(['candidate-search']);
    } else {
      this.location.back();
    }
  }
  
  logScrolling(e) {
    this.borderLimit = (e.detail.scrollTop > 20) ? true : false;
  }
}
