import { Suspense } from "react";
import AppLayout from "@/components/layout/AppLayoutServer";
import TrainingClientView from "@/components/trainings/TrainingClientView";
import { supabase } from "@/lib/supabase";
import type { Training } from "@/types/training";

function ContentSpinner() {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "calc(100vh - 56px)" }}>
      <div className="w-7 h-7 border-2 border-[#3B5BDB] border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

async function TrainingsContent() {
  const { data, error } = await supabase
    .from("trainings")
    .select("*")
    .order("planned_date", { ascending: false });

  console.log('trainings data:', data);
  console.log('trainings error:', error);

  if (error) {
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 6, height: "calc(100vh - 56px)" }}>
        <p style={{ fontSize: 13, fontWeight: 600, color: "#E03131" }}>데이터 로드 실패</p>
        <p style={{ fontSize: 12, color: "#999" }}>{error.message}</p>
      </div>
    );
  }

  return <TrainingClientView trainings={(data ?? []) as Training[]} />;
}

export default function TrainingsPage() {
  return (
    <AppLayout>
      <Suspense fallback={<ContentSpinner />}>
        <TrainingsContent />
      </Suspense>
    </AppLayout>
  );
}
