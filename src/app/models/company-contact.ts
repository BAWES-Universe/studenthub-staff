import {Contact} from './contact';

export class CompanyContact {
    company_contact_uuid: string;
    contact_uuid: string;
    company_id: number;
    contact_position: string;
    allow_access: any;
    created_at: string;
    updated_at: string;
    created_by: string;
    updated_by: string;
    contact: Contact;
}
