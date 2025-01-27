import { Area } from "./area";
import { JobInterest } from "./job-interest";
import JobSkills from "./job-skills";
import { Request, Story } from "./request";
import { Staff } from "./staff";

export class Job {
    job_uuid: string;
    story_uuid: string;
    request_uuid: string;
    area_uuid: string;
    position: string;
    position_ar: string;
    description: string;
    description_ar: string;
    hours_per_day: number;
    days_per_week: number;
    compensation_type: string;
    compensation_amount: number;
    compensation_description: string;
    compensation_description_ar: string;
    min_age: number;
    max_age: number;
    gender: number; //MALE = 1, FEMALE = 2, OTHER = 3
    available_from: string;
    available_to: string;
    status: number;// 0 -DRAFT | 1 - ACTIVE | 2- CLOSED
    created_at: string;
    updated_at: string;
    deleted_at: string;
    created_by: number;
    updated_by: number;
    deleted_by: number;
    is_available: boolean
    area: Area;
    createdBy: Staff;
    updatedBy: Staff;
    deletedBy: Staff;
    request: Request;
    story: Story;
    jobInterests: JobInterest[];
    jobSkills: JobSkills[];
}