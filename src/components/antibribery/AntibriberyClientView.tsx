"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Plus, Shield, BookOpen } from "lucide-react";
import RiskHeatmap from "@/components/common/RiskHeatmap";
import type { HeatmapRisk } from "@/components/common/RiskHeatmap";

export type BriberyRisk = {
  id: string; risk_number: string; category: string; title: string;
  description: string | null; likelihood: number; impact: number;
  risk_score: number | null; risk_level: string;
  control_measure: string | null; owner_name: string | null; status: string;
};

export type GiftReport = {
  id: string; report_number: string; report_date: string;
  reporter_name: string; gift_type: string; provider: string;
  amount: number | null; description: string | null; action: string;
};

type TabKey = "리스크" | "선물신고" | "교육";

const LEVEL_STYLE: Record<string, { label: string; color: string; bg: string }> = {
  critical: { label: "매우높음", color: "#E03131", bg: "#FECACA" },
  high:     { label: "높음",    color: "#E67700", bg: "#FED7AA" },
  medium:   { label: "중간",    color: "#854D0E", bg: "#FEF9C3" },
  low:      { label: "낮음",    color: "#166534", bg: "#DCFCE7" },
};

const ACTION_STYLE: Record<string, { label: string; color: string; bg: string }> = {
  reported: { label: "신고완료",  color: "#3B5BDB", bg: "#EEF2FF" },
  returned: { label: "반환",      color: "#2F9E44", bg: "#F0FBF4" },
  approved: { label: "승인",      color: "#E67700", bg: "#FFF9DB" },
  rejected: { label: "반려",      color: "#E03131", bg: "#FFF0F0" },
};

const STATUS_STYLE: Record<string, { label: string; color: string; bg: string }> = {
  open:        { label: "미결",   color: "#E03131", bg: "#FFF0F0" },
  in_progress: { label: "처리중", color: "#3B5BDB", bg: "#EEF2FF" },
  closed:      { label: "종결",   color: "#2F9E44", bg: "#F0FBF4" },
};

