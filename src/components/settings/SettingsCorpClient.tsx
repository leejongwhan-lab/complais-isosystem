"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import type { Company } from "@/lib/company";

// KSIC 주요 분류 → IAF 코드 매핑
const KSIC_IAF_MAP: Record<string, string> = {
  A: "01", B: "02",
  C10: "03", C11: "03", C12: "03",
  C13: "04", C14: "04", C15: "04",
  C16: "06", C17: "06", C18: "06",
  C19: "09", C20: "09",
  C21: "10",
  C22: "11",
  C23: "12", C24: "13",
  C25: "14", C26: "14",
  C27: "15",
  C28: "17", C29: "17",
  C30: "16",
  C31: "19", C32: "19", C33: "19",
  C34: "22", C35: "22",
  D: "37", E: "39",
  F: "26", G: "27", H: "24",
  I: "28", J: "31", K: "30",
  L: "25", M: "35", N: "35",
  O: "33", P: "29", Q: "32",
  R: "34", S: "34",
};

function getIafFromKsic(ksic: string): string {
  if (!ksic) return "";
  const prefix3 = ksic.slice(0, 3).toUpperCase();
  const prefix2 = ksic.slice(0, 2).toUpperCase();
  const prefix1 = ksic.slice(0, 1).toUpperCase();
  return KSIC_IAF_MAP[prefix3] ?? KSIC_IAF_MAP[prefix2] ?? KSIC_IAF_MAP[prefix1] ?? "";
}

function SectionHeader({ label }: { label: string }) {
  return (
    <div style={{ padding: "10px 20px", borderBottom: "1px solid #F0F0F0", background: "#FAFAFA" }}>
      <p style={{ margin: 0, fontSize: 11, fontWeight: 600, color: "#999", textTransform: "uppercase", letterSpacing: "0.06em" }}>
        {label}
      </p>
    </div>
  );
}

function FieldRow({ label, required, hint, children }: {
  label: string; required?: boolean; hint?: string; children: React.ReactNode;
}) {
  return (
    <div style={{ display: "flex", alignItems: "flex-start", padding: "12px 20px", borderBottom: "1px solid #F5F5F5", gap: 12 }}>
      <span style={{ fontSize: 12, color: "#888", minWidth: 120, flexShrink: 0, paddingTop: 4 }}>
        {label}{required && <span style={{ color: "#E03131" }}> *</span>}
      </span>
      <div style={{ flex: 1 }}>
        {children}
        {hint && <p style={{ margin: "4px 0 0", fontSize: 11, color: "#bbb" }}>{hint}</p>}
      </div>
    </div>
  );
}

const inputStyle = (editing: boolean): React.CSSProperties => ({
  fontSize: 13,
  border: "1px solid #E5E5E5",
  borderRadius: 5,
  padding: "5px 9px",
  outline: "none",
  color: "#1a1a1a",
  width: "100%",
  maxWidth: 360,
  background: editing ? "#fff" : "#FAFAFA",
  cursor: editing ? "text" : "default",
});

const textareaStyle = (editing: boolean): React.CSSProperties => ({
  fontSize: 13,
  border: "1px solid #E5E5E5",
  borderRadius: 5,
  padding: "6px 9px",
  outline: "none",
  color: "#1a1a1a",
  width: "100%",
  maxWidth: 500,
  background: editing ? "#fff" : "#FAFAFA",
  cursor: editing ? "text" : "default",
  resize: "vertical" as const,
});

type Fields = {
  company_name: string; name_en: string; biz_no: string; corp_no: string;
  ceo_name: string; business_type: string; company_code: string;
  scope_kr: string; scope_en: string;
  address: string; address_en: string;
  tel: string; email: string; website: string;
  employee_count_hq: string; employee_count_out: string;
  employee_full: string; employee_part: string;
  ksic_code: string;
};

