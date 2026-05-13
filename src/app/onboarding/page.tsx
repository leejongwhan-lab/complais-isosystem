"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { getAuthClient } from "@/lib/supabase-browser";
import { Check, Zap, Shield, Scale, Lock, UtensilsCrossed, ShieldCheck, Bot, Sparkles } from "lucide-react";

// ── 상수 ─────────────────────────────────────────────────────
const BUSINESS_TYPES = ["제조업", "건설업", "서비스업", "IT/소프트웨어", "기타"];
const EMPLOYEE_COUNTS = ["10명 미만", "10~50명", "50~200명", "200명 이상"];

type StandardKey = "iso9001" | "iso14001" | "iso45001" | "iatf" | "iso13485" | "iso50001" | "iso37001" | "iso37301" | "iso27001" | "iso22000" | "iso22301" | "iso42001" | "iso19443" | "iso22716";

const STANDARDS: {
  id: StandardKey;
  name: string;
  label: string;
  desc: string;
  docCount: number;
  required: boolean;
  color: string;
  bg: string;
  partner: boolean;
  Icon?: React.ComponentType<{ size?: number; color?: string }>;
}[] = [
  { id: "iso9001",  name: "ISO 9001:2015",    label: "품질경영시스템",     desc: "제품·서비스 품질 관리의 국제 표준",         docCount: 12, required: true,  color: "#3B5BDB", bg: "#EEF2FF", partner: false },
  { id: "iso14001", name: "ISO 14001:2015",   label: "환경경영시스템",     desc: "환경영향 최소화 및 지속가능성 관리",         docCount: 6,  required: false, color: "#2F9E44", bg: "#F0FBF4", partner: false },
  { id: "iso45001", name: "ISO 45001:2018",   label: "안전보건경영시스템", desc: "근로자 안전·보건 리스크 관리",               docCount: 5,  required: false, color: "#E67700", bg: "#FFF9DB", partner: false },
  { id: "iatf",     name: "IATF 16949:2016",  label: "자동차 품질경영",    desc: "자동차 산업 특화 품질경영시스템",           docCount: 8,  required: false, color: "#7048E8", bg: "#F3F0FF", partner: true  },
  { id: "iso13485", name: "ISO 13485:2016",   label: "의료기기 품질경영",  desc: "의료기기 설계·제조 품질 관리",               docCount: 7,  required: false, color: "#E03131", bg: "#FFF0F0", partner: true  },
  { id: "iso50001", name: "ISO 50001:2018",   label: "에너지경영시스템",   desc: "에너지 효율 향상, 비용 절감, 탄소 감축",    docCount: 4,  required: false, color: "#E67700", bg: "#FFF9DB", partner: false, Icon: Zap    },
  { id: "iso37001", name: "ISO 37001:2016",   label: "반부패경영시스템",   desc: "뇌물·부패 방지, 청렴 경영 시스템",          docCount: 3,  required: false, color: "#2F9E44", bg: "#F0FBF4", partner: false, Icon: Shield },
  { id: "iso37301", name: "ISO 37301:2021",   label: "준법경영시스템",     desc: "법규 준수, 컴플라이언스 리스크 관리",       docCount: 3,  required: false, color: "#1098AD", bg: "#E3FAFC", partner: false, Icon: Scale  },
  { id: "iso27001", name: "ISO 27001:2022",   label: "정보보안경영시스템", desc: "정보자산 보호, 사이버보안 관리",             docCount: 5,  required: false, color: "#7048E8", bg: "#F3F0FF", partner: false, Icon: Lock           },
  { id: "iso22000", name: "ISO 22000:2018",   label: "식품안전경영시스템", desc: "HACCP 포함, 식품공급망 위해요소 관리",        docCount: 5,  required: false, color: "#2F9E44", bg: "#EBFBEE", partner: false, Icon: UtensilsCrossed },
  { id: "iso22301", name: "ISO 22301:2019",   label: "사업연속성경영시스템", desc: "재난·사고 시 사업 지속성 확보",              docCount: 4,  required: false, color: "#3B5BDB", bg: "#EEF2FF", partner: false, Icon: ShieldCheck     },
  { id: "iso42001", name: "ISO/IEC 42001:2023", label: "AI경영시스템",    desc: "AI 개발·운영 윤리적 관리체계",               docCount: 4,  required: false, color: "#7048E8", bg: "#F3F0FF", partner: false, Icon: Bot             },
  { id: "iso19443", name: "ISO 19443:2018",   label: "원자력 공급망 품질", desc: "원전 납품 품질경영, ITNS 관리",              docCount: 4,  required: false, color: "#E67700", bg: "#FFF9DB", partner: true,  Icon: Zap             },
  { id: "iso22716", name: "ISO 22716:2007",   label: "화장품 GMP",        desc: "화장품 제조·품질관리 우수기준, EU 수출 필수", docCount: 6,  required: false, color: "#E64980", bg: "#FFE3EC", partner: false, Icon: Sparkles        },
];

