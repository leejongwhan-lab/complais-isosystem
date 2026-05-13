"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AppLayout from "@/components/layout/AppLayout";
import { supabase } from "@/lib/supabase";
import { generateDocNumber } from "@/lib/docNumber";
import {
  getDefaultSectionTemplates,
  getSuggestedIsoClause,
  type DocumentTemplateContext,
  type SectionTemplate,
} from "@/lib/document-templates";
import { ChevronRight, Check, FileText, Upload, Sparkles, Copy } from "lucide-react";
import TurtleDiagram, { type TurtleData } from "@/components/documents/TurtleDiagram";

// ── 상수 ──────────────────────────────────────────────────────
const LAYER_LABELS: Record<string, string> = {
  C:  "C — 공통 품질경영",
  E:  "E — 환경경영",
  S:  "S — 안전보건경영",
  EN: "EN — 에너지경영",
  AB: "AB — 반부패경영",
  CM: "CM — 준법경영",
  IS: "IS — 정보보안경영",
  FS: "FS — 식품안전경영",
  BC: "BC — 사업연속성경영",
  MD: "MD — 의료기기품질",
  AI: "AI — AI경영",
  NQ: "NQ — 원자력품질",
  CG: "CG — 화장품GMP",
};

const PROCESS_BY_LAYER: Record<string, { value: string; label: string }[]> = {
  C: [
    { value: "110", label: "110 - 조직상황/리스크" },
    { value: "120", label: "120 - 조직/업무분장" },
    { value: "130", label: "130 - 사업계획" },
    { value: "140", label: "140 - 시스템관리" },
    { value: "150", label: "150 - 내부심사" },
    { value: "160", label: "160 - 경영검토" },
    { value: "170", label: "170 - 시정조치(CAPA)" },
    { value: "180", label: "180 - 개선" },
    { value: "210", label: "210 - 수주/계약" },
    { value: "220", label: "220 - 고객불만" },
    { value: "310", label: "310 - 신제품개발" },
    { value: "410", label: "410 - 구매" },
    { value: "420", label: "420 - 공급자관리" },
    { value: "510", label: "510 - 생산관리" },
    { value: "520", label: "520 - 공정관리" },
    { value: "530", label: "530 - 식별/추적성" },
    { value: "540", label: "540 - 변경관리" },
    { value: "550", label: "550 - 설비관리" },
    { value: "560", label: "560 - 5S활동" },
    { value: "570", label: "570 - 검사/시험" },
    { value: "580", label: "580 - 부적합관리" },
    { value: "610", label: "610 - 측정장비" },
    { value: "710", label: "710 - 인원관리" },
    { value: "720", label: "720 - 교육훈련" },
    { value: "760", label: "760 - 문서관리" },
    { value: "770", label: "770 - 기록관리" },
  ],
  E:  [
    { value: "810", label: "810 - 환경운영관리" },
    { value: "811", label: "811 - 환경목표" },
    { value: "812", label: "812 - 환경모니터링" },
  ],
  S:  [
    { value: "820", label: "820 - 안전보건운영" },
    { value: "821", label: "821 - 위험성평가" },
    { value: "822", label: "822 - 안전보건목표" },
  ],
  EN: [{ value: "830", label: "830 - 에너지관리" }],
  AB: [{ value: "840", label: "840 - 반부패관리" }],
  CM: [{ value: "850", label: "850 - 준법관리" }],
  IS: [{ value: "860", label: "860 - 정보보안관리" }],
  FS: [{ value: "870", label: "870 - 식품안전관리" }],
  BC: [{ value: "880", label: "880 - 사업연속성관리" }],
  MD: [{ value: "890", label: "890 - 의료기기품질" }],
  AI: [{ value: "900", label: "900 - AI경영관리" }],
  NQ: [{ value: "910", label: "910 - 원자력품질관리" }],
  CG: [{ value: "920", label: "920 - 화장품GMP관리" }],
};

const DOC_TYPES = [
  { value: "M", label: "매뉴얼", desc: "최상위 방침 문서" },
  { value: "P", label: "프로세스", desc: "업무 절차 기술" },
  { value: "R", label: "지침서", desc: "세부 작업 지침" },
  { value: "F", label: "서식", desc: "양식·기록지" },
];

const APPROVAL_STEPS = [
  { step: 1, step_name: "작성자 확인" },
  { step: 2, step_name: "1차 검토" },
  { step: 3, step_name: "부서장 승인" },
  { step: 4, step_name: "경영대리인 최종승인" },
];

type RelatedDoc = { id: string; doc_number: string; title: string; version: string; status: string };

type CompanyTemplateProfile = DocumentTemplateContext;
type CompanyRecord = {
  company_code: string | null;
  business_type: string | null;
  management_rep: string | null;
  std_iso9001: boolean;
  std_iso14001: boolean;
  std_iso45001: boolean;
  std_iatf: boolean;
  std_iso13485: boolean;
  std_iso50001: boolean;
  std_iso37001: boolean;
  std_iso37301: boolean;
  std_iso27001: boolean;
  std_iso22000: boolean;
  std_iso22301: boolean;
  std_iso42001: boolean;
  std_iso19443: boolean;
  std_iso22716: boolean;
};
type QuickStartPreset = {
  id: string;
  label: string;
  desc: string;
  layer: string;
  processCode: string;
  docType: string;
};

const STATUS_COLOR: Record<string, { color: string; bg: string }> = {
  active:   { color: "#2F9E44", bg: "#F0FBF4" },
  review:   { color: "#E03131", bg: "#FFF0F0" },
  draft:    { color: "#999",    bg: "#F5F5F5" },
  obsolete: { color: "#bbb",    bg: "#F5F5F5" },
};

// ── 공통 input 스타일 ─────────────────────────────────────────
const INPUT_STYLE: React.CSSProperties = {
  width: "100%", padding: "7px 10px",
  fontSize: 13, color: "#1a1a1a",
  border: "1px solid #E5E5E5", borderRadius: 6,
  background: "#fff", outline: "none",
  boxSizing: "border-box",
};

const DRAFT_STORAGE_KEY = "complais-doc-new-draft";

