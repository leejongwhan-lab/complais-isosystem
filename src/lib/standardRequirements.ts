export type DocInfoType = "maintain" | "retain";

export interface RequiredRecord {
  clause: string;
  title: string;
  type: DocInfoType;
  retention: string;
  link: string;
  table?: string | null;
  formCodes?: string[];
}

export const STANDARD_INFO: Record<string, { name: string; color: string; bg: string }> = {
  "9001":  { name: "ISO 9001",   color: "#3B5BDB", bg: "#EEF2FF" },
  "14001": { name: "ISO 14001",  color: "#2F9E44", bg: "#EBFBEE" },
  "45001": { name: "ISO 45001",  color: "#E67700", bg: "#FFF9DB" },
  "iatf":  { name: "IATF 16949", color: "#1098AD", bg: "#E3FAFC" },
  "13485": { name: "ISO 13485",  color: "#7048E8", bg: "#F3F0FF" },
  "50001": { name: "ISO 50001",  color: "#E67700", bg: "#FFF9DB" },
  "37001": { name: "ISO 37001",  color: "#2F9E44", bg: "#EBFBEE" },
  "37301": { name: "ISO 37301",  color: "#1098AD", bg: "#E3FAFC" },
  "27001": { name: "ISO 27001",  color: "#7048E8", bg: "#F3F0FF" },
  "22000": { name: "ISO 22000",  color: "#E03131", bg: "#FFF5F5" },
  "22301": { name: "ISO 22301",  color: "#E67700", bg: "#FFF9DB" },
  "42001": { name: "ISO 42001",  color: "#3B5BDB", bg: "#EEF2FF" },
  "19443": { name: "ISO 19443",  color: "#555",    bg: "#F5F5F5" },
  "22716": { name: "ISO 22716",  color: "#E03131", bg: "#FFF5F5" },
};

