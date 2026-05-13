import { Suspense } from "react";
import { notFound } from "next/navigation";
import AppLayout from "@/components/layout/AppLayoutServer";
import AuditDetailClient from "@/components/audit/AuditDetailClient";
import { supabase } from "@/lib/supabase";
import type { Audit } from "@/types/audit";

function ContentSpinner() {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "calc(100vh - 56px)" }}>
      <div className="w-7 h-7 border-2 border-[#3B5BDB] border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

async function AuditDetailContent({ id }: { id: string }) {
  const { data, error } = await supabase
    .from("audits")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) notFound();

  return <AuditDetailClient audit={data as Audit} />;
}

export default async function AuditDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <AppLayout>
      <Suspense fallback={<ContentSpinner />}>
        <AuditDetailContent id={id} />
      </Suspense>
    </AppLayout>
  );
}