const BASE_QUICK_STARTS: QuickStartPreset[] = [
  { id: "capa", label: "시정조치", desc: "CAPA 프로세스 문서", layer: "C", processCode: "170", docType: "P" },
  { id: "internal-audit", label: "내부심사", desc: "심사 절차 문서", layer: "C", processCode: "150", docType: "P" },
  { id: "doc-control", label: "문서관리", desc: "문서화 정보 관리", layer: "C", processCode: "760", docType: "P" },
];

const STANDARD_QUICK_STARTS: Record<string, QuickStartPreset[]> = {
  std_iso14001: [{ id: "env-op", label: "환경운영", desc: "환경 운영관리 절차", layer: "E", processCode: "810", docType: "P" }],
  std_iso45001: [{ id: "safety-risk", label: "위험성평가", desc: "안전보건 위험성평가", layer: "S", processCode: "821", docType: "P" }],
  std_iso27001: [{ id: "infosec", label: "정보보안", desc: "정보보안 운영통제", layer: "IS", processCode: "860", docType: "P" }],
  std_iso22000: [{ id: "food-safety", label: "식품안전", desc: "식품안전 운영관리", layer: "FS", processCode: "870", docType: "P" }],
  std_iso22301: [{ id: "bcp", label: "BCP", desc: "사업연속성 대응", layer: "BC", processCode: "880", docType: "P" }],
  std_iso42001: [{ id: "ai-risk", label: "AI 운영", desc: "AI 시스템 운영통제", layer: "AI", processCode: "900", docType: "P" }],
};

function getProcessLabel(layer: string, processCode: string) {
  return PROCESS_BY_LAYER[layer]?.find((item) => item.value === processCode)?.label ?? processCode;
}

function getSuggestedTitle(layer: string, processCode: string, docType: string) {
  if (!layer || !processCode || !docType) return "";

  const processLabel = getProcessLabel(layer, processCode);
  const processName = processLabel.includes(" - ") ? processLabel.split(" - ")[1] ?? processLabel : processLabel;
  const typeLabel = DOC_TYPES.find((item) => item.value === docType)?.label ?? "문서";

  if (docType === "M") {
    const layerName = LAYER_LABELS[layer]?.split(" — ")[1] ?? LAYER_LABELS[layer] ?? "경영시스템";
    return `${layerName} ${typeLabel}`;
  }

  return `${processName} ${typeLabel}`;
}

function persistDraft(data: Record<string, unknown>) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(data));
}

function loadDraft(): Record<string, unknown> | null {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(DRAFT_STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as Record<string, unknown>;
  } catch {
    return null;
  }
}

function clearDraft() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(DRAFT_STORAGE_KEY);
}

