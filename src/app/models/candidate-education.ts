import { Degree } from "./degree";
import { Major } from "./major";
import { University } from "./university";

export class CandidateEducation {
    education_uuid: string;
    candidate_id: number;
    university_id: number;
    degree_uuid: string; 
    major_uuid: string;
    graduation_year: number;
    is_currently_studying: boolean;
    created_at: string;
    updated_at: string;
    major: Major;
    degree: Degree;
    university: University;
}