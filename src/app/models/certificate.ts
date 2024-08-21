import { Candidate } from "./candidate";
import { Company } from "./company";
import { Exam } from "./exam";
import { Staff } from "./staff";
import { Store } from "./store";

export class CandidateCertificate {
    certificate_uuid: string;
    certificate_type: number;
    candidate_work_history_id: number;
    candidate_id: number;
    store_id: number;
    company_id: number;
    parent_company_id: number;
    start_date: string;
    end_date: string;
    staff_id: number; 
    exam_uuid: string;
    isOpen: boolean; 
      
    // Related
    exam: Exam;
    staff: Staff;
    store: Store;
    candidate: Candidate;
    company: Company;
}
 
      