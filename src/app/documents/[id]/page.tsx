import { Suspense } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Check } from "lucide-react";
import AppLayout from "@/components/layout/AppLayoutServer";
import ApprovalPanel from "@/components/documents/ApprovalPanel";
import AIReviewPanel from "@/components/documents/AIReviewPanel";
import WorkflowActions from "@/components/documents/WorkflowActions";
import { getUserProfile, createSupabaseServerClient } from "@/lib/supabase-server";
import { getCompany } from "@/lib/company";
import { canWrite as checkCanWrite } from "@/lib/permissions";
import type { Document, DocumentSection, DocumentApproval, DocumentVersion, DocumentHistory } from "@/types/document";
import { Pencil, Clock, ChevronLeft } from "lucide-react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import PrintButton from "@/components/print/PrintButton";
import PrintLayout from "@/components/print/PrintLayout";
import type { TurtleData } from "@/components/documents/TurtleDiagram";
import DocNumberEditor from "@/components/documents/DocNumberEditor";
import DocumentBody from "@/components/documents/DocumentBody";
import type { Section } from "@/types/sections";

// ── 상수 ──────────────────────────────────────────────────────
const LAYER_COLOR: Record<string, { color: string; bg: string }> = {
  C: { color: "#3B5BDB", bg: "#EEF2FF" },
  I: { color: "#E67700", bg: "#FFF9DB" },
  E: { color: "#2F9E44", bg: "#F0FBF4" },
};

const STATUS_STYLE: Record<string, { label: string; color: string; bg: string }> = {
  active:   { label: "유효",     color: "#2F9E44", bg: "#F0FBF4" },
  review:   { label: "검토대기", color: "#E67700", bg: "#FFF9DB" },
  draft:    { label: "초안",     color: "#999",    bg: "#F5F5F5" },
  obsolete: { label: "폐기",     color: "#E03131", bg: "#FFF0F0" },
};

const HISTORY_COLORS: Record<string, string> = {
  create:         "#bbb",
  request_review: "#3B5BDB",
  approve:        "#2F9E44",
  reject:         "#E03131",
  obsolete:       "#999",
  restore:        "#555",
  revise:         "#E67700",
};

const HISTORY_LABELS: Record<string, string> = {
  create:         "최초 작성",
  request_review: "검토 요청",
  approve:        "승인",
  reject:         "반려",
  obsolete:       "폐기 처리",
  restore:        "복원",
  revise:         "개정 시작",
};

const WORKFLOW_STEPS = [
  { key: "draft",    label: "초안" },
  { key: "review",   label: "검토대기" },
  { key: "active",   label: "유효" },
  { key: "obsolete", label: "폐기" },
];

// ── 컴포넌트 ──────────────────────────────────────────────────
function ContentSpinner() {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "calc(100vh - 56px)" }}>
      <div className="w-7 h-7 border-2 border-[#3B5BDB] border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

function StatusStepper({ status }: { status: string }) {
  const currentIdx = WORKFLOW_STEPS.findIndex(s => s.key === status);

  return (
    <div style={{
      display: "flex", alignItems: "center",
      padding: "12px 32px", background: "#FAFAFA",
      borderBottom: "1px solid #E5E5E5",
    }}>
      {WORKFLOW_STEPS.map((step, i) => {
        const isDone    = i < currentIdx;
        const isCurrent = i === currentIdx;
        const circleBg  = isDone || isCurrent ? "#3B5BDB" : "#E5E5E5";
        const labelColor = isCurrent ? "#1a1a1a" : isDone ? "#3B5BDB" : "#bbb";

        return (
          <div key={step.key} style={{ display: "flex", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{
                width: 22, height: 22, borderRadius: "50%",
                display: "flex", alignItems: "center", justifyContent: "center",
                background: circleBg, flexShrink: 0,
              }}>
                {isDone
                  ? <Check size={11} color="#fff" strokeWidth={3} />
                  : <span style={{ fontSize: 10, fontWeight: 700, color: isCurrent ? "#fff" : "#bbb" }}>{i + 1}</span>
                }
              </div>
              <span style={{ fontSize: 12, fontWeight: isCurrent ? 700 : 400, color: labelColor, whiteSpace: "nowrap" }}>
                {step.label}
              </span>
            </div>
            {i < WORKFLOW_STEPS.length - 1 && (
              <div style={{
                width: 40, height: 1,
                background: isDone ? "#3B5BDB" : "#E5E5E5",
                margin: "0 10px", flexShrink: 0,
              }} />
            )}
          </div>
        );
      })}
    </div>
  );
}

function ApprovalTimeline({ approvals }: { approvals: DocumentApproval[] }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {approvals.map(a => {
        const done    = a.status === "approved";
        const pending = a.status === "pending";
        const color   = done ? "#2F9E44" : pending ? "#3B5BDB" : "#E03131";
        const bg      = done ? "#F0FBF4"  : pending ? "#EEF2FF"  : "#FFF0F0";
        return (
          <div key={a.id} style={{ display: "flex", alignItems: "start", gap: 10 }}>
            <div style={{
              width: 20, height: 20, borderRadius: "50%", flexShrink: 0, marginTop: 1,
              background: bg, color, display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 10, fontWeight: 700,
            }}>
              {a.step}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ margin: 0, fontSize: 12, fontWeight: 600, color: "#1a1a1a" }}>{a.step_name}</p>
              {a.approver_name && <p style={{ margin: 0, fontSize: 11, color: "#999" }}>{a.approver_name}</p>}
            </div>
            <span style={{ fontSize: 11, fontWeight: 600, padding: "2px 6px", borderRadius: 4, flexShrink: 0, background: bg, color }}>
              {done ? "승인" : pending ? "대기" : "반려"}
            </span>
          </div>
        );
      })}
    </div>
  );
}

