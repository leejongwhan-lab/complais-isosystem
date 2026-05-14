export type SectionType =
  | "purpose" | "scope" | "definitions" | "raci"
  | "procedure" | "sipoc" | "kpi" | "risk"
  | "related_docs" | "related_forms" | "text";

// Per-section data shapes
export type PurposeData  = { content: string };
export type TextData     = { content: string };
export type ScopeData    = { in_scope: string[]; out_scope: string[] };
export type DefinitionsData = { rows: Array<{ id: string; term: string; definition: string; source: string }> };
export type RaciData     = { roles: string[]; activities: string[]; matrix: Record<string, Record<string, string>> };
export type ProcedureData = { steps: Array<{ id: string; title: string; owner: string; input: string; output: string; content: string; note: string }> };
export type SipocData    = { suppliers: string[]; inputs: string[]; processes: string[]; outputs: string[]; customers: string[] };
export type KpiData      = { rows: Array<{ id: string; name: string; unit: string; target: string; cycle: string; owner: string }> };
export type RiskData     = { rows: Array<{ id: string; type: string; content: string; likelihood: number; impact: number; response: string; owner: string }> };
export type RelatedDocsData  = { docs: Array<{ id: string; doc_number: string; title: string }> };
export type RelatedFormsData = { forms: Array<{ id: string; form_code: string; title: string }> };

export type SectionData =
  | PurposeData | TextData | ScopeData | DefinitionsData | RaciData
  | ProcedureData | SipocData | KpiData | RiskData | RelatedDocsData | RelatedFormsData;

export type Section = {
  id: string;
  type: SectionType;
  title: string;
  order: number;
  data: SectionData;
};

export const SECTION_TYPE_LABELS: Record<SectionType, string> = {
  purpose:       "목적",
  scope:         "적용범위",
  definitions:   "용어 및 정의",
  raci:          "책임과 권한 (RACI)",
  procedure:     "프로세스 절차",
  sipoc:         "프로세스 개요 (SIPOC)",
  kpi:           "성과지표 (KPI)",
  risk:          "위험 및 기회",
  related_docs:  "관련문서",
  related_forms: "관련서식",
  text:          "일반 텍스트",
};

export const DOCUMENT_SECTION_TEMPLATES: Record<string, Array<{ type: SectionType; title: string }>> = {
  P: [
    { type: "purpose",       title: "1. 목적" },
    { type: "scope",         title: "2. 적용범위" },
    { type: "definitions",   title: "3. 용어 및 정의" },
    { type: "raci",          title: "4. 책임과 권한" },
    { type: "sipoc",         title: "5. 프로세스 개요 (SIPOC)" },
    { type: "procedure",     title: "6. 프로세스 절차" },
    { type: "kpi",           title: "7. 성과지표" },
    { type: "risk",          title: "8. 위험 및 기회" },
    { type: "related_docs",  title: "9. 관련문서" },
    { type: "related_forms", title: "10. 관련서식" },
  ],
  M: [
    { type: "purpose",      title: "1. 목적 및 배경" },
    { type: "scope",        title: "2. 적용범위" },
    { type: "definitions",  title: "3. 용어 및 정의" },
    { type: "text",         title: "4. 경영시스템 개요" },
    { type: "raci",         title: "5. 조직 및 책임" },
    { type: "text",         title: "6. 프로세스 목록 및 상호관계" },
    { type: "related_docs", title: "7. 관련문서" },
  ],
  R: [
    { type: "purpose",       title: "1. 목적" },
    { type: "scope",         title: "2. 적용범위" },
    { type: "definitions",   title: "3. 용어 및 정의" },
    { type: "raci",          title: "4. 책임과 권한" },
    { type: "procedure",     title: "5. 세부 지침" },
    { type: "related_docs",  title: "6. 관련문서" },
    { type: "related_forms", title: "7. 관련서식" },
  ],
  W: [
    { type: "purpose",       title: "1. 목적" },
    { type: "scope",         title: "2. 적용범위" },
    { type: "text",          title: "3. 준비사항 (자재/장비/안전)" },
    { type: "procedure",     title: "4. 작업순서" },
    { type: "kpi",           title: "5. 품질기준" },
    { type: "risk",          title: "6. 위험요인 및 안전조치" },
    { type: "related_forms", title: "7. 관련서식" },
  ],
};

export function createDefaultSection(type: SectionType, title: string, order: number): Section {
  const id = crypto.randomUUID();
  const defaultData: Record<SectionType, SectionData> = {
    purpose:       { content: "" } as PurposeData,
    text:          { content: "" } as TextData,
    scope:         { in_scope: [""], out_scope: [""] } as ScopeData,
    definitions:   { rows: [{ id: crypto.randomUUID(), term: "", definition: "", source: "" }] } as DefinitionsData,
    raci:          { roles: ["작성자", "검토자", "승인자"], activities: [""], matrix: {} } as RaciData,
    procedure:     { steps: [{ id: crypto.randomUUID(), title: "Step 1", owner: "", input: "", output: "", content: "", note: "" }] } as ProcedureData,
    sipoc:         { suppliers: [""], inputs: [""], processes: [""], outputs: [""], customers: [""] } as SipocData,
    kpi:           { rows: [{ id: crypto.randomUUID(), name: "", unit: "", target: "", cycle: "월 1회", owner: "" }] } as KpiData,
    risk:          { rows: [{ id: crypto.randomUUID(), type: "위험", content: "", likelihood: 1, impact: 1, response: "", owner: "" }] } as RiskData,
    related_docs:  { docs: [] } as RelatedDocsData,
    related_forms: { forms: [] } as RelatedFormsData,
  };
  return { id, type, title, order, data: defaultData[type] };
}
