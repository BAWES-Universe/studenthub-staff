import {Component, ViewChild, OnInit, ChangeDetectorRef, ViewRef} from '@angular/core';
import { NavController, Platform, MenuController, PopoverController, IonContent, ModalController } from '@ionic/angular';
import { environment } from '../../../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { TransferState, makeStateKey } from '@angular/platform-browser';
// import algoliasearch from 'algoliasearch';
import * as VERSION from 'algoliasearch-helper/src/version';
import * as encodeProxy from 'querystring-es3/encode';
// service
import { AuthService } from '../../../../providers/auth.service';
import { FulltimerService } from '../../../../providers/logged-in/fulltimer.service';
import { TranslateLabelService } from '../../../../providers/translate-label.service';
import { EventService } from '../../../../providers/event.service';
import { AlgoliaService } from 'src/app/providers/logged-in/algolia.service';
//models
import { Fulltimer } from 'src/app/models/fulltimer';
//pages
import { FulltimerFormPage } from '../fulltimer-form/fulltimer-form.page';
import { AnalyticsService } from 'src/app/providers/analytics.service';


const encode = encodeProxy.default || encodeProxy;

@Component({
  selector: 'app-fulltimer-search',
  templateUrl: './fulltimer-search.page.html',
  styleUrls: ['./fulltimer-search.page.scss'],
})
export class FulltimerSearchPage implements OnInit {

  @ViewChild(IonContent, { static: true }) content: IonContent;

  @ViewChild('instantSearch', { static: false }) public instantSearch;

  public request_uuid;

  public lastQuery;

  public eleInfinite;

  public showFilter: boolean = false;

  public loading: boolean;

  public isMobile: boolean;

  public instantSearchConfig;

  public nbHits = null;
  public nbPages;
  public page;
  public searchParameters = {};
  public refreshingFulltimers = false;
  public dirty = false;
  public noFulltimerList = false;
  public showSearchForm = false;
  public showSearchBox = true;
  public haveLocationFilter = false;
  public lastRefinements;
  public lastQueryId;
  public scrollPosition = 0;
  public borderLimit = false;

  constructor(
    public httpClient: HttpClient,
    public transferState: TransferState,
    public navCtrl: NavController,
    public modalCtrl: ModalController,
    public platform: Platform,
    public auth: AuthService,
    public algoliaService: AlgoliaService,
    public fulltimerService: FulltimerService,
    public changeDetector: ChangeDetectorRef,
    public eventService: EventService,
    public translateService: TranslateLabelService,
    public analyticService: AnalyticsService,
    public popoverCtrl: PopoverController,
    public _menuCtrl: MenuController
  ) {
  }

  ngOnInit() {

    this.analyticService.page('Fulltimer Search Page');

    this.platform.ready().then(() => {
      if (this.platform.is('mobile')) {
        this.isMobile = true;
      }
    });

    /*window.onresize = (e) => {
      this.onResize();
    };*/
  }

  ionViewWillEnter() {

    if (
      this.fulltimerService.algoliaConfig &&
      this.fulltimerService.algoliaConfig.searchParameters &&
      this.instantSearch &&
      this.instantSearch.instantSearchInstance.helper &&
      (
        JSON.stringify(this.instantSearch.instantSearchInstance.helper.state.numericRefinements) != JSON.stringify(this.fulltimerService.algoliaConfig.searchParameters.numericRefinements) ||
        JSON.stringify(this.instantSearch.instantSearchInstance.helper.state.facetFilters) != JSON.stringify(this.fulltimerService.algoliaConfig.searchParameters.facetFilters) ||
        JSON.stringify(this.instantSearch.instantSearchInstance.helper.state.disjunctiveFacetsRefinements) != JSON.stringify(this.fulltimerService.algoliaConfig.searchParameters.disjunctiveFacetsRefinements)
      )
    ) {
      this.scrollPosition = 0;
      this.dirty = true;
      // this.refreshingFulltimers = true;
    } else {
      setTimeout(() => {
        this.refreshingFulltimers = false;
      });
    }

    this.content.scrollToPoint(0, this.scrollPosition);

    if (this.instantSearchConfig && this.dirty) {
      this.initializeSearchParameters();
    }
  }