// ── 메인 컨텐츠 ───────────────────────────────────────────────
async function DocumentContent({ id }: { id: string }) {
  const supabase = await createSupabaseServerClient();
  const [company, profile, docRes, sectionsRes, approvalsRes, versionsRes, historyRes, capasRes] = await Promise.all([
    getCompany(),
    getUserProfile(),
    supabase.from("documents").select("*").eq("id", id).single(),
    supabase.from("document_sections").select("*").eq("document_id", id).order("section_order"),
    supabase.from("document_approvals").select("*").eq("document_id", id).order("step"),
    supabase.from("document_versions").select("*").eq("document_id", id).order("created_at", { ascending: false }).limit(5),
    supabase.from("document_history").select("*").eq("document_id", id).order("created_at", { ascending: false }),
    supabase.from("capas").select("id, capa_number, title, grade, status, due_date").eq("related_doc_id", id).order("created_at", { ascending: false }).limit(10),
  ]);

  if (docRes.error || !docRes.data) notFound();

  const doc       = docRes.data as Document;
  const turtleData = (doc.turtle_data ?? null) as TurtleData | null;
  const sections  = (sectionsRes.data  ?? []) as DocumentSection[];
  const richSections = (Array.isArray(doc.sections) ? doc.sections : []) as Section[];
  const approvals = (approvalsRes.data ?? []) as DocumentApproval[];
  const versions  = (versionsRes.data  ?? []) as DocumentVersion[];
  const history   = (historyRes.data   ?? []) as DocumentHistory[];

  type CapaRow = { id: string; capa_number: string; title: string; grade: string; status: string; due_date: string | null };
  const relatedCapas = (capasRes.data ?? []) as CapaRow[];

  const writeOk = checkCanWrite(profile?.role ?? "viewer");
  const isAdmin = profile?.role === "admin";
  const ls  = LAYER_COLOR[doc.layer]   ?? { color: "#999", bg: "#F5F5F5" };
  const sd  = STATUS_STYLE[doc.status] ?? { label: doc.status, color: "#999", bg: "#F5F5F5" };
  const canEdit = writeOk && (doc.status === "draft" || doc.status === "review");

  return (
    <PrintLayout
      docNumber={doc.doc_number}
      title={doc.title}
      version={doc.version}
      status={doc.status}
      layer={doc.layer}
      isoClause={doc.related_iso ?? undefined}
      ownerName={doc.owner_name ?? undefined}
      companyName={company?.company_name ?? undefined}
      approvals={approvals}
      richSections={richSections.length > 0 ? richSections : undefined}
      versions={versions.map(v => ({
        version: v.version,
        change_reason: v.change_reason,
        changed_by: v.changed_by,
        created_at: v.created_at,
      }))}
    >
    <div style={{ display: "flex", flexDirection: "column", height: "calc(100vh - 56px)" }}>

      {/* 상태 스텝퍼 */}
      <StatusStepper status={doc.status} />

      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>

        {/* ── 좌측: 본문 ── */}
        <div style={{ flex: 1, overflowY: "auto", background: "#fff" }}>
          {/* 문서 헤더 */}
          <div style={{ padding: "24px 32px", borderBottom: "1px solid #E5E5E5" }}>
            <div style={{ display: "flex", alignItems: "start", justifyContent: "space-between", gap: 16 }}>
              <div>
                <Breadcrumb items={[{ label: "문서관리", href: "/documents" }, { label: doc.title }]} />
                {/* 뱃지 행 */}
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
                  <DocNumberEditor
                    documentId={doc.id}
                    currentNumber={doc.doc_number}
                    canEdit={isAdmin}
                  />
                  <span style={{ fontSize: 11, fontWeight: 600, padding: "2px 6px", borderRadius: 4, color: ls.color, background: ls.bg }}>
                    {doc.layer}
                  </span>
                  <span style={{ fontSize: 11, fontWeight: 600, padding: "2px 6px", borderRadius: 4, color: sd.color, background: sd.bg }}>
                    {sd.label}
                  </span>
                </div>
                <h1 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: "#1a1a1a", lineHeight: 1.3 }}>
                  {doc.title}
                </h1>
                {doc.description && (
                  <p style={{ margin: "4px 0 0", fontSize: 13, color: "#555" }}>{doc.description}</p>
                )}
                {/* 반려 사유 표시 */}
                {doc.reject_reason && doc.status === "draft" && (
                  <div style={{ marginTop: 10, padding: "8px 12px", background: "#FFF0F0", borderRadius: 6, borderLeft: "3px solid #E03131" }}>
                    <p style={{ margin: 0, fontSize: 12, color: "#E03131", fontWeight: 600 }}>반려 사유</p>
                    <p style={{ margin: "2px 0 0", fontSize: 13, color: "#555" }}>{doc.reject_reason}</p>
                  </div>
                )}
                {/* 메타 */}
                <div style={{ display: "flex", alignItems: "center", gap: 16, marginTop: 10, fontSize: 12, color: "#999" }}>
                  {doc.owner_name  && <span>담당자 <span style={{ color: "#555", fontWeight: 500 }}>{doc.owner_name}</span></span>}
                  <span>버전 <span style={{ fontFamily: "monospace", color: "#555", fontWeight: 500 }}>{doc.version}</span></span>
                  {doc.related_iso && <span>ISO <span style={{ color: "#555", fontWeight: 500 }}>{doc.related_iso}</span></span>}
                  <span>수정 <span style={{ color: "#555" }}>{doc.updated_at.slice(0, 10)}</span></span>
                </div>
              </div>

              {/* 액션 버튼 */}
              <div style={{ display: "flex", gap: 6, flexShrink: 0, marginTop: 2, alignItems: "center" }}>
                <WorkflowActions documentId={doc.id} status={doc.status} canWrite={writeOk} />
                {canEdit && (
                  <Link href={`/documents/${doc.id}/edit`} style={{
                    display: "flex", alignItems: "center", gap: 5,
                    padding: "5px 10px", borderRadius: 6, textDecoration: "none",
                    fontSize: 12, fontWeight: 500, color: "#555",
                    border: "1px solid #E5E5E5", background: "#fff",
                  }}
                    className="hover:bg-[#F5F5F5] transition-colors"
                  >
                    <Pencil size={12} color="#999" />
                    수정
                  </Link>
                )}
                <PrintButton />
                <Link href="/documents" style={{
                  display: "flex", alignItems: "center", gap: 4,
                  padding: "5px 10px", borderRadius: 6, textDecoration: "none",
                  fontSize: 12, fontWeight: 500, color: "#555",
                  border: "1px solid #E5E5E5", background: "#fff",
                }}
                  className="hover:bg-[#F5F5F5] transition-colors"
                >
                  <ChevronLeft size={12} color="#999" />
                  목록
                </Link>
              </div>
            </div>
          </div>

          <DocumentBody
            documentId={doc.id}
            docType={doc.doc_type}
            richSections={richSections}
            legacySections={sections}
            turtleData={turtleData}
            history={history}
            canWrite={writeOk}
            historyColors={HISTORY_COLORS}
            historyLabels={HISTORY_LABELS}
          />
        </div>

        {/* ── 우측: 패널 ── */}
        <aside className="no-print" style={{
          width: 260, flexShrink: 0,
          background: "#fff", borderLeft: "1px solid #E5E5E5",
          overflowY: "auto",
        }}>
          {/* 결재 현황 */}
          <div style={{ padding: "16px", borderBottom: "1px solid #F0F0F0" }}>
            <p style={{ margin: "0 0 12px", fontSize: 10, fontWeight: 600, color: "#bbb", textTransform: "uppercase", letterSpacing: "0.06em" }}>
              결재 현황
            </p>
            {approvals.length > 0 ? (
              <ApprovalTimeline approvals={approvals} />
            ) : (
              <p style={{ fontSize: 12, color: "#bbb" }}>결재선이 없습니다.</p>
            )}
          </div>

          {/* 승인/반려 */}
          {approvals.some(a => a.status === "pending") && (
            <div style={{ padding: "16px", borderBottom: "1px solid #F0F0F0" }}>
              <ApprovalPanel documentId={doc.id} approvals={approvals} />
            </div>
          )}

          {/* 버전 이력 */}
          <div style={{ padding: "16px", borderBottom: "1px solid #F0F0F0" }}>
            <p style={{ margin: "0 0 12px", fontSize: 10, fontWeight: 600, color: "#bbb", textTransform: "uppercase", letterSpacing: "0.06em" }}>
              버전 이력
            </p>
            {versions.length > 0 ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {versions.map(v => (
                  <div key={v.id} style={{ display: "flex", alignItems: "start", gap: 8 }}>
                    <span style={{
                      fontFamily: "monospace", fontSize: 11, fontWeight: 700,
                      color: "#3B5BDB", background: "#EEF2FF",
                      borderRadius: 4, padding: "2px 5px", flexShrink: 0, marginTop: 1,
                    }}>
                      {v.version}
                    </span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ margin: 0, fontSize: 12, color: "#555", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {v.change_reason ?? "—"}
                      </p>
                      <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 2, fontSize: 11, color: "#bbb" }}>
                        <Clock size={10} color="#bbb" />
                        {v.created_at.slice(0, 10)}
                        {v.changed_by && ` · ${v.changed_by}`}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ fontSize: 12, color: "#bbb" }}>이력이 없습니다.</p>
            )}
          </div>

          {/* 연관 CAPA */}
          <div style={{ padding: "16px", borderBottom: "1px solid #F0F0F0" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
              <p style={{ margin: 0, fontSize: 10, fontWeight: 600, color: "#bbb", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                🔗 연관 CAPA
              </p>
              <Link href={`/capa/new?doc_id=${doc.id}`} style={{ fontSize: 11, color: "#3B5BDB", textDecoration: "none", fontWeight: 500 }}>
                + 연결
              </Link>
            </div>
            {relatedCapas.length === 0 ? (
              <p style={{ fontSize: 12, color: "#bbb", margin: 0 }}>연관된 CAPA가 없습니다.</p>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {relatedCapas.map(c => {
                  const gradeColor = c.grade === "A" ? "#E03131" : c.grade === "B" ? "#E67700" : "#F59F00";
                  const isDone = c.status === "completed";
                  return (
                    <Link key={c.id} href={`/capa/${c.id}`} style={{ textDecoration: "none", display: "flex", flexDirection: "column", gap: 3, padding: "8px 10px", borderRadius: 6, border: "1px solid #F0F0F0", background: "#FAFAFA" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                        <span style={{ fontFamily: "monospace", fontSize: 11, fontWeight: 700, color: "#3B5BDB" }}>{c.capa_number}</span>
                        <span style={{ fontSize: 10, fontWeight: 700, color: gradeColor }}>{c.grade}급</span>
                        <span style={{ fontSize: 10, fontWeight: 600, marginLeft: "auto", color: isDone ? "#2F9E44" : "#3B5BDB", background: isDone ? "#F0FBF4" : "#EEF2FF", padding: "1px 5px", borderRadius: 3 }}>
                          {isDone ? "완료" : c.status}
                        </span>
                      </div>
                      <span style={{ fontSize: 12, color: "#374151", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.title}</span>
                      {c.due_date && !isDone && <span style={{ fontSize: 11, color: "#9CA3AF" }}>마감 {c.due_date}</span>}
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

          {/* AI 개선 제안 */}
          <AIReviewPanel
            title={doc.title}
            isoClause={doc.related_iso ?? null}
            sections={sections}
          />
        </aside>
      </div>
    </div>
    </PrintLayout>
  );
}

export default async function DocumentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <AppLayout>
      <Suspense fallback={<ContentSpinner />}>
        <DocumentContent id={id} />
      </Suspense>
    </AppLayout>
  );
}