export default function AntibriberyClientView({
  riskList, giftList,
}: { riskList: BriberyRisk[]; giftList: GiftReport[] }) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabKey>("리스크");
  const [selectedCell, setSelectedCell] = useState<{ likelihood: number; impact: number } | null>(null);

  const now = new Date();
  const thisMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  const thisMonthGifts = giftList.filter(g => g.report_date.startsWith(thisMonth)).length;
  const highRisk = riskList.filter(r => r.risk_level === "critical" || r.risk_level === "high").length;

  const heatmapRisks: HeatmapRisk[] = riskList.map(r => ({
    id: r.id,
    risk_number: r.risk_number,
    likelihood: r.likelihood,
    impact: r.impact,
    risk_level: r.risk_level,
  }));

  const tableRisks = useMemo(() => {
    if (!selectedCell) return riskList;
    return riskList.filter(r => r.likelihood === selectedCell.likelihood && r.impact === selectedCell.impact);
  }, [riskList, selectedCell]);

  const tabs: { key: TabKey; label: string; count?: number }[] = [
    { key: "리스크",  label: "부패리스크 평가",    count: riskList.length },
    { key: "선물신고", label: "선물·접대 신고",    count: giftList.length },
    { key: "교육",    label: "반부패 교육" },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "calc(100vh - 56px)" }}>

      {/* KPI */}
      <div style={{ display: "flex", borderBottom: "1px solid #F0F0F0", flexShrink: 0 }}>
        {[
          { label: "부패리스크 평가",   value: riskList.length,  sub: "등록 건수",      color: "#1a1a1a" },
          { label: "고위험 리스크",      value: highRisk,         sub: "즉시 대응 필요", color: highRisk > 0 ? "#E03131" : "#2F9E44" },
          { label: "선물·접대 신고",    value: giftList.length,  sub: "전체 건수",      color: "#3B5BDB" },
          { label: "이번달 신고",        value: thisMonthGifts,   sub: thisMonth,        color: "#E67700" },
        ].map((kpi, i, arr) => (
          <div key={kpi.label} style={{ flex: 1, padding: "18px 22px", borderRight: i < arr.length - 1 ? "1px solid #F0F0F0" : "none" }}>
            <p style={{ margin: "0 0 5px", fontSize: 11, fontWeight: 500, color: "#999", textTransform: "uppercase", letterSpacing: "0.05em" }}>{kpi.label}</p>
            <p style={{ margin: "0 0 4px", fontSize: 26, fontWeight: 600, lineHeight: 1, color: kpi.color }}>{kpi.value}</p>
            <p style={{ margin: 0, fontSize: 11, color: "#bbb" }}>{kpi.sub}</p>
          </div>
        ))}
      </div>

      {/* 탭 툴바 */}
      <div style={{ background: "#fff", borderBottom: "1px solid #E5E5E5", padding: "10px 16px", display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
        <div style={{ display: "flex", gap: 4 }}>
          {tabs.map(t => (
            <button key={t.key} onClick={() => { setActiveTab(t.key); setSelectedCell(null); }} style={{
              display: "flex", alignItems: "center", gap: 5,
              padding: "5px 12px", borderRadius: 4, cursor: "pointer",
              fontSize: 12, fontWeight: activeTab === t.key ? 600 : 400,
              border: activeTab === t.key ? "1px solid #2F9E44" : "1px solid #E5E5E5",
              background: activeTab === t.key ? "#EBFBEE" : "#fff",
              color: activeTab === t.key ? "#2F9E44" : "#555",
            }}>
              {t.label}
              {t.count !== undefined && (
                <span style={{
                  fontSize: 10, fontWeight: 700, padding: "0 4px", borderRadius: 8,
                  background: activeTab === t.key ? "#2F9E44" : "#F0F0F0",
                  color: activeTab === t.key ? "#fff" : "#999",
                }}>{t.count}</span>
              )}
            </button>
          ))}
        </div>
        <div style={{ flex: 1 }} />
        {activeTab === "리스크" && (
          <Link href="/antibribery/risks/new" style={{
            display: "flex", alignItems: "center", gap: 5,
            padding: "5px 12px", borderRadius: 6, textDecoration: "none",
            fontSize: 12, fontWeight: 600, color: "#fff", background: "#2F9E44",
          }} className="hover:opacity-90 transition-opacity">
            <Plus size={13} />리스크 등록
          </Link>
        )}
        {activeTab === "선물신고" && (
          <Link href="/antibribery/gifts/new" style={{
            display: "flex", alignItems: "center", gap: 5,
            padding: "5px 12px", borderRadius: 6, textDecoration: "none",
            fontSize: 12, fontWeight: 600, color: "#fff", background: "#3B5BDB",
          }} className="hover:opacity-90 transition-opacity">
            <Plus size={13} />신고서 작성
          </Link>
        )}
        {activeTab === "교육" && (
          <Link href="/forms/F-720-02/new" style={{
            display: "flex", alignItems: "center", gap: 5,
            padding: "5px 12px", borderRadius: 6, textDecoration: "none",
            fontSize: 12, fontWeight: 600, color: "#fff", background: "#7048E8",
          }} className="hover:opacity-90 transition-opacity">
            <Plus size={13} />교육 기록
          </Link>
        )}
      </div>

      {/* 본문 */}
      <div style={{ flex: 1, overflow: "hidden" }}>
        {activeTab === "리스크" && (
          <RiskTab
            riskList={riskList}
            tableRisks={tableRisks}
            heatmapRisks={heatmapRisks}
            selectedCell={selectedCell}
            onCellClick={(l, i) => setSelectedCell(prev => prev?.likelihood === l && prev?.impact === i ? null : { likelihood: l, impact: i })}
            onRiskClick={id => router.push(`/antibribery/risks/${id}`)}
          />
        )}
        {activeTab === "선물신고" && <GiftTab giftList={giftList} />}
        {activeTab === "교육" && <TrainingTab />}
      </div>

      <div style={{ background: "#fff", borderTop: "1px solid #E5E5E5", padding: "10px 16px", flexShrink: 0 }}>
        <span style={{ fontSize: 12, color: "#999" }}>
          {activeTab === "리스크"
            ? <>리스크 <span style={{ fontWeight: 600, color: "#555" }}>{riskList.length}</span>건 · 선물신고 <span style={{ fontWeight: 600, color: "#555" }}>{giftList.length}</span>건</>
            : activeTab === "선물신고"
              ? <>총 <span style={{ fontWeight: 600, color: "#555" }}>{giftList.length}</span>건</>
              : null
          }
        </span>
      </div>
    </div>
  );
}

