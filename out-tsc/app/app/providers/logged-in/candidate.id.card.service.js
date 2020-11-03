import { __decorate } from "tslib";
import { Injectable } from '@angular/core';
let CandidateIdCardService = class CandidateIdCardService {
    constructor(_authhttp) {
        this._authhttp = _authhttp;
        this.candidates = [];
        this._candidateEndpoint = "/candidate-id-cards";
    }
    /**
     * Renew ID cards
     * @returns {Observable<any>}
     */
    renew(candidates) {
        let url = this._candidateEndpoint + '/renew';
        let params = {
            "candidates": candidates
        };
        return this._authhttp.post(url, params);
    }
    /**
     * generate candidate id zip
     * @returns {Observable<any>}
     */
    generate(candidates) {
        let url = this._candidateEndpoint + '/generate';
        let params = {
            "candidates": candidates
        };
        return this._authhttp.generateCards(url, params, 'ID-Cards.zip');
    }
    /**
     * List of all candidates whose card not generated, to generate card
     * @returns {Observable<any>}
     */
    listExpiredIds(candidate_name, page) {
        let url = this._candidateEndpoint + '/list-expired?candidate_name=' + candidate_name + '&page=' + page;
        return this._authhttp.getRaw(url);
    }
    /**
     * List of all candidates whose card not generated, to generate card
     * @returns {Observable<any>}
     */
    listAssignedExpiredIds(candidate_name, page) {
        let url = this._candidateEndpoint + '/list-expired?assigned=1&candidate_name=' + candidate_name + '&page=' + page;
        return this._authhttp.getRaw(url);
    }
    /**
     * Total candidates whose card not generated, to generate card
     * @returns {Observable<any>}
     */
    totalExpiredIds() {
        let url = this._candidateEndpoint + '/total-expired';
        return this._authhttp.get(url);
    }
    /**
     * List of all candidates whose card not generated, to generate card
     * @returns {Observable<any>}
     */
    listCandidates(candidate_name, page) {
        let url = this._candidateEndpoint + '/list-candidates?candidate_name=' + candidate_name + '&page=' + page;
        return this._authhttp.getRaw(url);
    }
    /**
     * List of all candidates whose card already generated, to download zip
     * @returns {Observable<any>}
     */
    listCandidateIds(candidate_name, page) {
        let url = this._candidateEndpoint + '/list-candidate-ids?candidate_name=' + candidate_name + '&page=' + page;
        return this._authhttp.getRaw(url);
    }
};
CandidateIdCardService = __decorate([
    Injectable({
        providedIn: 'root'
    })
], CandidateIdCardService);
export { CandidateIdCardService };
//# sourceMappingURL=candidate.id.card.service.js.map