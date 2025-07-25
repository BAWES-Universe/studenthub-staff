export interface Permission {
  id: string;
  action: string;
  section: string;
  companyIds?: number[];
}