  dismiss() {
    this.showFilter = !this.showFilter;
  }

  allFulltimers() {
    this.navCtrl.navigateForward('/fulltimer-list');
  }

  ionViewDidEnter() {

    if (!this.instantSearchConfig) { // on first time app load
      this.initializeSearchParameters();

      this.setConfig();
    }
  }

  ionViewWillLeave() {
    this.content.getScrollElement().then(ele => {
      this.scrollPosition = ele.scrollTop;
    });
  }

  /**
   * initialize search parameters from state
   */
  initializeSearchParameters() {

    if (this.fulltimerService.algoliaConfig) {
      this.searchParameters = Object.assign({}, this.fulltimerService.algoliaConfig.searchParameters);
    /*} else {
      this.searchParameters = {
        'getRankingInfo': true,
        'aroundLatLngViaIP': true,
        'aroundRadius': 'all'
      };*/
    }
  }

  onResize() {
    this.showFilter = false;
  }

  /**
   * open filter page
   */
  openFilter() {

    this.showFilter = true;
    /*
    this.updateAlgoliaState();

    this.navCtrl.navigateForward('/fulltimer-filter', {
      animated: false,
      animationDirection: 'forward'
    });*/
  }

  /**
   * update algolia state
   */
  async updateAlgoliaState() {
    if(!this.fulltimerService.algoliaConfig) {
      this.fulltimerService.algoliaConfig = {};
    }

    this.fulltimerService.algoliaConfig.instantSearchConfig = Object.assign({}, this.instantSearchConfig);
    this.fulltimerService.algoliaConfig.searchParameters = this.instantSearch ? Object.assign({}, this.instantSearch.instantSearchInstance.helper.state) : Object.assign({}, this.searchParameters);
    this.fulltimerService.algoliaConfig.nbHits = this.nbHits;
    this.fulltimerService.algoliaConfig.nbPages = this.nbPages;
  }

