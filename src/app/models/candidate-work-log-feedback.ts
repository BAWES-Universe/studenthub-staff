import { Candidate } from "./candidate";

export class CandidateWorkLogFeedback {
    cwlf_uuid: string;
    candidate_id: number;
    store_id: number;
    company_id: number;
    date : string;
    candidate_working_hour_uuid: string;
    status : number;
    note: string;
    reason : string;
    is_public: boolean;
    rating : number;
    created_at : string;
    updated_at : string;
    candidate: Candidate;
}