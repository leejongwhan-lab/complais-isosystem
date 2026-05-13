import { notFound } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { FormTemplate } from "@/types/form";
import FormNewClient from "@/components/forms/FormNewClient";
import AppLayout from "@/components/layout/AppLayout";

interface Props {
  params: Promise<{ form_code: string }>;
}

export default async function FormNewPage({ params }: Props) {
  const { form_code } = await params;

  const { data } = await supabase
    .from("form_templates")
    .select("*")
    .eq("form_code", form_code)
    .single();

  if (!data) notFound();

  return (
    <AppLayout>
      <FormNewClient template={data as FormTemplate} />
    </AppLayout>
  );
}
