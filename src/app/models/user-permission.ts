export interface UserPermission {
  permission_user_uuid: string;
  admin_id: number;
  staff_id: number;
  permission_sub_section_uuid: string;
  created_at: string;
  companies: number[];
  sub_section_name: string;
  sub_section_slug: string;
  permission_uuid: string;
  section_name: string;
  is_company_specific_permission: number;
}
