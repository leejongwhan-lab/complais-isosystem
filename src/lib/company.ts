import { cookies } from "next/headers";
import { supabase } from "./supabase";
import { createSupabaseServerClient } from "./supabase-server";

export type Company = {
  id: string;
  company_name: string;
  company_code: string | null;
  business_type: string | null;
  management_rep: string | null;
  std_iso9001:  boolean;
  std_iso14001: boolean;
  std_iso45001: boolean;
  std_iatf:     boolean;
  std_iso13485: boolean;
  std_iso50001: boolean;
  std_iso37001: boolean;
  std_iso37301: boolean;
  std_iso27001: boolean;
  std_iso22000: boolean;
  std_iso22301: boolean;
  std_iso42001: boolean;
  std_iso19443: boolean;
  std_iso22716: boolean;
  plan: string;
  // complais 2 호환 필드
  name_en:            string | null;
  biz_no:             string | null;
  corp_no:            string | null;
  ceo_name:           string | null;
  address:            string | null;
  address_en:         string | null;
  tel:                string | null;
  website:            string | null;
  iaf_code:           string | null;
  ksic_code:          string | null;
  scope_kr:           string | null;
  scope_en:           string | null;
  employee_count_hq:  number | null;
  employee_count_out: number | null;
  employee_full:      number | null;
  employee_part:      number | null;
  email:              string | null;
};

export async function getCompany(): Promise<Company | null> {
  const cookieStore = await cookies();
  let companyId = cookieStore.get("company_id")?.value;

  if (!companyId) {
    const authSupabase = await createSupabaseServerClient();
    const { data: { user } } = await authSupabase.auth.getUser();
    if (!user) return null;

    const { data: profile } = await authSupabase
      .from("profiles")
      .select("company_id")
      .eq("id", user.id)
      .single();

    companyId = (profile as { company_id?: string | null } | null)?.company_id ?? undefined;
  }

  if (!companyId) return null;

  const { data } = await supabase
    .from("companies")
    .select(
      "id, company_name, company_code, business_type, management_rep, " +
      "std_iso9001, std_iso14001, std_iso45001, std_iatf, std_iso13485, " +
      "std_iso50001, std_iso37001, std_iso37301, std_iso27001, " +
      "std_iso22000, std_iso22301, std_iso42001, std_iso19443, std_iso22716, plan, " +
      "name_en, biz_no, corp_no, ceo_name, address, address_en, tel, website, " +
      "iaf_code, ksic_code, scope_kr, scope_en, " +
      "employee_count_hq, employee_count_out, employee_full, employee_part, email"
    )
    .eq("id", companyId)
    .single();

  return (data as Company | null) ?? null;
}
