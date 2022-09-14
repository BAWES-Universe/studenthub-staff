import { Store } from './store';
import { Company } from './company';
import {Candidate} from "./candidate";


export class CandidateWorkHistory {
    id: number;
    candidate_id: number;
    store_id: number;
    company_id: number;
    parent_company_id: number;
    start_date: string;
    end_date: string;
    candidate_hourly_rate: any;
    // Related
    store: Store;
    candidate: Candidate;
    company: Company;
}
