import { Suspense } from "react";
import AppLayout from "@/components/layout/AppLayoutServer";
import EnergyClientView from "@/components/energy/EnergyClientView";
import type { EnergyRecord } from "@/components/energy/EnergyClientView";
import { supabase } from "@/lib/supabase";

function ContentSpinner() {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "calc(100vh - 56px)" }}>
      <div className="w-7 h-7 border-2 border-[#3B5BDB] border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

async function EnergyContent() {
  let records: EnergyRecord[] = [];
  try {
    const { data } = await supabase
      .from("energy_records")
      .select("id, record_month, energy_type, amount, unit, cost, memo")
      .order("record_month", { ascending: false })
      .limit(60);
    records = (data ?? []) as EnergyRecord[];
  } catch {
    records = [];
  }
  return <EnergyClientView records={records} />;
}

export default function EnergyPage() {
  return (
    <AppLayout>
      <Suspense fallback={<ContentSpinner />}>
        <EnergyContent />
      </Suspense>
    </AppLayout>
  );
}
