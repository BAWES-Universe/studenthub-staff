import { Note } from './note';
import { Request } from './request';

export class Contact {
    contact_uuid: string;
    contact_name: string;
    contact_position: string;
    contact_email: string;
    contact_password: string;
    contact_receive_email: any;
    contact_receive_notification: any;
    contact_auth_key: string;
    contact_password_hash: string;
    contact_password_reset_token: string;
    contact_created_datetime: string;
    contact_updated_datetime: string;
    contactEmails: contactEmail[];
    contactPhones: contactPhone[];
    notes: Note[];
    contactStats: any;
    requests: Request[];
}

export class contactEmail {
    email_uuid: string;
    contact_uuid: string;
    email_address: string;
    email_created_datetime: string;
    email_updated_datetime: string;
}

export class contactPhone {
    phone_uuid: string;
    contact_uuid: string;
    phone_number: string;
    phone_created_datetime: string;
    phone_updated_datetime: string;
}

