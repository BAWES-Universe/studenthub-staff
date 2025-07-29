export interface Permission {
  id: string;
  sub_section_name: string;
  section_name: string;
  companyIds?: number[];
  is_company_specific_permission?: number;
}
