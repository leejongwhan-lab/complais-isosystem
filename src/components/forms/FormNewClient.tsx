"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FormTemplate, FormData } from "@/types/form";
import FormEngine from "./FormEngine";
import { supabase } from "@/lib/supabase";

interface FormNewClientProps {
  template: FormTemplate;
}

function todayStr() {
  return new Date().toISOString().slice(0, 10).replace(/-/g, "");
}

async function genRecordNumber(formCode: string): Promise<string> {
  const prefix = `FR-${formCode}-${todayStr()}`;
  const { count } = await supabase
    .from("form_records")
    .select("*", { count: "exact", head: true })
    .like("record_number", `${prefix}%`);
  const seq = String((count ?? 0) + 1).padStart(3, "0");
  return `${prefix}-${seq}`;
}

export default function FormNewClient({ template }: FormNewClientProps) {
  const router = useRouter();
  const [companyId, setCompanyId] = useState("");

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) return;
      const { data: profile } = await supabase.from("profiles").select("company_id").eq("id", user.id).single();
      if (profile?.company_id) setCompanyId(profile.company_id as string);
    });
  }, []);

  async function handleSave(data: FormData, status: "draft" | "completed") {
    const record_number = await genRecordNumber(template.form_code);
    const { error } = await supabase.from("form_records").insert({
      record_number,
      form_code: template.form_code,
      form_name: template.form_name,
      category: template.category,
      data,
      status,
      created_by: "품질관리자",
    });
    if (!error) {
      router.push(`/forms/${template.form_code}/records`);
    }
  }

  return (
    <div style={{ padding: 24 }}>
      <div style={{ marginBottom: 20 }}>
        <p style={{ margin: 0, fontSize: 12, color: "#bbb" }}>서식 작성</p>
        <h1 style={{ margin: "4px 0 0", fontSize: 18, fontWeight: 700, color: "#1a1a1a" }}>
          {template.form_name}
        </h1>
      </div>
      <FormEngine template={template} onSave={handleSave} companyId={companyId} />
    </div>
  );
}
