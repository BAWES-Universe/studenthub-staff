import { Candidate, CandidateWorkingHour } from "./candidate";

export class CandidateWorkingHourAppeal {
  appeal_uuid: string;
  candidate_id: number;
  candidate_working_hour_uuid: string;
  candidate: Candidate;
  reason: string;
  status: number;
  correntHours: CandidateWorkingHour[];
  originalHour: CandidateWorkingHour;
  created_at: string;
  updated_at: string;
}