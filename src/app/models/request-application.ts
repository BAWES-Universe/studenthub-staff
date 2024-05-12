import { Candidate } from "./candidate";
import { Fulltimer } from "./fulltimer";
import { Request } from "./request";
import { RequestInterview } from "./request-interview";

export class RequestApplication {
    application_uuid: string;
    candidate_id: number; 
    fulltimer_uuid: string; 
    request_uuid: string; 
    status: number; 
    created_at: string; 
    updated_at: string;
    candidate: Candidate;
    fulltimer: Fulltimer;
    requestInterview: RequestInterview;
    request: Request
}

