import { notFound } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { FormTemplate, FormRecord } from "@/types/form";
import FormRecordClient from "@/components/forms/FormRecordClient";
import AppLayout from "@/components/layout/AppLayoutServer";

interface Props {
  params: Promise<{ form_code: string; id: string }>;
}

export default async function FormRecordDetailPage({ params }: Props) {
  const { form_code, id } = await params;

  const [{ data: tmpl }, { data: rec }] = await Promise.all([
    supabase.from("form_templates").select("*").eq("form_code", form_code).single(),
    supabase.from("form_records").select("*").eq("id", id).single(),
  ]);

  if (!tmpl || !rec) notFound();

  return (
    <AppLayout>
      <FormRecordClient
        template={tmpl as FormTemplate}
        record={rec as FormRecord}
      />
    </AppLayout>
  );
}