const PLANS: {
  id: string;
  name: string;
  price: number | null;
  features: string[];
  recommended: boolean;
  color: string;
}[] = [
  {
    id: "free", name: "Free", price: null, recommended: false, color: "#555",
    features: ["ISO 9001 기본 문서 5개", "AI 초안 월 3회", "대시보드 + 문서관리"],
  },
  {
    id: "starter", name: "Starter", price: 39000, recommended: true, color: "#3B5BDB",
    features: ["ISO 9001 전체 문서 12개", "AI 초안 월 20회", "CAPA + 심사 + 공급자 + 교육", "경영검토 + 리스크 관리"],
  },
  {
    id: "pro", name: "Professional", price: 79000, recommended: false, color: "#2F9E44",
    features: ["ISO 9001 + 추가 표준 1개", "AI 초안 무제한", "E-Layer 환경·안전 모듈", "PDF 출력"],
  },
  {
    id: "enterprise", name: "Enterprise", price: 149000, recommended: false, color: "#7048E8",
    features: ["멀티 표준 무제한", "전담 컨설턴트 지원", "컴플라이스 플랫폼 연계", "커스텀 온보딩"],
  },
];

// ── 공통 스타일 ───────────────────────────────────────────────
const INPUT_STYLE: React.CSSProperties = {
  width: "100%", padding: "8px 11px", fontSize: 13, color: "#1a1a1a",
  border: "1px solid #E5E5E5", borderRadius: 7, background: "#fff",
  outline: "none", boxSizing: "border-box",
};

const LABEL_STYLE: React.CSSProperties = {
  display: "block", marginBottom: 6, fontSize: 11, fontWeight: 600,
  color: "#999", textTransform: "uppercase" as const, letterSpacing: "0.05em",
};

// ── Step 헤더 ────────────────────────────────────────────────
const STEP_META = [
  { title: "회사 정보 입력",    desc: "귀사의 기본 정보를 입력해주세요" },
  { title: "적용 표준 선택",    desc: "도입할 경영시스템 표준을 선택해주세요" },
  { title: "플랜 선택",         desc: "최적의 플랜을 선택하고 시작하세요" },
];

// ── 칩 버튼 ──────────────────────────────────────────────────
function ChipBtn({
  label, selected, onClick, color = "#3B5BDB", bg = "#EEF2FF",
}: { label: string; selected: boolean; onClick: () => void; color?: string; bg?: string }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: "6px 12px", borderRadius: 6, cursor: "pointer",
        fontSize: 12, fontWeight: selected ? 600 : 400,
        border: selected ? `1px solid ${color}` : "1px solid #E5E5E5",
        background: selected ? bg : "#fff",
        color: selected ? color : "#555",
        transition: "border-color 0.15s",
      }}
    >
      {label}
    </button>
  );
}

