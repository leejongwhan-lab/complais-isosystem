"use client";

import { useState, useEffect } from "react";
import AppLayout from "@/components/layout/AppLayoutServer";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { ClipboardCheck, FileText, Plus } from "lucide-react";

type FormTemplate = {
  id: string;
  form_code: string;
  title: string;
  description: string | null;
  category: string | null;
  related_iso: string | null;
  frequency: string | null;
};

type TodayStat = { form_code: string; count: number };

function DailyRecordsClient() {
  const [forms, setForms] = useState<FormTemplate[]>([]);
  const [stats, setStats] = useState<TodayStat[]>([]);
  const [loading, setLoading] = useState(true);

  const today = new Date().toISOString().slice(0, 10);

  useEffect(() => {
    async function load() {
      const [formsRes, statsRes] = await Promise.all([
        supabase
          .from("form_templates")
          .select("id, form_code, title, description, category, related_iso, frequency")
          .eq("frequency", "daily")
          .order("form_code"),
        supabase
          .from("form_records")
          .select("form_code")
          .gte("created_at", `${today}T00:00:00`)
          .lt("created_at", `${today}T23:59:59`),
      ]);

      setForms((formsRes.data ?? []) as FormTemplate[]);

      const countMap: Record<string, number> = {};
      for (const r of (statsRes.data ?? []) as { form_code: string }[]) {
        countMap[r.form_code] = (countMap[r.form_code] ?? 0) + 1;
      }
      setStats(Object.entries(countMap).map(([form_code, count]) => ({ form_code, count })));
      setLoading(false);
    }
    load();
  }, [today]);

  function getTodayCount(formCode: string): number {
    return stats.find(s => s.form_code === formCode)?.count ?? 0;
  }

  const ISO_COLORS: Record<string, { color: string; bg: string }> = {
    "9001":  { color: "#3B5BDB", bg: "#EEF2FF" },
    "14001": { color: "#2F9E44", bg: "#EBFBEE" },
    "45001": { color: "#E67700", bg: "#FFF9DB" },
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "calc(100vh - 52px)" }}>
      {/* 헤더 */}
      <div style={{
        padding: "16px 24px 12px", borderBottom: "1px solid #E5E5E5",
        background: "#fff", flexShrink: 0,
      }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <h2 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: "#1a1a1a" }}>공정·현장 기록</h2>
            <p style={{ margin: "3px 0 0", fontSize: 12, color: "#999" }}>
              매일 작성하는 현장 기록 서식 모음 · {today}
            </p>
          </div>
          <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
            <span style={{ fontSize: 12, color: "#888" }}>
              오늘 작성:{" "}
              <strong style={{ color: "#3B5BDB" }}>
                {stats.reduce((sum, s) => sum + s.count, 0)}건
              </strong>
            </span>
          </div>
        </div>
      </div>

      {/* 콘텐츠 */}
      <div style={{ flex: 1, overflowY: "auto", padding: "20px 24px" }}>
        {loading ? (
          <div style={{ textAlign: "center", padding: "60px 0", color: "#bbb", fontSize: 13 }}>
            로딩 중...
          </div>
        ) : forms.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 0" }}>
            <ClipboardCheck size={40} color="#ddd" />
            <p style={{ marginTop: 12, color: "#bbb", fontSize: 13 }}>
              등록된 일간 서식이 없습니다.
            </p>
            <p style={{ color: "#bbb", fontSize: 12 }}>
              서식 라이브러리에서 frequency=daily 서식을 추가하거나,
              <br />데이터베이스에서 frequency 값을 설정하세요.
            </p>
          </div>
        ) : (
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 16,
          }}>
            {forms.map(form => {
              const todayCount = getTodayCount(form.form_code);
              const hasTodayRecord = todayCount > 0;
              const isoKey = form.related_iso?.replace("ISO ", "") ?? "";
              const isoColor = ISO_COLORS[isoKey] ?? { color: "#999", bg: "#F5F5F5" };

              return (
                <div key={form.id} style={{
                  border: `1px solid ${hasTodayRecord ? "#B2F2BB" : "#E5E5E5"}`,
                  borderRadius: 10, padding: "16px",
                  background: hasTodayRecord ? "#F0FBF4" : "#fff",
                  display: "flex", flexDirection: "column", gap: 10,
                }}>
                  {/* 서식 코드 + ISO 뱃지 */}
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <span style={{
                      fontSize: 10, fontWeight: 700, fontFamily: "monospace",
                      color: "#555", background: "#F5F5F5",
                      padding: "2px 6px", borderRadius: 3,
                    }}>
                      {form.form_code}
                    </span>
                    {form.related_iso && (
                      <span style={{
                        fontSize: 10, fontWeight: 600,
                        color: isoColor.color, background: isoColor.bg,
                        padding: "2px 6px", borderRadius: 3,
                      }}>
                        {form.related_iso}
                      </span>
                    )}
                  </div>

                  {/* 서식명 */}
                  <div>
                    <p style={{ margin: 0, fontSize: 14, fontWeight: 600, color: "#1a1a1a" }}>
                      {form.title}
                    </p>
                    {form.description && (
                      <p style={{ margin: "3px 0 0", fontSize: 11, color: "#888" }}>
                        {form.description}
                      </p>
                    )}
                  </div>

                  {/* 오늘 현황 */}
                  <div style={{
                    padding: "6px 10px", borderRadius: 6,
                    background: hasTodayRecord ? "#EBFBEE" : "#FFF9DB",
                    display: "flex", alignItems: "center", gap: 6,
                  }}>
                    <ClipboardCheck size={12} color={hasTodayRecord ? "#2F9E44" : "#E67700"} />
                    <span style={{ fontSize: 11, fontWeight: 600, color: hasTodayRecord ? "#2F9E44" : "#E67700" }}>
                      {hasTodayRecord ? `오늘 ${todayCount}건 작성됨` : "오늘 미작성"}
                    </span>
                  </div>

                  {/* 버튼 */}
                  <div style={{ display: "flex", gap: 6 }}>
                    <Link
                      href={`/forms/${form.form_code}/new`}
                      style={{
                        flex: 1, padding: "7px", borderRadius: 6, fontSize: 12,
                        fontWeight: 600, textAlign: "center", textDecoration: "none",
                        background: "#3B5BDB", color: "#fff",
                        display: "flex", alignItems: "center", justifyContent: "center", gap: 4,
                      }}
                    >
                      <Plus size={12} />
                      작성하기
                    </Link>
                    <Link
                      href={`/forms/${form.form_code}`}
                      style={{
                        flex: 1, padding: "7px", borderRadius: 6, fontSize: 12,
                        fontWeight: 500, textAlign: "center", textDecoration: "none",
                        border: "1px solid #E5E5E5", color: "#555", background: "#fff",
                        display: "flex", alignItems: "center", justifyContent: "center", gap: 4,
                      }}
                    >
                      <FileText size={12} />
                      기록 보기
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

export default function DailyRecordsPage() {
  return (
    <AppLayout>
      <DailyRecordsClient />
    </AppLayout>
  );
}