function RiskTab({
  riskList, tableRisks, heatmapRisks, selectedCell, onCellClick, onRiskClick,
}: {
  riskList: BriberyRisk[];
  tableRisks: BriberyRisk[];
  heatmapRisks: HeatmapRisk[];
  selectedCell: { likelihood: number; impact: number } | null;
  onCellClick: (l: number, i: number) => void;
  onRiskClick: (id: string) => void;
}) {
  if (riskList.length === 0) {
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", gap: 12 }}>
        <Shield size={40} color="#ddd" />
        <p style={{ margin: 0, fontSize: 14, fontWeight: 600, color: "#999" }}>등록된 부패리스크가 없습니다</p>
        <Link href="/antibribery/risks/new" style={{
          marginTop: 4, padding: "7px 16px", borderRadius: 6, textDecoration: "none",
          fontSize: 13, fontWeight: 600, color: "#fff", background: "#2F9E44",
        }}>새로 등록</Link>
      </div>
    );
  }
  return (
    <div style={{ display: "flex", height: "100%", overflow: "hidden" }}>
      {/* 히트맵 */}
      <div style={{ flex: 55, overflowY: "auto", padding: "20px 24px", borderRight: "1px solid #E5E5E5" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
          <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: "#1a1a1a" }}>부패리스크 히트맵</p>
          {selectedCell && (
            <button onClick={() => onCellClick(selectedCell.likelihood, selectedCell.impact)}
              style={{ fontSize: 11, fontWeight: 500, color: "#2F9E44", background: "#EBFBEE", border: "1px solid #B2F2BB", borderRadius: 4, padding: "3px 8px", cursor: "pointer" }}>
              필터 해제 ✕
            </button>
          )}
        </div>
        <RiskHeatmap risks={heatmapRisks} selectedCell={selectedCell} onCellClick={onCellClick} onRiskClick={onRiskClick} />
      </div>
      {/* 테이블 */}
      <div style={{ flex: 45, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <div style={{ padding: "10px 14px", borderBottom: "1px solid #E5E5E5", flexShrink: 0 }}>
          <span style={{ fontSize: 12, color: "#999" }}>
            {selectedCell ? `가능성 ${selectedCell.likelihood} × 영향도 ${selectedCell.impact} — ${tableRisks.length}건` : `전체 ${riskList.length}건`}
          </span>
        </div>
        <div style={{ flex: 1, overflowY: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead style={{ position: "sticky", top: 0, zIndex: 10, background: "#FAFAFA", borderBottom: "1px solid #E5E5E5" }}>
              <tr>
                {["번호", "카테고리", "제목", "가능성", "영향도", "점수", "등급", "담당자", "상태"].map((col, i) => (
                  <th key={i} style={{ padding: "7px 10px", textAlign: "left", fontSize: 10, fontWeight: 600, color: "#999", whiteSpace: "nowrap" }}>{col}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tableRisks.length === 0 ? (
                <tr><td colSpan={9} style={{ textAlign: "center", padding: "36px 0", fontSize: 13, color: "#bbb" }}>해당하는 리스크가 없습니다.</td></tr>
              ) : tableRisks.map((r, i) => {
                const ls = LEVEL_STYLE[r.risk_level] ?? { label: r.risk_level, color: "#999", bg: "#F5F5F5" };
                const ss = STATUS_STYLE[r.status] ?? { label: r.status, color: "#999", bg: "#F5F5F5" };
                return (
                  <tr key={r.id}
                    onClick={() => onRiskClick(r.id)}
                    style={{ borderBottom: i < tableRisks.length - 1 ? "1px solid #F0F0F0" : "none", cursor: "pointer" }}
                    className="hover:bg-[#FAFAFA] transition-colors">
                    <td style={{ padding: "8px 10px" }}><span style={{ fontFamily: "monospace", fontSize: 10, fontWeight: 700, color: "#2F9E44" }}>{r.risk_number.slice(-3)}</span></td>
                    <td style={{ padding: "8px 10px", fontSize: 11, color: "#555", whiteSpace: "nowrap" }}>{r.category}</td>
                    <td style={{ padding: "8px 10px", maxWidth: 130 }}><span style={{ fontSize: 12, color: "#1a1a1a", display: "block", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{r.title}</span></td>
                    <td style={{ padding: "8px 10px", textAlign: "center", fontSize: 12, fontWeight: 600, color: "#555" }}>{r.likelihood}</td>
                    <td style={{ padding: "8px 10px", textAlign: "center", fontSize: 12, fontWeight: 600, color: "#555" }}>{r.impact}</td>
                    <td style={{ padding: "8px 10px", textAlign: "center", fontSize: 12, fontWeight: 700, color: ls.color }}>{r.risk_score ?? r.likelihood * r.impact}</td>
                    <td style={{ padding: "8px 10px" }}><span style={{ fontSize: 10, fontWeight: 700, padding: "2px 5px", borderRadius: 3, color: ls.color, background: ls.bg }}>{ls.label}</span></td>
                    <td style={{ padding: "8px 10px", fontSize: 11, color: "#555", whiteSpace: "nowrap" }}>{r.owner_name ?? "—"}</td>
                    <td style={{ padding: "8px 10px" }}><span style={{ fontSize: 10, fontWeight: 600, padding: "2px 5px", borderRadius: 3, color: ss.color, background: ss.bg }}>{ss.label}</span></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function GiftTab({ giftList }: { giftList: GiftReport[] }) {
  if (giftList.length === 0) {
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", gap: 12 }}>
        <Shield size={40} color="#ddd" />
        <p style={{ margin: 0, fontSize: 14, fontWeight: 600, color: "#999" }}>신고 내역이 없습니다</p>
        <Link href="/antibribery/gifts/new" style={{
          marginTop: 4, padding: "7px 16px", borderRadius: 6, textDecoration: "none",
          fontSize: 13, fontWeight: 600, color: "#fff", background: "#3B5BDB",
        }}>신고서 작성</Link>
      </div>
    );
  }
  return (
    <div style={{ overflowY: "auto", height: "100%" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 800 }}>
        <thead style={{ position: "sticky", top: 0, zIndex: 10, background: "#FAFAFA", borderBottom: "1px solid #E5E5E5" }}>
          <tr>
            {["신고번호", "신고일", "신고자", "구분", "제공자", "금액", "처리상태"].map((col, i) => (
              <th key={i} style={{ padding: "8px 14px", textAlign: "left", fontSize: 11, fontWeight: 600, color: "#999", whiteSpace: "nowrap" }}>{col}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {giftList.map((g, i) => {
            const as_ = ACTION_STYLE[g.action] ?? ACTION_STYLE["reported"];
            return (
              <tr key={g.id} style={{ borderBottom: i < giftList.length - 1 ? "1px solid #F0F0F0" : "none" }}
                className="hover:bg-[#FAFAFA] transition-colors">
                <td style={{ padding: "10px 14px", fontSize: 12, fontFamily: "monospace", color: "#3B5BDB" }}>{g.report_number}</td>
                <td style={{ padding: "10px 14px", fontSize: 12, color: "#555" }}>{g.report_date}</td>
                <td style={{ padding: "10px 14px", fontSize: 13, color: "#1a1a1a", fontWeight: 500 }}>{g.reporter_name}</td>
                <td style={{ padding: "10px 14px", fontSize: 12, color: "#555" }}>{g.gift_type}</td>
                <td style={{ padding: "10px 14px", fontSize: 12, color: "#555" }}>{g.provider}</td>
                <td style={{ padding: "10px 14px", fontSize: 13, color: "#1a1a1a" }}>{g.amount != null ? `₩${g.amount.toLocaleString()}` : "—"}</td>
                <td style={{ padding: "10px 14px" }}><span style={{ fontSize: 11, fontWeight: 600, padding: "2px 7px", borderRadius: 4, color: as_.color, background: as_.bg }}>{as_.label}</span></td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function TrainingTab() {
  return (
    <div style={{ padding: "32px 28px" }}>
      <div style={{ maxWidth: 560 }}>
        <p style={{ margin: "0 0 8px", fontSize: 13, fontWeight: 600, color: "#1a1a1a" }}>반부패 교육 기록</p>
        <p style={{ margin: "0 0 20px", fontSize: 13, color: "#555", lineHeight: 1.6 }}>
          ISO 37001은 임직원이 반부패 방침 및 절차를 인식할 수 있도록 교육훈련을 실시하고 그 기록을 보관할 것을 요구합니다.
          서식 라이브러리의 F-720-02 (교육일지)를 활용하세요.
        </p>
        <div style={{
          display: "flex", flexDirection: "column", alignItems: "center", gap: 12,
          padding: "48px 0", border: "1px dashed #E5E5E5", borderRadius: 8,
        }}>
          <BookOpen size={36} color="#ddd" />
          <p style={{ margin: 0, fontSize: 13, color: "#bbb" }}>등록된 교육 기록이 없습니다</p>
          <Link href="/forms/F-720-02/new" style={{
            padding: "7px 16px", borderRadius: 6, textDecoration: "none",
            fontSize: 13, fontWeight: 600, color: "#fff", background: "#7048E8",
          }} className="hover:opacity-90 transition-opacity">
            교육일지 작성 (F-720-02)
          </Link>
        </div>
      </div>
    </div>
  );
}