export default function SettingsCorpClient({ company }: { company: Company | null }) {
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const init = (): Fields => ({
    company_name:       company?.company_name ?? "",
    name_en:            company?.name_en ?? "",
    biz_no:             company?.biz_no ?? "",
    corp_no:            company?.corp_no ?? "",
    ceo_name:           company?.ceo_name ?? "",
    business_type:      company?.business_type ?? "",
    company_code:       company?.company_code ?? "",
    scope_kr:           company?.scope_kr ?? "",
    scope_en:           company?.scope_en ?? "",
    address:            company?.address ?? "",
    address_en:         company?.address_en ?? "",
    tel:                company?.tel ?? "",
    email:              company?.email ?? "",
    website:            company?.website ?? "",
    employee_count_hq:  String(company?.employee_count_hq ?? ""),
    employee_count_out: String(company?.employee_count_out ?? ""),
    employee_full:      String(company?.employee_full ?? ""),
    employee_part:      String(company?.employee_part ?? ""),
    ksic_code:          company?.ksic_code ?? "",
  });

  const [f, setF] = useState<Fields>(init);

  const iafCode = getIafFromKsic(f.ksic_code);

  function handleKsicChange(v: string) {
    setF(prev => ({ ...prev, ksic_code: v }));
  }

  async function handleSave() {
    if (!company) return;
    setSaving(true);
    await supabase
      .from("companies")
      .update({
        company_name:       f.company_name.trim() || null,
        name_en:            f.name_en.trim() || null,
        biz_no:             f.biz_no.trim() || null,
        corp_no:            f.corp_no.trim() || null,
        ceo_name:           f.ceo_name.trim() || null,
        business_type:      f.business_type.trim() || null,
        company_code:       f.company_code.trim() || null,
        scope_kr:           f.scope_kr.trim() || null,
        scope_en:           f.scope_en.trim() || null,
        address:            f.address.trim() || null,
        address_en:         f.address_en.trim() || null,
        tel:                f.tel.trim() || null,
        email:              f.email.trim() || null,
        website:            f.website.trim() || null,
        employee_count_hq:  f.employee_count_hq ? parseInt(f.employee_count_hq) : null,
        employee_count_out: f.employee_count_out ? parseInt(f.employee_count_out) : null,
        employee_full:      f.employee_full ? parseInt(f.employee_full) : null,
        employee_part:      f.employee_part ? parseInt(f.employee_part) : null,
        ksic_code:          f.ksic_code.trim() || null,
        iaf_code:           iafCode || null,
      })
      .eq("id", company.id);
    setSaving(false);
    setSaved(true);
    setEditing(false);
    setTimeout(() => setSaved(false), 3000);
  }

  function handleCancel() {
    setF(init());
    setEditing(false);
  }

  const inp = (key: keyof Fields) => (
    <input
      value={f[key]}
      disabled={!editing}
      onChange={e => setF(prev => ({ ...prev, [key]: e.target.value }))}
      style={inputStyle(editing)}
    />
  );

  return (
    <div style={{ padding: "28px 32px" }}>
      {/* 헤더 */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
        <div>
          <h2 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: "#1a1a1a" }}>기업 기본정보</h2>
          <p style={{ margin: "3px 0 0", fontSize: 12, color: "#999" }}>인증서·보고서에 표시되는 공식 정보입니다.</p>
        </div>
        {!editing ? (
          <button onClick={() => setEditing(true)} disabled={!company} style={{
            padding: "6px 14px", borderRadius: 6, fontSize: 13, fontWeight: 500,
            border: "1px solid #E5E5E5", background: "#fff", color: company ? "#555" : "#ccc", cursor: company ? "pointer" : "not-allowed",
          }}>{company ? "수정" : "회사 미등록"}</button>
        ) : (
          <div style={{ display: "flex", gap: 6 }}>
            <button onClick={handleCancel} style={{
              padding: "6px 14px", borderRadius: 6, fontSize: 13,
              border: "1px solid #E5E5E5", background: "#fff", color: "#555", cursor: "pointer",
            }}>취소</button>
            <button onClick={handleSave} disabled={saving} style={{
              padding: "6px 14px", borderRadius: 6, fontSize: 13, fontWeight: 600,
              border: "none", background: "#3B5BDB", color: "#fff",
              cursor: saving ? "not-allowed" : "pointer", opacity: saving ? 0.7 : 1,
            }}>{saving ? "저장 중..." : "저장"}</button>
          </div>
        )}
      </div>

      {saved && (
        <div style={{ marginBottom: 16, padding: "10px 14px", borderRadius: 6, background: "#F0FBF4", color: "#2F9E44", fontSize: 13, fontWeight: 500 }}>
          저장되었습니다.
        </div>
      )}

      {/* 섹션 1: 기본 정보 */}
      <div style={{ background: "#fff", border: "1px solid #E5E5E5", borderRadius: 10, overflow: "hidden", marginBottom: 16 }}>
        <SectionHeader label="🏷 기본 정보" />
        <FieldRow label="기업명" required>{inp("company_name")}</FieldRow>
        <FieldRow label="영문 기업명">{inp("name_en")}</FieldRow>
        <FieldRow label="사업자등록번호">{inp("biz_no")}</FieldRow>
        <FieldRow label="법인등록번호">{inp("corp_no")}</FieldRow>
        <FieldRow label="대표자명">{inp("ceo_name")}</FieldRow>
        <FieldRow label="업태">{inp("business_type")}</FieldRow>
        <FieldRow label="회사 코드" hint="문서번호 접두어 (영문 대문자 5자 이내)">
          <input
            value={f.company_code}
            disabled={!editing}
            onChange={e => setF(prev => ({ ...prev, company_code: e.target.value.toUpperCase().replace(/[^A-Z]/g, "").slice(0, 5) }))}
            style={inputStyle(editing)}
          />
        </FieldRow>
      </div>

      {/* 섹션 2: 인증 수행 범위 */}
      <div style={{ background: "#fff", border: "1px solid #E5E5E5", borderRadius: 10, overflow: "hidden", marginBottom: 16 }}>
        <SectionHeader label="📋 인증 수행 범위" />
        <FieldRow label="국문 범위" required hint="심사기관에 등록되는 공식 인증 범위">
          <textarea
            value={f.scope_kr}
            disabled={!editing}
            rows={2}
            onChange={e => setF(prev => ({ ...prev, scope_kr: e.target.value }))}
            style={textareaStyle(editing)}
          />
        </FieldRow>
        <FieldRow label="영문 범위" hint="해외 고객 및 글로벌 인증기관 제출용">
          <textarea
            value={f.scope_en}
            disabled={!editing}
            rows={2}
            onChange={e => setF(prev => ({ ...prev, scope_en: e.target.value }))}
            style={textareaStyle(editing)}
          />
        </FieldRow>
      </div>

      {/* 섹션 3: 주소 */}
      <div style={{ background: "#fff", border: "1px solid #E5E5E5", borderRadius: 10, overflow: "hidden", marginBottom: 16 }}>
        <SectionHeader label="📍 주소" />
        <FieldRow label="국문 주소">{inp("address")}</FieldRow>
        <FieldRow label="영문 주소">{inp("address_en")}</FieldRow>
      </div>

      {/* 섹션 4: 연락처 */}
      <div style={{ background: "#fff", border: "1px solid #E5E5E5", borderRadius: 10, overflow: "hidden", marginBottom: 16 }}>
        <SectionHeader label="📞 연락처" />
        <FieldRow label="대표 전화">{inp("tel")}</FieldRow>
        <FieldRow label="대표 이메일">{inp("email")}</FieldRow>
        <FieldRow label="홈페이지">{inp("website")}</FieldRow>
      </div>

      {/* 섹션 5: 인원 현황 */}
      <div style={{ background: "#fff", border: "1px solid #E5E5E5", borderRadius: 10, overflow: "hidden" }}>
        <SectionHeader label="👥 인원 현황" />
        <div style={{ padding: "12px 20px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          {([
            ["본사 인원수",  "employee_count_hq"],
            ["외부 근무",    "employee_count_out"],
            ["정규직",       "employee_full"],
            ["비정규직",     "employee_part"],
          ] as [string, keyof Fields][]).map(([label, key]) => (
            <div key={key}>
              <label style={{ display: "block", fontSize: 11, color: "#888", marginBottom: 4 }}>{label}</label>
              <input
                type="number"
                value={f[key]}
                disabled={!editing}
                onChange={e => setF(prev => ({ ...prev, [key]: e.target.value }))}
                style={{ ...inputStyle(editing), maxWidth: "100%" }}
              />
            </div>
          ))}
        </div>
        <div style={{ borderTop: "1px solid #F5F5F5" }}>
          <FieldRow label="KSIC 코드" hint="입력 시 IAF 코드가 자동으로 표시됩니다">
            <input
              value={f.ksic_code}
              disabled={!editing}
              onChange={e => handleKsicChange(e.target.value)}
              placeholder="예) C30 (자동차 제조)"
              style={inputStyle(editing)}
            />
          </FieldRow>
          <FieldRow label="IAF 코드">
            <div style={{
              display: "inline-block", padding: "5px 12px", borderRadius: 5,
              background: "#F0F4FF", color: "#3B5BDB",
              fontSize: 13, fontWeight: 600, minWidth: 60, minHeight: 30,
              border: "1px solid #D0D7FF",
            }}>
              {iafCode ? `IAF ${iafCode}` : (company?.iaf_code ? `IAF ${company.iaf_code}` : "—")}
            </div>
          </FieldRow>
        </div>
      </div>
    </div>
  );
}
