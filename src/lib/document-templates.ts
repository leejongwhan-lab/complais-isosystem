export type SectionTemplate = {
  key: string;
  title: string;
  placeholder: string;
};

export type DocumentTemplateContext = {
  layer?: string;
  businessType?: string | null;
  standards?: Partial<Record<StandardFlag, boolean>>;
};

const DEFAULT_ISO_CLAUSES: Record<string, string> = {
  "C:110": "6.1",
  "C:130": "6.1/6.2",
  "C:150": "9.2",
  "C:160": "9.3",
  "C:170": "10.2",
  "C:210": "8.2",
  "C:420": "8.4",
  "C:720": "7.2",
  "C:760": "7.5",
  "E:810": "8.1",
  "E:811": "6.2",
  "E:812": "9.1/9.1.2",
  "S:820": "8.1",
  "S:821": "6.1.2/8.1",
  "S:822": "6.2",
  "EN:830": "6.3/8.1/9.1",
  "AB:840": "4.5/8.2/8.3",
  "CM:850": "6.1/8.1",
  "IS:860": "5~8 / Annex A",
  "FS:870": "8",
  "BC:880": "8",
  "MD:890": "4.1/7.3/7.5/8.2",
  "AI:900": "5~10",
  "NQ:910": "8.1/8.4/8.5",
  "CG:920": "3~17",
};

type StandardFlag =
  | "std_iso9001"
  | "std_iso14001"
  | "std_iso45001"
  | "std_iatf"
  | "std_iso13485"
  | "std_iso50001"
  | "std_iso37001"
  | "std_iso37301"
  | "std_iso27001"
  | "std_iso22000"
  | "std_iso22301"
  | "std_iso42001"
  | "std_iso19443"
  | "std_iso22716";

const MANUAL_SECTIONS: SectionTemplate[] = [
  { key: "company_overview", title: "1. 조직 개요", placeholder: "조직명, 주요 제품·서비스, 주요 이해관계자, 운영 위치를 기술하세요..." },
  { key: "policy", title: "2. 경영방침", placeholder: "조직의 방침, 방향성, 준수 의지를 기술하세요..." },
  { key: "scope", title: "3. 적용 범위", placeholder: "적용 표준, 대상 조직, 적용 제외 사항과 사유를 기술하세요..." },
  { key: "process_map", title: "4. 프로세스 구성", placeholder: "핵심 프로세스, 지원 프로세스, 상호작용 구조를 기술하세요..." },
  { key: "responsibility", title: "5. 책임과 권한", placeholder: "최고경영자, 관리책임자, 부서별 책임과 권한을 기술하세요..." },
  { key: "doc_structure", title: "6. 문서 체계", placeholder: "매뉴얼, 절차서, 지침서, 서식 등 문서화된 정보의 체계를 설명하세요..." },
];

const PROCESS_SECTIONS: SectionTemplate[] = [
  { key: "purpose", title: "1. 목적", placeholder: "이 프로세스의 목적과 기대 효과를 기술하세요..." },
  { key: "scope", title: "2. 적용 범위", placeholder: "적용 조직, 업무, 시스템 또는 현장을 기술하세요..." },
  { key: "terms", title: "3. 용어 및 정의", placeholder: "업무 수행에 필요한 주요 용어와 약어를 정리하세요..." },
  { key: "responsibility", title: "4. 책임과 권한", placeholder: "역할별 책임, 승인 권한, 협업 주체를 기술하세요..." },
  { key: "procedure", title: "5. 업무 절차", placeholder: "입력, 수행 단계, 판단 기준, 산출물을 순서대로 기술하세요..." },
  { key: "related_docs", title: "6. 관련 문서", placeholder: "관련 규정, 지침, 서식, 외부 요구사항을 기술하세요..." },
  { key: "records", title: "7. 기록", placeholder: "생성·보관해야 할 기록, 보존기간, 관리 방법을 기술하세요..." },
];

const GUIDELINE_SECTIONS: SectionTemplate[] = [
  { key: "purpose", title: "1. 목적", placeholder: "이 지침의 목적과 사용 시점을 기술하세요..." },
  { key: "scope", title: "2. 적용 범위", placeholder: "적용 업무, 담당자, 대상 시스템 또는 설비를 기술하세요..." },
  { key: "guidelines", title: "3. 세부 지침", placeholder: "수행 기준, 세부 절차, 주의사항을 단계별로 기술하세요..." },
  { key: "examples", title: "4. 작성 예시", placeholder: "입력 예시, 판단 예시, 오류 방지 포인트를 기술하세요..." },
];

const LAYER_FOCUS: Record<string, string> = {
  C: "품질, 고객 요구사항, 프로세스 일관성",
  E: "환경측면, 법규 준수, 오염 예방",
  S: "위험요인, 작업 안전, 근로자 보호",
  EN: "에너지 사용, 성과지표, 효율 개선",
  AB: "부패 리스크, 신고 체계, 통제 활동",
  CM: "법규 준수, 통제 절차, 위반 대응",
  IS: "정보자산, 접근통제, 사고 대응",
  FS: "식품 안전 위해요소, CCP, 위생 관리",
  BC: "비상 대응, 복구 전략, 업무 연속성",
  MD: "설계관리, 추적성, 규제 요구사항",
  AI: "AI 거버넌스, 책임성, 데이터·모델 통제",
  NQ: "안전등급 품질보증, 추적성, 공급망 통제",
  CG: "GMP, 위생, 원료·제조·보관 관리",
};

