export interface PermissionSubSection {
  permission_sub_section_uuid: string;
  sub_section_name: string;
  sub_section_slug: string;
  permission_uuid: string;
  created_at: string;
}

export interface Permission {
  permission_uuid: string;
  section_name: string;
  created_at: string;
  companies: number[] | null;
  is_company_specific_permission: number;
  subSections: PermissionSubSection[];
}
