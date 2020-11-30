import { Area } from './area';
import { Country } from './country';

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
    fulltimer_created_datetime: string;
    fulltimer_updated_datetime: string;
    fulltimerTags: FulltimerTag[];
    area: Area;
    country: Country;
    nationality: Country;
}