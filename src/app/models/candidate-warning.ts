import { Staff } from "./staff";

export class CandidateWarning {
    warning_id: number;
    candidate_id: number;
    title: string;
    message: string;
    created_by: number;
    updated_by: number;
    created_at: string;
    updated_at: string;
    createdBy: Staff;
    updatedBy: Staff;
}