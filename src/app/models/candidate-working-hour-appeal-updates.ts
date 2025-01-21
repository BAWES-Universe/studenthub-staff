import { Staff } from "./staff";

export class CandidateWorkingHourAppealUpdates {
    appeal_update_uuid: string;
    appeal_uuid: string;
    update: string;
    detail: string;
    created_at: string;
    updated_at: string;
    created_by: string;
    updated_by: string;
    createdBy: Staff;
    updatedBy: Staff;
}