  /**
   * check is empty
   * @param obj
   */
  isEmpty(obj) {
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        return false;
      }
    }
    return true;
  }

  /**
   * return current refinements
   */
  currentRefinements() {

    const instantSearchInstance = Object.assign({}, this.instantSearch.instantSearchInstance);

    return {
      query: instantSearchInstance.helper.state.query,
      tagRefinements: instantSearchInstance.helper.state.tagRefinements,
      numericRefinements: instantSearchInstance.helper.state.numericRefinements,
      disjunctiveFacetsRefinements: instantSearchInstance.helper.state.disjunctiveFacetsRefinements
    };
  }

  onSearch(event) {
    if(this.instantSearch && this.instantSearch.instantSearchInstance)
      this.instantSearch.instantSearchInstance.helper.setQuery(event.target.value).search();
  }

  /**
   * Set algolia config
   */
  async setConfig() {

    setTimeout(_ => {
    //  this.loading = true;
    });

    this.algoliaService.getKey().then(response => {
      this.instantSearchConfig = this.instantSearchConfigRefactor(makeStateKey, HttpHeaders, response);
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

    const client = algoliasearch(appId, apiKey, {

      requester: {
        send({ headers, method, url, data }) {

          const transferStateKey = makeStateKey(`ngais(${data})`);

            if (transferState.hasKey(transferStateKey) && !this.refreshingFulltimers) {
                const response = JSON.parse(transferState.get(transferStateKey, JSON.stringify({})));
                return Promise.resolve({
                    status: response.status,
                    content: JSON.stringify(response.body),
                    isTimedOut: false,
                });
            }

            return new Promise((resolve, reject) => {
                httpClient
                    .request(method, url, {
                    headers,
                    body: data,
                    observe: 'response',
                })
                    .subscribe(response => {

                   // this.processResponse(response, transferState, transferStateKey);

                    resolve({
                        status: response.status,
                        content: JSON.stringify(response.body),
                        isTimedOut: false,
                    });
                }, response => reject({
                    status: response.status,
                    body: response.body,
                }));
            });
        },
      }
    });

    /*const requester = (rawUrl, opts, fromResetKey = false) => {

      if (transferState.hasKey(transferStateKey) && !this.refreshingFulltimers) {

        // @type {?}
        let resp = JSON.parse(transferState.get(transferStateKey, {}));

        let index;
        let XRequestedAt;

        if (resp && resp.url) {
          index = resp.url.indexOf('x-requested-at=');
          XRequestedAt = parseInt(resp.url.substr(index + 15));
        }

        if (!XRequestedAt || ((new Date().getTime()) - XRequestedAt) > environment.algoliaCacheDuration) {
          transferState.remove(transferStateKey);
          return client._request(rawUrl, opts); // call again after removing transfer state
        }

        this.processResponse(resp);

        return Promise.resolve(this.resolveResponse(resp));
      }

      this.lastQuery = opts.body;

      return new Promise((resolve, reject) => {

        // no loading when filtering facet values from filter search bar

        /*if (rawUrl.indexOf('/facets/') === -1) {
          setTimeout(_ => {
            this.loading = true;

            if (
              opts.jsonBody &&
              opts.jsonBody.requests &&
              opts.jsonBody.requests[0].params &&
              opts.jsonBody.requests[0].params.indexOf('page=0') != -1
            ) {
              setTimeout(() => {
                this.refreshingFulltimers = true;
              });
            }
          });
        }*

        //if key got time out

        if (this.algoliaService.getCurrentTimeUTC() > this.algoliaService.securedApiKeyValidUntil) {
          return this.resetKey(opts, rawUrl, resolve, transferState, transferStateKey);
        }

        //normal request

        httpClient
          .request(opts.method, url, {
            headers: headers,
            body: opts.body,
            observe: 'response'
          }).subscribe(resp => {

            this.processResponse(resp, transferState, transferStateKey);

            resolve(this.resolveResponse(resp));
          }, resp => {

            // http 400 = secure key expired

            if (fromResetKey || resp.status != 400) {
              this._handleError(resp);

              return resolve(this.resolveResponse(resp));
            }

            // on fail get new key and call again

            this.resetKey(opts, rawUrl, resolve, transferState, transferStateKey);

          });
      });
    };*/
    return client;
  }

  resetKey(opts, rawUrl, resolve,  transferState, transferStateKey) {

    this.algoliaService.getKey(true).then(response => {

      //this.instantSearch.searchClient.api
      // update config

      this.instantSearchConfig = this.instantSearchConfigRefactor(makeStateKey, HttpHeaders, response);

      // update old key
      opts.headers['x-algolia-api-key'] = response.securedApiKey;
      opts.jsonBody.apiKey = response.securedApiKey;
      opts.body = JSON.stringify(opts.jsonBody);

      this.instantSearchConfig.searchClient._request(rawUrl, opts, true).then(resp => {

        this.processResponse(resp, transferState, transferStateKey);

        resolve(this.resolveResponse(resp));
      });
    });
  }

  /**
   * process response from algolia
   * @param resp
   * @param transferState
   * @param transferStateKey
   */
  processResponse(resp, transferState = null, transferStateKey = null) {

    if (transferState) {
      transferState.set(transferStateKey, JSON.stringify(resp));
    }

    setTimeout(() => {
      this.loading = false;
      this.refreshingFulltimers = false;
    });

    if (resp.body && resp.body.results && resp.body.results[0]) {
      const results = resp.body.results[0];

      setTimeout(() => {
        this.nbHits = results.nbHits;
        this.nbPages = results.nbPages;
        this.page = results.page;
        this.noFulltimerList = (results.page == 0 && results.nbHits == 0);
      });
    }

    // either need fulltimers in result or query in search box

    // TF condition
    setTimeout(() => {

      this.showSearchBox = (
        !this.noFulltimerList ||
        (
          this.instantSearch &&
          this.instantSearch.instantSearchInstance &&
          this.instantSearch.instantSearchInstance.helper.state.query &&
          this.instantSearch.instantSearchInstance.helper.state.query.length > 0
        )
      );

      if (this.changeDetector !== null &&
        this.changeDetector !== undefined &&
        !(this.changeDetector as ViewRef).destroyed) {
        this.changeDetector.detectChanges();
      }

      if (this.eleInfinite) {
        this.eleInfinite.complete();
      }
    });
  }

  /**
   * Handles Caught Errors from All Authorized Requests Made to Server
   * @returns {Observable}
   */
  public _handleError(error: any) {

    const errMsg = (error.message) ? error.message :
      error.status ? `${error.status} - ${error.statusText}` : 'Server error';

    // Handle No Internet Connection Error
    if (error.status == 0 || !navigator.onLine) {
      return this.eventService.internetOffline$.next({});
    }

    // Handle internal server error - 500 or 400
    if (error.status === 500) {
      console.error(error);
      return this.eventService.error500$.next({});
    }

    if (error.status === 404) {
      return this.eventService.error404$.next({});
    }

    alert('Error: ' + errMsg);
  }

  onRender(event) {
    console.log(event);
  }

  /**
   * set loader on scroll to bottom if have more data
   * @param e
   */
  doInfinite(e, state = null, showMoreHandler = null) {

    console.log(state, showMoreHandler);

    //showMoreHandler(e);

    // if already loading

    /*if (this.loading) {
      e.target.complete();
      return false;
    }*/

    setTimeout(_ => {
      this.loading = true;
    });

    this.eleInfinite = event.target;

    return true;
  }

  /**
   * promise resolve response
   * @param resp
   */
  resolveResponse(resp) {
    return {
      statusCode: resp.status,
      body: resp.body,
      headers: resp.headers
    };
  }

  /**
   * createSSRSearchClient refactor
   * @param makeStateKey
   * @param HttpHeaders
   * @param response
   */
  instantSearchConfigRefactor(makeStateKey, HttpHeaders, response) {

    return {
      indexName: environment.algoliaFulltimerIndex,

      /*onStateChange({ uiState, setUiState }) {
        // Custom logic
        setUiState(uiState);
      },*/
      searchClient: this.createSSRSearchClient({
        makeStateKey,
        HttpHeaders,
        transferState: this.transferState,
        httpClient: this.httpClient,
        apiKey: response.securedApiKey,
        appId: response.appId
      })
    };
  }

  /**
   * Loads the create page
   */
  async createModal($event, fulltimer: Fulltimer = new Fulltimer()) {
    $event.preventDefault();
    $event.stopPropagation();

    window.history.pushState({ navigationId: window.history.state?.navigationId }, null, window.location.pathname);

    const modal = await this.modalCtrl.create({
      component: FulltimerFormPage,
      componentProps: {
        model: fulltimer,
        request_uuid: this.request_uuid
      },
      cssClass: "popup-modal"
    });
    modal.onDidDismiss().then(e => {

      if (!e.data || e.data.from != 'native-back-btn') {
        window['history-back-from'] = 'onDidDismiss';
        window.history.back();
      }

      if (e.data && e.data.refresh) {

        if(this.request_uuid) {
          setTimeout(() => {
            this.modalCtrl.dismiss({ refresh: true });
          }, 500);
        }

        this.refreshingFulltimers = true;

        //refresh listing

        setTimeout(() => {
          this.refreshFulltimers();
        }, 2000);//give time to backend to sync with algolia
      }
    });
    return await modal.present();
  }

  /**
   * Refresh fulltimer list
   */
  async refreshFulltimers() {

    if (!this.instantSearch) {
      return null;
    }

    this.nbPages = 0;

    this.loading = true;
    this.refreshingFulltimers = true;

    this.instantSearch.instantSearchInstance.helper.clearCache().setPage(0).setQuery('').search();
  }

  logScrolling(e) {
    if(e.target) {
      this.borderLimit = e.target.scrollTop > 20;
    } else {
      this.borderLimit = (e.detail.scrollTop > 20);
    }
  }

  onFulltimerClicked(hit) {
    //[routerLink]="'/fulltimer/' + hit.objectID"
    if(!this.request_uuid) {
      this.navCtrl.navigateForward('/fulltimer/' + hit.objectID);
    } else {
      this.modalCtrl.dismiss({
        fulltimer_uuid: hit.objectID
      });
    }
  }
}
