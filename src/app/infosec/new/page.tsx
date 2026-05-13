"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import AppLayout from "@/components/layout/AppLayout";
import { supabase } from "@/lib/supabase";

const INPUT_STYLE = {
  width: "100%", padding: "8px 12px", fontSize: 13,
  border: "1px solid #E5E5E5", borderRadius: 6,
  outline: "none", color: "#1a1a1a", background: "#fff",
  boxSizing: "border-box" as const,
};

const ASSET_TYPES = ["하드웨어", "소프트웨어", "데이터", "서비스", "인원", "시설"] as const;
const CLASSIFICATIONS = [
  { value: "public",       label: "공개" },
  { value: "internal",     label: "내부" },
  { value: "confidential", label: "기밀" },
  { value: "secret",       label: "비밀" },
] as const;
const SCALE_LABELS = ["", "거의없음", "낮음", "보통", "높음", "매우높음"];

type AssetType = typeof ASSET_TYPES[number];
type ClassType = typeof CLASSIFICATIONS[number]["value"];

function levelInfo(score: number) {
  if (score >= 16) return { label: "매우높음", color: "#E03131", bg: "#FECACA" };
  if (score >= 11) return { label: "높음",    color: "#E67700", bg: "#FED7AA" };
  if (score >= 6)  return { label: "중간",    color: "#854D0E", bg: "#FEF9C3" };
  return                   { label: "낮음",    color: "#166534", bg: "#DCFCE7" };
}

function ScaleBtn({ value, selected, onClick }: { value: number; selected: boolean; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} style={{
      width: 36, height: 36, borderRadius: 6, cursor: "pointer",
      fontSize: 13, fontWeight: selected ? 700 : 400,
      border: selected ? "2px solid #7048E8" : "1px solid #E5E5E5",
      background: selected ? "#F3F0FF" : "#fff",
      color: selected ? "#7048E8" : "#555",
    }}>{value}</button>
  );
}

