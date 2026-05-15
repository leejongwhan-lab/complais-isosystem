"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { CalendarDays, FileText, Plus } from "lucide-react";

type FormTemplate = {
  id: string;
  form_code: string;
  title: string;
  description: string | null;
  category: string | null;
  related_iso: string | null;
  frequency: string | null;
};

type PeriodTab = "weekly" | "monthly";

const ISO_COLORS: Record<string, { color: string; bg: string }> = {
  "9001":  { color: "#3B5BDB", bg: "#EEF2FF" },
  "14001": { color: "#2F9E44", bg: "#EBFBEE" },
  "45001": { color: "#E67700", bg: "#FFF9DB" },
};

export default function PeriodicRecordsClient() {
  const [tab, setTab] = useState<PeriodTab>("weekly");
  const [forms, setForms] = useState<Record<PeriodTab, FormTemplate[]>>({ weekly: [], monthly: [] });
  const [loading, setLoading] = useState(true);

  const now = new Date();
  const thisWeekStart = new Date(now);
  thisWeekStart.setDate(now.getDate() - now.getDay());
  const thisMonthStart = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-01`;
  const thisWeekStartStr = thisWeekStart.toISOString().slice(0, 10);

  useEffect(() => {
    async function load() {
      const [weekRes, monthRes] = await Promise.all([
        supabase
          .from("form_templates")
          .select("id, form_code, title, description, category, related_iso, frequency")
          .eq("frequency", "weekly")
          .order("form_code"),
        supabase
          .from("form_templates")
          .select("id, form_code, title, description, category, related_iso, frequency")
          .eq("frequency", "monthly")
          .order("form_code"),
      ]);
      setForms({
        weekly:  (weekRes.data ?? [])  as FormTemplate[],
        monthly: (monthRes.data ?? []) as FormTemplate[],
      });
      setLoading(false);
    }
    load();
  }, []);

  const periodLabel = tab === "weekly"
    ? `이번 주 (${thisWeekStartStr} ~)`
    : `이번 달 (${thisMonthStart} ~)`;

  const currentForms = forms[tab];

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "calc(100vh - 52px)" }}>
      <div style={{
        display: "flex", gap: 0, borderBottom: "1px solid #E5E5E5",
        background: "#fff", padding: "0 24px", flexShrink: 0,
        alignItems: "center", justifyContent: "space-between",
      }}>
        <div style={{ display: "flex" }}>
          {([
            { key: "weekly" as PeriodTab,  label: "주간" },
            { key: "monthly" as PeriodTab, label: "월간" },
          ]).map(t => (
            <button key={t.key} onClick={() => setTab(t.key)} style={{
              padding: "12px 20px", fontSize: 13, fontWeight: tab === t.key ? 600 : 400,
              color: tab === t.key ? "#3B5BDB" : "#888",
              background: "transparent", border: "none",
              borderBottom: tab === t.key ? "2px solid #3B5BDB" : "2px solid transparent",
              cursor: "pointer", marginBottom: -1,
            }}>
              {t.label}
            </button>
          ))}
        </div>
        <span style={{ fontSize: 12, color: "#aaa", marginRight: 4 }}>{periodLabel}</span>
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: "20px 24px" }}>
        <div style={{ marginBottom: 20 }}>
          <h2 style={{ margin: "0 0 3px", fontSize: 16, fontWeight: 700, color: "#1a1a1a" }}>생산·물류 기록</h2>
          <p style={{ margin: 0, fontSize: 12, color: "#999" }}>
            {tab === "weekly" ? "주간" : "월간"} 정기 작성 서식 모음
          </p>
        </div>

        {loading ? (
          <div style={{ textAlign: "center", padding: "60px 0", color: "#bbb", fontSize: 13 }}>로딩 중...</div>
        ) : currentForms.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 0" }}>
            <CalendarDays size={40} color="#ddd" />
            <p style={{ marginTop: 12, color: "#bbb", fontSize: 13 }}>
              등록된 {tab === "weekly" ? "주간" : "월간"} 서식이 없습니다.<br />
              데이터베이스에서 frequency=&apos;{tab === "weekly" ? "weekly" : "monthly"}&apos; 값을 설정하세요.
            </p>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
            {currentForms.map(form => {
              const isoKey = form.related_iso?.replace("ISO ", "") ?? "";
              const isoColor = ISO_COLORS[isoKey] ?? { color: "#999", bg: "#F5F5F5" };
              return (
                <div key={form.id} style={{
                  border: "1px solid #E5E5E5", borderRadius: 10, padding: "16px",
                  background: "#fff", display: "flex", flexDirection: "column", gap: 10,
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <span style={{ fontSize: 10, fontWeight: 700, fontFamily: "monospace", color: "#555", background: "#F5F5F5", padding: "2px 6px", borderRadius: 3 }}>
                      {form.form_code}
                    </span>
                    {form.related_iso && (
                      <span style={{ fontSize: 10, fontWeight: 600, color: isoColor.color, background: isoColor.bg, padding: "2px 6px", borderRadius: 3 }}>
                        {form.related_iso}
                      </span>
                    )}
                    <span style={{ fontSize: 10, fontWeight: 600, color: "#3B5BDB", background: "#EEF2FF", padding: "2px 6px", borderRadius: 3, marginLeft: "auto" }}>
                      {tab === "weekly" ? "주간" : "월간"}
                    </span>
                  </div>

                  <div>
                    <p style={{ margin: 0, fontSize: 14, fontWeight: 600, color: "#1a1a1a" }}>{form.title}</p>
                    {form.description && (
                      <p style={{ margin: "3px 0 0", fontSize: 11, color: "#888" }}>{form.description}</p>
                    )}
                  </div>

                  <div style={{ display: "flex", gap: 6, marginTop: "auto" }}>
                    <Link href={`/forms/${form.form_code}/new`} style={{
                      flex: 1, padding: "7px", borderRadius: 6, fontSize: 12, fontWeight: 600,
                      textAlign: "center", textDecoration: "none", background: "#3B5BDB", color: "#fff",
                      display: "flex", alignItems: "center", justifyContent: "center", gap: 4,
                    }}>
                      <Plus size={12} />작성하기
                    </Link>
                    <Link href={`/forms/${form.form_code}`} style={{
                      flex: 1, padding: "7px", borderRadius: 6, fontSize: 12, fontWeight: 500,
                      textAlign: "center", textDecoration: "none", border: "1px solid #E5E5E5", color: "#555", background: "#fff",
                      display: "flex", alignItems: "center", justifyContent: "center", gap: 4,
                    }}>
                      <FileText size={12} />기록 보기
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
