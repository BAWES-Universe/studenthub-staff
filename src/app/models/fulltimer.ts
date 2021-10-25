import { Area } from './area';
import { Country } from './country';
import { Note } from './note';

export class FulltimerTag {
    fulltimer_tags_id: number;
    fulltimer_uuid: string;
    tag: string;
}

export class Fulltimer {
    fulltimer_uuid : string;
    nationality_id : number;
    country_id: number;
    fulltimer_area_uuid: string;
    fulltimer_latitude: number;
    fulltimer_longitude: number;
    fulltimer_name: string;
    fulltimer_phone: any;
    fulltimer_email: string;
    fulltimer_pdf_cv: string;
    university_id: number;
    fulltimer_employed: number;
    fulltimer_gender: number;
    fulltimer_driving_license: number;
    fulltimer_birth_date: string;
    fulltimer_current_salary: string;
    fulltimer_expected_salary: string;
    fulltimer_created_datetime: string;
    fulltimer_updated_datetime: string;
    rejectionRatio: any;
    acceptanceRatio: any;
    suggested: number;
    suggestionAccepted: number;
    suggestionRejected: number;
    fulltimerTags: FulltimerTag[];
    area: Area;
    country: Country;
    nationality: Country;
    notes: Note[];
}
