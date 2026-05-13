"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import { supabase } from "@/lib/supabase";
import type { Company } from "@/lib/company";

type StdKey = keyof Pick<Company,
  "std_iso9001" | "std_iso14001" | "std_iso45001" | "std_iatf" | "std_iso13485" |
  "std_iso50001" | "std_iso37001" | "std_iso37301" | "std_iso27001" |
  "std_iso22000" | "std_iso22301" | "std_iso42001" | "std_iso19443" | "std_iso22716"
>;

const STD_LIST: { key: StdKey; label: string; name: string; color: string; bg: string; fixed?: boolean }[] = [
  { key: "std_iso9001",  label: "ISO 9001",   name: "품질경영시스템",     color: "#3B5BDB", bg: "#EEF2FF", fixed: true  },
  { key: "std_iso14001", label: "ISO 14001",  name: "환경경영시스템",     color: "#2F9E44", bg: "#F0FBF4"               },
  { key: "std_iso45001", label: "ISO 45001",  name: "안전보건경영시스템", color: "#E67700", bg: "#FFF9DB"               },
  { key: "std_iatf",     label: "IATF 16949", name: "자동차 품질경영",    color: "#7048E8", bg: "#F3F0FF"               },
  { key: "std_iso13485", label: "ISO 13485",  name: "의료기기 품질경영",  color: "#E03131", bg: "#FFF0F0"               },
  { key: "std_iso50001", label: "ISO 50001",  name: "에너지경영시스템",   color: "#E67700", bg: "#FFF9DB"               },
  { key: "std_iso37001", label: "ISO 37001",  name: "반부패경영시스템",   color: "#2F9E44", bg: "#F0FBF4"               },
  { key: "std_iso37301", label: "ISO 37301",  name: "준법경영시스템",     color: "#1098AD", bg: "#E3FAFC"               },
  { key: "std_iso27001", label: "ISO 27001",  name: "정보보안경영시스템", color: "#7048E8", bg: "#F3F0FF"               },
  { key: "std_iso22000", label: "ISO 22000",  name: "식품안전경영시스템", color: "#2F9E44", bg: "#EBFBEE"               },
  { key: "std_iso22301", label: "ISO 22301",  name: "사업연속성경영시스템", color: "#3B5BDB", bg: "#EEF2FF"             },
  { key: "std_iso42001", label: "ISO 42001",  name: "AI경영시스템",       color: "#7048E8", bg: "#F3F0FF"               },
  { key: "std_iso19443", label: "ISO 19443",  name: "원자력 공급망 품질", color: "#E67700", bg: "#FFF9DB"               },
  { key: "std_iso22716", label: "ISO 22716",  name: "화장품 GMP",        color: "#E64980", bg: "#FFE3EC"               },
];

const PLAN_LABEL: Record<string, string> = {
  free:         "무료",
  starter:      "스타터",
  professional: "프로페셔널",
  enterprise:   "엔터프라이즈",
};

