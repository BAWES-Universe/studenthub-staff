import { Candidate } from "./candidate";
import { Invitation } from "./invitation";
import { Job } from "./job";

 
export class JobInterest {
    job_interest_uuid: string;
    candidate_id: number;
    job_uuid: string;
    status: string; // "INTERESTED"  "SHORTLISTED" "REJECTED";
    notes: string;
    created_at: string;
    updated_at: string;
    seen_at: string;
    invitations: Invitation[]; 
    candidate: Candidate;
    job: Job; 
}