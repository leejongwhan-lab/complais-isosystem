import { supabase } from "@/lib/supabase";
import { getCompany } from "@/lib/company";
import type { Company } from "@/lib/company";
import { FormTemplate } from "@/types/form";
import FormsClientView from "@/components/forms/FormsClientView";
import AppLayout from "@/components/layout/AppLayoutServer";

const CATEGORY_ORDER = [
  "경영관리", "고객영업", "구매공급자", "생산관리",
  "품질관리", "인사교육", "환경안전", "신제품개발",
  "식품안전", "사업연속성", "의료기기", "AI경영", "원자력품질", "화장품GMP",
];

function getEnabledStandards(company: Company | null): string[] {
  // iso9001 은 필수 표준 — 항상 포함
  const enabled = ["전체", "common", "iso9001"];
  if (!company) {
    return [
      "전체", "common",
      "iso9001", "iso14001", "iso45001", "iso50001",
      "iso37001", "iso37301", "iso27001",
      "iso22000", "iso22301", "iso13485", "iso42001", "iso19443",
      "iso22716", "iatf16949",
    ];
  }
  if (company.std_iso14001) enabled.push("iso14001");
  if (company.std_iso45001) enabled.push("iso45001");
  if (company.std_iso50001) enabled.push("iso50001");
  if (company.std_iso37001) enabled.push("iso37001");
  if (company.std_iso37301) enabled.push("iso37301");
  if (company.std_iso27001) enabled.push("iso27001");
  if (company.std_iso22000) enabled.push("iso22000");
  if (company.std_iso22301) enabled.push("iso22301");
  if (company.std_iso13485) enabled.push("iso13485");
  if (company.std_iso42001) enabled.push("iso42001");
  if (company.std_iso19443) enabled.push("iso19443");
  if (company.std_iso22716) enabled.push("iso22716");
  if (company.std_iatf)     enabled.push("iatf16949");
  return enabled;
}

export default async function FormsPage() {
  const [formsResult, company] = await Promise.all([
    supabase.from("form_templates").select("*").order("sort_order"),
    getCompany(),
  ]);

  console.log("[forms/page] forms count:", formsResult.data?.length, "error:", formsResult.error);
  console.log("[forms/page] company:", company);

  const templates: FormTemplate[] = (formsResult.data ?? []) as FormTemplate[];

  const catMap = new Map<string, number>();
  for (const t of templates) {
    catMap.set(t.category, (catMap.get(t.category) ?? 0) + 1);
  }
  const categories = CATEGORY_ORDER
    .filter(c => catMap.has(c))
    .map(c => ({ name: c, count: catMap.get(c)! }));

  const enabledStandards = getEnabledStandards(company);
  console.log("[forms/page] enabledStandards:", enabledStandards);

  return (
    <AppLayout>
      <FormsClientView
        templates={templates}
        categories={categories}
        enabledStandards={enabledStandards}
      />
    </AppLayout>
  );
}
