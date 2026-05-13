import { notFound } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import ConsultantLayout from "@/components/consultant/ConsultantLayout";
import SwitchCompanyButton from "@/components/consultant/SwitchCompanyButton";

// ─── Types ────────────────────────────────────────────────────────────────────

type Company = {
  id: string;
  company_name: string;
  industry: string | null;
  employee_count: number | null;
  management_rep: string | null;
  std_iso9001: boolean;
  std_iso14001: boolean;
  std_iso45001: boolean;
  std_iso50001: boolean;
  std_iso37001: boolean;
  std_iso37301: boolean;
  std_iso27001: boolean;
  certification_body: string | null;
  certification_expiry: string | null;
};

type Capa = {
  id: string;
  capa_number: string;
  title: string;
  status: string;
  created_at: string;
  due_date: string | null;
};

type Audit = {
  id: string;
  audit_number: string;
  title: string;
  status: "planned" | "in_progress" | "completed" | "cancelled";
  audit_date: string | null;
  created_at: string;
};

type Document = {
  id: string;
  doc_number: string;
  title: string;
  status: "draft" | "review" | "approved" | "obsolete";
  version: string;
  updated_at: string;
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDate(iso: string | null): string {
  if (!iso) return "-";
  return iso.slice(0, 10);
}

function calcCertDday(expiry: string | null): string {
  if (!expiry) return "-";
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const exp = new Date(expiry);
  exp.setHours(0, 0, 0, 0);
  const diff = Math.ceil((exp.getTime() - today.getTime()) / 86400000);
  if (diff < 0) return `만료 (${Math.abs(diff)}일 경과)`;
  if (diff === 0) return "D-Day";
  return `D-${diff}`;
}

const STD_BADGES = [
  { key: "std_iso9001" as const,  label: "ISO 9001",  color: "#3B5BDB", bg: "#EEF2FF" },
  { key: "std_iso14001" as const, label: "ISO 14001", color: "#2F9E44", bg: "#EBFBEE" },
  { key: "std_iso45001" as const, label: "ISO 45001", color: "#E67700", bg: "#FFF9DB" },
  { key: "std_iso50001" as const, label: "ISO 50001", color: "#E67700", bg: "#FFF9DB" },
  { key: "std_iso37301" as const, label: "ISO 37301", color: "#1098AD", bg: "#E3FAFC" },
  { key: "std_iso37001" as const, label: "ISO 37001", color: "#2F9E44", bg: "#EBFBEE" },
  { key: "std_iso27001" as const, label: "ISO 27001", color: "#7048E8", bg: "#F3F0FF" },
];

// ─── Status Badge Helpers ─────────────────────────────────────────────────────

function capaStatusBadge(status: string) {
  const map: Record<string, { bg: string; color: string; label: string }> = {
    open:        { bg: "#FFF5F5", color: "#e03131", label: "오픈" },
    in_progress: { bg: "#EEF2FF", color: "#3B5BDB", label: "진행중" },
    completed:   { bg: "#EBFBEE", color: "#2F9E44", label: "완료" },
  };
  const s = map[status] ?? { bg: "#F5F5F5", color: "#888", label: status };
  return (
    <span style={{ fontSize: 11, fontWeight: 600, padding: "2px 7px", borderRadius: 4, background: s.bg, color: s.color }}>
      {s.label}
    </span>
  );
}

function auditStatusBadge(status: string) {
  const map: Record<string, { bg: string; color: string; label: string }> = {
    planned:     { bg: "#F5F5F5", color: "#888",    label: "계획됨" },
    in_progress: { bg: "#EEF2FF", color: "#3B5BDB", label: "진행중" },
    completed:   { bg: "#EBFBEE", color: "#2F9E44", label: "완료" },
    cancelled:   { bg: "#FFF5F5", color: "#e03131", label: "취소됨" },
  };
  const s = map[status] ?? { bg: "#F5F5F5", color: "#888", label: status };
  return (
    <span style={{ fontSize: 11, fontWeight: 600, padding: "2px 7px", borderRadius: 4, background: s.bg, color: s.color }}>
      {s.label}
    </span>
  );
}

function docStatusBadge(status: string) {
  const map: Record<string, { bg: string; color: string; label: string }> = {
    approved: { bg: "#EBFBEE", color: "#2F9E44", label: "승인됨" },
    review:   { bg: "#EEF2FF", color: "#3B5BDB", label: "검토중" },
    draft:    { bg: "#F5F5F5", color: "#888",    label: "초안" },
    obsolete: { bg: "#FFF5F5", color: "#e03131", label: "폐기됨" },
  };
  const s = map[status] ?? { bg: "#F5F5F5", color: "#888", label: status };
  return (
    <span style={{ fontSize: 11, fontWeight: 600, padding: "2px 7px", borderRadius: 4, background: s.bg, color: s.color }}>
      {s.label}
    </span>
  );
}

// ─── Shared Table Styles ──────────────────────────────────────────────────────

const thStyle: React.CSSProperties = {
  padding: "10px 14px",
  textAlign: "left",
  fontSize: 11,
  fontWeight: 600,
  color: "#888",
  background: "#FAFAFA",
  borderBottom: "1px solid #E5E5E5",
  whiteSpace: "nowrap",
};

const tdStyle: React.CSSProperties = {
  padding: "10px 14px",
  fontSize: 13,
  color: "#1a1a1a",
  borderBottom: "1px solid #F0F0F0",
  verticalAlign: "middle",
};

// ─── Tab Content Components ───────────────────────────────────────────────────

function CapaTab({ capas }: { capas: Capa[] }) {
  if (capas.length === 0) {
    return (
      <div style={{ padding: "48px 0", textAlign: "center", color: "#bbb", fontSize: 13 }}>
        CAPA가 없습니다
      </div>
    );
  }
  return (
    <div style={{ overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={thStyle}>CAPA번호</th>
            <th style={thStyle}>제목</th>
            <th style={thStyle}>상태</th>
            <th style={thStyle}>마감일</th>
            <th style={thStyle}>등록일</th>
          </tr>
        </thead>
        <tbody>
          {capas.map((c) => (
            <tr key={c.id} style={{ background: "#fff" }}>
              <td style={{ ...tdStyle, fontFamily: "monospace", fontSize: 12, color: "#3B5BDB" }}>
                {c.capa_number}
              </td>
              <td style={{ ...tdStyle, maxWidth: 260 }}>
                <span style={{ display: "block", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {c.title}
                </span>
              </td>
              <td style={tdStyle}>{capaStatusBadge(c.status)}</td>
              <td style={tdStyle}>{formatDate(c.due_date)}</td>
              <td style={{ ...tdStyle, color: "#888" }}>{formatDate(c.created_at)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function AuditTab({ audits }: { audits: Audit[] }) {
  if (audits.length === 0) {
    return (
      <div style={{ padding: "48px 0", textAlign: "center", color: "#bbb", fontSize: 13 }}>
        내부심사 기록이 없습니다
      </div>
    );
  }
  return (
    <div style={{ overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={thStyle}>심사번호</th>
            <th style={thStyle}>제목</th>
            <th style={thStyle}>상태</th>
            <th style={thStyle}>심사일</th>
          </tr>
        </thead>
        <tbody>
          {audits.map((a) => (
            <tr key={a.id} style={{ background: "#fff" }}>
              <td style={{ ...tdStyle, fontFamily: "monospace", fontSize: 12, color: "#3B5BDB" }}>
                {a.audit_number}
              </td>
              <td style={{ ...tdStyle, maxWidth: 300 }}>
                <span style={{ display: "block", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {a.title}
                </span>
              </td>
              <td style={tdStyle}>{auditStatusBadge(a.status)}</td>
              <td style={tdStyle}>{formatDate(a.audit_date)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function DocumentsTab({
  documents,
  approvedCount,
  reviewCount,
  draftCount,
}: {
  documents: Document[];
  approvedCount: number;
  reviewCount: number;
  draftCount: number;
}) {
  return (
    <>
      {/* Mini stats */}
      <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
        {[
          { label: "승인됨", count: approvedCount, color: "#2F9E44", bg: "#EBFBEE" },
          { label: "검토중", count: reviewCount,   color: "#3B5BDB", bg: "#EEF2FF" },
          { label: "초안",   count: draftCount,    color: "#888",    bg: "#F5F5F5" },
        ].map((s) => (
          <div key={s.label} style={{
            flex: 1, padding: "12px 16px", borderRadius: 8,
            background: s.bg, display: "flex", alignItems: "center", justifyContent: "space-between",
          }}>
            <span style={{ fontSize: 12, color: s.color, fontWeight: 600 }}>{s.label}</span>
            <span style={{ fontSize: 20, fontWeight: 700, color: s.color }}>{s.count}</span>
          </div>
        ))}
      </div>

      {documents.length === 0 ? (
        <div style={{ padding: "48px 0", textAlign: "center", color: "#bbb", fontSize: 13 }}>
          문서가 없습니다
        </div>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th style={thStyle}>문서번호</th>
                <th style={thStyle}>제목</th>
                <th style={thStyle}>상태</th>
                <th style={thStyle}>버전</th>
                <th style={thStyle}>최근수정</th>
              </tr>
            </thead>
            <tbody>
              {documents.map((d) => (
                <tr key={d.id} style={{ background: "#fff" }}>
                  <td style={{ ...tdStyle, fontFamily: "monospace", fontSize: 12, color: "#3B5BDB" }}>
                    {d.doc_number}
                  </td>
                  <td style={{ ...tdStyle, maxWidth: 260 }}>
                    <span style={{ display: "block", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {d.title}
                    </span>
                  </td>
                  <td style={tdStyle}>{docStatusBadge(d.status)}</td>
                  <td style={{ ...tdStyle, fontFamily: "monospace", fontSize: 12 }}>{d.version}</td>
                  <td style={{ ...tdStyle, color: "#888" }}>{formatDate(d.updated_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function ConsultantClientDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ tab?: string }>;
}) {
  const { id } = await params;
  const { tab: rawTab } = await searchParams;
  const tab = rawTab === "audit" || rawTab === "documents" ? rawTab : "capa";

  // ── Company ──────────────────────────────────────────────────────────────────
  let company: Company | null = null;
  try {
    const { data } = await supabase
      .from("companies")
      .select(
        "id, company_name, industry, employee_count, management_rep, " +
        "std_iso9001, std_iso14001, std_iso45001, std_iso50001, std_iso37001, std_iso37301, std_iso27001, " +
        "certification_body, certification_expiry"
      )
      .eq("id", id)
      .single();
    company = data as Company | null;
  } catch {}

  if (!company) notFound();

  // ── KPI Fetches ───────────────────────────────────────────────────────────────
  let docCount = 0;
  try {
    const { count } = await supabase
      .from("documents")
      .select("*", { count: "exact", head: true })
      .eq("company_id", id);
    docCount = count ?? 0;
  } catch {}

  let openCapaCount = 0;
  try {
    const { count } = await supabase
      .from("capas")
      .select("*", { count: "exact", head: true })
      .eq("company_id", id)
      .neq("status", "completed");
    openCapaCount = count ?? 0;
  } catch {}

  let lastAuditDate: string | null = null;
  try {
    const { data } = await supabase
      .from("audits")
      .select("audit_date")
      .eq("company_id", id)
      .eq("status", "completed")
      .order("audit_date", { ascending: false })
      .limit(1)
      .single();
    lastAuditDate = (data as { audit_date: string | null } | null)?.audit_date ?? null;
  } catch {}

  // ── Tab Data ──────────────────────────────────────────────────────────────────
  let capas: Capa[] = [];
  if (tab === "capa") {
    try {
      const { data } = await supabase
        .from("capas")
        .select("id, capa_number, title, status, created_at, due_date")
        .eq("company_id", id)
        .order("created_at", { ascending: false })
        .limit(10);
      capas = (data as Capa[] | null) ?? [];
    } catch {}
  }

  let audits: Audit[] = [];
  if (tab === "audit") {
    try {
      const { data } = await supabase
        .from("audits")
        .select("id, audit_number, title, status, audit_date, created_at")
        .eq("company_id", id)
        .order("audit_date", { ascending: false })
        .limit(10);
      audits = (data as Audit[] | null) ?? [];
    } catch {}
  }

  let documents: Document[] = [];
  let approvedCount = 0;
  let reviewCount = 0;
  let draftCount = 0;
  if (tab === "documents") {
    try {
      const { data } = await supabase
        .from("documents")
        .select("id, doc_number, title, status, version, updated_at")
        .eq("company_id", id)
        .order("updated_at", { ascending: false })
        .limit(10);
      documents = (data as Document[] | null) ?? [];
    } catch {}

    try {
      const { count } = await supabase
        .from("documents")
        .select("*", { count: "exact", head: true })
        .eq("company_id", id)
        .eq("status", "approved");
      approvedCount = count ?? 0;
    } catch {}
    try {
      const { count } = await supabase
        .from("documents")
        .select("*", { count: "exact", head: true })
        .eq("company_id", id)
        .eq("status", "review");
      reviewCount = count ?? 0;
    } catch {}
    try {
      const { count } = await supabase
        .from("documents")
        .select("*", { count: "exact", head: true })
        .eq("company_id", id)
        .eq("status", "draft");
      draftCount = count ?? 0;
    } catch {}
  }

  // ─────────────────────────────────────────────────────────────────────────────

  const certDday = calcCertDday(company.certification_expiry);
  const certExpired =
    company.certification_expiry !== null &&
    new Date(company.certification_expiry) < new Date();

  const tabs = [
    { key: "capa",      label: "CAPA 현황" },
    { key: "audit",     label: "내부심사 현황" },
    { key: "documents", label: "문서 현황" },
  ] as const;

  return (
    <ConsultantLayout active="/consultant/clients">
      <div style={{ padding: 32, maxWidth: 1100, margin: "0 auto" }}>

        {/* ── Header ─────────────────────────────────────────────────────────── */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 24 }}>
          <div>
            <div style={{ fontSize: 12, color: "#888", marginBottom: 6 }}>
              <Link href="/consultant/clients" style={{ color: "#888", textDecoration: "none" }}>
                고객사 목록
              </Link>
              {" / "}
              <span style={{ color: "#1a1a1a" }}>{company.company_name}</span>
            </div>
            <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: "#1a1a1a" }}>
              {company.company_name}
            </h1>
          </div>
          <SwitchCompanyButton companyId={id} />
        </div>

        {/* ── KPI Cards ──────────────────────────────────────────────────────── */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 24 }}>
          {/* 전체 문서 */}
          <div style={{ background: "#fff", border: "1px solid #E5E5E5", borderRadius: 8, padding: "18px 20px" }}>
            <div style={{ fontSize: 10, fontWeight: 600, color: "#bbb", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>
              전체 문서
            </div>
            <div style={{ fontSize: 28, fontWeight: 700, color: "#1a1a1a", lineHeight: 1.1 }}>
              {docCount.toLocaleString()}
            </div>
            <div style={{ fontSize: 12, color: "#888", marginTop: 4 }}>등록된 문서 수</div>
          </div>

          {/* 미완료 CAPA */}
          <div style={{ background: "#fff", border: "1px solid #E5E5E5", borderRadius: 8, padding: "18px 20px" }}>
            <div style={{ fontSize: 10, fontWeight: 600, color: "#bbb", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>
              미완료 CAPA
            </div>
            <div style={{ fontSize: 28, fontWeight: 700, color: openCapaCount > 0 ? "#E03131" : "#2F9E44", lineHeight: 1.1 }}>
              {openCapaCount.toLocaleString()}
            </div>
            <div style={{ fontSize: 12, color: "#888", marginTop: 4 }}>처리 대기 중</div>
          </div>

          {/* 최근 심사 */}
          <div style={{ background: "#fff", border: "1px solid #E5E5E5", borderRadius: 8, padding: "18px 20px" }}>
            <div style={{ fontSize: 10, fontWeight: 600, color: "#bbb", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>
              최근 심사
            </div>
            <div style={{ fontSize: 20, fontWeight: 700, color: "#1a1a1a", lineHeight: 1.2 }}>
              {formatDate(lastAuditDate)}
            </div>
            <div style={{ fontSize: 12, color: "#888", marginTop: 4 }}>최근 완료 심사일</div>
          </div>

          {/* 인증 만료 D-day */}
          <div style={{ background: "#fff", border: "1px solid #E5E5E5", borderRadius: 8, padding: "18px 20px" }}>
            <div style={{ fontSize: 10, fontWeight: 600, color: "#bbb", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>
              인증 만료 D-day
            </div>
            <div style={{
              fontSize: 20,
              fontWeight: 700,
              lineHeight: 1.2,
              color: certExpired ? "#E03131" : company.certification_expiry ? "#3B5BDB" : "#bbb",
            }}>
              {certDday}
            </div>
            <div style={{ fontSize: 12, color: "#888", marginTop: 4 }}>
              {company.certification_expiry ? formatDate(company.certification_expiry) : "미설정"}
            </div>
          </div>
        </div>

        {/* ── Company Info Card ───────────────────────────────────────────────── */}
        <div style={{
          background: "#fff", border: "1px solid #E5E5E5", borderRadius: 8,
          padding: "18px 20px", marginBottom: 24,
        }}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 28, alignItems: "flex-start" }}>
            <div style={{ minWidth: 120 }}>
              <div style={{ fontSize: 10, fontWeight: 600, color: "#bbb", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 4 }}>회사명</div>
              <div style={{ fontSize: 14, color: "#1a1a1a", fontWeight: 500 }}>{company.company_name}</div>
            </div>
            <div style={{ minWidth: 100 }}>
              <div style={{ fontSize: 10, fontWeight: 600, color: "#bbb", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 4 }}>업종</div>
              <div style={{ fontSize: 14, color: "#1a1a1a" }}>{company.industry ?? "-"}</div>
            </div>
            <div style={{ minWidth: 80 }}>
              <div style={{ fontSize: 10, fontWeight: 600, color: "#bbb", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 4 }}>직원수</div>
              <div style={{ fontSize: 14, color: "#1a1a1a" }}>{company.employee_count ? `${company.employee_count}명` : "-"}</div>
            </div>
            <div style={{ minWidth: 100 }}>
              <div style={{ fontSize: 10, fontWeight: 600, color: "#bbb", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 4 }}>경영대표</div>
              <div style={{ fontSize: 14, color: "#1a1a1a" }}>{company.management_rep ?? "-"}</div>
            </div>
            <div style={{ flex: 1, minWidth: 200 }}>
              <div style={{ fontSize: 10, fontWeight: 600, color: "#bbb", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 }}>적용표준</div>
              <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                {STD_BADGES.filter((b) => (company as Record<string, unknown>)[b.key]).map((b) => (
                  <span key={b.key} style={{
                    fontSize: 11, fontWeight: 700,
                    padding: "2px 7px", borderRadius: 4,
                    background: b.bg, color: b.color,
                  }}>
                    {b.label}
                  </span>
                ))}
                {STD_BADGES.every((b) => !(company as Record<string, unknown>)[b.key]) && (
                  <span style={{ fontSize: 12, color: "#bbb" }}>표준 미설정</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ── Tabs ───────────────────────────────────────────────────────────── */}
        <div style={{ background: "#fff", border: "1px solid #E5E5E5", borderRadius: 8, overflow: "hidden" }}>
          {/* Tab bar */}
          <div style={{ display: "flex", borderBottom: "1px solid #E5E5E5", background: "#FAFAFA" }}>
            {tabs.map((t) => {
              const active = tab === t.key;
              return (
                <Link
                  key={t.key}
                  href={`/consultant/clients/${id}?tab=${t.key}`}
                  style={{
                    padding: "12px 20px",
                    fontSize: 13,
                    fontWeight: active ? 600 : 400,
                    color: active ? "#7C3AED" : "#666",
                    textDecoration: "none",
                    borderBottom: active ? "2px solid #7C3AED" : "2px solid transparent",
                    marginBottom: -1,
                    display: "inline-block",
                  }}
                >
                  {t.label}
                </Link>
              );
            })}
          </div>

          {/* Tab content */}
          <div style={{ padding: 20 }}>
            {tab === "capa" && <CapaTab capas={capas} />}
            {tab === "audit" && <AuditTab audits={audits} />}
            {tab === "documents" && (
              <DocumentsTab
                documents={documents}
                approvedCount={approvedCount}
                reviewCount={reviewCount}
                draftCount={draftCount}
              />
            )}
          </div>
        </div>

      </div>
    </ConsultantLayout>
  );
}
