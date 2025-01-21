import { Candidate } from './candidate';
import { Request, Story } from './request';
import { Note } from "./note";
import { JobInterest } from './job-interest';

export class Invitation {
    invitation_uuid: string;
    candidate_id: number;
    request_uuid: string;
    story_uuid: string;
    job_interest_uuid: string;
    invitation_status: number;// (1-Invited , 2- rejected, 3- accepted)
    invitation_email_seen_at: string;
    invitation_app_seen_at: string;
    invitation_created_by_staff: number;
    invitation_updated_by_staff: number;
    invitation_created_by_company: number;
    invitation_updated_by_company: number;
    invitation_created_at: string;
    invitation_updated_at: string;
    is_suggested: any;
    candidate: Candidate;
    request: Request;
    story: Story;
    note: Note;
    jobInterest: JobInterest;
}