export default function InfosecNewPage() {
  const router = useRouter();
  const year = new Date().getFullYear();
  const [count, setCount] = useState(0);
  const [form, setForm] = useState({
    asset_name:      "",
    asset_type:      "하드웨어" as AssetType,
    location:        "",
    owner_name:      "",
    classification:  "internal" as ClassType,
    likelihood:      3,
    impact:          3,
    control_measure: "",
  });
  const [saving, setSaving] = useState(false);
  const [error,  setError]  = useState<string | null>(null);

  useEffect(() => {
    supabase.from("information_assets").select("*", { count: "exact", head: true })
      .then(({ count: c }) => setCount(c ?? 0));
  }, []);

  const assetNumber = `IA-${year}-${String(count + 1).padStart(3, "0")}`;
  const score = form.likelihood * form.impact;
  const level = useMemo(() => levelInfo(score), [score]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.asset_name.trim()) { setError("자산명을 입력해주세요."); return; }
    setSaving(true); setError(null);
    const { error: err } = await supabase.from("information_assets").insert({
      asset_number:    assetNumber,
      asset_name:      form.asset_name.trim(),
      asset_type:      form.asset_type,
      location:        form.location.trim() || null,
      owner_name:      form.owner_name.trim() || null,
      classification:  form.classification,
      likelihood:      form.likelihood,
      impact:          form.impact,
      control_measure: form.control_measure.trim() || null,
      status:          "active",
    });
    setSaving(false);
    if (err) { setError(err.message); return; }
    router.push("/infosec");
  }

  return (
    <AppLayout>
      <div style={{ display: "flex", justifyContent: "center", padding: "36px 24px", background: "#fff", minHeight: "calc(100vh - 56px)" }}>
        <div style={{ width: "100%", maxWidth: 580 }}>

          <div style={{ marginBottom: 24 }}>
            <h1 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: "#1a1a1a" }}>정보자산 등록</h1>
            <p style={{ margin: "4px 0 0", fontSize: 13, color: "#999" }}>새로운 정보자산을 등록하고 위험을 평가합니다.</p>
          </div>

          <form onSubmit={handleSubmit}>

            {/* 자산번호 */}
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#555", marginBottom: 4 }}>자산번호</label>
              <div style={{ ...INPUT_STYLE, background: "#FAFAFA", fontFamily: "monospace", fontWeight: 700, color: "#7048E8" }}>
                {assetNumber}
              </div>
            </div>

            {/* 자산명 */}
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#555", marginBottom: 4 }}>자산명 *</label>
              <input type="text" value={form.asset_name} onChange={e => setForm(p => ({ ...p, asset_name: e.target.value }))}
                placeholder="정보자산 이름을 입력하세요" style={INPUT_STYLE}
                className="focus:border-[#7048E8] transition-colors placeholder:text-[#bbb]" />
            </div>

            {/* 자산유형 */}
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#555", marginBottom: 6 }}>자산 유형 *</label>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {ASSET_TYPES.map(t => (
                  <button key={t} type="button" onClick={() => setForm(p => ({ ...p, asset_type: t }))}
                    style={{
                      padding: "6px 12px", borderRadius: 6, cursor: "pointer",
                      fontSize: 12, fontWeight: form.asset_type === t ? 600 : 400,
                      border: form.asset_type === t ? "1px solid #7048E8" : "1px solid #E5E5E5",
                      background: form.asset_type === t ? "#F3F0FF" : "#fff",
                      color: form.asset_type === t ? "#7048E8" : "#555",
                    }}>{t}</button>
                ))}
              </div>
            </div>

            {/* 보관위치 + 소유자 */}
            <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
              <div style={{ flex: 1 }}>
                <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#555", marginBottom: 4 }}>보관위치</label>
                <input type="text" value={form.location} onChange={e => setForm(p => ({ ...p, location: e.target.value }))}
                  placeholder="서버실, 사무실 등" style={INPUT_STYLE}
                  className="focus:border-[#7048E8] transition-colors placeholder:text-[#bbb]" />
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#555", marginBottom: 4 }}>자산 소유자</label>
                <input type="text" value={form.owner_name} onChange={e => setForm(p => ({ ...p, owner_name: e.target.value }))}
                  placeholder="담당자 이름" style={INPUT_STYLE}
                  className="focus:border-[#7048E8] transition-colors placeholder:text-[#bbb]" />
              </div>
            </div>

            {/* 분류등급 */}
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#555", marginBottom: 6 }}>분류등급 *</label>
              <div style={{ display: "flex", gap: 8 }}>
                {CLASSIFICATIONS.map(c => (
                  <button key={c.value} type="button" onClick={() => setForm(p => ({ ...p, classification: c.value }))}
                    style={{
                      flex: 1, padding: "8px 0", borderRadius: 6, cursor: "pointer",
                      fontSize: 12, fontWeight: form.classification === c.value ? 600 : 400,
                      border: form.classification === c.value ? "1px solid #7048E8" : "1px solid #E5E5E5",
                      background: form.classification === c.value ? "#F3F0FF" : "#fff",
                      color: form.classification === c.value ? "#7048E8" : "#555",
                    }}>{c.label}</button>
                ))}
              </div>
            </div>

            {/* 위험평가 */}
            <div style={{ marginBottom: 16, padding: "16px", background: "#FAFAFA", borderRadius: 8, border: "1px solid #F0F0F0" }}>
              <p style={{ margin: "0 0 12px", fontSize: 12, fontWeight: 600, color: "#555" }}>위험평가</p>
              <div style={{ display: "flex", gap: 24, marginBottom: 14 }}>
                <div>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#555", marginBottom: 8 }}>발생가능성</label>
                  <div style={{ display: "flex", gap: 4 }}>
                    {[1,2,3,4,5].map(v => (
                      <ScaleBtn key={v} value={v} selected={form.likelihood === v} onClick={() => setForm(p => ({ ...p, likelihood: v }))} />
                    ))}
                  </div>
                  <p style={{ margin: "4px 0 0", fontSize: 11, color: "#bbb" }}>{SCALE_LABELS[form.likelihood]}</p>
                </div>
                <div>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#555", marginBottom: 8 }}>영향도</label>
                  <div style={{ display: "flex", gap: 4 }}>
                    {[1,2,3,4,5].map(v => (
                      <ScaleBtn key={v} value={v} selected={form.impact === v} onClick={() => setForm(p => ({ ...p, impact: v }))} />
                    ))}
                  </div>
                  <p style={{ margin: "4px 0 0", fontSize: 11, color: "#bbb" }}>{SCALE_LABELS[form.impact]}</p>
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", background: level.bg, borderRadius: 6, border: `1px solid ${level.color}30` }}>
                <span style={{ fontSize: 11, color: "#555" }}>위험도 점수</span>
                <span style={{ fontSize: 22, fontWeight: 800, color: level.color }}>{score}</span>
                <span style={{ fontSize: 12, fontWeight: 600, color: level.color }}>/ 25</span>
                <span style={{ marginLeft: "auto", fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 4, color: level.color, background: "rgba(255,255,255,0.7)" }}>{level.label}</span>
              </div>
            </div>

            {/* 관리방안 */}
            <div style={{ marginBottom: 28 }}>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#555", marginBottom: 4 }}>관리방안</label>
              <textarea value={form.control_measure} onChange={e => setForm(p => ({ ...p, control_measure: e.target.value }))}
                placeholder="해당 자산의 보안 관리 방안을 입력하세요" rows={3}
                style={{ ...INPUT_STYLE, resize: "vertical", lineHeight: 1.6 }}
                className="focus:border-[#7048E8] transition-colors placeholder:text-[#bbb]" />
            </div>

            {error && <p style={{ marginBottom: 16, fontSize: 12, color: "#E03131" }}>{error}</p>}

            <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
              <button type="button" onClick={() => router.back()}
                style={{ padding: "8px 18px", borderRadius: 6, cursor: "pointer", fontSize: 13, fontWeight: 500, color: "#555", border: "1px solid #E5E5E5", background: "#fff" }}
                className="hover:bg-[#F5F5F5] transition-colors">취소</button>
              <button type="submit" disabled={saving}
                style={{ padding: "8px 18px", borderRadius: 6, fontSize: 13, fontWeight: 600, color: "#fff", border: "none",
                  background: saving ? "#D0BFFF" : "#7048E8", cursor: saving ? "not-allowed" : "pointer" }}
                className={saving ? "" : "hover:opacity-90 transition-opacity"}>
                {saving ? "저장 중..." : "저장"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </AppLayout>
  );
}
