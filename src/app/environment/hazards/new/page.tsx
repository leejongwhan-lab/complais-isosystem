"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import AppLayout from "@/components/layout/AppLayout";
import { supabase } from "@/lib/supabase";

const INPUT_STYLE = {
  width: "100%", padding: "8px 12px", fontSize: 13,
  border: "1px solid #E5E5E5", borderRadius: 6,
  outline: "none", color: "#1a1a1a", background: "#fff",
  boxSizing: "border-box" as const,
};
const LBL = { display: "block", fontSize: 12, fontWeight: 600 as const, color: "#555", marginBottom: 4 };
const SCALE_LABELS = ["", "거의없음", "낮음", "보통", "높음", "매우높음"];
const M4_OPTIONS   = ["Man", "Machine", "Media", "Management"];
const PHA_METHODS  = ["HAZOP", "What-If", "Checklist"];
const DEVIATIONS   = ["온도 상승", "온도 하강", "압력 초과", "압력 저하", "유량 증가", "유량 감소", "누출", "역류", "오염"];

function levelInfo(score: number) {
  if (score >= 16) return { label: "매우높음", color: "#E03131", bg: "#FECACA" };
  if (score >= 11) return { label: "높음",    color: "#E67700", bg: "#FED7AA" };
  if (score >= 6)  return { label: "중간",    color: "#854D0E", bg: "#FEF9C3" };
  return                   { label: "낮음",    color: "#166534", bg: "#DCFCE7" };
}

function ScaleBtn({ value, selected, onClick }: { value: number; selected: boolean; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} style={{
      width: 36, height: 36, borderRadius: 6, cursor: "pointer", fontSize: 13,
      fontWeight: selected ? 700 : 400,
      border:     selected ? "2px solid #3B5BDB" : "1px solid #E5E5E5",
      background: selected ? "#EEF2FF" : "#fff",
      color:      selected ? "#3B5BDB" : "#555",
    }}>{value}</button>
  );
}

function MiniCell({ lik, sev, active }: { lik: number; sev: number; active: boolean }) {
  const s  = lik * sev;
  const bg = s >= 16 ? "#FECACA" : s >= 11 ? "#FED7AA" : s >= 6 ? "#FEF9C3" : "#DCFCE7";
  const br = s >= 16 ? "#FCA5A5" : s >= 11 ? "#FDBA74" : s >= 6 ? "#FDE047" : "#86EFAC";
  return (
    <div style={{
      width: 20, height: 20, borderRadius: 3,
      background: bg,
      border: active ? "2px solid #3B5BDB" : `1px solid ${br}`,
      boxSizing: "border-box",
    }} />
  );
}

function ScoreBar({ likelihood, severity, label }: { likelihood: number; severity: number; label: string }) {
  const score = likelihood * severity;
  const lv = levelInfo(score);
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", background: lv.bg, borderRadius: 6, border: `1px solid ${lv.color}30` }}>
      <span style={{ fontSize: 11, color: "#555" }}>{label}</span>
      <span style={{ fontSize: 22, fontWeight: 800, color: lv.color }}>{score}</span>
      <span style={{ fontSize: 12, fontWeight: 600, color: lv.color }}>/25</span>
      <span style={{ marginLeft: "auto", fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 4, color: lv.color, background: "rgba(255,255,255,0.7)" }}>
        {lv.label}
      </span>
    </div>
  );
}

