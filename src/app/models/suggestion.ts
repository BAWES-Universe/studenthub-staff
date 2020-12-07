import { Candidate } from './candidate';
import { Fulltimer } from './fulltimer';
import { Note } from './note';
import { Request } from './request';

export class Suggestion {
    suggestion_uuid: string;
    request_uuid: string;
    fulltimer_uuid: string;
    candidate_id: number;
    note_uuid: string;
    suggestion_status: number;
    suggestion_datetime: string;
    note: Note;
    candidate: Candidate;
    fulltimer: Fulltimer;
    request: Request;
}
