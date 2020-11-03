import { __decorate } from "tslib";
import { Injectable } from '@angular/core';
let CandidateService = class CandidateService {
    constructor(_authhttp) {
        this._authhttp = _authhttp;
        this._candidateEndpoint = '/candidates';
    }
    /**
     * candidate detail
     * @returns {Observable<any>}
     */
    detail(id) {
        return this._authhttp.get(this._candidateEndpoint + '/detail/' + id + '?expand=candidateIdCard,store,company,candidateSkills,candidateExperiences,bank,nationality,area,country,university');
    }
    /**
     * candidate salary transfer list
     * @returns {Observable<any>}
     */
    transfers(id) {
        const url = this._candidateEndpoint + '/transfers/' + id + '?expand=bank';
        return this._authhttp.get(url);
    }
    /**
     * List of all candidates
     * @returns {Observable<any>}
     */
    list() {
        const url = this._candidateEndpoint;
        return this._authhttp.getRaw(url + '?expand=store,company,candidateSkills,candidateExperiences');
    }
    /**
     * List of all candidates
     * @returns {Observable<any>}
     */
    listFilter(search, page) {
        const url = this._candidateEndpoint + '/filter?page=' + page + search + '&expand=store,company,candidateSkills,candidateExperiences';
        return this._authhttp.getRaw(url);
    }
    /**
     * List of all candidates asigned to store
     * @returns {Observable<any>}
     */
    listAssigned(candidate_name, page, incompleteProfile = 0, withoutBank = 0) {
        const url = this._candidateEndpoint + '/assigned?candidate_name=' + candidate_name + '&page=' + page + '&incomplete_profile=' + incompleteProfile + '&without_bank=' + withoutBank + '&expand=store,company,candidateSkills,candidateExperiences';
        return this._authhttp.getRaw(url);
    }
    /**
     * List of all candidates without bank details
     * @returns {Observable<any>}
     */
    listWithoutBank(candidate_name, page) {
        const url = this._candidateEndpoint + '/without-bank?candidate_name=' + candidate_name + '&page=' + page
            + '&expand=store,company,candidateSkills,candidateExperiences';
        return this._authhttp.getRaw(url);
    }
    /**
     * List of all candidates not asigned to store
     * @returns {Observable<any>}
     */
    listNotAssigned(candidate_name, page, incompleteProfile = 0, withoutBank = 0) {
        const url = this._candidateEndpoint + '/not-assigned?candidate_name=' + candidate_name + '&page=' + page + '&incomplete_profile=' + incompleteProfile + '&without_bank=' + withoutBank + '&expand=store,company,candidateSkills,candidateExperiences';
        return this._authhttp.getRaw(url);
    }
    /**
     * Create
     * @param {Candidate} model
     * @returns {Observable<any>}
     */
    create(model) {
        const postUrl = `${this._candidateEndpoint}`;
        const params = {
            candidate_id: model.candidate_id,
            store_id: model.store_id,
            bank_id: model.bank_id,
            university_id: model.university_id,
            country_id: model.country_id,
            bank_account_name: model.bank_account_name,
            iban: model.candidate_iban,
            name: model.candidate_name,
            name_ar: model.candidate_name_ar,
            personal_photo: model.candidate_personal_photo,
            email: model.candidate_email,
            phone: model.candidate_phone,
            birth_date: model.candidate_birth_date,
            civil_id: model.candidate_civil_id,
            expiry_date: model.candidate_civil_expiry_date,
            photo_front: model.candidate_civil_photo_front,
            photo_back: model.candidate_civil_photo_back,
            hourly_rate: model.candidate_hourly_rate,
            candidate_status: model.candidate_status,
            candidate_objective: model.candidate_objective,
            candidate_gender: model.candidate_gender,
            candidate_driving_license: model.candidate_driving_license,
            skill: model.skill,
            experience: model.experience,
            resume: model.candidate_resume
        };
        return this._authhttp.post(postUrl, params);
    }
    /**
     * Update
     * @param {Candidate} model
     * @returns {Observable<any>}
     */
    update(model) {
        const url = `${this._candidateEndpoint}/${model.candidate_id}`;
        const params = {
            candidate_id: model.candidate_id,
            store_id: model.store_id,
            university_id: model.university_id,
            country_id: model.country_id,
            bank_id: model.bank_id,
            bank_account_name: model.bank_account_name,
            iban: model.candidate_iban,
            name: model.candidate_name,
            name_ar: model.candidate_name_ar,
            personal_photo: model.candidate_personal_photo,
            email: model.candidate_email,
            phone: model.candidate_phone,
            birth_date: model.candidate_birth_date,
            civil_id: model.candidate_civil_id,
            expiry_date: model.candidate_civil_expiry_date,
            photo_front: model.candidate_civil_photo_front,
            photo_back: model.candidate_civil_photo_back,
            hourly_rate: model.candidate_hourly_rate,
            candidate_status: model.candidate_status,
            candidate_objective: model.candidate_objective,
            candidate_gender: model.candidate_gender,
            candidate_driving_license: model.candidate_driving_license,
            skill: model.skill,
            experience: model.experience,
            resume: model.candidate_resume
        };
        return this._authhttp.patch(url, params);
    }
    /**
     * update job search status
     * @param params
     */
    updateJobSearchStatus(params) {
        const url = `${this._candidateEndpoint}/job-search-status`;
        return this._authhttp.patch(url, {
            candidate_id: params.candidate_id,
            job_search_status: params.job_search_status
        });
    }
    /**
     * Reset Password
     * @param {Candidate} model
     * @returns {Observable<any>}
     */
    resetPassword(model) {
        const url = `${this._candidateEndpoint}/reset-password/${model.candidate_id}`;
        return this._authhttp.patch(url, {});
    }
    /**
     * Delete candidate
     * @param {Candidate} model
     * @returns {Observable<any>}
     */
    delete(model) {
        const url = `${this._candidateEndpoint}/${model.candidate_id}`;
        return this._authhttp.delete(url);
    }
    /**
     * Removes Candidate from Assigned store
     * @param {any} candidate
     * @returns {Observable<any>}
     */
    removeFromAssignedStore(candidate) {
        const url = `${this._candidateEndpoint}/unassign/${candidate.candidate_id}`;
        return this._authhttp.delete(url);
    }
    /**
     * Assign candidate to store
     * @param {Candidate} candidate
     * @param {number} store_id
     * @returns {Observable<any>}
     */
    assignCandidateToStore(candidate, store_id) {
        const params = {
            store_id
        };
        const url = `${this._candidateEndpoint}/assign/${candidate.candidate_id}`;
        return this._authhttp.patch(url, params);
    }
    /**
     * List candidates by country
     * @param country
     * @param page
     */
    listByCountry(country, page) {
        const url = this._candidateEndpoint + '/search?expand=store,company&country_id=' + country.country_id + '&page=' + page;
        return this._authhttp.getRaw(url);
    }
    /**
     * return work history
     * @param candidate
     */
    workHistory(candidate_id) {
        const url = this._candidateEndpoint + '/work-history/' + candidate_id + '?expand=store,company';
        return this._authhttp.get(url);
    }
    /**
     * List of all candidate to review changes
     * @returns {Observable<any>}
     */
    listToReview(page) {
        const url = this._candidateEndpoint + '/search?expand=store,company&by=review&review=0&page=' + page;
        return this._authhttp.getRaw(url);
    }
    /**
     * No. of all candidate to review changes
     * @returns {Observable<any>}
     */
    totalToReview() {
        return this._authhttp.get(this._candidateEndpoint + '/total-to-review');
    }
    /**
     * approve candidate
     * @param {Candidate} model
     * @returns {Observable<any>}
     */
    approve(model) {
        return this._authhttp.patch(`${this._candidateEndpoint}/approve/${model.candidate_id}`, {});
    }
    /**
     * unapprove candidate
     * @param {Candidate} model
     * @returns {Observable<any>}
     */
    unapprove(model) {
        return this._authhttp.patch(`${this._candidateEndpoint}/unapprove/${model.candidate_id}`, {});
    }
    /**
     * update candidate hourly rate
     * @param model
     * @param rate
     */
    updateHour(model, rate) {
        return this._authhttp.patch(`${this._candidateEndpoint}/update-hour-rate/${model.candidate_id}`, {
            hourly_rate: rate
        });
    }
    /**
     * update candidate hourly rate
     * @param model
     * @param rate
     */
    expired(model) {
        return this._authhttp.patch(`${this._candidateEndpoint}/expire-card/${model.candidate_id}`, {});
    }
    /**
     * update candidate hourly rate
     * @param model
     * @param rate
     */
    exportCV(model) {
        return this._authhttp.pdfget(`${this._candidateEndpoint}/candidate-resume-pdf/${model.candidate_id}`, model.candidate_name + '-cv');
    }
};
CandidateService = __decorate([
    Injectable({
        providedIn: 'root'
    })
], CandidateService);
export { CandidateService };
//# sourceMappingURL=candidate.service.js.map