const LAYER_TERMS: Record<string, string> = {
  E: "환경측면, 환경영향, 준수의무 등",
  S: "위험요인, 위험성, 안전작업기준 등",
  EN: "에너지베이스라인, EnPI, 주요사용처 등",
  AB: "뇌물, 이해상충, 실사, 신고채널 등",
  CM: "준수의무, 통제활동, 조사, 시정조치 등",
  IS: "정보자산, 접근권한, 취약점, 사고 등",
  FS: "위해요소, CCP, PRP, 추적성 등",
  BC: "중단사고, RTO, 복구자원, 우회절차 등",
  MD: "UDI, 밸리데이션, 변경관리, 불만처리 등",
  AI: "AI 시스템, 학습데이터, 편향, 인적감독 등",
  NQ: "ITNS, 특수공정, 품질등급, 검증기록 등",
  CG: "GMP, 일탈, 라인클리어런스, 위생관리 등",
};

const STANDARD_BY_LAYER: Record<string, StandardFlag | undefined> = {
  C: "std_iso9001",
  E: "std_iso14001",
  S: "std_iso45001",
  EN: "std_iso50001",
  AB: "std_iso37001",
  CM: "std_iso37301",
  IS: "std_iso27001",
  FS: "std_iso22000",
  BC: "std_iso22301",
  MD: "std_iso13485",
  AI: "std_iso42001",
  NQ: "std_iso19443",
  CG: "std_iso22716",
};

const BUSINESS_NOTES: Record<string, string> = {
  "제조업": "운영 현장, 설비, 자재, 공정 관리 관점을 함께 반영하세요.",
  "건설업": "현장 단위 작업, 협력업체, 공정별 위험 통제를 함께 반영하세요.",
  "서비스업": "고객 접점, 서비스 전달, 민원 및 경험 품질 관점을 반영하세요.",
  "IT/소프트웨어": "시스템 변경, 접근권한, 배포, 장애 대응 관점을 반영하세요.",
  "기타": "조직의 실제 운영 형태에 맞는 업무 흐름과 통제를 반영하세요.",
};

function withManualFocus(sections: SectionTemplate[], layer?: string): SectionTemplate[] {
  const focus = layer ? LAYER_FOCUS[layer] : null;
  if (!focus) return sections;

  return sections.map((section) => {
    if (section.key === "policy") {
      return { ...section, placeholder: `${focus}에 대한 조직의 방침, 목표, 준수 의지를 기술하세요...` };
    }
    if (section.key === "process_map") {
      return { ...section, placeholder: `${focus}를 반영한 핵심 프로세스와 지원 프로세스의 상호작용을 기술하세요...` };
    }
    return section;
  });
}

function withProcessFocus(sections: SectionTemplate[], layer?: string, businessType?: string | null): SectionTemplate[] {
  const focus = layer ? LAYER_FOCUS[layer] : null;
  const terms = layer ? LAYER_TERMS[layer] : null;
  const businessNote = businessType ? BUSINESS_NOTES[businessType] : null;

  return sections.map((section) => {
    if (section.key === "scope" && focus) {
      return { ...section, placeholder: `적용 조직, 업무, 시스템 또는 현장과 함께 ${focus} 관점을 기술하세요...` };
    }
    if (section.key === "terms" && terms) {
      return { ...section, placeholder: `${terms} 등 이 프로세스에 필요한 용어를 정리하세요...` };
    }
    if (section.key === "procedure") {
      const parts = [
        "입력, 수행 단계, 판단 기준, 산출물, 예외 대응을 순서대로 기술하세요...",
        focus ? `${focus} 관리 포인트를 포함하세요.` : null,
        businessNote,
      ].filter(Boolean);
      return { ...section, placeholder: parts.join(" ") };
    }
    return section;
  });
}

function withGuidelineFocus(sections: SectionTemplate[], layer?: string, businessType?: string | null): SectionTemplate[] {
  const focus = layer ? LAYER_FOCUS[layer] : null;
  const businessNote = businessType ? BUSINESS_NOTES[businessType] : null;

  return sections.map((section) => {
    if (section.key === "guidelines") {
      const parts = [
        "수행 기준, 세부 절차, 확인 포인트, 주의사항을 단계별로 기술하세요...",
        focus ? `${focus} 관련 통제 기준을 포함하세요.` : null,
        businessNote,
      ].filter(Boolean);
      return { ...section, placeholder: parts.join(" ") };
    }
    return section;
  });
}

function cloneSections(sections: SectionTemplate[]): SectionTemplate[] {
  return sections.map((section) => ({ ...section }));
}

export function getDefaultSectionTemplates(docType: string, context: DocumentTemplateContext = {}): SectionTemplate[] {
  const { layer, businessType, standards } = context;
  const layerStandard = layer ? STANDARD_BY_LAYER[layer] : undefined;
  const isEnabled = layerStandard ? Boolean(standards?.[layerStandard]) : true;
  const effectiveLayer = isEnabled ? layer : undefined;

  if (docType === "M") return withManualFocus(cloneSections(MANUAL_SECTIONS), effectiveLayer);
  if (docType === "P") return withProcessFocus(cloneSections(PROCESS_SECTIONS), effectiveLayer, businessType);
  if (docType === "R") return withGuidelineFocus(cloneSections(GUIDELINE_SECTIONS), effectiveLayer, businessType);
  return [];
}

export function getSuggestedIsoClause(layer: string, processCode: string) {
  return DEFAULT_ISO_CLAUSES[`${layer}:${processCode}`] ?? "";
}

export const SECTION_TEMPLATES: Record<string, SectionTemplate[]> = {
  M: cloneSections(MANUAL_SECTIONS),
  P: cloneSections(PROCESS_SECTIONS),
  R: cloneSections(GUIDELINE_SECTIONS),
  F: [],
};
