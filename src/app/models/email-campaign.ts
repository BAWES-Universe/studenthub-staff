import { EmailCampaignFilter } from "./email-campaign-filter";

export class EmailCampaign {
    campaign_uuid: string; 
    subject: string; 
    message: string; 
    progress: number; 
    trigger_date_time: string;
    last_trigger_date_time: string;
    is_recurring: boolean;
    trigger_period: number;
    target: number;

    status: number;
    created_at: string; 
    updated_at: string; 
    emailCampaignFilters: EmailCampaignFilter[];
}