function HazardNewContent() {
  const router       = useRouter();
  const searchParams = useSearchParams();
  const year         = new Date().getFullYear();

  const initType = searchParams.get("type") === "pha" ? "pha" : "kras";
  const [assessmentType, setAssessmentType] = useState<"kras" | "pha">(initType);

  const [krasCount, setKrasCount] = useState(0);
  const [phaCount,  setPhaCount]  = useState(0);

  const [kras, setKras] = useState({
    work_area:          "",
    work_type:          "",
    work_step:          "",
    hazard_type:        "Machine",
    hazard:             "",
    risk_factor:        "",
    current_control:    "",
    before_likelihood:  3,
    before_severity:    3,
    additional_control: "",
    after_likelihood:   1,
    after_severity:     1,
    owner_name:         "",
    review_date:        "",
  });

  const [pha, setPha] = useState({
    process_name:      "",
    assessment_method: "HAZOP",
    node:              "",
    deviation_preset:  "",
    deviation_custom:  "",
    cause:             "",
    consequence:       "",
    safeguard:         "",
    likelihood:        3,
    severity:          3,
    recommendation:    "",
    action_party:      "",
    target_date:       "",
  });

  const [saving, setSaving] = useState(false);
  const [error,  setError]  = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      supabase.from("hazard_assessments").select("*", { count: "exact", head: true }),
      supabase.from("process_hazard_assessments").select("*", { count: "exact", head: true }),
    ]).then(([k, p]) => {
      setKrasCount(k.count ?? 0);
      setPhaCount(p.count ?? 0);
    });
  }, []);

  const krasNumber = `HA-${year}-${String(krasCount + 1).padStart(3, "0")}`;
  const phaNumber  = `PHA-${year}-${String(phaCount + 1).padStart(3, "0")}`;

  const deviationValue = pha.deviation_preset === "직접입력" ? pha.deviation_custom : pha.deviation_preset;

  function setK<K extends keyof typeof kras>(key: K) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setKras(p => ({ ...p, [key]: e.target.value }));
  }
  function setP<K extends keyof typeof pha>(key: K) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setPha(p => ({ ...p, [key]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true); setError(null);

    if (assessmentType === "kras") {
      if (!kras.hazard.trim()) { setError("유해·위험요인을 입력해주세요."); setSaving(false); return; }
      const { error: err } = await supabase
        .from("hazard_assessments")
        .insert({
          hazard_number:       krasNumber,
          assessment_type:     "kras",
          work_area:           kras.work_area.trim(),
          work_type:           kras.work_type.trim(),
          work_step:           kras.work_step.trim()          || null,
          hazard_type:         kras.hazard_type,
          hazard:              kras.hazard.trim(),
          risk_factor:         kras.risk_factor.trim()        || null,
          current_control:     kras.current_control.trim()    || null,
          likelihood:          kras.before_likelihood,
          severity:            kras.before_severity,
          before_likelihood:   kras.before_likelihood,
          before_severity:     kras.before_severity,
          additional_control:  kras.additional_control.trim() || null,
          after_likelihood:    kras.after_likelihood,
          after_severity:      kras.after_severity,
          owner_name:          kras.owner_name.trim()         || null,
          review_date:         kras.review_date               || null,
        });
      setSaving(false);
      if (err) { setError(err.message); return; }
    } else {
      if (!pha.process_name.trim()) { setError("공정명을 입력해주세요."); setSaving(false); return; }
      const { error: err } = await supabase
        .from("process_hazard_assessments")
        .insert({
          pha_number:        phaNumber,
          process_name:      pha.process_name.trim(),
          assessment_method: pha.assessment_method,
          node:              pha.node.trim()           || null,
          deviation:         deviationValue            || null,
          cause:             pha.cause.trim()          || null,
          consequence:       pha.consequence.trim()    || null,
          safeguard:         pha.safeguard.trim()      || null,
          likelihood:        pha.likelihood,
          severity:          pha.severity,
          recommendation:    pha.recommendation.trim() || null,
          action_party:      pha.action_party.trim()   || null,
          target_date:       pha.target_date           || null,
          status:            "open",
        });
      setSaving(false);
      if (err) { setError(err.message); return; }
    }

    router.push("/environment");
  }

  const typeTabStyle = (t: "kras" | "pha") => ({
    flex: 1, padding: "10px 0", borderRadius: 6, cursor: "pointer" as const,
    fontSize: 13, fontWeight: (assessmentType === t ? 700 : 400) as 400 | 700,
    border: assessmentType === t ? "2px solid #3B5BDB" : "1px solid #E5E5E5",
    background: assessmentType === t ? "#EEF2FF" : "#fff",
    color: assessmentType === t ? "#3B5BDB" : "#555",
  });

  return (
    <AppLayout>
      <div style={{ display: "flex", justifyContent: "center", padding: "36px 24px", background: "#fff", minHeight: "calc(100vh - 56px)" }}>
        <div style={{ width: "100%", maxWidth: 600 }}>

          <div style={{ marginBottom: 24 }}>
            <h1 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: "#1a1a1a" }}>위험성평가 등록</h1>
            <p style={{ margin: "4px 0 0", fontSize: 13, color: "#999" }}>ISO 45001 위험성평가 항목을 등록합니다.</p>
          </div>

          {/* 평가 유형 선택 */}
          <div style={{ marginBottom: 24 }}>
            <label style={LBL}>평가 유형</label>
            <div style={{ display: "flex", gap: 10 }}>
              <button type="button" onClick={() => { setAssessmentType("kras"); setError(null); }} style={typeTabStyle("kras")}>
                KRAS (작업위험성평가)
              </button>
              <button type="button" onClick={() => { setAssessmentType("pha"); setError(null); }} style={typeTabStyle("pha")}>
                공정위험성평가 (PHA)
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit}>

            {/* ═══ KRAS 폼 ═══ */}
            {assessmentType === "kras" && (
              <>
                {/* 번호 */}
                <div style={{ marginBottom: 16 }}>
                  <label style={LBL}>평가 번호</label>
                  <div style={{ ...INPUT_STYLE, background: "#FAFAFA", fontFamily: "monospace", fontWeight: 700, color: "#3B5BDB" }}>{krasNumber}</div>
                </div>

                {/* 작업장소 + 작업유형 */}
                <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
                  <div style={{ flex: 1 }}>
                    <label style={LBL}>작업 장소</label>
                    <input type="text" value={kras.work_area} onChange={setK("work_area")} placeholder="예: 생산라인" style={INPUT_STYLE}
                      className="focus:border-[#3B5BDB] transition-colors placeholder:text-[#bbb]" />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={LBL}>작업 유형</label>
                    <input type="text" value={kras.work_type} onChange={setK("work_type")} placeholder="예: 프레스 작업" style={INPUT_STYLE}
                      className="focus:border-[#3B5BDB] transition-colors placeholder:text-[#bbb]" />
                  </div>
                </div>

                {/* 작업 단계 */}
                <div style={{ marginBottom: 16 }}>
                  <label style={LBL}>작업 단계</label>
                  <input type="text" value={kras.work_step} onChange={setK("work_step")} placeholder="예: 원재료 투입 단계" style={INPUT_STYLE}
                    className="focus:border-[#3B5BDB] transition-colors placeholder:text-[#bbb]" />
                </div>

                {/* 4M 분류 */}
                <div style={{ marginBottom: 16 }}>
                  <label style={LBL}>4M 분류</label>
                  <div style={{ display: "flex", gap: 8 }}>
                    {M4_OPTIONS.map(m => {
                      const colors: Record<string, { color: string; bg: string }> = {
                        Man: { color: "#3B5BDB", bg: "#EEF2FF" },
                        Machine: { color: "#E67700", bg: "#FFF9DB" },
                        Media: { color: "#2F9E44", bg: "#F0FBF4" },
                        Management: { color: "#7048E8", bg: "#F3F0FF" },
                      };
                      const c = colors[m];
                      const sel = kras.hazard_type === m;
                      return (
                        <button key={m} type="button" onClick={() => setKras(p => ({ ...p, hazard_type: m }))}
                          style={{
                            flex: 1, padding: "7px 0", borderRadius: 6, cursor: "pointer", fontSize: 12,
                            fontWeight: sel ? 700 : 400,
                            border: sel ? `1px solid ${c.color}` : "1px solid #E5E5E5",
                            background: sel ? c.bg : "#fff",
                            color: sel ? c.color : "#555",
                          }}>
                          {m}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 유해·위험요인 */}
                <div style={{ marginBottom: 16 }}>
                  <label style={LBL}>유해·위험요인 *</label>
                  <input type="text" value={kras.hazard} onChange={setK("hazard")} placeholder="예: 협착 위험" style={INPUT_STYLE}
                    className="focus:border-[#3B5BDB] transition-colors placeholder:text-[#bbb]" />
                </div>

                {/* 위험성 요인 */}
                <div style={{ marginBottom: 16 }}>
                  <label style={LBL}>위험성 요인</label>
                  <input type="text" value={kras.risk_factor} onChange={setK("risk_factor")} placeholder="예: 안전가드 미설치" style={INPUT_STYLE}
                    className="focus:border-[#3B5BDB] transition-colors placeholder:text-[#bbb]" />
                </div>

                {/* 현재 관리방안 */}
                <div style={{ marginBottom: 16 }}>
                  <label style={LBL}>현재 관리방안</label>
                  <textarea value={kras.current_control} onChange={setK("current_control")} placeholder="현재 적용 중인 관리 방안" rows={2}
                    style={{ ...INPUT_STYLE, resize: "vertical", lineHeight: 1.6 }}
                    className="focus:border-[#3B5BDB] transition-colors placeholder:text-[#bbb]" />
                </div>

                {/* 개선 전 위험도 */}
                <div style={{ marginBottom: 16, padding: "16px", background: "#FAFAFA", borderRadius: 8, border: "1px solid #F0F0F0" }}>
                  <p style={{ margin: "0 0 12px", fontSize: 11, fontWeight: 600, color: "#E67700", textTransform: "uppercase", letterSpacing: "0.05em" }}>개선 전 위험도</p>
                  <div style={{ display: "flex", gap: 32 }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ marginBottom: 12 }}>
                        <label style={{ ...LBL, marginBottom: 8 }}>발생가능성</label>
                        <div style={{ display: "flex", gap: 4 }}>
                          {[1,2,3,4,5].map(v => <ScaleBtn key={v} value={v} selected={kras.before_likelihood === v} onClick={() => setKras(p => ({ ...p, before_likelihood: v }))} />)}
                        </div>
                        <p style={{ margin: "4px 0 0", fontSize: 11, color: "#bbb" }}>{SCALE_LABELS[kras.before_likelihood]}</p>
                      </div>
                      <div style={{ marginBottom: 12 }}>
                        <label style={{ ...LBL, marginBottom: 8 }}>심각도</label>
                        <div style={{ display: "flex", gap: 4 }}>
                          {[1,2,3,4,5].map(v => <ScaleBtn key={v} value={v} selected={kras.before_severity === v} onClick={() => setKras(p => ({ ...p, before_severity: v }))} />)}
                        </div>
                        <p style={{ margin: "4px 0 0", fontSize: 11, color: "#bbb" }}>{SCALE_LABELS[kras.before_severity]}</p>
                      </div>
                      <ScoreBar likelihood={kras.before_likelihood} severity={kras.before_severity} label="개선 전 점수" />
                    </div>
                    {/* 미니 히트맵 */}
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", paddingTop: 24 }}>
                      <p style={{ margin: "0 0 8px", fontSize: 10, color: "#bbb" }}>위치 미리보기</p>
                      <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                        {[5,4,3,2,1].map(sev => (
                          <div key={sev} style={{ display: "flex", gap: 2 }}>
                            {[1,2,3,4,5].map(lik => <MiniCell key={lik} lik={lik} sev={sev} active={kras.before_likelihood === lik && kras.before_severity === sev} />)}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* 추가 관리방안 (개선대책) */}
                <div style={{ marginBottom: 16 }}>
                  <label style={LBL}>추가 관리방안 (개선대책)</label>
                  <textarea value={kras.additional_control} onChange={setK("additional_control")} placeholder="추가로 필요한 관리 방안 / 개선대책" rows={2}
                    style={{ ...INPUT_STYLE, resize: "vertical", lineHeight: 1.6 }}
                    className="focus:border-[#3B5BDB] transition-colors placeholder:text-[#bbb]" />
                </div>

                {/* 개선 후 위험도 */}
                <div style={{ marginBottom: 16, padding: "14px 16px", background: "#F0FBF4", borderRadius: 8, border: "1px solid #86EFAC" }}>
                  <p style={{ margin: "0 0 12px", fontSize: 11, fontWeight: 600, color: "#2F9E44", textTransform: "uppercase", letterSpacing: "0.05em" }}>개선 후 잔류 위험도</p>
                  <div style={{ display: "flex", gap: 16 }}>
                    <div style={{ flex: 1 }}>
                      <label style={{ ...LBL, marginBottom: 8 }}>발생가능성</label>
                      <div style={{ display: "flex", gap: 4 }}>
                        {[1,2,3,4,5].map(v => <ScaleBtn key={v} value={v} selected={kras.after_likelihood === v} onClick={() => setKras(p => ({ ...p, after_likelihood: v }))} />)}
                      </div>
                    </div>
                    <div style={{ flex: 1 }}>
                      <label style={{ ...LBL, marginBottom: 8 }}>심각도</label>
                      <div style={{ display: "flex", gap: 4 }}>
                        {[1,2,3,4,5].map(v => <ScaleBtn key={v} value={v} selected={kras.after_severity === v} onClick={() => setKras(p => ({ ...p, after_severity: v }))} />)}
                      </div>
                    </div>
                  </div>
                  <div style={{ marginTop: 12 }}>
                    <ScoreBar likelihood={kras.after_likelihood} severity={kras.after_severity} label="개선 후 점수" />
                  </div>
                </div>

                {/* 담당자 + 검토일 */}
                <div style={{ display: "flex", gap: 12, marginBottom: 28 }}>
                  <div style={{ flex: 1 }}>
                    <label style={LBL}>담당자</label>
                    <input type="text" value={kras.owner_name} onChange={setK("owner_name")} placeholder="담당자 이름" style={INPUT_STYLE}
                      className="focus:border-[#3B5BDB] transition-colors placeholder:text-[#bbb]" />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={LBL}>검토일</label>
                    <input type="date" value={kras.review_date} onChange={setK("review_date")} style={INPUT_STYLE}
                      className="focus:border-[#3B5BDB] transition-colors" />
                  </div>
                </div>
              </>
            )}

            {/* ═══ PHA 폼 ═══ */}
            {assessmentType === "pha" && (
              <>
                {/* 번호 */}
                <div style={{ marginBottom: 16 }}>
                  <label style={LBL}>평가 번호</label>
                  <div style={{ ...INPUT_STYLE, background: "#FAFAFA", fontFamily: "monospace", fontWeight: 700, color: "#7048E8" }}>{phaNumber}</div>
                </div>

                {/* 공정명 */}
                <div style={{ marginBottom: 16 }}>
                  <label style={LBL}>공정명 *</label>
                  <input type="text" value={pha.process_name} onChange={setP("process_name")} placeholder="예: 도장 공정" style={INPUT_STYLE}
                    className="focus:border-[#3B5BDB] transition-colors placeholder:text-[#bbb]" />
                </div>

                {/* 평가방법 */}
                <div style={{ marginBottom: 16 }}>
                  <label style={LBL}>평가방법</label>
                  <div style={{ display: "flex", gap: 8 }}>
                    {PHA_METHODS.map(m => {
                      const colors: Record<string, string> = { HAZOP: "#7048E8", "What-If": "#3B5BDB", Checklist: "#2F9E44" };
                      const bgs:   Record<string, string> = { HAZOP: "#F3F0FF", "What-If": "#EEF2FF", Checklist: "#F0FBF4" };
                      const sel = pha.assessment_method === m;
                      return (
                        <button key={m} type="button" onClick={() => setPha(p => ({ ...p, assessment_method: m }))}
                          style={{
                            flex: 1, padding: "8px 0", borderRadius: 6, cursor: "pointer", fontSize: 12,
                            fontWeight: sel ? 700 : 400,
                            border:     sel ? `1px solid ${colors[m]}` : "1px solid #E5E5E5",
                            background: sel ? bgs[m] : "#fff",
                            color:      sel ? colors[m] : "#555",
                          }}>
                          {m}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 노드/검토구간 */}
                <div style={{ marginBottom: 16 }}>
                  <label style={LBL}>노드 / 검토 구간</label>
                  <input type="text" value={pha.node} onChange={setP("node")} placeholder="예: 희석제 공급라인" style={INPUT_STYLE}
                    className="focus:border-[#3B5BDB] transition-colors placeholder:text-[#bbb]" />
                </div>

                {/* 이탈 (드롭다운 + 직접입력) */}
                <div style={{ marginBottom: 16 }}>
                  <label style={LBL}>이탈</label>
                  <select value={pha.deviation_preset} onChange={e => setPha(p => ({ ...p, deviation_preset: e.target.value, deviation_custom: "" }))}
                    style={{ ...INPUT_STYLE, cursor: "pointer" }}>
                    <option value="">선택하세요</option>
                    {DEVIATIONS.map(d => <option key={d} value={d}>{d}</option>)}
                    <option value="직접입력">직접입력...</option>
                  </select>
                  {pha.deviation_preset === "직접입력" && (
                    <input type="text" value={pha.deviation_custom}
                      onChange={e => setPha(p => ({ ...p, deviation_custom: e.target.value }))}
                      placeholder="이탈 내용 직접 입력"
                      style={{ ...INPUT_STYLE, marginTop: 8 }}
                      className="focus:border-[#3B5BDB] transition-colors placeholder:text-[#bbb]" />
                  )}
                </div>

                {/* 원인 */}
                <div style={{ marginBottom: 16 }}>
                  <label style={LBL}>원인</label>
                  <input type="text" value={pha.cause} onChange={setP("cause")} placeholder="예: 조절밸브 고장" style={INPUT_STYLE}
                    className="focus:border-[#3B5BDB] transition-colors placeholder:text-[#bbb]" />
                </div>

                {/* 결과/영향 */}
                <div style={{ marginBottom: 16 }}>
                  <label style={LBL}>결과 / 영향</label>
                  <input type="text" value={pha.consequence} onChange={setP("consequence")} placeholder="예: VOC 농도 상승 → 화재 위험" style={INPUT_STYLE}
                    className="focus:border-[#3B5BDB] transition-colors placeholder:text-[#bbb]" />
                </div>

                {/* 현재 안전조치 */}
                <div style={{ marginBottom: 16 }}>
                  <label style={LBL}>현재 안전조치 (Safeguard)</label>
                  <textarea value={pha.safeguard} onChange={setP("safeguard")} placeholder="현재 적용 중인 안전조치" rows={2}
                    style={{ ...INPUT_STYLE, resize: "vertical", lineHeight: 1.6 }}
                    className="focus:border-[#3B5BDB] transition-colors placeholder:text-[#bbb]" />
                </div>

                {/* 발생가능성 × 심각도 */}
                <div style={{ marginBottom: 16, padding: "16px", background: "#FAFAFA", borderRadius: 8, border: "1px solid #F0F0F0" }}>
                  <p style={{ margin: "0 0 12px", fontSize: 11, fontWeight: 600, color: "#999", textTransform: "uppercase", letterSpacing: "0.05em" }}>위험도 평가</p>
                  <div style={{ display: "flex", gap: 24, marginBottom: 12 }}>
                    <div>
                      <label style={{ ...LBL, marginBottom: 8 }}>발생가능성</label>
                      <div style={{ display: "flex", gap: 4 }}>
                        {[1,2,3,4,5].map(v => <ScaleBtn key={v} value={v} selected={pha.likelihood === v} onClick={() => setPha(p => ({ ...p, likelihood: v }))} />)}
                      </div>
                      <p style={{ margin: "4px 0 0", fontSize: 11, color: "#bbb" }}>{SCALE_LABELS[pha.likelihood]}</p>
                    </div>
                    <div>
                      <label style={{ ...LBL, marginBottom: 8 }}>심각도</label>
                      <div style={{ display: "flex", gap: 4 }}>
                        {[1,2,3,4,5].map(v => <ScaleBtn key={v} value={v} selected={pha.severity === v} onClick={() => setPha(p => ({ ...p, severity: v }))} />)}
                      </div>
                      <p style={{ margin: "4px 0 0", fontSize: 11, color: "#bbb" }}>{SCALE_LABELS[pha.severity]}</p>
                    </div>
                  </div>
                  <ScoreBar likelihood={pha.likelihood} severity={pha.severity} label="위험도 점수" />
                </div>

                {/* 권고 조치사항 */}
                <div style={{ marginBottom: 16 }}>
                  <label style={LBL}>권고 조치사항</label>
                  <textarea value={pha.recommendation} onChange={setP("recommendation")} placeholder="권고 조치사항을 입력하세요" rows={3}
                    style={{ ...INPUT_STYLE, resize: "vertical", lineHeight: 1.6 }}
                    className="focus:border-[#3B5BDB] transition-colors placeholder:text-[#bbb]" />
                </div>

                {/* 조치 담당 + 목표일 */}
                <div style={{ display: "flex", gap: 12, marginBottom: 28 }}>
                  <div style={{ flex: 1 }}>
                    <label style={LBL}>조치 담당</label>
                    <input type="text" value={pha.action_party} onChange={setP("action_party")} placeholder="담당 부서 / 이름" style={INPUT_STYLE}
                      className="focus:border-[#3B5BDB] transition-colors placeholder:text-[#bbb]" />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={LBL}>목표일</label>
                    <input type="date" value={pha.target_date} onChange={setP("target_date")} style={INPUT_STYLE}
                      className="focus:border-[#3B5BDB] transition-colors" />
                  </div>
                </div>
              </>
            )}

            {error && <p style={{ marginBottom: 16, fontSize: 12, color: "#E03131" }}>{error}</p>}

            <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
              <button type="button" onClick={() => router.back()}
                style={{ padding: "8px 18px", borderRadius: 6, cursor: "pointer", fontSize: 13, fontWeight: 500, color: "#555", border: "1px solid #E5E5E5", background: "#fff" }}
                className="hover:bg-[#F5F5F5] transition-colors">취소</button>
              <button type="submit" disabled={saving}
                style={{ padding: "8px 18px", borderRadius: 6, cursor: saving ? "not-allowed" : "pointer", fontSize: 13, fontWeight: 600, color: "#fff", border: "none", background: saving ? "#C5D0FF" : "#3B5BDB" }}
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

export default function HazardNewPage() {
  return (
    <Suspense fallback={<AppLayout><div style={{ padding: 24, fontSize: 14, color: "#888" }}>불러오는 중...</div></AppLayout>}>
      <HazardNewContent />
    </Suspense>
  );
}
