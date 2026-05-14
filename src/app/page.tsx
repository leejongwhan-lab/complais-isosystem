import { Suspense } from "react";
import Link from "next/link";
import AppLayout from "@/components/layout/AppLayoutServer";
import { supabase } from "@/lib/supabase";
import { getCompany } from "@/lib/company";
import { getUserProfile } from "@/lib/supabase-server";
import { canWrite } from "@/lib/permissions";

const STD_BADGES = [
  { key: "std_iso9001", label: "ISO 9001", color: "#3B5BDB", bg: "#EEF2FF" },
  { key: "std_iso14001", label: "ISO 14001", color: "#2F9E44", bg: "#EBFBEE" },
  { key: "std_iso45001", label: "ISO 45001", color: "#E67700", bg: "#FFF9DB" },
  { key: "std_iso50001", label: "ISO 50001", color: "#E67700", bg: "#FFF9DB" },
  { key: "std_iso27001", label: "ISO 27001", color: "#7048E8", bg: "#F3F0FF" },
  { key: "std_iso22000", label: "ISO 22000", color: "#2F9E44", bg: "#EBFBEE" },
  { key: "std_iso22301", label: "ISO 22301", color: "#3B5BDB", bg: "#EEF2FF" },
] as const;

type TodoItem = {
  label: string;
  count: number;
  href: string;
  tone: "neutral" | "warn" | "danger";
  help: string;
};

function ContentSpinner() {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "calc(100vh - 56px)" }}>
      <div className="w-8 h-8 border-2 border-[#3B5BDB] border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

function toneColor(tone: TodoItem["tone"]) {
  if (tone === "danger") return { color: "#E03131", bg: "#FFF0F0", border: "#FFD8D8" };
  if (tone === "warn") return { color: "#E67700", bg: "#FFF9DB", border: "#FFE8A1" };
  return { color: "#3B5BDB", bg: "#F5F8FF", border: "#D0D7FF" };
}

function formatDate(value: string | null) {
  if (!value) return "미정";
  return value.slice(0, 10);
}

