import { Staff } from './staff';
import { CompanyContact } from './company-contact';
import { Company } from './company';
import { Note } from './note';


export class Request {
    request_uuid: string;
    company_id: number;
    contact_uuid: string;
    request_created_by: number;
    request_updated_by: number;
    request_position_type: number;
    request_position_title: string;
    request_number_of_employees: number;
    request_additional_info: string;
    request_status: any;
    // request_status: Status;
    request_feedback: string;
    request_created_datetime: string;
    request_updated_datetime: string;
    requestCreatedBy: Staff;
    requestUpdatedBy: Staff;
    staff: Staff;
    contact: CompanyContact;
    company: Company;
    lastActivity: Note;
}
/*
enum Status {
    pending,
    started,
    delivered,
    cancelled
}*/
