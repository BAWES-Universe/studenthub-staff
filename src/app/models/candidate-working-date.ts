import { Candidate} from "./candidate";
import { Company} from "./company";
import { Store} from "./store";

export class CandidateWorkingDate {

    cwd_uuid?: string;
    candidate_id?: number;
    store_id?: number;
    company_id?: number;
    date?: string;
    start_time?: string;
    end_time?: string;
    total_time?: number;
    status?: number;
    created_at?: string;
    updated_at?: string;
    candidate?: Candidate;
    company?: Company;
    store?: Store;
    health?: any;
    total_rejected!: number;
    total_pending!: number;
    total_approved!: number;
}