async function DashboardContent() {
  const today = new Date();
  const todayIso = today.toISOString().slice(0, 10);

  const sixMonthsAgo = new Date(today);
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
  sixMonthsAgo.setDate(1);
  const sixMonthsAgoIso = sixMonthsAgo.toISOString().slice(0, 10);

  const [company, profile, docsRes, capaRes, auditRes, trainingRes, riskRes, capaTrendRes] = await Promise.all([
    getCompany(),
    getUserProfile(),
    supabase
      .from("documents")
      .select("id, title, status, updated_at", { count: "exact" })
      .order("updated_at", { ascending: false })
      .limit(8),
    supabase
      .from("capas")
      .select("id, capa_number, title, status, due_date", { count: "exact" })
      .neq("status", "completed")
      .order("due_date", { ascending: true })
      .limit(6),
    supabase
      .from("audits")
      .select("id, audit_number, audit_type, status, planned_date", { count: "exact" })
      .in("status", ["planned", "in_progress"])
      .order("planned_date", { ascending: true })
      .limit(6),
    supabase
      .from("trainings")
      .select("id, title, status, planned_date, total_count, completed_count", { count: "exact" })
      .neq("status", "completed")
      .order("planned_date", { ascending: true })
      .limit(6),
    supabase
      .from("risks")
      .select("id, title, owner_name, next_review_date")
      .lte("next_review_date", todayIso)
      .order("next_review_date", { ascending: true })
      .limit(6),
    supabase
      .from("capas")
      .select("id, created_at, closed_at")
      .gte("created_at", sixMonthsAgoIso),
  ]);

  const documents = (docsRes.data ?? []) as Array<{ id: string; title: string; status: string; updated_at: string }>;
  const capas = (capaRes.data ?? []) as Array<{ id: string; capa_number: string; title: string; status: string; due_date: string | null }>;
  const audits = (auditRes.data ?? []) as Array<{ id: string; audit_number: string; audit_type: string; status: string; planned_date: string | null }>;
  const trainings = (trainingRes.data ?? []) as Array<{ id: string; title: string; status: string; planned_date: string | null; total_count: number | null; completed_count: number | null }>;
  const risks = (riskRes.data ?? []) as Array<{ id: string; title: string; owner_name: string | null; next_review_date: string | null }>;

  // Build 6-month CAPA trend
  const trendMonths = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(today);
    d.setMonth(d.getMonth() - (5 - i));
    return { key: d.toISOString().slice(0, 7), label: `${d.getMonth() + 1}월`, created: 0, completed: 0 };
  });
  (capaTrendRes.data ?? []).forEach((c: { created_at: string; closed_at: string | null }) => {
    const cm = c.created_at.slice(0, 7);
    const m1 = trendMonths.find(m => m.key === cm);
    if (m1) m1.created++;
    if (c.closed_at) {
      const dm = c.closed_at.slice(0, 7);
      const m2 = trendMonths.find(m => m.key === dm);
      if (m2) m2.completed++;
    }
  });
  const trendMax = Math.max(...trendMonths.flatMap(m => [m.created, m.completed]), 1);

  const draftDocs = documents.filter((doc) => doc.status === "draft").length;
  const reviewDocs = documents.filter((doc) => doc.status === "review").length;
  const overdueCapas = capas.filter((capa) => capa.due_date && capa.due_date < todayIso).length;
  const pendingAudits = audits.filter((audit) => audit.status === "planned").length;
  const openTrainings = trainings.length;
  const reviewRisks = risks.length;
  const writeOk = canWrite(profile?.role ?? "viewer");

  const todos: TodoItem[] = [
    {
      label: "검토 필요한 문서",
      count: reviewDocs,
      href: "/documents?status=review",
      tone: reviewDocs > 0 ? "danger" : "neutral",
      help: "승인 또는 반려 판단이 필요한 문서",
    },
    {
      label: "작성 중 문서",
      count: draftDocs,
      href: "/documents?status=draft",
      tone: draftDocs > 0 ? "warn" : "neutral",
      help: "초안 상태에서 멈춘 문서",
    },
    {
      label: "미종결 CAPA",
      count: capaRes.count ?? 0,
      href: "/capa",
      tone: overdueCapas > 0 ? "danger" : (capaRes.count ?? 0) > 0 ? "warn" : "neutral",
      help: "시정조치 후속조치가 필요한 항목",
    },
    {
      label: "예정된 내부심사",
      count: pendingAudits,
      href: "/audit",
      tone: pendingAudits > 0 ? "warn" : "neutral",
      help: "계획 또는 진행 중인 심사 일정",
    },
    {
      label: "진행 중 교육",
      count: openTrainings,
      href: "/trainings",
      tone: openTrainings > 0 ? "warn" : "neutral",
      help: "완료 처리가 남은 교육",
    },
    {
      label: "재평가 필요한 리스크",
      count: reviewRisks,
      href: "/risks",
      tone: reviewRisks > 0 ? "danger" : "neutral",
      help: "재검토일이 도래한 리스크",
    },
  ];

  const activeBadges = STD_BADGES.filter((badge) => company?.[badge.key]);
  const companyName = company?.company_name ?? "경영시스템";

  return (
    <div>
      <div style={{ padding: "20px 24px", borderBottom: "1px solid #F0F0F0", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
        <div>
          <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: "#1a1a1a" }}>{companyName} 이번 주 운영 현황</h2>
          <p style={{ margin: "4px 0 0", fontSize: 12, color: "#777" }}>
            문서 관리가 아니라, 지금 처리해야 할 업무를 우선 보여줍니다.
          </p>
        </div>
        {writeOk && (
          <div style={{ display: "flex", gap: 8 }}>
            <Link
              href="/documents/new"
              style={{ padding: "7px 12px", borderRadius: 8, textDecoration: "none", fontSize: 12, fontWeight: 700, color: "#fff", background: "#3B5BDB" }}
            >
              새 문서 작성
            </Link>
            <Link
              href="/forms"
              style={{ padding: "7px 12px", borderRadius: 8, textDecoration: "none", fontSize: 12, fontWeight: 700, color: "#3B5BDB", background: "#F5F8FF", border: "1px solid #D0D7FF" }}
            >
              서식 바로가기
            </Link>
          </div>
        )}
      </div>

      <div style={{ padding: "10px 24px 0", display: "flex", gap: 6, flexWrap: "wrap" }}>
        {activeBadges.map((badge) => (
          <span
            key={badge.key}
            style={{
              fontSize: 11,
              fontWeight: 700,
              padding: "4px 10px",
              borderRadius: 999,
              background: badge.bg,
              color: badge.color,
              border: `1px solid ${badge.color}22`,
            }}
          >
            {badge.label}
          </span>
        ))}
      </div>

      <div style={{ padding: 24, display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, alignItems: "stretch" }}>
        {todos.map((todo) => {
          const tone = toneColor(todo.tone);
          return (
            <Link
              key={todo.label}
              href={todo.href}
              style={{
                textDecoration: "none",
                border: `1px solid ${tone.border}`,
                borderRadius: 12,
                padding: "16px 16px 14px",
                background: tone.bg,
                display: "block",
                height: "100%",
              }}
            >
              <div style={{ display: "flex", alignItems: "start", justifyContent: "space-between", gap: 12 }}>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: tone.color }}>{todo.label}</div>
                  <div style={{ marginTop: 4, fontSize: 11, color: "#666" }}>{todo.help}</div>
                </div>
                <div style={{ fontSize: 26, fontWeight: 800, color: tone.color, lineHeight: 1 }}>{todo.count}</div>
              </div>
            </Link>
          );
        })}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 360px", gap: 20, padding: "0 24px 24px", alignItems: "start" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <section style={{ border: "1px solid #E5E5E5", borderRadius: 12, overflow: "hidden", background: "#fff", display: "flex", flexDirection: "column", minHeight: 300 }}>
            <div style={{ padding: "12px 16px", borderBottom: "1px solid #E5E5E5", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <strong style={{ fontSize: 13, color: "#1a1a1a" }}>이번 주 우선 처리</strong>
              <Link href="/capa" style={{ fontSize: 12, color: "#3B5BDB", textDecoration: "none" }}>전체 보기</Link>
            </div>
            <div style={{ flex: 1, overflowY: "auto", minHeight: 0, padding: 12, display: "flex", flexDirection: "column", gap: 10 }}>
              {capas.length === 0 && audits.length === 0 && risks.length === 0 && (
                <p style={{ margin: 0, padding: 8, fontSize: 13, color: "#777" }}>긴급하게 처리할 항목이 없습니다.</p>
              )}
              {capas.slice(0, 3).map((capa) => (
                <Link key={capa.id} href={`/capa/${capa.id}`} style={{ textDecoration: "none", border: "1px solid #F0F0F0", borderRadius: 10, padding: "12px 14px", display: "block", color: "#1a1a1a" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
                    <div>
                      <div style={{ fontFamily: "monospace", fontSize: 11, fontWeight: 700, color: "#3B5BDB" }}>{capa.capa_number}</div>
                      <div style={{ marginTop: 3, fontSize: 13, fontWeight: 600 }}>{capa.title}</div>
                    </div>
                    <span style={{ fontSize: 11, fontWeight: 700, color: capa.due_date && capa.due_date < todayIso ? "#E03131" : "#E67700" }}>
                      {formatDate(capa.due_date)}
                    </span>
                  </div>
                </Link>
              ))}
              {audits.slice(0, 2).map((audit) => (
                <Link key={audit.id} href={`/audit/${audit.id}`} style={{ textDecoration: "none", border: "1px solid #F0F0F0", borderRadius: 10, padding: "12px 14px", display: "block", color: "#1a1a1a" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
                    <div>
                      <div style={{ fontFamily: "monospace", fontSize: 11, fontWeight: 700, color: "#3B5BDB" }}>{audit.audit_number}</div>
                      <div style={{ marginTop: 3, fontSize: 13, fontWeight: 600 }}>내부심사 준비</div>
                    </div>
                    <span style={{ fontSize: 11, fontWeight: 700, color: "#E67700" }}>{formatDate(audit.planned_date)}</span>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          <section style={{ border: "1px solid #E5E5E5", borderRadius: 12, overflow: "hidden", background: "#fff", display: "flex", flexDirection: "column", minHeight: 300 }}>
            <div style={{ padding: "12px 16px", borderBottom: "1px solid #E5E5E5", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <strong style={{ fontSize: 13, color: "#1a1a1a" }}>최근 운영 문서</strong>
              <Link href="/documents" style={{ fontSize: 12, color: "#3B5BDB", textDecoration: "none" }}>문서관리</Link>
            </div>
            <div style={{ flex: 1, overflowY: "auto", minHeight: 0, padding: 12, display: "flex", flexDirection: "column", gap: 8 }}>
              {documents.length === 0 && <p style={{ margin: 0, padding: 8, fontSize: 13, color: "#777" }}>아직 등록된 문서가 없습니다.</p>}
              {documents.slice(0, 6).map((doc) => (
                <Link key={doc.id} href={`/documents/${doc.id}`} style={{ textDecoration: "none", border: "1px solid #F0F0F0", borderRadius: 10, padding: "10px 12px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, color: "#1a1a1a" }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600 }}>{doc.title}</div>
                    <div style={{ marginTop: 2, fontSize: 11, color: "#777" }}>마지막 수정 {formatDate(doc.updated_at)}</div>
                  </div>
                  <span style={{ fontSize: 10, fontWeight: 700, padding: "3px 7px", borderRadius: 999, background: doc.status === "review" ? "#FFF0F0" : doc.status === "draft" ? "#FFF9DB" : "#F0FBF4", color: doc.status === "review" ? "#E03131" : doc.status === "draft" ? "#E67700" : "#2F9E44" }}>
                    {doc.status}
                  </span>
                </Link>
              ))}
            </div>
          </section>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <section style={{ border: "1px solid #E5E5E5", borderRadius: 12, overflow: "hidden", background: "#fff", display: "flex", flexDirection: "column", minHeight: 300 }}>
            <div style={{ padding: "12px 16px", borderBottom: "1px solid #E5E5E5" }}>
              <strong style={{ fontSize: 13, color: "#1a1a1a" }}>예정 일정</strong>
            </div>
            <div style={{ flex: 1, overflowY: "auto", minHeight: 0, padding: 12, display: "flex", flexDirection: "column", gap: 8 }}>
              {audits.length === 0 && trainings.length === 0 && (
                <p style={{ margin: 0, padding: 8, fontSize: 13, color: "#777" }}>가까운 예정 일정이 없습니다.</p>
              )}
              {audits.map((audit) => (
                <Link key={audit.id} href={`/audit/${audit.id}`} style={{ textDecoration: "none", border: "1px solid #F0F0F0", borderRadius: 10, padding: "10px 12px", color: "#1a1a1a" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 700, color: "#3B5BDB" }}>내부심사</div>
                      <div style={{ marginTop: 2, fontSize: 13 }}>{audit.audit_number}</div>
                    </div>
                    <div style={{ fontSize: 11, color: "#777" }}>{formatDate(audit.planned_date)}</div>
                  </div>
                </Link>
              ))}
              {trainings.map((training) => (
                <Link key={training.id} href={`/trainings/${training.id}`} style={{ textDecoration: "none", border: "1px solid #F0F0F0", borderRadius: 10, padding: "10px 12px", color: "#1a1a1a" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 700, color: "#2F9E44" }}>교육훈련</div>
                      <div style={{ marginTop: 2, fontSize: 13 }}>{training.title}</div>
                    </div>
                    <div style={{ fontSize: 11, color: "#777" }}>{formatDate(training.planned_date)}</div>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          <section style={{ border: "1px solid #E5E5E5", borderRadius: 12, overflow: "hidden", background: "#fff" }}>
            <div style={{ padding: "12px 16px", borderBottom: "1px solid #E5E5E5" }}>
              <strong style={{ fontSize: 13, color: "#1a1a1a" }}>운영 힌트</strong>
            </div>
            <div style={{ padding: 14, display: "flex", flexDirection: "column", gap: 12 }}>
              <div style={{ fontSize: 12, color: "#555", lineHeight: 1.6 }}>
                초안 문서가 쌓이면 먼저 <strong>검토대기</strong>로 올리고, 관련 서식 기록과 CAPA를 문서 상세에 연결해두는 편이 심사 대응에 유리합니다.
              </div>
              <div style={{ fontSize: 12, color: "#555", lineHeight: 1.6 }}>
                내부심사와 교육은 월별 반복 업무라서, 대시보드에서 예정 일정이 비어 있으면 실제 운영 루틴이 끊긴 상태일 가능성이 큽니다.
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <Link href="/documents/new" style={{ textDecoration: "none", fontSize: 12, fontWeight: 700, color: "#3B5BDB" }}>
                  문서 초안 만들기
                </Link>
                <Link href="/audit/new" style={{ textDecoration: "none", fontSize: 12, fontWeight: 700, color: "#3B5BDB" }}>
                  심사 일정 등록
                </Link>
              </div>
            </div>
          </section>

          {/* ESG 요약 위젯 */}
          <section style={{ border: "1px solid #E5E5E5", borderRadius: 12, overflow: "hidden", background: "#fff" }}>
            <div style={{ padding: "12px 16px", borderBottom: "1px solid #E5E5E5", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <strong style={{ fontSize: 13, color: "#1a1a1a" }}>ESG 성과 요약</strong>
              <Link href="/compliance" style={{ fontSize: 12, color: "#3B5BDB", textDecoration: "none" }}>전체 보기</Link>
            </div>
            <div style={{ padding: 12, display: "flex", flexDirection: "column", gap: 8 }}>
              {([
                { cat: "E", label: "전체 문서 수",    value: docsRes.count ?? 0,      unit: "건",  color: "#2F9E44", bg: "#F0FBF4" },
                { cat: "S", label: "미종결 CAPA",      value: capaRes.count ?? 0,      unit: "건",  color: "#3B5BDB", bg: "#EEF2FF" },
                { cat: "G", label: "진행 중 교육훈련", value: openTrainings,           unit: "건",  color: "#7048E8", bg: "#F3F0FF" },
              ] as const).map(item => (
                <div key={item.cat} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 10px", borderRadius: 8, border: "1px solid #F0F0F0" }}>
                  <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 6px", borderRadius: 4, color: item.color, background: item.bg }}>
                    {item.cat}
                  </span>
                  <span style={{ fontSize: 13, color: "#555", flex: 1 }}>{item.label}</span>
                  <span style={{ fontSize: 14, fontWeight: 700, color: item.color }}>
                    {item.value.toLocaleString()}
                    <span style={{ fontSize: 11, fontWeight: 400, color: "#999", marginLeft: 2 }}>{item.unit}</span>
                  </span>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>

      {/* CAPA 월별 추이 차트 */}
      <div style={{ padding: "0 24px 28px" }}>
        <section style={{ border: "1px solid #E5E5E5", borderRadius: 12, overflow: "hidden", background: "#fff" }}>
          <div style={{ padding: "12px 16px", borderBottom: "1px solid #E5E5E5", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <strong style={{ fontSize: 13, color: "#1a1a1a" }}>CAPA 월별 추이 (최근 6개월)</strong>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                <div style={{ width: 10, height: 10, borderRadius: 2, background: "#E03131" }} />
                <span style={{ fontSize: 11, color: "#555" }}>발생</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                <div style={{ width: 10, height: 10, borderRadius: 2, background: "#2F9E44" }} />
                <span style={{ fontSize: 11, color: "#555" }}>완료</span>
              </div>
              <Link href="/capa" style={{ fontSize: 12, color: "#3B5BDB", textDecoration: "none" }}>전체 보기</Link>
            </div>
          </div>
          <div style={{ padding: "20px 24px" }}>
            <div style={{ display: "flex", alignItems: "flex-end", gap: 12, height: 140 }}>
              {trendMonths.map(month => (
                <div key={month.key} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <div style={{ width: "100%", display: "flex", gap: 4, alignItems: "flex-end", height: 112 }}>
                    <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
                      {month.created > 0 && (
                        <div style={{ fontSize: 10, fontWeight: 700, color: "#E03131", textAlign: "center", marginBottom: 2 }}>
                          {month.created}
                        </div>
                      )}
                      <div style={{
                        background: "#E03131",
                        borderRadius: "3px 3px 0 0",
                        height: `${Math.max(Math.round((month.created / trendMax) * 100), month.created > 0 ? 4 : 0)}px`,
                        opacity: 0.8,
                      }} />
                    </div>
                    <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
                      {month.completed > 0 && (
                        <div style={{ fontSize: 10, fontWeight: 700, color: "#2F9E44", textAlign: "center", marginBottom: 2 }}>
                          {month.completed}
                        </div>
                      )}
                      <div style={{
                        background: "#2F9E44",
                        borderRadius: "3px 3px 0 0",
                        height: `${Math.max(Math.round((month.completed / trendMax) * 100), month.completed > 0 ? 4 : 0)}px`,
                        opacity: 0.8,
                      }} />
                    </div>
                  </div>
                  <div style={{ height: 1, width: "100%", background: "#E5E5E5", marginTop: 0 }} />
                  <span style={{ fontSize: 11, color: "#999", marginTop: 6 }}>{month.label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <AppLayout>
      <Suspense fallback={<ContentSpinner />}>
        <DashboardContent />
      </Suspense>
    </AppLayout>
  );
}
