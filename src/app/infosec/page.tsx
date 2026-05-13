import { Suspense } from "react";
import AppLayout from "@/components/layout/AppLayoutServer";
import InfosecClientView from "@/components/infosec/InfosecClientView";
import type { InfoAsset } from "@/components/infosec/InfosecClientView";
import { supabase } from "@/lib/supabase";

function ContentSpinner() {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "calc(100vh - 56px)" }}>
      <div className="w-7 h-7 border-2 border-[#3B5BDB] border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

async function InfosecContent() {
  let assets: InfoAsset[] = [];
  try {
    const { data } = await supabase
      .from("information_assets")
      .select("id, asset_number, asset_name, asset_type, location, owner_name, classification, likelihood, impact, risk_score, control_measure, status")
      .order("created_at", { ascending: false });
    assets = (data ?? []) as InfoAsset[];
  } catch {
    assets = [];
  }
  return <InfosecClientView assets={assets} />;
}

export default function InfosecPage() {
  return (
    <AppLayout>
      <Suspense fallback={<ContentSpinner />}>
        <InfosecContent />
      </Suspense>
    </AppLayout>
  );
}
