import { Suspense } from "react";
import AppLayout from "@/components/layout/AppLayoutServer";
import AntibriberyClientView from "@/components/antibribery/AntibriberyClientView";
import type { BriberyRisk, GiftReport } from "@/components/antibribery/AntibriberyClientView";
import { supabase } from "@/lib/supabase";

function ContentSpinner() {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "calc(100vh - 56px)" }}>
      <div className="w-7 h-7 border-2 border-[#3B5BDB] border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

async function AntibriberyContent() {
  let riskList: BriberyRisk[] = [];
  let giftList: GiftReport[] = [];
  try {
    const [{ data: risks }, { data: gifts }] = await Promise.all([
      supabase.from("bribery_risks")
        .select("id, risk_number, category, title, description, likelihood, impact, risk_score, risk_level, control_measure, owner_name, status")
        .order("created_at", { ascending: false }),
      supabase.from("gift_reports")
        .select("id, report_number, report_date, reporter_name, gift_type, provider, amount, description, action")
        .order("report_date", { ascending: false }),
    ]);
    riskList = (risks ?? []) as BriberyRisk[];
    giftList = (gifts ?? []) as GiftReport[];
  } catch {
    riskList = [];
    giftList = [];
  }
  return <AntibriberyClientView riskList={riskList} giftList={giftList} />;
}

export default function AntibriberyPage() {
  return (
    <AppLayout>
      <Suspense fallback={<ContentSpinner />}>
        <AntibriberyContent />
      </Suspense>
    </AppLayout>
  );
}
