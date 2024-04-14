import {Story, StoryActivity} from './request';

export class Staff {
    staff_id: number;
    staff_name: string;
    staff_email: string;
    staff_photo: string;
    staff_notification: boolean | number;
    staff_job_title: string;
    staff_status: number;
    hours_per_day: number;
    staff_created_at: string;
    staff_updated_at: string;
    total_assigned: number | string;
    total_notes: number | string;
    total_requests: number | string;
    valocity: number;
    totalAssigned: number;
    totalInvitations: number;
    totalStoryEmployees: number;
    activeStory: Story[];
    totalCompletedStories: number;
    storyActivities: StoryActivity[];
    groupStoryActivities: StoryActivity[];
}

