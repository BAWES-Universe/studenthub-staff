import { Candidate } from './candidate';
import { Fulltimer } from './fulltimer';
import { Note } from './note';
import { Request } from './request';
import { Staff } from './staff';

export class Suggestion {
    suggestion_uuid: string;
    request_uuid: string;
    fulltimer_uuid: string;
    candidate_id: number;
    note_uuid: string;
    suggestion_status: number;
    suggestion_datetime: string;
    mail_to_company: boolean;
    note: Note;
    feedback: Note;
    feedbacks: Note[];
    candidate: Candidate;
    fulltimer: Fulltimer;
    request: Request;
    createdBy: any;
    updatedBy: any;
}