export const STANDARD_REQUIREMENTS: Record<string, RequiredRecord[]> = {
  "9001": [
    { clause: "4.3",   title: "경영시스템 적용범위",          type: "maintain", retention: "영구", link: "/documents",          table: "documents",           formCodes: [] },
    { clause: "5.2",   title: "품질방침",                    type: "maintain", retention: "영구", link: "/documents",          table: "documents",           formCodes: [] },
    { clause: "6.1",   title: "리스크 및 기회 조치 계획",     type: "maintain", retention: "3년",  link: "/risks",              table: "risks",               formCodes: [] },
    { clause: "6.2",   title: "품질목표 및 달성 계획",        type: "maintain", retention: "3년",  link: "/compliance",         table: null,                  formCodes: ["F-110-01"] },
    { clause: "7.1.5", title: "측정 장비 교정 기준",          type: "maintain", retention: "3년",  link: "/documents",          table: null,                  formCodes: [] },
    { clause: "8.1",   title: "운용 기획 및 관리 결과",       type: "maintain", retention: "3년",  link: "/documents",          table: null,                  formCodes: [] },
    { clause: "7.2",   title: "교육훈련·역량 증거 기록",      type: "retain",   retention: "3년",  link: "/trainings",          table: "trainings",           formCodes: [] },
    { clause: "8.4.1", title: "공급자 평가 기록",             type: "retain",   retention: "3년",  link: "/suppliers",          table: "suppliers",           formCodes: [] },
    { clause: "8.5.2", title: "식별 및 추적성 기록",          type: "retain",   retention: "3년",  link: "/documents",          table: null,                  formCodes: [] },
    { clause: "8.6",   title: "제품·서비스 적합성 방출 기록", type: "retain",   retention: "3년",  link: "/forms",              table: "form_records",        formCodes: [] },
    { clause: "8.7",   title: "부적합 출력물 관리 기록",      type: "retain",   retention: "5년",  link: "/nonconformity",      table: "nonconformities",     formCodes: [] },
    { clause: "9.1",   title: "모니터링·측정·분석 결과",     type: "retain",   retention: "3년",  link: "/compliance",         table: null,                  formCodes: ["F-110-01"] },
    { clause: "9.2",   title: "내부심사 프로그램 및 결과",    type: "retain",   retention: "3년",  link: "/audit",              table: "audits",              formCodes: ["F-150-01", "F-150-02"] },
    { clause: "9.3",   title: "경영검토 결과",                type: "retain",   retention: "3년",  link: "/management-review",  table: "management_reviews",  formCodes: [] },
    { clause: "10.2",  title: "부적합 및 시정조치 결과",      type: "retain",   retention: "5년",  link: "/capa",               table: "capas",               formCodes: [] },
  ],

  "14001": [
    { clause: "4.3",   title: "환경경영시스템 적용범위",      type: "maintain", retention: "영구", link: "/documents",          table: "documents",           formCodes: [] },
    { clause: "5.2",   title: "환경방침",                    type: "maintain", retention: "영구", link: "/documents",          table: "documents",           formCodes: [] },
    { clause: "6.1.2", title: "환경영향 평가 기준·방법론",   type: "maintain", retention: "3년",  link: "/environment",        table: "env_aspects",         formCodes: ["F-ENV-01"] },
    { clause: "6.2",   title: "환경목표 및 달성 계획",        type: "maintain", retention: "3년",  link: "/compliance",         table: null,                  formCodes: [] },
    { clause: "6.1.2", title: "중요 환경측면 결정 기록",      type: "retain",   retention: "3년",  link: "/environment",        table: "env_aspects",         formCodes: [] },
    { clause: "7.2",   title: "역량 증거 기록",              type: "retain",   retention: "3년",  link: "/trainings",          table: "trainings",           formCodes: [] },
    { clause: "8.1",   title: "환경운용 기획 및 관리 기록",   type: "retain",   retention: "3년",  link: "/environment",        table: null,                  formCodes: [] },
    { clause: "8.2",   title: "비상사태 대비·대응 훈련 기록", type: "retain",   retention: "3년",  link: "/documents",          table: null,                  formCodes: [] },
    { clause: "9.1",   title: "모니터링·측정 결과",          type: "retain",   retention: "3년",  link: "/compliance",         table: null,                  formCodes: [] },
    { clause: "9.1.2", title: "준수 의무 평가 결과",          type: "retain",   retention: "3년",  link: "/compliance",         table: null,                  formCodes: [] },
    { clause: "9.2",   title: "내부심사 프로그램 및 결과",    type: "retain",   retention: "3년",  link: "/audit",              table: "audits",              formCodes: [] },
    { clause: "9.3",   title: "경영검토 결과",                type: "retain",   retention: "3년",  link: "/management-review",  table: "management_reviews",  formCodes: [] },
    { clause: "10.2",  title: "부적합 및 시정조치 결과",      type: "retain",   retention: "5년",  link: "/capa",               table: "capas",               formCodes: [] },
  ],

  "45001": [
    { clause: "4.3",   title: "OH&S 경영시스템 적용범위",    type: "maintain", retention: "영구", link: "/documents",          table: "documents",           formCodes: [] },
    { clause: "5.2",   title: "안전보건방침",                type: "maintain", retention: "영구", link: "/documents",          table: "documents",           formCodes: [] },
    { clause: "5.4",   title: "근로자 협의·참여 프로세스",   type: "maintain", retention: "3년",  link: "/documents",          table: null,                  formCodes: [] },
    { clause: "6.1.2", title: "위험성평가 기준·방법론",      type: "maintain", retention: "3년",  link: "/environment",        table: null,                  formCodes: ["F-KRAS-01"] },
    { clause: "6.2",   title: "안전보건목표 및 달성 계획",   type: "maintain", retention: "3년",  link: "/compliance",         table: null,                  formCodes: [] },
    { clause: "6.1.2", title: "위험성평가 결과 기록",        type: "retain",   retention: "3년",  link: "/environment",        table: "hazard_risks",        formCodes: ["F-KRAS-01"] },
    { clause: "7.2",   title: "역량 증거 기록",              type: "retain",   retention: "3년",  link: "/trainings",          table: "trainings",           formCodes: [] },
    { clause: "8.1.3", title: "변경관리 기록",               type: "retain",   retention: "3년",  link: "/documents",          table: null,                  formCodes: [] },
    { clause: "8.1.4", title: "협력업체 OH&S 관리 기록",     type: "retain",   retention: "3년",  link: "/suppliers",          table: "suppliers",           formCodes: [] },
    { clause: "8.2",   title: "비상상황 대응 훈련 기록",     type: "retain",   retention: "3년",  link: "/documents",          table: null,                  formCodes: [] },
    { clause: "9.1",   title: "모니터링·측정 결과",          type: "retain",   retention: "3년",  link: "/compliance",         table: null,                  formCodes: [] },
    { clause: "9.1.2", title: "준수 의무 평가 결과",          type: "retain",   retention: "3년",  link: "/compliance",         table: null,                  formCodes: [] },
    { clause: "9.2",   title: "내부심사 프로그램 및 결과",    type: "retain",   retention: "3년",  link: "/audit",              table: "audits",              formCodes: [] },
    { clause: "9.3",   title: "경영검토 결과",                type: "retain",   retention: "3년",  link: "/management-review",  table: "management_reviews",  formCodes: [] },
    { clause: "10.2",  title: "사건·부적합·시정조치 결과",   type: "retain",   retention: "5년",  link: "/capa",               table: "capas",               formCodes: [] },
  ],

  "50001": [
    { clause: "5.2",   title: "에너지방침",                  type: "maintain", retention: "영구", link: "/documents",          table: "documents",           formCodes: [] },
    { clause: "6.3",   title: "에너지기준선(EnB)",           type: "maintain", retention: "3년",  link: "/energy",             table: null,                  formCodes: [] },
    { clause: "6.4",   title: "에너지성과지표(EnPI)",        type: "maintain", retention: "3년",  link: "/energy",             table: null,                  formCodes: [] },
    { clause: "6.2",   title: "에너지목표 및 달성 계획",      type: "maintain", retention: "3년",  link: "/compliance",         table: null,                  formCodes: [] },
    { clause: "6.3",   title: "에너지검토 결과",              type: "retain",   retention: "3년",  link: "/energy",             table: null,                  formCodes: [] },
    { clause: "8.1",   title: "에너지사용량 기록",            type: "retain",   retention: "3년",  link: "/energy",             table: "energy_usages",       formCodes: [] },
    { clause: "7.2",   title: "역량 증거 기록",              type: "retain",   retention: "3년",  link: "/trainings",          table: "trainings",           formCodes: [] },
    { clause: "9.2",   title: "내부심사 결과",                type: "retain",   retention: "3년",  link: "/audit",              table: "audits",              formCodes: [] },
    { clause: "9.3",   title: "경영검토 결과",                type: "retain",   retention: "3년",  link: "/management-review",  table: "management_reviews",  formCodes: [] },
  ],

  "37001": [
    { clause: "5.2",   title: "반부패방침",                  type: "maintain", retention: "영구", link: "/documents",          table: "documents",           formCodes: [] },
    { clause: "6.1.2", title: "뇌물리스크 평가 결과",        type: "retain",   retention: "5년",  link: "/antibribery",        table: "risks",               formCodes: [] },
    { clause: "8.7",   title: "선물·접대·후원 기록",         type: "retain",   retention: "5년",  link: "/antibribery",        table: null,                  formCodes: [] },
    { clause: "8.6",   title: "실사 기록",                   type: "retain",   retention: "5년",  link: "/documents",          table: null,                  formCodes: [] },
    { clause: "7.2",   title: "역량 증거 기록",              type: "retain",   retention: "3년",  link: "/trainings",          table: "trainings",           formCodes: [] },
    { clause: "9.2",   title: "내부심사 결과",                type: "retain",   retention: "5년",  link: "/audit",              table: "audits",              formCodes: [] },
    { clause: "9.3",   title: "경영검토 결과",                type: "retain",   retention: "5년",  link: "/management-review",  table: "management_reviews",  formCodes: [] },
    { clause: "10.2",  title: "부적합 및 시정조치 결과",      type: "retain",   retention: "5년",  link: "/capa",               table: "capas",               formCodes: [] },
  ],

  "37301": [
    { clause: "5.2",   title: "준법방침",                    type: "maintain", retention: "영구", link: "/documents",          table: "documents",           formCodes: [] },
    { clause: "6.1",   title: "준법의무 등록부",              type: "retain",   retention: "3년",  link: "/compliance-mgmt",    table: "compliance_items",    formCodes: [] },
    { clause: "6.1",   title: "준법리스크 평가 기록",        type: "retain",   retention: "3년",  link: "/risks",              table: "risks",               formCodes: [] },
    { clause: "7.2",   title: "역량 증거 기록",              type: "retain",   retention: "3년",  link: "/trainings",          table: "trainings",           formCodes: [] },
    { clause: "9.2",   title: "내부심사 결과",                type: "retain",   retention: "5년",  link: "/audit",              table: "audits",              formCodes: [] },
    { clause: "9.3",   title: "경영검토 결과",                type: "retain",   retention: "5년",  link: "/management-review",  table: "management_reviews",  formCodes: [] },
  ],

  "27001": [
    { clause: "4.3",   title: "정보보안경영시스템 적용범위",  type: "maintain", retention: "영구", link: "/documents",          table: "documents",           formCodes: [] },
    { clause: "5.2",   title: "정보보안방침",                type: "maintain", retention: "영구", link: "/documents",          table: "documents",           formCodes: [] },
    { clause: "6.1.3", title: "적용가능성 기술서(SoA)",      type: "maintain", retention: "영구", link: "/documents",          table: null,                  formCodes: [] },
    { clause: "6.1.2", title: "정보보안 리스크 평가 결과",   type: "retain",   retention: "3년",  link: "/risks",              table: "risks",               formCodes: [] },
    { clause: "6.1.3", title: "정보보안 리스크 처리 계획",   type: "retain",   retention: "3년",  link: "/risks",              table: null,                  formCodes: [] },
    { clause: "8.1",   title: "정보자산 목록",               type: "retain",   retention: "3년",  link: "/infosec",            table: "info_assets",         formCodes: [] },
    { clause: "7.2",   title: "역량 증거 기록",              type: "retain",   retention: "3년",  link: "/trainings",          table: "trainings",           formCodes: [] },
    { clause: "9.2",   title: "내부심사 결과",                type: "retain",   retention: "3년",  link: "/audit",              table: "audits",              formCodes: [] },
    { clause: "9.3",   title: "경영검토 결과",                type: "retain",   retention: "3년",  link: "/management-review",  table: "management_reviews",  formCodes: [] },
    { clause: "10.1",  title: "부적합 및 시정조치 결과",      type: "retain",   retention: "5년",  link: "/capa",               table: "capas",               formCodes: [] },
  ],

  "13485": [
    { clause: "4.2.1", title: "품질매뉴얼",                  type: "maintain", retention: "영구", link: "/documents/manuals",  table: null,                  formCodes: [] },
    { clause: "7.3",   title: "설계개발 기획 및 결과",        type: "retain",   retention: "제품수명+2년", link: "/medical-device",     table: null,                  formCodes: [] },
    { clause: "8.2.1", title: "고객불만 및 피드백 기록",      type: "retain",   retention: "5년",  link: "/capa",               table: "capas",               formCodes: [] },
    { clause: "8.4",   title: "불만 처리 기록",               type: "retain",   retention: "5년",  link: "/capa",               table: null,                  formCodes: [] },
    { clause: "8.5.2", title: "이상사례 보고 기록",           type: "retain",   retention: "영구", link: "/documents",          table: null,                  formCodes: [] },
    { clause: "7.4",   title: "공급자 평가 기록",             type: "retain",   retention: "3년",  link: "/suppliers",          table: "suppliers",           formCodes: [] },
    { clause: "7.6",   title: "교정·검증 장비 기록",          type: "retain",   retention: "3년",  link: "/documents",          table: null,                  formCodes: [] },
    { clause: "7.2",   title: "역량 증거 기록",              type: "retain",   retention: "3년",  link: "/trainings",          table: "trainings",           formCodes: [] },
    { clause: "8.2.4", title: "내부심사 결과",                type: "retain",   retention: "5년",  link: "/audit",              table: "audits",              formCodes: [] },
    { clause: "8.5.2", title: "시정조치 결과",                type: "retain",   retention: "5년",  link: "/capa",               table: "capas",               formCodes: [] },
  ],

  "22000": [
    { clause: "5.2",   title: "식품안전방침",                type: "maintain", retention: "영구", link: "/documents",          table: "documents",           formCodes: [] },
    { clause: "8.1",   title: "HACCP 플랜(위해요소 분석)",   type: "maintain", retention: "3년",  link: "/food-safety",        table: null,                  formCodes: [] },
    { clause: "8.9.2", title: "잠재적 안전하지 않은 제품 기록", type: "retain", retention: "2년", link: "/food-safety",        table: null,                  formCodes: [] },
    { clause: "8.6",   title: "모니터링 및 검증 기록",        type: "retain",   retention: "2년",  link: "/food-safety",        table: null,                  formCodes: [] },
    { clause: "8.4",   title: "교정 기록",                   type: "retain",   retention: "1년",  link: "/documents",          table: null,                  formCodes: [] },
    { clause: "7.2",   title: "역량 증거 기록",              type: "retain",   retention: "3년",  link: "/trainings",          table: "trainings",           formCodes: [] },
    { clause: "9.2",   title: "내부심사 결과",                type: "retain",   retention: "5년",  link: "/audit",              table: "audits",              formCodes: [] },
    { clause: "10.2",  title: "부적합 및 시정조치 결과",      type: "retain",   retention: "3년",  link: "/capa",               table: "capas",               formCodes: [] },
  ],

  "22301": [
    { clause: "5.2",   title: "사업연속성방침",              type: "maintain", retention: "영구", link: "/documents",          table: "documents",           formCodes: [] },
    { clause: "8.2.2", title: "BIA(사업영향분석) 결과",      type: "retain",   retention: "3년",  link: "/bcms",               table: null,                  formCodes: [] },
    { clause: "8.3",   title: "BCP(사업연속성계획)",         type: "maintain", retention: "3년",  link: "/bcms/bcp",           table: null,                  formCodes: [] },
    { clause: "8.5",   title: "연습·훈련 기록",              type: "retain",   retention: "3년",  link: "/documents",          table: null,                  formCodes: [] },
    { clause: "7.2",   title: "역량 증거 기록",              type: "retain",   retention: "3년",  link: "/trainings",          table: "trainings",           formCodes: [] },
    { clause: "9.2",   title: "내부심사 결과",                type: "retain",   retention: "5년",  link: "/audit",              table: "audits",              formCodes: [] },
    { clause: "9.3",   title: "경영검토 결과",                type: "retain",   retention: "5년",  link: "/management-review",  table: "management_reviews",  formCodes: [] },
  ],

  "42001": [
    { clause: "5.2",   title: "AI 방침",                     type: "maintain", retention: "영구", link: "/documents",          table: "documents",           formCodes: [] },
    { clause: "6.1.2", title: "AI 리스크 평가 결과",         type: "retain",   retention: "3년",  link: "/ai-mgmt",            table: null,                  formCodes: [] },
    { clause: "6.1.2", title: "AI 시스템 영향평가(AIIA)",    type: "retain",   retention: "3년",  link: "/ai-mgmt",            table: null,                  formCodes: [] },
    { clause: "7.2",   title: "역량 증거 기록",              type: "retain",   retention: "3년",  link: "/trainings",          table: "trainings",           formCodes: [] },
    { clause: "9.2",   title: "내부심사 결과",                type: "retain",   retention: "5년",  link: "/audit",              table: "audits",              formCodes: [] },
    { clause: "9.3",   title: "경영검토 결과",                type: "retain",   retention: "5년",  link: "/management-review",  table: "management_reviews",  formCodes: [] },
    { clause: "10.2",  title: "부적합 및 시정조치 결과",      type: "retain",   retention: "5년",  link: "/capa",               table: "capas",               formCodes: [] },
  ],

  "19443": [
    { clause: "4.3",   title: "원자력 품질경영시스템 범위",  type: "maintain", retention: "영구", link: "/documents",          table: "documents",           formCodes: [] },
    { clause: "5.2",   title: "원자력 품질방침",             type: "maintain", retention: "영구", link: "/documents",          table: "documents",           formCodes: [] },
    { clause: "8.1",   title: "ITNS(중요도 특성 고지) 기록", type: "retain",   retention: "영구", link: "/nuclear",            table: null,                  formCodes: [] },
    { clause: "7.2",   title: "역량 증거 기록",              type: "retain",   retention: "영구", link: "/trainings",          table: "trainings",           formCodes: [] },
    { clause: "9.2",   title: "내부심사 결과",                type: "retain",   retention: "영구", link: "/audit",              table: "audits",              formCodes: [] },
    { clause: "9.3",   title: "경영검토 결과",                type: "retain",   retention: "영구", link: "/management-review",  table: "management_reviews",  formCodes: [] },
    { clause: "10.2",  title: "부적합 및 시정조치 결과",      type: "retain",   retention: "영구", link: "/capa",               table: "capas",               formCodes: [] },
  ],

  "22716": [
    { clause: "3.2",   title: "GMP 문서 체계",               type: "maintain", retention: "영구", link: "/documents/manuals",  table: null,                  formCodes: [] },
    { clause: "5.4",   title: "배치 제조기록",               type: "retain",   retention: "3년",  link: "/cosmetic/batch",     table: null,                  formCodes: [] },
    { clause: "7.4",   title: "원자재 수입검사 기록",        type: "retain",   retention: "3년",  link: "/documents",          table: null,                  formCodes: [] },
    { clause: "7.5",   title: "완제품 검사 기록",            type: "retain",   retention: "3년",  link: "/documents",          table: null,                  formCodes: [] },
    { clause: "8.4",   title: "일탈·불일치·불만 기록",       type: "retain",   retention: "3년",  link: "/capa",               table: "capas",               formCodes: [] },
    { clause: "6.4",   title: "역량 증거 기록",              type: "retain",   retention: "3년",  link: "/trainings",          table: "trainings",           formCodes: [] },
  ],

  "iatf": [
    { clause: "7.1.5.1", title: "측정 장비 교정 기록",       type: "retain",   retention: "3년",  link: "/documents",          table: null,                  formCodes: [] },
    { clause: "8.3.3",   title: "제품·공정 FMEA",            type: "maintain", retention: "3년",  link: "/documents",          table: null,                  formCodes: [] },
    { clause: "8.3.5",   title: "관리계획서",                type: "maintain", retention: "3년",  link: "/documents",          table: null,                  formCodes: [] },
    { clause: "8.5.2",   title: "MSA(측정시스템분석) 결과",  type: "retain",   retention: "3년",  link: "/documents",          table: null,                  formCodes: [] },
    { clause: "8.5.2",   title: "SPC(통계적 공정관리) 결과", type: "retain",   retention: "1년",  link: "/documents",          table: null,                  formCodes: [] },
    { clause: "10.2",    title: "8D 보고서",                 type: "retain",   retention: "5년",  link: "/capa",               table: "capas",               formCodes: [] },
    { clause: "8.4.1",   title: "공급자 승인 기록",          type: "retain",   retention: "3년",  link: "/suppliers",          table: "suppliers",           formCodes: [] },
    { clause: "7.2",     title: "역량 증거 기록",            type: "retain",   retention: "3년",  link: "/trainings",          table: "trainings",           formCodes: [] },
    { clause: "9.2",     title: "내부심사 결과",              type: "retain",   retention: "5년",  link: "/audit",              table: "audits",              formCodes: [] },
    { clause: "9.3",     title: "경영검토 결과",              type: "retain",   retention: "5년",  link: "/management-review",  table: "management_reviews",  formCodes: [] },
  ],
};
