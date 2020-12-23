import {Component, ViewChild, OnInit, ChangeDetectorRef, ViewRef} from '@angular/core';
import { NavController, Platform, MenuController, PopoverController, IonContent, AlertController } from '@ionic/angular';
import { Plugins } from '@capacitor/core';
// import { Storage } from '@ionic/storage';
import { environment } from '../../../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { TransferState, makeStateKey } from '@angular/platform-browser';
import * as algoliasearchProxy from 'algoliasearch/index';
import * as VERSION from 'algoliasearch/src/version';
import * as encodeProxy from 'querystring-es3/encode';
// service
import { AuthService } from '../../../../providers/auth.service';
import { CandidateService } from '../../../../providers/logged-in/candidate.service';
import { TranslateLabelService } from '../../../../providers/translate-label.service';
import { EventService } from '../../../../providers/event.service';
import { AlgoliaService } from 'src/app/providers/logged-in/algolia.service';
import { CandidateIdCardService } from 'src/app/providers/logged-in/candidate.id.card.service';
//pages
import { CandidateMergeSelectPage } from '../candidate-merge-select/candidate-merge-select.page';


const { Storage } = Plugins;
const algoliasearch = algoliasearchProxy.default || algoliasearchProxy;
const encode = encodeProxy.default || encodeProxy;

@Component({
  selector: 'app-candidate-search',
  templateUrl: './candidate-search.page.html',
  styleUrls: ['./candidate-search.page.scss'],
})
export class CandidateSearchPage implements OnInit {

  @ViewChild(IonContent, { static: true }) content: IonContent;

  @ViewChild('instantSearch', { static: false }) public instantSearch;

  public lastQuery;

  public downloading;

  public merging;

  public eleInfinite;

  public loading: boolean;

  public isMobile: boolean;

  public instantSearchConfig;

  public nbHits = null;
  public nbPages;
  public page;
  public searchParameters = {};
  public refreshingCandidates = false;
  public dirty = false;
  public noCandidateList = false;
  public showSearchForm = false;
  public showSearchBox = true;
  public haveLocationFilter = false;
  public lastRefinements;
  public lastQueryId;
  public scrollPosition = 0;
  public borderLimit = false;
  public showFilter = false;

  constructor(
    public httpClient: HttpClient,
    public transferState: TransferState,
    public navCtrl: NavController,
    public alertCtrl: AlertController,
    public platform: Platform,
    public auth: AuthService,
    public algoliaService: AlgoliaService,
    public candidateService: CandidateService,
    public candidateIdCardService: CandidateIdCardService,
    public changeDetector: ChangeDetectorRef,
    public eventService: EventService,
    public translateService: TranslateLabelService,
    public popoverCtrl: PopoverController,
    public _menuCtrl: MenuController
  ) {
  }

  ngOnInit() {

    this.platform.ready().then(() => {
      if (this.platform.is('mobile')) {
        this.isMobile = true;
      }
    });
  }

