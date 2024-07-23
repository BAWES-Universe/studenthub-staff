import { Candidate } from "./candidate";
import { Company } from "./company";
import { Note } from "./note";
import { Request } from "./request";
import { Staff } from "./staff";

export class InterviewEvaluation {
    interview_evaluation_uuid: string;
    candidate_id: number;
    request_uuid: string;
    company_id: number; 
    staff_id: number; 
    created_at: string;
    updated_at: string;
    notes: Note[];
    staff: Staff;
    request: Request;
    company: Company;
    interviewEvaluationNoteVersions: InterviewEvaluationNoteVersion[];
    latestInterviewEvaluationNoteVersions: InterviewEvaluationNoteVersion;
}

export class InterviewEvaluationNoteVersion {
    ienv_uuid: string;
    version: number;
    interview_evaluation_uuid: string;
    staff_id: number;
    candidate_id: number;
    created_at: string;
    updated_at: string;
    staff: Staff;
    candidate: Candidate;
    interviewEvaluationNotes: InterviewEvaluationNote[];
}

export class InterviewEvaluationNote {
    ienv_uuid: string;
    note: string;
}