// ── Step 인디케이터 ─────────────────────────────────────────
function StepBar({ step }: { step: number }) {
  const steps = ["기본 정보", "내용 작성", "결재선 설정"];
  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      {steps.map((label, i) => {
        const idx    = i + 1;
        const done   = step > idx;
        const active = step === idx;
        return (
          <div key={i} style={{ display: "flex", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
              <div style={{
                width: 22, height: 22, borderRadius: "50%",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 11, fontWeight: 700,
                background: done ? "#2F9E44" : active ? "#3B5BDB" : "#F0F0F0",
                color: done || active ? "#fff" : "#bbb",
              }}>
                {done ? <Check size={11} /> : idx}
              </div>
              <span style={{ fontSize: 13, fontWeight: active ? 600 : 400, color: done ? "#2F9E44" : active ? "#1a1a1a" : "#bbb" }}>
                {label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <ChevronRight size={14} color="#E5E5E5" style={{ margin: "0 10px" }} />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ── 우측 패널 ─────────────────────────────────────────────────
function RightPanel({
  step, layer, processCode, docType, title, ownerName,
  sectionContents, templates, file, approvers, docNumberPreview, relatedDocs, onLoadDoc, loadingSourceDocId,
}: {
  step: number; layer: string; processCode: string; docType: string;
  title: string; ownerName: string;
  sectionContents: Record<string, string>;
  templates: { key: string; title: string; placeholder: string }[];
  file: File | null; approvers: Record<number, string>;
  docNumberPreview: string; relatedDocs: RelatedDoc[];
  onLoadDoc: (docId: string) => void;
  loadingSourceDocId: string | null;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

      {/* 문서번호 미리보기 */}
      <div>
        <p style={{ margin: "0 0 8px", fontSize: 10, fontWeight: 600, color: "#bbb", textTransform: "uppercase", letterSpacing: "0.06em" }}>
          문서번호 미리보기
        </p>
        <div style={{ background: "#F0F4FF", border: "1px solid #C5D0FF", borderRadius: 8, padding: "14px 12px", textAlign: "center" }}>
          <span style={{ fontFamily: "'JetBrains Mono', 'Fira Mono', 'Courier New', monospace", fontSize: 18, fontWeight: 700, color: "#3B5BDB", letterSpacing: "0.04em" }}>
            {docNumberPreview}
          </span>
        </div>
      </div>

      {/* 선택 현황 */}
      <div>
        <p style={{ margin: "0 0 8px", fontSize: 10, fontWeight: 600, color: "#bbb", textTransform: "uppercase", letterSpacing: "0.06em" }}>
          선택 현황
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {[
            { key: "레이어",   val: layer       ? LAYER_LABELS[layer]                                                               : null },
            { key: "프로세스", val: processCode  ? (PROCESS_BY_LAYER[layer]?.find(p => p.value === processCode)?.label ?? processCode) : null },
            { key: "유형",     val: docType     ? DOC_TYPES.find(t => t.value === docType)?.label                                  : null },
            { key: "제목",     val: title.trim()    || null },
            { key: "담당자",   val: ownerName.trim() || null },
          ].map(({ key, val }) => (
            <div key={key} style={{ display: "flex", justifyContent: "space-between", gap: 8, fontSize: 12 }}>
              <span style={{ color: "#bbb", flexShrink: 0 }}>{key}</span>
              <span style={{ color: val ? "#1a1a1a" : "#E5E5E5", fontWeight: val ? 500 : 400, textAlign: "right", maxWidth: 140, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {val ?? "—"}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* {processCode} 기존 문서 */}
      {step === 1 && (
        <div>
          <p style={{ margin: "0 0 8px", fontSize: 10, fontWeight: 600, color: "#bbb", textTransform: "uppercase", letterSpacing: "0.06em" }}>
            {processCode} 기존 문서
          </p>
          {relatedDocs.length > 0 ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
              {relatedDocs.map(doc => {
                const sc = STATUS_COLOR[doc.status] ?? { color: "#999", bg: "#F5F5F5" };
                return (
                  <div key={doc.id} style={{ padding: "8px 10px", background: "#FAFAFA", border: "1px solid #E5E5E5", borderRadius: 6, display: "flex", alignItems: "start", gap: 8 }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ margin: 0, fontFamily: "monospace", fontSize: 11, fontWeight: 700, color: "#3B5BDB" }}>{doc.doc_number}</p>
                      <p style={{ margin: "2px 0 0", fontSize: 11, color: "#555", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{doc.title}</p>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "end", gap: 6, flexShrink: 0 }}>
                      <span style={{ fontSize: 10, fontWeight: 600, borderRadius: 4, padding: "1px 5px", color: sc.color, background: sc.bg, marginTop: 1 }}>
                        {doc.status}
                      </span>
                      <button
                        onClick={() => onLoadDoc(doc.id)}
                        disabled={loadingSourceDocId === doc.id}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 4,
                          padding: "3px 6px",
                          borderRadius: 4,
                          border: "1px solid #D0D7FF",
                          background: "#F5F8FF",
                          color: "#3B5BDB",
                          fontSize: 10,
                          fontWeight: 600,
                          cursor: loadingSourceDocId === doc.id ? "not-allowed" : "pointer",
                          opacity: loadingSourceDocId === doc.id ? 0.6 : 1,
                        }}
                      >
                        <Copy size={10} />
                        {loadingSourceDocId === doc.id ? "불러오는 중" : "내용 불러오기"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p style={{ fontSize: 12, color: "#bbb" }}>해당 프로세스 문서 없음</p>
          )}
        </div>
      )}

      {/* 섹션 작성 현황 (Step 2) */}
      {step === 2 && docType !== "F" && templates.length > 0 && (
        <div>
          <p style={{ margin: "0 0 8px", fontSize: 10, fontWeight: 600, color: "#bbb", textTransform: "uppercase", letterSpacing: "0.06em" }}>
            섹션 작성 현황
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {templates.map(t => {
              const filled = !!(sectionContents[t.key]?.trim());
              return (
                <div key={t.key} style={{ display: "flex", alignItems: "center", gap: 7 }}>
                  <div style={{
                    width: 14, height: 14, borderRadius: 3, flexShrink: 0,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    background: filled ? "#3B5BDB" : "#F0F0F0",
                  }}>
                    {filled && <Check size={9} color="#fff" />}
                  </div>
                  <span style={{ fontSize: 12, color: filled ? "#1a1a1a" : "#bbb", fontWeight: filled ? 500 : 400 }}>
                    {t.title}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {step === 2 && docType === "F" && (
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <FileText size={12} color={file ? "#3B5BDB" : "#bbb"} />
          <span style={{ fontSize: 12, color: file ? "#1a1a1a" : "#bbb" }}>
            {file ? file.name : "파일 미선택"}
          </span>
        </div>
      )}

      {/* 결재선 미리보기 (Step 3) */}
      {step === 3 && (
        <div>
          <p style={{ margin: "0 0 8px", fontSize: 10, fontWeight: 600, color: "#bbb", textTransform: "uppercase", letterSpacing: "0.06em" }}>
            결재선 미리보기
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {APPROVAL_STEPS.map(s => {
              const name = approvers[s.step]?.trim() || null;
              return (
                <div key={s.step} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{
                    width: 18, height: 18, borderRadius: "50%", flexShrink: 0,
                    background: "#EEF2FF", color: "#3B5BDB",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 10, fontWeight: 700,
                  }}>
                    {s.step}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ margin: 0, fontSize: 11, color: "#bbb" }}>{s.step_name}</p>
                    <p style={{ margin: 0, fontSize: 12, fontWeight: 600, color: name ? "#1a1a1a" : "#E5E5E5", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {name ?? "—"}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// ── 메인 페이지 ───────────────────────────────────────────────
export default function NewDocumentPage() {
  const router = useRouter();
  const [step, setStep]     = useState(1);
  const [saving, setSaving] = useState(false);

  const [companyCode, setCompanyCode] = useState<string>("");
  const [companyTemplateProfile, setCompanyTemplateProfile] = useState<CompanyTemplateProfile>({ businessType: null, standards: {} });

  const [layer,        setLayer]        = useState("");
  const [processCode,  setProcessCode]  = useState("");
  const [docType,      setDocType]      = useState("");
  const [title,        setTitle]        = useState("");
  const [titleTouched, setTitleTouched] = useState(false);
  const [ownerName,    setOwnerName]    = useState("");
  const [relatedIso,   setRelatedIso]   = useState("");
  const [relatedIsoTouched, setRelatedIsoTouched] = useState(false);
  const [changeReason, setChangeReason] = useState("");

  const [sectionContents, setSectionContents] = useState<Record<string, string>>({});
  const [loadingSections, setLoadingSections] = useState<Record<string, boolean>>({});
  const [toast, setToast]   = useState<string | null>(null);
  const [file,    setFile]    = useState<File | null>(null);
  const [dragging,setDragging]= useState(false);

  const [approvers, setApprovers] = useState<Record<number, string>>({ 1: "", 2: "", 3: "", 4: "" });
  const [relatedDocs, setRelatedDocs]   = useState<RelatedDoc[]>([]);
  const [dbTemplate, setDbTemplate]     = useState<SectionTemplate[] | null>(null);
  const [dbIsoClause, setDbIsoClause]   = useState("");
  const [docNumberActual, setDocNumberActual] = useState<string>("");
  const [loadingSourceDocId, setLoadingSourceDocId] = useState<string | null>(null);

  const [turtleData, setTurtleData] = useState<TurtleData>({
    processName: "", purpose: "", responsible: "",
    input: [], output: [],
    who: { items: [], links: [] },
    withWhat: { items: [], links: [] },
    how: { items: [], links: [] },
    kpi: { items: [], links: [] },
  });
  const [hasSavedDraft, setHasSavedDraft] = useState(false);

  // 회사 코드 로드
  useEffect(() => {
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) return;
      const { data: profile } = await supabase
        .from("profiles").select("company_id, full_name").eq("id", user.id).single();
      if (!profile?.company_id) return;
      const { data: company } = await supabase
        .from("companies")
        .select(
          "company_code, business_type, management_rep, std_iso9001, std_iso14001, std_iso45001, std_iatf, std_iso13485, " +
          "std_iso50001, std_iso37001, std_iso37301, std_iso27001, std_iso22000, std_iso22301, std_iso42001, std_iso19443, std_iso22716"
        )
        .eq("id", profile.company_id)
        .single();
      if (!company) return;
      const c = company as unknown as CompanyRecord;
      const code = c.company_code || "";
      const profileName = (profile as { full_name?: string | null } | null)?.full_name?.trim() ?? "";
      const owner = profileName || c.management_rep || "";
      setCompanyCode(code);
      setOwnerName((prev) => prev || owner);
      setApprovers((prev) => ({
        1: prev[1] || owner,
        2: prev[2],
        3: prev[3],
        4: prev[4] || c.management_rep || owner,
      }));
      setCompanyTemplateProfile({
        businessType: c.business_type,
        standards: {
          std_iso9001: c.std_iso9001,
          std_iso14001: c.std_iso14001,
          std_iso45001: c.std_iso45001,
          std_iatf: c.std_iatf,
          std_iso13485: c.std_iso13485,
          std_iso50001: c.std_iso50001,
          std_iso37001: c.std_iso37001,
          std_iso37301: c.std_iso37301,
          std_iso27001: c.std_iso27001,
          std_iso22000: c.std_iso22000,
          std_iso22301: c.std_iso22301,
          std_iso42001: c.std_iso42001,
          std_iso19443: c.std_iso19443,
          std_iso22716: c.std_iso22716,
        },
      });
      console.log("[docNew] companyCode loaded:", code || "(없음 — 설정 페이지에서 회사코드 설정 필요)");
    });

    const draftFrame = window.requestAnimationFrame(() => {
      setHasSavedDraft(Boolean(loadDraft()));
    });

    return () => window.cancelAnimationFrame(draftFrame);
  }, []);

  useEffect(() => {
    if (!processCode) return;
    supabase.from("documents").select("id, doc_number, title, version, status")
      .eq("process_no", processCode).order("doc_number").limit(6)
      .then(({ data }) => setRelatedDocs((data ?? []) as RelatedDoc[]));
  }, [processCode]);

  // 문서번호 실시간 미리보기 (max 기반)
  useEffect(() => {
    let active = true;

    async function loadDocNumber() {
      if (!layer || !processCode || !docType) {
        if (active) setDocNumberActual("");
        return;
      }

      const num = await generateDocNumber(supabase, companyCode, layer, processCode, docType);
      if (!active) return;
      console.log("[docNew] docNumber preview:", num);
      setDocNumberActual(num);
    }

    void loadDocNumber();
    return () => {
      active = false;
    };
  }, [layer, processCode, docType, companyCode]);

  useEffect(() => {
    let active = true;

    async function loadTemplate() {
      if (!layer || !processCode || !docType || docType === "F") {
        if (active) {
          setDbTemplate(null);
          setDbIsoClause("");
        }
        return;
      }

      const { data } = await supabase
        .from("document_templates")
        .select("sections, iso_clause")
        .eq("layer", layer)
        .eq("process_no", processCode)
        .eq("doc_type", docType)
        .eq("is_active", true)
        .order("sort_order")
        .limit(1);

      if (!active) return;
      const tpl = data?.[0] as { sections: SectionTemplate[]; iso_clause?: string | null } | undefined;
      setDbTemplate(
        tpl?.sections && Array.isArray(tpl.sections) ? tpl.sections : null
      );
      setDbIsoClause(tpl?.iso_clause?.trim() ?? "");
    }

    void loadTemplate();
    return () => {
      active = false;
    };
  }, [layer, processCode, docType]);

  const handleAIDraft = async (key: string, sectionTitle: string) => {
    setLoadingSections(prev => ({ ...prev, [key]: true }));
    try {
      const res = await fetch("/api/ai/draft", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ docType, sectionKey: sectionTitle, title, isoClause: relatedIso, layer }),
      });
      const json = await res.json() as { content?: string; error?: string };
      if (!res.ok) throw new Error(json.error ?? "AI 호출 실패");
      setSectionContents(prev => ({ ...prev, [key]: json.content ?? "" }));
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "AI 초안 생성 실패";
      setToast(msg);
      setTimeout(() => setToast(null), 3000);
    } finally {
      setLoadingSections(prev => ({ ...prev, [key]: false }));
    }
  };

  const templates = dbTemplate ?? getDefaultSectionTemplates(docType, {
    layer,
    businessType: companyTemplateProfile.businessType,
    standards: companyTemplateProfile.standards,
  });
  const suggestedIsoClause = dbIsoClause || getSuggestedIsoClause(layer, processCode);
  useEffect(() => {
    if (relatedIsoTouched || !suggestedIsoClause || relatedIso === suggestedIsoClause) return;
    const frame = window.requestAnimationFrame(() => {
      setRelatedIso(suggestedIsoClause);
    });
    return () => window.cancelAnimationFrame(frame);
  }, [relatedIso, relatedIsoTouched, suggestedIsoClause]);

  const quickStartPresets = [
    ...BASE_QUICK_STARTS,
    ...Object.entries(companyTemplateProfile.standards ?? {})
      .flatMap(([key, enabled]) => (enabled ? (STANDARD_QUICK_STARTS[key] ?? []) : [])),
  ].slice(0, 6);
  const step1Valid  = !!(layer && processCode && docType && title.trim());

  const saveDraftSnapshot = (next: Partial<{
    layer: string;
    processCode: string;
    docType: string;
    title: string;
    titleTouched: boolean;
    ownerName: string;
    relatedIso: string;
    relatedIsoTouched: boolean;
    changeReason: string;
    sectionContents: Record<string, string>;
    approvers: Record<number, string>;
  }> = {}) => {
    const snapshot = {
      layer,
      processCode,
      docType,
      title,
      titleTouched,
      ownerName,
      relatedIso,
      relatedIsoTouched,
      changeReason,
      sectionContents,
      approvers,
      ...next,
    };
    persistDraft(snapshot);
    setHasSavedDraft(true);
  };

  const applyPreset = (preset: QuickStartPreset) => {
    setLayer(preset.layer);
    setProcessCode(preset.processCode);
    setDocType(preset.docType);
    setTitleTouched(false);
    const suggested = getSuggestedTitle(preset.layer, preset.processCode, preset.docType);
    const suggestedClause = getSuggestedIsoClause(preset.layer, preset.processCode);
    setTitle(suggested);
    setRelatedIso(suggestedClause);
    setRelatedIsoTouched(false);
    saveDraftSnapshot({
      layer: preset.layer,
      processCode: preset.processCode,
      docType: preset.docType,
      title: suggested,
      titleTouched: false,
      relatedIso: suggestedClause,
      relatedIsoTouched: false,
    });
  };

  const restoreDraft = () => {
    const draft = loadDraft();
    if (!draft) return;
    setLayer(typeof draft.layer === "string" ? draft.layer : "");
    setProcessCode(typeof draft.processCode === "string" ? draft.processCode : "");
    setDocType(typeof draft.docType === "string" ? draft.docType : "");
    setTitle(typeof draft.title === "string" ? draft.title : "");
    setTitleTouched(Boolean(draft.titleTouched));
    setOwnerName(typeof draft.ownerName === "string" ? draft.ownerName : "");
    setRelatedIso(typeof draft.relatedIso === "string" ? draft.relatedIso : "");
    setRelatedIsoTouched(Boolean(draft.relatedIsoTouched));
    setChangeReason(typeof draft.changeReason === "string" ? draft.changeReason : "");
    setSectionContents((draft.sectionContents as Record<string, string>) ?? {});
    setApprovers((draft.approvers as Record<number, string>) ?? { 1: "", 2: "", 3: "", 4: "" });
  };

  const handleLoadFromDocument = async (docId: string) => {
    setLoadingSourceDocId(docId);
    try {
      const [docRes, sectionsRes, approvalsRes] = await Promise.all([
        supabase
          .from("documents")
          .select("layer, process_no, doc_type, title, owner_name, related_iso, turtle_data")
          .eq("id", docId)
          .single(),
        supabase
          .from("document_sections")
          .select("section_key, content")
          .eq("document_id", docId)
          .order("section_order"),
        supabase
          .from("document_approvals")
          .select("step, approver_name")
          .eq("document_id", docId)
          .order("step"),
      ]);

      if (docRes.error || !docRes.data) {
        throw docRes.error ?? new Error("문서 정보를 불러오지 못했습니다.");
      }

      const sourceDoc = docRes.data as {
        layer: string;
        process_no: string;
        doc_type: string;
        title: string;
        owner_name: string | null;
        related_iso: string | null;
        turtle_data?: TurtleData | null;
      };
      const nextSectionContents = Object.fromEntries(
        ((sectionsRes.data ?? []) as { section_key: string; content: string | null }[])
          .map((section) => [section.section_key, section.content ?? ""])
      );
      const nextApprovers = {
        1: "",
        2: "",
        3: "",
        4: "",
        ...Object.fromEntries(
          ((approvalsRes.data ?? []) as { step: number; approver_name: string | null }[])
            .map((approval) => [approval.step, approval.approver_name ?? ""])
        ),
      } as Record<number, string>;

      setLayer(sourceDoc.layer);
      setProcessCode(sourceDoc.process_no);
      setDocType(sourceDoc.doc_type);
      setTitle(sourceDoc.title);
      setTitleTouched(true);
      setOwnerName(sourceDoc.owner_name ?? "");
      setRelatedIso(sourceDoc.related_iso ?? "");
      setRelatedIsoTouched(Boolean(sourceDoc.related_iso));
      setSectionContents(nextSectionContents);
      setApprovers(nextApprovers);
      if (sourceDoc.doc_type === "P" && sourceDoc.turtle_data) {
        setTurtleData(sourceDoc.turtle_data);
      }
      setStep(2);
      saveDraftSnapshot({
        layer: sourceDoc.layer,
        processCode: sourceDoc.process_no,
        docType: sourceDoc.doc_type,
        title: sourceDoc.title,
        titleTouched: true,
        ownerName: sourceDoc.owner_name ?? "",
        relatedIso: sourceDoc.related_iso ?? "",
        relatedIsoTouched: Boolean(sourceDoc.related_iso),
        sectionContents: nextSectionContents,
        approvers: nextApprovers,
      });
      setToast("기존 문서 내용을 불러왔습니다.");
      setTimeout(() => setToast(null), 2500);
    } catch (error) {
      const message = error instanceof Error ? error.message : "문서 내용을 불러오지 못했습니다.";
      setToast(message);
      setTimeout(() => setToast(null), 3000);
    } finally {
      setLoadingSourceDocId(null);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/documents/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          company_code: companyCode,
          layer,
          process_no: processCode,
          doc_type: docType,
          title: title.trim(),
          owner_name: ownerName.trim() || null,
          related_iso: relatedIso.trim() || null,
          change_reason: changeReason.trim() || "최초 작성",
          sections: templates.map((template) => ({
            key: template.key,
            title: template.title,
            content: sectionContents[template.key] ?? null,
          })),
          approvals: APPROVAL_STEPS.map((stepInfo) => ({
            step: stepInfo.step,
            step_name: stepInfo.step_name,
            approver_name: approvers[stepInfo.step]?.trim() || null,
          })),
          turtle_data: docType === "P" ? turtleData : null,
        }),
      });
      const json = await res.json() as { id?: string; error?: string };
      if (!res.ok || !json.id) {
        throw new Error(json.error ?? "문서 생성 실패");
      }
      const docId = json.id;

      clearDraft();
      setHasSavedDraft(false);

      router.push(`/documents/${docId}`);
    } catch (err) {
      const e = err as { message?: string };
      console.error("handleSave 에러:", e?.message ?? err);
      alert(`저장 중 오류가 발생했습니다.\n${e?.message ?? "알 수 없는 오류"}`);
    } finally {
      setSaving(false);
    }
  };

  // ── 공통 카드 버튼 스타일 ──────────────────────────────────
  const cardStyle = (selected: boolean): React.CSSProperties => ({
    display: "flex", flexDirection: "column", alignItems: "start",
    padding: "10px 12px", borderRadius: 6, cursor: "pointer", textAlign: "left",
    border: selected ? "1px solid #3B5BDB" : "1px solid #E5E5E5",
    background: selected ? "#EEF2FF" : "#fff",
    transition: "border-color 0.15s",
  });

  return (
    <AppLayout>
      <div style={{ display: "flex", flexDirection: "column", height: "calc(100vh - 56px)" }}>

        {/* 회사코드 경고 */}
        {!companyCode && (
          <div style={{ background: "#FFF9DB", borderBottom: "1px solid #FFE066", padding: "8px 24px", flexShrink: 0, display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 12, color: "#92400E", fontWeight: 500 }}>
              ⚠ 회사 코드가 설정되지 않았습니다. 설정 &gt; 회사 코드를 먼저 설정하면 정확한 문서번호가 생성됩니다.
            </span>
            <a href="/settings" style={{ fontSize: 12, fontWeight: 600, color: "#B45309", textDecoration: "underline" }}>설정으로 이동</a>
          </div>
        )}
        {/* Step 인디케이터 */}
        <div style={{ background: "#fff", borderBottom: "1px solid #E5E5E5", padding: "12px 24px", flexShrink: 0 }}>
          <StepBar step={step} />
        </div>

        {/* 2컬럼 */}
        <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>

          {/* ── 좌측: 폼 ── */}
          <div style={{ flex: 1, overflowY: "auto", padding: "24px 32px", background: "#fff" }}>

            {/* ══ Step 1 ══ */}
            {step === 1 && (
              <div style={{ display: "flex", flexDirection: "column", gap: 22, maxWidth: 560 }}>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
                    <label style={{ fontSize: 11, fontWeight: 600, color: "#999", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                      빠른 시작
                    </label>
                    {hasSavedDraft && (
                      <button
                        onClick={restoreDraft}
                        style={{ padding: "4px 10px", borderRadius: 999, border: "1px solid #C5D0FF", background: "#F0F4FF", color: "#3B5BDB", fontSize: 11, fontWeight: 600, cursor: "pointer" }}
                      >
                        임시저장 복원
                      </button>
                    )}
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 8 }}>
                    {quickStartPresets.map((preset) => (
                      <button
                        key={preset.id}
                        onClick={() => applyPreset(preset)}
                        style={{
                          padding: "10px 12px",
                          borderRadius: 8,
                          border: "1px solid #E5E5E5",
                          background: "#FAFAFA",
                          textAlign: "left",
                          cursor: "pointer",
                        }}
                      >
                        <div style={{ fontSize: 12, fontWeight: 700, color: "#1a1a1a" }}>{preset.label}</div>
                        <div style={{ marginTop: 2, fontSize: 11, color: "#777" }}>{preset.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 레이어 */}
                <div>
                  <label style={{ display: "block", marginBottom: 6, fontSize: 11, fontWeight: 600, color: "#999", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                    레이어 <span style={{ color: "#E03131" }}>*</span>
                  </label>
                  <select
                    value={layer}
                    onChange={e => {
                      const nextLayer = e.target.value;
                      const nextCodes = PROCESS_BY_LAYER[nextLayer] ?? [];
                      const nextProcessCode = nextCodes[0]?.value ?? "";
                      const nextIsoClause = getSuggestedIsoClause(nextLayer, nextProcessCode);
                      setLayer(nextLayer);
                      setProcessCode(nextProcessCode);
                      if (!titleTouched) {
                        setTitle(getSuggestedTitle(nextLayer, nextProcessCode, docType));
                      }
                      if (!relatedIsoTouched) {
                        setRelatedIso(nextIsoClause);
                      }
                      saveDraftSnapshot({
                        layer: nextLayer,
                        processCode: nextProcessCode,
                        title: !titleTouched ? getSuggestedTitle(nextLayer, nextProcessCode, docType) : title,
                        relatedIso: !relatedIsoTouched ? nextIsoClause : relatedIso,
                      });
                    }}
                    style={{ ...INPUT_STYLE, cursor: "pointer" }}
                    className="focus:border-[#3B5BDB] transition-colors"
                  >
                    <option value="">— 레이어 선택 —</option>
                    {Object.entries(LAYER_LABELS).map(([key, label]) => (
                      <option key={key} value={key}>{label}</option>
                    ))}
                  </select>
                </div>

                {/* 프로세스 코드 + 문서 유형 */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
                  <div>
                    <label style={{ display: "block", marginBottom: 6, fontSize: 11, fontWeight: 600, color: "#999", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                      프로세스 코드 <span style={{ color: "#E03131" }}>*</span>
                    </label>
                    <select
                      value={processCode}
                      onChange={e => {
                        const nextProcessCode = e.target.value;
                        const nextIsoClause = getSuggestedIsoClause(layer, nextProcessCode);
                        setProcessCode(nextProcessCode);
                        if (!titleTouched) {
                          setTitle(getSuggestedTitle(layer, nextProcessCode, docType));
                        }
                        if (!relatedIsoTouched) {
                          setRelatedIso(nextIsoClause);
                        }
                        saveDraftSnapshot({
                          processCode: nextProcessCode,
                          title: !titleTouched ? getSuggestedTitle(layer, nextProcessCode, docType) : title,
                          relatedIso: !relatedIsoTouched ? nextIsoClause : relatedIso,
                        });
                      }}
                      disabled={!layer}
                      style={{ ...INPUT_STYLE, cursor: layer ? "pointer" : "not-allowed", opacity: layer ? 1 : 0.5 }}
                      className="focus:border-[#3B5BDB] transition-colors"
                    >
                      {!layer && <option value="">— 레이어 먼저 선택 —</option>}
                      {(PROCESS_BY_LAYER[layer] ?? []).map(pc => (
                        <option key={pc.value} value={pc.value}>{pc.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label style={{ display: "block", marginBottom: 6, fontSize: 11, fontWeight: 600, color: "#999", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                      문서 유형 <span style={{ color: "#E03131" }}>*</span>
                    </label>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
                      {DOC_TYPES.map(t => (
                        <button
                          key={t.value}
                          onClick={() => {
                            const nextIsoClause = getSuggestedIsoClause(layer, processCode);
                            setDocType(t.value);
                            if (!titleTouched) {
                              setTitle(getSuggestedTitle(layer, processCode, t.value));
                            }
                            if (!relatedIsoTouched) {
                              setRelatedIso(nextIsoClause);
                            }
                            saveDraftSnapshot({
                              docType: t.value,
                              title: !titleTouched ? getSuggestedTitle(layer, processCode, t.value) : title,
                              relatedIso: !relatedIsoTouched ? nextIsoClause : relatedIso,
                            });
                          }}
                          style={cardStyle(docType === t.value)}
                        >
                          <span style={{ fontSize: 12, fontWeight: 600, color: docType === t.value ? "#3B5BDB" : "#1a1a1a" }}>
                            {t.value} — {t.label}
                          </span>
                          <span style={{ fontSize: 11, color: "#bbb", marginTop: 2 }}>{t.desc}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* 제목 */}
                <div>
                  <label style={{ display: "block", marginBottom: 6, fontSize: 11, fontWeight: 600, color: "#999", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                    문서 제목 <span style={{ color: "#E03131" }}>*</span>
                  </label>
                  <input
                    type="text" value={title} onChange={e => {
                      setTitle(e.target.value);
                      setTitleTouched(true);
                      saveDraftSnapshot({ title: e.target.value, titleTouched: true });
                    }}
                    placeholder="예: 설계변경 관리 프로세스"
                    style={INPUT_STYLE}
                    className="focus:border-[#3B5BDB] transition-colors placeholder:text-[#bbb]"
                  />
                  {!titleTouched && layer && processCode && docType && (
                    <p style={{ margin: "6px 0 0", fontSize: 11, color: "#999" }}>
                      선택값 기준으로 제목을 자동 제안했습니다. 그대로 쓰거나 수정하면 됩니다.
                    </p>
                  )}
                </div>

                {/* 담당자 + ISO */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
                  <div>
                    <label style={{ display: "block", marginBottom: 6, fontSize: 11, fontWeight: 600, color: "#999", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                      담당자
                    </label>
                    <input type="text" value={ownerName} onChange={e => {
                      setOwnerName(e.target.value);
                      saveDraftSnapshot({ ownerName: e.target.value });
                    }}
                      placeholder="홍길동" style={INPUT_STYLE}
                      className="focus:border-[#3B5BDB] transition-colors placeholder:text-[#bbb]" />
                  </div>
                  <div>
                    <label style={{ display: "block", marginBottom: 6, fontSize: 11, fontWeight: 600, color: "#999", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                      관련 ISO 조항
                    </label>
                    <input type="text" value={relatedIso} onChange={e => {
                      setRelatedIso(e.target.value);
                      setRelatedIsoTouched(true);
                      saveDraftSnapshot({ relatedIso: e.target.value, relatedIsoTouched: true });
                    }}
                      placeholder="예: 8.3" style={INPUT_STYLE}
                      className="focus:border-[#3B5BDB] transition-colors placeholder:text-[#bbb]" />
                    {!relatedIsoTouched && suggestedIsoClause && (
                      <p style={{ margin: "6px 0 0", fontSize: 11, color: "#999" }}>
                        선택한 프로세스 기준으로 ISO 조항을 자동 제안했습니다.
                      </p>
                    )}
                  </div>
                </div>

                {/* 작성 사유 */}
                <div>
                  <label style={{ display: "block", marginBottom: 6, fontSize: 11, fontWeight: 600, color: "#999", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                    작성 사유
                  </label>
                  <input type="text" value={changeReason} onChange={e => {
                    setChangeReason(e.target.value);
                    saveDraftSnapshot({ changeReason: e.target.value });
                  }}
                    placeholder="예: 최초 작성" style={INPUT_STYLE}
                    className="focus:border-[#3B5BDB] transition-colors placeholder:text-[#bbb]" />
                </div>
              </div>
            )}

            {/* ══ Step 2 ══ */}
            {step === 2 && (
              <div style={{ display: "flex", flexDirection: "column", gap: 12, maxWidth: 560 }}>
                {docType === "F" ? (
                  <div
                    onDragOver={e => { e.preventDefault(); setDragging(true); }}
                    onDragLeave={() => setDragging(false)}
                    onDrop={e => { e.preventDefault(); setDragging(false); const f = e.dataTransfer.files[0]; if (f) setFile(f); }}
                    style={{
                      border: `2px dashed ${dragging ? "#3B5BDB" : "#E5E5E5"}`, borderRadius: 8,
                      padding: "40px 24px", display: "flex", flexDirection: "column",
                      alignItems: "center", gap: 10, background: dragging ? "#F5F8FF" : "#FAFAFA",
                    }}
                  >
                    <Upload size={24} color="#bbb" />
                    {file ? (
                      <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: "#3B5BDB" }}>{file.name}</p>
                    ) : (
                      <>
                        <p style={{ margin: 0, fontSize: 13, fontWeight: 500, color: "#555" }}>드래그하거나 클릭하여 업로드</p>
                        <p style={{ margin: 0, fontSize: 11, color: "#bbb" }}>PDF, DOCX, XLSX, HWP</p>
                      </>
                    )}
                    <label style={{ marginTop: 4, padding: "5px 12px", borderRadius: 6, border: "1px solid #E5E5E5", background: "#fff", fontSize: 12, fontWeight: 500, color: "#555", cursor: "pointer" }}
                      className="hover:bg-[#F5F5F5] transition-colors">
                      파일 선택
                      <input type="file" className="hidden" accept=".pdf,.docx,.xlsx,.hwp"
                        onChange={e => { const f = e.target.files?.[0]; if (f) setFile(f); }} />
                    </label>
                  </div>
                ) : (
                  templates.map(t => (
                    <div key={t.key} style={{ border: "1px solid #E5E5E5", borderRadius: 8, padding: "14px 16px", background: "#fff" }}>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
                        <label style={{ fontSize: 13, fontWeight: 600, color: "#1a1a1a" }}>{t.title}</label>
                        <button
                          onClick={() => handleAIDraft(t.key, t.title)}
                          disabled={loadingSections[t.key]}
                          style={{
                            display: "flex", alignItems: "center", gap: 4,
                            padding: "3px 8px", borderRadius: 4,
                            cursor: loadingSections[t.key] ? "not-allowed" : "pointer",
                            fontSize: 11, fontWeight: 600, color: "#7048E8",
                            border: "1px solid #D4BFFF", background: "#F3F0FF",
                            opacity: loadingSections[t.key] ? 0.6 : 1,
                          }}
                          className="hover:opacity-80 transition-opacity"
                        >
                          {loadingSections[t.key] ? (
                            <div className="w-3 h-3 border border-[#7048E8] border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <Sparkles size={10} />
                          )}
                          {loadingSections[t.key] ? "생성 중..." : "AI 초안"}
                        </button>
                      </div>
                      <textarea
                        rows={5} value={sectionContents[t.key] ?? ""}
                        onChange={e => {
                          const nextContents = { ...sectionContents, [t.key]: e.target.value };
                          setSectionContents(nextContents);
                          saveDraftSnapshot({ sectionContents: nextContents });
                        }}
                        placeholder={t.placeholder}
                        style={{ ...INPUT_STYLE, resize: "vertical", lineHeight: 1.7 }}
                        className="focus:border-[#3B5BDB] transition-colors placeholder:text-[#bbb]"
                      />
                    </div>
                  ))
                )}

                {/* 거북이표 (절차서 P 유형만) */}
                {docType === "P" && (
                  <div style={{ marginTop: 24, border: "1px solid #E5E5E5", borderRadius: 8, padding: "16px", background: "#fff" }}>
                    <p style={{ margin: "0 0 12px", fontSize: 13, fontWeight: 600, color: "#1a1a1a" }}>
                      프로세스 거북이표 <span style={{ fontSize: 11, color: "#bbb", fontWeight: 400 }}>(선택사항)</span>
                    </p>
                    <TurtleDiagram
                      {...turtleData}
                      editable={true}
                      onChange={setTurtleData}
                    />
                  </div>
                )}
              </div>
            )}

            {/* ══ Step 3 ══ */}
            {step === 3 && (
              <div style={{ display: "flex", flexDirection: "column", gap: 8, maxWidth: 560 }}>
                <p style={{ margin: "0 0 8px", fontSize: 13, color: "#555" }}>
                  결재선을 설정합니다. 이름을 비워두면 해당 단계는 생략됩니다.
                </p>
                {APPROVAL_STEPS.map(s => (
                  <div key={s.step} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", border: "1px solid #E5E5E5", borderRadius: 8, background: "#fff" }}>
                    <div style={{
                      width: 24, height: 24, borderRadius: "50%", flexShrink: 0,
                      background: "#EEF2FF", color: "#3B5BDB",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 11, fontWeight: 700,
                    }}>
                      {s.step}
                    </div>
                    <div style={{ flex: 1 }}>
                      <p style={{ margin: "0 0 5px", fontSize: 12, fontWeight: 600, color: "#555" }}>{s.step_name}</p>
                      <input
                        type="text" value={approvers[s.step] ?? ""}
                        onChange={e => {
                          const nextApprovers = { ...approvers, [s.step]: e.target.value };
                          setApprovers(nextApprovers);
                          saveDraftSnapshot({ approvers: nextApprovers });
                        }}
                        placeholder={s.step === 1 ? ownerName || "작성자 이름" : "담당자 이름"}
                        style={{ ...INPUT_STYLE, background: "#FAFAFA" }}
                        className="focus:border-[#3B5BDB] transition-colors placeholder:text-[#bbb]"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* 하단 버튼 */}
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 24, maxWidth: 560 }}>
              {step > 1 && (
                <button
                  onClick={() => setStep(s => s - 1)}
                  style={{ padding: "6px 14px", borderRadius: 6, border: "1px solid #E5E5E5", background: "#fff", fontSize: 13, fontWeight: 500, color: "#555", cursor: "pointer" }}
                  className="hover:bg-[#F5F5F5] transition-colors"
                >
                  이전
                </button>
              )}
              <div style={{ flex: 1 }} />
              {step < 3 ? (
                <button
                  onClick={() => setStep(s => s + 1)}
                  disabled={step === 1 && !step1Valid}
                  style={{
                    padding: "6px 16px", borderRadius: 6, border: "none",
                    fontSize: 13, fontWeight: 600, color: "#fff", background: "#3B5BDB",
                    cursor: (step === 1 && !step1Valid) ? "not-allowed" : "pointer",
                    opacity: (step === 1 && !step1Valid) ? 0.4 : 1,
                  }}
                  className="hover:opacity-90 transition-opacity"
                >
                  다음
                </button>
              ) : (
                <button
                  onClick={handleSave}
                  disabled={saving}
                  style={{
                    padding: "6px 16px", borderRadius: 6, border: "none",
                    fontSize: 13, fontWeight: 600, color: "#fff", background: "#2F9E44",
                    cursor: saving ? "not-allowed" : "pointer", opacity: saving ? 0.5 : 1,
                  }}
                  className="hover:opacity-90 transition-opacity"
                >
                  {saving ? "저장 중..." : "문서 저장"}
                </button>
              )}
            </div>
          </div>

          {/* ── 우측: 패널 ── */}
          <aside style={{
            width: 260, flexShrink: 0,
            background: "#FAFAFA", borderLeft: "1px solid #E5E5E5",
            overflowY: "auto",
          }}>
            <div style={{ padding: "20px 16px", position: "sticky", top: 0 }}>
              <RightPanel
                step={step} layer={layer} processCode={processCode} docType={docType}
                title={title} ownerName={ownerName}
                sectionContents={sectionContents} templates={templates}
                file={file} approvers={approvers}
                docNumberPreview={docNumberActual || (layer && docType ? "생성 중..." : "—")}
                relatedDocs={relatedDocs}
                onLoadDoc={handleLoadFromDocument}
                loadingSourceDocId={loadingSourceDocId}
              />
            </div>
          </aside>
        </div>
      </div>
      {toast && (
        <div style={{
          position: "fixed", bottom: 24, left: "50%", transform: "translateX(-50%)",
          background: "#1a1a1a", color: "#fff", borderRadius: 8,
          padding: "10px 18px", fontSize: 13, fontWeight: 500,
          boxShadow: "0 4px 16px rgba(0,0,0,0.18)", zIndex: 9999,
          whiteSpace: "nowrap",
        }}>
          {toast}
        </div>
      )}
    </AppLayout>
  );
}