// ── 메인 ─────────────────────────────────────────────────────
export default function OnboardingPage() {
  const [step, setStep]     = useState(1);
  const [saving, setSaving] = useState(false);

  // Step 1
  const [companyName,    setCompanyName]    = useState("");
  const [companyCode,    setCompanyCode]    = useState("");
  const [businessType,   setBusinessType]   = useState("");
  const [employeeCount,  setEmployeeCount]  = useState("");
  const [ceoName,        setCeoName]        = useState("");
  const [managementRep,  setManagementRep]  = useState("");

  // Step 2
  const [standards, setStandards] = useState<Record<StandardKey, boolean>>({
    iso9001: true, iso14001: false, iso45001: false, iatf: false, iso13485: false,
    iso50001: false, iso37001: false, iso37301: false, iso27001: false,
    iso22000: false, iso22301: false, iso42001: false, iso19443: false, iso22716: false,
  });

  // Step 3
  const [plan, setPlan] = useState("starter");

  const step1Valid = !!companyName.trim() && companyCode.length >= 2;
  const maxWidth   = step === 3 ? 900 : 640;

  const toggleStandard = (key: StandardKey) => {
    if (key === "iso9001") return;
    setStandards(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleComplete = async () => {
    setSaving(true);
    try {
      const companyData = {
        company_name:   companyName.trim(),
        company_code:   companyCode.toUpperCase(),
        business_type:  businessType  || null,
        employee_count: employeeCount || null,
        ceo_name:       ceoName.trim()       || null,
        management_rep: managementRep.trim() || null,
        std_iso9001:  true,
        std_iso14001: standards.iso14001,
        std_iso45001: standards.iso45001,
        std_iatf:     standards.iatf,
        std_iso13485: standards.iso13485,
        std_iso50001: standards.iso50001,
        std_iso37001: standards.iso37001,
        std_iso37301: standards.iso37301,
        std_iso27001: standards.iso27001,
        std_iso22000: standards.iso22000,
        std_iso22301: standards.iso22301,
        std_iso42001: standards.iso42001,
        std_iso19443: standards.iso19443,
        std_iso22716: standards.iso22716,
        plan,
      };

      console.log("inserting company:", companyData);

      const { data, error } = await supabase
        .from("companies")
        .insert(companyData)
        .select()
        .single();

      if (error) {
        console.error("Supabase error:", error.message, error.details, error.hint);
        throw error;
      }
      if (!data) throw new Error("저장 실패: 반환 데이터 없음");

      const companyId = (data as { id: string }).id;
      document.cookie = `company_id=${companyId}; path=/; max-age=31536000; SameSite=Lax`;

      // Link authenticated user's profile to this company (쿠키 세션 기반)
      const authClient = getAuthClient();
      const { data: { user } } = await authClient.auth.getUser();
      if (user) {
        const { error: profileError } = await supabase
          .from("profiles")
          .upsert(
            { id: user.id, company_id: companyId, role: "admin", full_name: "" },
            { onConflict: "id" }
          );
        if (profileError) console.error("[onboarding] profile upsert error:", profileError.message);
      }

      window.location.href = "/";
    } catch (err) {
      const e = err as { message?: string };
      console.error("handleComplete 에러:", e?.message ?? err);
      alert(`저장 중 오류가 발생했습니다.\n${e?.message ?? "알 수 없는 오류"}`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh", background: "#F8F9FA",
      display: "flex", flexDirection: "column", alignItems: "center",
      justifyContent: "center", padding: "40px 20px",
    }}>
      {/* 로고 */}
      <div style={{ marginBottom: 28, display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{
          width: 34, height: 34, borderRadius: 9, background: "#3B5BDB", color: "#fff",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 15, fontWeight: 800, letterSpacing: "-0.03em",
        }}>C</div>
        <span style={{ fontSize: 20, fontWeight: 800, color: "#1a1a1a", letterSpacing: "-0.03em" }}>
          complAIs
        </span>
      </div>

      {/* 카드 */}
      <div style={{
        width: "100%", maxWidth,
        background: "#fff", borderRadius: 14, border: "1px solid #E5E5E5",
        boxShadow: "0 4px 24px rgba(0,0,0,0.06)", overflow: "hidden",
        transition: "max-width 0.3s",
      }}>

        {/* 프로그레스 바 */}
        <div style={{ height: 3, background: "#F0F0F0" }}>
          <div style={{
            height: 3, width: `${(step / 3) * 100}%`,
            background: "#3B5BDB", borderRadius: 2,
            transition: "width 0.4s cubic-bezier(0.4,0,0.2,1)",
          }} />
        </div>

        {/* 헤더 */}
        <div style={{ padding: "28px 32px 0" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }}>
            {[1, 2, 3].map(i => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <div style={{
                  width: 20, height: 20, borderRadius: "50%",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 10, fontWeight: 700,
                  background: i < step ? "#2F9E44" : i === step ? "#3B5BDB" : "#F0F0F0",
                  color: i <= step ? "#fff" : "#bbb",
                }}>
                  {i < step ? <Check size={10} /> : i}
                </div>
                {i < 3 && <div style={{ width: 20, height: 1, background: i < step ? "#2F9E44" : "#E5E5E5" }} />}
              </div>
            ))}
          </div>
          <h1 style={{ margin: "0 0 4px", fontSize: 20, fontWeight: 700, color: "#1a1a1a" }}>
            {STEP_META[step - 1].title}
          </h1>
          <p style={{ margin: "0 0 24px", fontSize: 13, color: "#999" }}>
            {STEP_META[step - 1].desc}
          </p>
        </div>

        {/* 컨텐츠 */}
        <div style={{ padding: "0 32px" }}>

          {/* ── Step 1: 회사 정보 ── */}
          {step === 1 && (
            <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
              <div>
                <label style={LABEL_STYLE}>회사명 <span style={{ color: "#E03131" }}>*</span></label>
                <input
                  type="text" value={companyName} onChange={e => {
                    setCompanyName(e.target.value);
                    const suggested = e.target.value.replace(/[^a-zA-Z가-힣]/g, "").toUpperCase().slice(0, 3);
                    setCompanyCode(prev => prev.length <= 3 ? suggested : prev);
                  }}
                  placeholder="예: OOO 주식회사"
                  style={INPUT_STYLE}
                  className="focus:border-[#3B5BDB] transition-colors placeholder:text-[#bbb]"
                />
              </div>

              <div>
                <label style={LABEL_STYLE}>
                  회사 코드 (영문 2~5자) <span style={{ color: "#E03131" }}>*</span>
                </label>
                <input
                  type="text"
                  value={companyCode}
                  onChange={e => setCompanyCode(e.target.value.toUpperCase().replace(/[^A-Z]/g, "").slice(0, 5))}
                  placeholder="예: ABC, LAMP, KQI"
                  style={INPUT_STYLE}
                  className="focus:border-[#3B5BDB] transition-colors placeholder:text-[#bbb]"
                />
                <p style={{ margin: "4px 0 0", fontSize: 11, color: "#999" }}>
                  문서번호에 사용됩니다. 예) ABC-C-150-P-01
                </p>
              </div>

              <div>
                <label style={LABEL_STYLE}>업종</label>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {BUSINESS_TYPES.map(bt => (
                    <ChipBtn
                      key={bt} label={bt}
                      selected={businessType === bt}
                      onClick={() => setBusinessType(bt === businessType ? "" : bt)}
                    />
                  ))}
                </div>
              </div>

              <div>
                <label style={LABEL_STYLE}>직원 수</label>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {EMPLOYEE_COUNTS.map(ec => (
                    <ChipBtn
                      key={ec} label={ec}
                      selected={employeeCount === ec}
                      onClick={() => setEmployeeCount(ec === employeeCount ? "" : ec)}
                    />
                  ))}
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                <div>
                  <label style={LABEL_STYLE}>대표자명</label>
                  <input
                    type="text" value={ceoName} onChange={e => setCeoName(e.target.value)}
                    placeholder="홍길동"
                    style={INPUT_STYLE}
                    className="focus:border-[#3B5BDB] transition-colors placeholder:text-[#bbb]"
                  />
                </div>
                <div>
                  <label style={LABEL_STYLE}>경영대리인</label>
                  <input
                    type="text" value={managementRep} onChange={e => setManagementRep(e.target.value)}
                    placeholder="품질관리자"
                    style={INPUT_STYLE}
                    className="focus:border-[#3B5BDB] transition-colors placeholder:text-[#bbb]"
                  />
                </div>
              </div>
            </div>
          )}

          {/* ── Step 2: 표준 선택 ── */}
          {step === 2 && (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {STANDARDS.map(std => {
                const selected = standards[std.id];
                return (
                  <button
                    key={std.id}
                    onClick={() => toggleStandard(std.id)}
                    disabled={std.required}
                    style={{
                      display: "flex", alignItems: "center", gap: 14,
                      padding: "14px 16px", borderRadius: 10, cursor: std.required ? "default" : "pointer",
                      border: selected ? `1.5px solid ${std.color}` : "1.5px solid #E5E5E5",
                      background: selected ? std.bg : "#FAFAFA",
                      textAlign: "left", transition: "border-color 0.15s, background 0.15s",
                    }}
                    className={!std.required ? "hover:border-[#bbb] transition-colors" : ""}
                  >
                    {/* 체크박스 */}
                    <div style={{
                      width: 20, height: 20, borderRadius: 5, flexShrink: 0,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      background: selected ? std.color : "#fff",
                      border: selected ? `2px solid ${std.color}` : "2px solid #E5E5E5",
                    }}>
                      {selected && <Check size={12} color="#fff" strokeWidth={3} />}
                    </div>

                    {/* 표준 정보 */}
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        {std.Icon && (
                          <std.Icon size={14} color={selected ? std.color : "#bbb"} />
                        )}
                        <span style={{ fontSize: 13, fontWeight: 700, color: selected ? std.color : "#1a1a1a" }}>
                          {std.name}
                        </span>
                        <span style={{ fontSize: 11, fontWeight: 600, color: std.color }}>
                          {std.label}
                        </span>
                        {std.required && (
                          <span style={{ fontSize: 10, fontWeight: 700, color: "#3B5BDB", background: "#EEF2FF", borderRadius: 3, padding: "1px 5px" }}>
                            필수
                          </span>
                        )}
                        {std.partner && (
                          <span style={{ fontSize: 10, fontWeight: 700, color: "#7048E8", background: "#F3F0FF", borderRadius: 3, padding: "1px 5px" }}>
                            파트너 연계
                          </span>
                        )}
                      </div>
                      <p style={{ margin: "2px 0 0", fontSize: 12, color: "#999" }}>{std.desc}</p>
                    </div>

                    {/* 문서 수 */}
                    <div style={{ textAlign: "right", flexShrink: 0 }}>
                      <p style={{ margin: 0, fontSize: 18, fontWeight: 700, color: selected ? std.color : "#bbb" }}>
                        {std.docCount}
                      </p>
                      <p style={{ margin: 0, fontSize: 10, color: "#bbb" }}>문서</p>
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {/* ── Step 3: 플랜 ── */}
          {step === 3 && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10 }}>
              {PLANS.map(p => {
                const selected = plan === p.id;
                return (
                  <button
                    key={p.id}
                    onClick={() => setPlan(p.id)}
                    style={{
                      display: "flex", flexDirection: "column", alignItems: "start",
                      padding: "18px 16px", borderRadius: 10, cursor: "pointer",
                      border: selected ? `2px solid ${p.color}` : "1.5px solid #E5E5E5",
                      background: selected ? "#fff" : "#FAFAFA",
                      textAlign: "left", position: "relative",
                      boxShadow: selected ? `0 0 0 3px ${p.color}22` : "none",
                      transition: "border-color 0.15s, box-shadow 0.15s",
                    }}
                  >
                    {p.recommended && (
                      <div style={{
                        position: "absolute", top: -1, right: 10,
                        background: "#3B5BDB", color: "#fff",
                        fontSize: 10, fontWeight: 700, borderRadius: "0 0 5px 5px",
                        padding: "2px 7px",
                      }}>
                        추천
                      </div>
                    )}

                    <p style={{ margin: "0 0 2px", fontSize: 14, fontWeight: 700, color: selected ? p.color : "#1a1a1a" }}>
                      {p.name}
                    </p>
                    <p style={{ margin: "0 0 14px", fontSize: 18, fontWeight: 800, color: selected ? p.color : "#1a1a1a" }}>
                      {p.price === null
                        ? "무료"
                        : <>₩{p.price.toLocaleString()}<span style={{ fontSize: 11, fontWeight: 400, color: "#999" }}>/월</span></>
                      }
                    </p>

                    <div style={{ display: "flex", flexDirection: "column", gap: 5, width: "100%" }}>
                      {p.features.map((f, i) => (
                        <div key={i} style={{ display: "flex", alignItems: "start", gap: 6 }}>
                          <div style={{
                            width: 14, height: 14, borderRadius: "50%", flexShrink: 0, marginTop: 1,
                            background: selected ? p.color : "#E5E5E5",
                            display: "flex", alignItems: "center", justifyContent: "center",
                          }}>
                            <Check size={8} color="#fff" strokeWidth={3} />
                          </div>
                          <span style={{ fontSize: 11, color: "#555", lineHeight: 1.45 }}>{f}</span>
                        </div>
                      ))}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* 하단 버튼 */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "24px 32px 32px",
        }}>
          {step > 1 ? (
            <button
              onClick={() => setStep(s => s - 1)}
              style={{
                padding: "7px 16px", borderRadius: 7, border: "1px solid #E5E5E5",
                background: "#fff", fontSize: 13, fontWeight: 500, color: "#555", cursor: "pointer",
              }}
              className="hover:bg-[#F5F5F5] transition-colors"
            >
              이전
            </button>
          ) : (
            <div />
          )}

          {step < 3 ? (
            <button
              onClick={() => setStep(s => s + 1)}
              disabled={step === 1 && !step1Valid}
              style={{
                padding: "7px 20px", borderRadius: 7, border: "none",
                background: "#3B5BDB", color: "#fff",
                fontSize: 13, fontWeight: 600,
                cursor: step === 1 && !step1Valid ? "not-allowed" : "pointer",
                opacity: step === 1 && !step1Valid ? 0.4 : 1,
              }}
              className="hover:opacity-90 transition-opacity"
            >
              다음
            </button>
          ) : (
            <button
              onClick={handleComplete}
              disabled={saving}
              style={{
                padding: "7px 22px", borderRadius: 7, border: "none",
                background: "#2F9E44", color: "#fff",
                fontSize: 13, fontWeight: 600,
                cursor: saving ? "not-allowed" : "pointer",
                opacity: saving ? 0.5 : 1,
              }}
              className="hover:opacity-90 transition-opacity"
            >
              {saving ? "설정 중..." : "시작하기"}
            </button>
          )}
        </div>
      </div>

      <p style={{ marginTop: 20, fontSize: 11, color: "#bbb" }}>
        이미 계정이 있으신가요?{" "}
        <a href="/login" style={{ color: "#3B5BDB", fontWeight: 500, textDecoration: "none" }}>로그인</a>
      </p>
    </div>
  );
}
