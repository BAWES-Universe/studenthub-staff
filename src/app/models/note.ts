import { Staff } from './staff';

export class Note {
    note_uuid: string;
    company_id: number;
    candidate_id: number;
    contact_uuid: string;
    fulltimer_uuid: string;
    request_uuid: string;
    staff_id: number;
    note_type: any;
    note_text: string;
    created_by: string;
    updated_by: string;
    note_created_datetime: string;
    note_updated_datetime: string;

    createdBy: Staff;
    updatedBy: Staff;
}
