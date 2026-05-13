import type { CSSProperties } from "react";

export const LAYER_LABELS: Record<string, string> = {
  C: "C — 공통 품질경영",
  E: "E — 환경경영",
  S: "S — 안전보건경영",
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

export const PROCESS_BY_LAYER: Record<string, { value: string; label: string }[]> = {
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
  E: [
    { value: "810", label: "810 - 환경운영관리" },
    { value: "811", label: "811 - 환경목표" },
    { value: "812", label: "812 - 환경모니터링" },
  ],
  S: [
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

export const DOC_TYPES = [
  { value: "M", label: "매뉴얼", desc: "최상위 방침 문서" },
  { value: "P", label: "프로세스", desc: "업무 절차 기술" },
  { value: "R", label: "지침서", desc: "세부 작업 지침" },
  { value: "F", label: "서식", desc: "양식·기록지" },
];

export const APPROVAL_STEPS = [
  { step: 1, step_name: "작성자 확인" },
  { step: 2, step_name: "1차 검토" },
  { step: 3, step_name: "부서장 승인" },
  { step: 4, step_name: "경영대리인 최종승인" },
];

export type RelatedDoc = {
  id: string;
  doc_number: string;
  title: string;
  version: string;
  status: string;
};

export type QuickStartPreset = {
  id: string;
  label: string;
  desc: string;
  layer: string;
  processCode: string;
  docType: string;
};

export const STATUS_COLOR: Record<string, { color: string; bg: string }> = {
  active: { color: "#2F9E44", bg: "#F0FBF4" },
  review: { color: "#E03131", bg: "#FFF0F0" },
  draft: { color: "#999", bg: "#F5F5F5" },
  obsolete: { color: "#bbb", bg: "#F5F5F5" },
};

export const INPUT_STYLE: CSSProperties = {
  width: "100%",
  padding: "7px 10px",
  fontSize: 13,
  color: "#1a1a1a",
  border: "1px solid #E5E5E5",
  borderRadius: 6,
  background: "#fff",
  outline: "none",
  boxSizing: "border-box",
};

export const DRAFT_STORAGE_KEY = "complais-doc-new-draft";

export const BASE_QUICK_STARTS: QuickStartPreset[] = [
  { id: "capa", label: "시정조치", desc: "CAPA 프로세스 문서", layer: "C", processCode: "170", docType: "P" },
  { id: "internal-audit", label: "내부심사", desc: "심사 절차 문서", layer: "C", processCode: "150", docType: "P" },
  { id: "doc-control", label: "문서관리", desc: "문서화 정보 관리", layer: "C", processCode: "760", docType: "P" },
];

export const STANDARD_QUICK_STARTS: Record<string, QuickStartPreset[]> = {
  std_iso14001: [{ id: "env-op", label: "환경운영", desc: "환경 운영관리 절차", layer: "E", processCode: "810", docType: "P" }],
  std_iso45001: [{ id: "safety-risk", label: "위험성평가", desc: "안전보건 위험성평가", layer: "S", processCode: "821", docType: "P" }],
  std_iso27001: [{ id: "infosec", label: "정보보안", desc: "정보보안 운영통제", layer: "IS", processCode: "860", docType: "P" }],
  std_iso22000: [{ id: "food-safety", label: "식품안전", desc: "식품안전 운영관리", layer: "FS", processCode: "870", docType: "P" }],
  std_iso22301: [{ id: "bcp", label: "BCP", desc: "사업연속성 대응", layer: "BC", processCode: "880", docType: "P" }],
  std_iso42001: [{ id: "ai-risk", label: "AI 운영", desc: "AI 시스템 운영통제", layer: "AI", processCode: "900", docType: "P" }],
};

export function getProcessLabel(layer: string, processCode: string) {
  return PROCESS_BY_LAYER[layer]?.find((item) => item.value === processCode)?.label ?? processCode;
}

export function getSuggestedTitle(layer: string, processCode: string, docType: string) {
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

export function persistDraft(data: Record<string, unknown>) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(data));
}

export function loadDraft(): Record<string, unknown> | null {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(DRAFT_STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as Record<string, unknown>;
  } catch {
    return null;
  }
}

export function clearDraft() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(DRAFT_STORAGE_KEY);
}