  ionViewWillEnter() {

    if (
      this.candidateService.algoliaConfig &&
      this.candidateService.algoliaConfig.searchParameters &&
      this.instantSearch &&
      this.instantSearch.instantSearchInstance.helper &&
      (
        JSON.stringify(this.instantSearch.instantSearchInstance.helper.state.numericRefinements) != JSON.stringify(this.candidateService.algoliaConfig.searchParameters.numericRefinements) ||
        JSON.stringify(this.instantSearch.instantSearchInstance.helper.state.facetFilters) != JSON.stringify(this.candidateService.algoliaConfig.searchParameters.facetFilters) ||
        JSON.stringify(this.instantSearch.instantSearchInstance.helper.state.disjunctiveFacetsRefinements) != JSON.stringify(this.candidateService.algoliaConfig.searchParameters.disjunctiveFacetsRefinements)
      )
    ) {
      this.scrollPosition = 0;
      this.dirty = true;
      // this.refreshingCandidates = true;
    } else {
      setTimeout(() => {
        this.refreshingCandidates = false;
      });
    }

    this.content.scrollToPoint(0, this.scrollPosition);

    if (this.instantSearchConfig && this.dirty) {
      this.initializeSearchParameters();
    }
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
   * Merge to account
   */
  async merge(e) {

    if (this.candidateService.candidates.length != 2) {
      const prompt = await this.alertCtrl.create({
        message: 'Please select any 2 candidates',
        buttons: ['Okay']
      });
      prompt.present();

      return false;
    }

    const popover = await this.popoverCtrl.create({
      component: CandidateMergeSelectPage,
      event: e,
      cssClass: 'candidate-merge-select'
    });

    popover.onDidDismiss().then(e => {
      
      if(!e.data || !e.data.candidate) {
        return false;
      }

      let source;

      if(e.data.candidate.candidate_id == this.candidateService.candidates[1].candidate_id) {
        source = this.candidateService.candidates[0].candidate_id;
      } else {
        source = this.candidateService.candidates[1].candidate_id;
      }

      this.merging = true;

      this.candidateService.merge(source, e.data.candidate.candidate_id).subscribe(response => {
      }, (err) => {
      }, () => {
        this.merging = false;
        this.candidateService.candidates = [];
        this.candidateIdCardService.candidates = [];

        this.refreshCandidates();
      });
    });
    popover.present();
  }


  /**
   * Generate id cards
   */
  async generate() {
    
    if (this.candidateIdCardService.candidates.length == 0) {
      const prompt = await this.alertCtrl.create({
        message: 'Please select candidate(s)',
        buttons: ['Ok']
      });
      prompt.present();

      return false;
    }

    this.downloading = true;

    this.candidateIdCardService.generate(this.candidateIdCardService.candidates).subscribe(response => {
    }, (err) => {
    }, () => {
      this.downloading = false;
      this.candidateIdCardService.candidates = [];
    });
  }

  deselect() {
    this.candidateService.candidates = [];
    this.candidateIdCardService.candidates = [];

    this.eventService.clearCandidateSelection$.next();
  }

  /**
   * initialize search parameters from state
   */
  initializeSearchParameters() {

    if (this.candidateService.algoliaConfig) {
      this.searchParameters = Object.assign({}, this.candidateService.algoliaConfig.searchParameters);
    }
  }

  /**
   * Open filter for mobile users
   */
  openFilter() {

    this.showFilter = true;
    // this.updateAlgoliaState();
    //
    // this.router.navigate(['job-with-filter']);
  }
  dismiss() {
    this.showFilter = false;
  }

  /**
   * update algolia state
   */
  async updateAlgoliaState() {
    if(!this.candidateService.algoliaConfig) {
      this.candidateService.algoliaConfig = {};
    }

    this.candidateService.algoliaConfig.instantSearchConfig = Object.assign({}, this.instantSearchConfig);
    this.candidateService.algoliaConfig.searchParameters = this.instantSearch ? Object.assign({}, this.instantSearch.instantSearchInstance.helper.state) : Object.assign({}, this.searchParameters);
    this.candidateService.algoliaConfig.nbHits = this.nbHits;
    this.candidateService.algoliaConfig.nbPages = this.nbPages;
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
      this.loading = true;
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

    const client = algoliasearch(appId, apiKey, {});

    client.addAlgoliaAgent('angular-instantsearch ' + VERSION);

    client._request = (rawUrl, opts, fromResetKey = false) => {

      if (this.instantSearchConfig.searchClient) {
        opts.headers['x-algolia-api-key'] = this.instantSearchConfig.searchClient.apiKey;
      }

      let headers = new HttpHeaders();
      headers = headers.set('content-type', opts.method === 'POST' ? 'application/x-www-form-urlencoded' : 'application/json');
      headers = headers.set('accept', 'application/json');

      let url = rawUrl + (rawUrl.includes('?') ? '&' : '?') + encode(opts.headers);
      url += '&x-requested-at=' + new Date().getTime();

      const transferStateKey = makeStateKey('pogi-source-ais(' + opts.body + ')');

      if (transferState.hasKey(transferStateKey)) {

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
                this.refreshingCandidates = true;
              });
            }
          });
        }*/

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
    };
    return client;
  }

  resetKey(opts, rawUrl, resolve,  transferState, transferStateKey) {

    this.algoliaService.getKey(true).then(response => {

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

    if (this.eleInfinite) {
      this.eleInfinite.complete();
    }

    setTimeout(() => {
      this.loading = false;
      this.refreshingCandidates = false;
    });

    if (resp.body && resp.body.results && resp.body.results[0]) {
      const results = resp.body.results[0];

      setTimeout(() => {
        this.nbHits = results.nbHits;
        this.nbPages = results.nbPages;
        this.page = results.page;
        this.noCandidateList = (results.page == 0 && results.nbHits == 0);
      });
    }

    // either need candidates in result or query in search box

    // TF condition
    setTimeout(() => {

      this.showSearchBox = (
        !this.noCandidateList ||
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
      return this.eventService.internetOffline$.next();
    }

    // Handle internal server error - 500 or 400
    if (error.status === 500) {
      return this.eventService.error500$.next();
    }

    if (error.status === 404) {
      return this.eventService.error404$.next();
    }

    alert('Error: ' + errMsg);
  }

  /**
   * set loader on scroll to bottom if have more data
   * @param e
   */
  doInfinite(e) {

    // if already loading

    if (this.loading) {
      e.target.complete();
      return false;
    }

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
  }

  /**
   * When its selected
   */
  rowSelected(model) {
    this.navCtrl.navigateForward('candidate-view/' + model.candidate_id, {
      state: {
        model
      }
    });
  }
  

  /**
   * Refresh list
   */
  async refreshCandidates() {
    
    if (!this.instantSearch) {
      return null;
    }

    this.nbPages = 0;
    
    this.loading = true;
    this.refreshingCandidates = true;
  
    this.instantSearch.instantSearchInstance.helper.clearCache().setPage(0).setQuery('').search();
  }

  logScrolling(e) {
    this.borderLimit = (e.detail.scrollTop > 20) ? true : false;
  }
}