export default function SettingsClient({ company }: { company: Company | null }) {
  const [editing, setEditing]           = useState(false);
  const [companyName, setCompanyName]   = useState(company?.company_name ?? "");
  const [companyCode, setCompanyCode]   = useState(company?.company_code ?? "");
  const [rep, setRep]                   = useState(company?.management_rep ?? "");
  const [stdValues, setStdValues]       = useState<Record<StdKey, boolean>>(
    () => Object.fromEntries(STD_LIST.map(s => [s.key, company?.[s.key] ?? false])) as Record<StdKey, boolean>
  );
  const [saving, setSaving]             = useState(false);
  const [saved, setSaved]               = useState(false);

  function toggleStd(key: StdKey) {
    if (key === "std_iso9001") return;
    setStdValues(prev => ({ ...prev, [key]: !prev[key] }));
  }

  async function handleSave() {
    if (!company) return;
    setSaving(true);
    await supabase
      .from("companies")
      .update({
        company_name:   companyName.trim(),
        company_code:   companyCode,
        management_rep: rep.trim() || null,
        ...Object.fromEntries(STD_LIST.map(s => [s.key, stdValues[s.key]])),
      })
      .eq("id", company.id);
    setSaving(false);
    setSaved(true);
    setEditing(false);
    setTimeout(() => setSaved(false), 3000);
  }

  function handleCancel() {
    setEditing(false);
    setCompanyName(company?.company_name ?? "");
    setCompanyCode(company?.company_code ?? "");
    setRep(company?.management_rep ?? "");
    setStdValues(Object.fromEntries(STD_LIST.map(s => [s.key, company?.[s.key] ?? false])) as Record<StdKey, boolean>);
  }

  if (!company) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "calc(100vh - 56px)" }}>
        <p style={{ fontSize: 13, color: "#bbb" }}>회사 정보가 없습니다. 온보딩을 완료해주세요.</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 680, margin: "0 auto", padding: "36px 24px" }}>
      {/* 헤더 */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 28 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: "#1a1a1a" }}>회사 설정</h1>
          <p style={{ margin: "4px 0 0", fontSize: 13, color: "#999" }}>경영시스템 기본 정보를 관리합니다.</p>
        </div>
        {!editing ? (
          <button onClick={() => setEditing(true)} style={{
            padding: "6px 14px", borderRadius: 6, fontSize: 13, fontWeight: 500,
            border: "1px solid #E5E5E5", background: "#fff", color: "#555", cursor: "pointer",
          }} className="hover:bg-[#F5F5F5] transition-colors">
            수정
          </button>
        ) : (
          <div style={{ display: "flex", gap: 6 }}>
            <button onClick={handleCancel} style={{
              padding: "6px 14px", borderRadius: 6, fontSize: 13, fontWeight: 500,
              border: "1px solid #E5E5E5", background: "#fff", color: "#555", cursor: "pointer",
            }} className="hover:bg-[#F5F5F5] transition-colors">취소</button>
            <button onClick={handleSave} disabled={saving} style={{
              padding: "6px 14px", borderRadius: 6, fontSize: 13, fontWeight: 600,
              border: "none", background: "#3B5BDB", color: "#fff",
              cursor: saving ? "not-allowed" : "pointer", opacity: saving ? 0.6 : 1,
            }} className="hover:opacity-90 transition-opacity">
              {saving ? "저장 중..." : "저장"}
            </button>
          </div>
        )}
      </div>

      {saved && (
        <div style={{ marginBottom: 16, padding: "10px 14px", borderRadius: 6, background: "#F0FBF4", color: "#2F9E44", fontSize: 13, fontWeight: 500 }}>
          저장되었습니다. 사이드바가 자동 반영됩니다.
        </div>
      )}

      {/* 기본 정보 */}
      <div style={{ background: "#fff", border: "1px solid #E5E5E5", borderRadius: 10, overflow: "hidden", marginBottom: 20 }}>
        <SectionHeader label="기본 정보" />
        <div style={{ padding: "4px 0" }}>
          <Row label="회사명">
            {editing ? (
              <input value={companyName} onChange={e => setCompanyName(e.target.value)}
                style={{ fontSize: 13, border: "1px solid #E5E5E5", borderRadius: 5, padding: "4px 8px", outline: "none", color: "#1a1a1a", width: "100%", maxWidth: 260 }}
                className="focus:border-[#3B5BDB] transition-colors" />
            ) : (
              <span style={{ fontSize: 13, color: "#1a1a1a", fontWeight: 500 }}>{company.company_name}</span>
            )}
          </Row>
          <Row label="관리대표">
            {editing ? (
              <input value={rep} onChange={e => setRep(e.target.value)} placeholder="관리대표자 이름"
                style={{ fontSize: 13, border: "1px solid #E5E5E5", borderRadius: 5, padding: "4px 8px", outline: "none", color: "#1a1a1a", width: "100%", maxWidth: 260 }}
                className="focus:border-[#3B5BDB] transition-colors placeholder:text-[#bbb]" />
            ) : (
              <span style={{ fontSize: 13, color: "#1a1a1a" }}>{company.management_rep ?? "—"}</span>
            )}
          </Row>
          <Row label="회사 코드">
            <div style={{ flex: 1 }}>
              <input
                type="text"
                value={companyCode}
                disabled={!editing}
                onChange={e => setCompanyCode(e.target.value.toUpperCase().replace(/[^A-Z]/g, "").slice(0, 5))}
                style={{ fontSize: 13, border: "1px solid #E5E5E5", borderRadius: 5, padding: "4px 8px", outline: "none", color: "#1a1a1a", width: "100%", maxWidth: 260 }}
                className="focus:border-[#3B5BDB] transition-colors"
              />
              <p style={{ margin: "4px 0 0", fontSize: 11, color: editing ? "#E67700" : "#999" }}>
                {editing ? "⚠ 변경 시 기존 문서번호는 자동 변경되지 않습니다" : "문서번호 접두어"}
              </p>
            </div>
          </Row>
          <Row label="플랜">
            <span style={{ fontSize: 12, fontWeight: 600, padding: "3px 8px", borderRadius: 5, background: "#EEF2FF", color: "#3B5BDB" }}>
              {PLAN_LABEL[company.plan] ?? company.plan}
            </span>
          </Row>
        </div>
      </div>

      {/* 적용 표준 */}
      <div style={{ background: "#fff", border: "1px solid #E5E5E5", borderRadius: 10, overflow: "hidden" }}>
        <SectionHeader label="적용 표준" />
        <div style={{ padding: "12px 20px", display: "flex", flexDirection: "column", gap: 8 }}>
          {STD_LIST.map(s => {
            const active  = stdValues[s.key];
            const locked  = s.fixed;
            return (
              <button
                key={s.key}
                onClick={() => !locked && toggleStd(s.key)}
                disabled={!editing || locked}
                style={{
                  display: "flex", alignItems: "center", gap: 12,
                  padding: "10px 14px", borderRadius: 8, cursor: (!editing || locked) ? "default" : "pointer",
                  border: active ? `1.5px solid ${s.color}` : "1.5px solid #E5E5E5",
                  background: active ? s.bg : "#FAFAFA",
                  textAlign: "left",
                  opacity: (!editing && !active) ? 0.45 : 1,
                  transition: "border-color 0.15s, background 0.15s, opacity 0.15s",
                }}
                className={editing && !locked ? "hover:border-[#bbb] transition-colors" : ""}
              >
                {/* 체크 박스 */}
                <div style={{
                  width: 18, height: 18, borderRadius: 4, flexShrink: 0,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  background: active ? s.color : "#fff",
                  border: active ? `2px solid ${s.color}` : "2px solid #E5E5E5",
                }}>
                  {active && <Check size={11} color="#fff" strokeWidth={3} />}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <span style={{ fontSize: 12, fontWeight: 700, color: active ? s.color : "#555" }}>{s.label}</span>
                    <span style={{ fontSize: 11, color: active ? s.color : "#999" }}>{s.name}</span>
                    {locked && (
                      <span style={{ fontSize: 10, fontWeight: 700, color: "#3B5BDB", background: "#EEF2FF", borderRadius: 3, padding: "1px 5px" }}>필수</span>
                    )}
                  </div>
                </div>
                {active && (
                  <span style={{ fontSize: 10, fontWeight: 600, padding: "2px 6px", borderRadius: 4, color: s.color, background: `${s.color}20`, flexShrink: 0 }}>
                    적용 중
                  </span>
                )}
              </button>
            );
          })}
          {!editing && (
            <p style={{ margin: "4px 0 0", fontSize: 12, color: "#bbb" }}>
              적용 표준 변경은 &quot;수정&quot; 버튼을 클릭하세요.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function SectionHeader({ label }: { label: string }) {
  return (
    <div style={{ padding: "14px 20px", borderBottom: "1px solid #F0F0F0", background: "#FAFAFA" }}>
      <p style={{ margin: 0, fontSize: 11, fontWeight: 600, color: "#999", textTransform: "uppercase", letterSpacing: "0.06em" }}>
        {label}
      </p>
    </div>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", alignItems: "center", padding: "12px 20px", borderBottom: "1px solid #F5F5F5" }}>
      <span style={{ fontSize: 12, color: "#999", minWidth: 80, flexShrink: 0 }}>{label}</span>
      {children}
    </div>
  );
}
