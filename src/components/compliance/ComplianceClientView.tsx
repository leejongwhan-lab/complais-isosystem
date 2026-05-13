"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Plus, Scale } from "lucide-react";
import RiskHeatmap from "@/components/common/RiskHeatmap";
import type { HeatmapRisk } from "@/components/common/RiskHeatmap";

export type ComplianceObligation = {
  id: string; obligation_number: string; category: string; law_name: string;
  article: string | null; requirement: string; applicable_dept: string | null;
  compliance_status: string; next_review_date: string | null; owner_name: string | null;
  likelihood: number | null; impact: number | null;
};

type TabKey = "의무목록" | "리스크";

const STATUS_STYLE: Record<string, { label: string; color: string; bg: string }> = {
  compliant:     { label: "준수",    color: "#2F9E44", bg: "#F0FBF4" },
  non_compliant: { label: "미준수",  color: "#E03131", bg: "#FFF0F0" },
  na:            { label: "해당없음", color: "#999",    bg: "#F5F5F5" },
  pending:       { label: "검토중",  color: "#3B5BDB", bg: "#EEF2FF" },
};

export default function ComplianceClientView({ obligations }: { obligations: ComplianceObligation[] }) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabKey>("의무목록");
  const [selectedCell, setSelectedCell] = useState<{ likelihood: number; impact: number } | null>(null);

  const [dateRange] = useState(() => {
    const todayDate = new Date();
    const in30DaysDate = new Date(todayDate);
    in30DaysDate.setDate(in30DaysDate.getDate() + 30);
    return {
      today: todayDate.toISOString().slice(0, 10),
      in30Days: in30DaysDate.toISOString().slice(0, 10),
    };
  });
  const { today, in30Days } = dateRange;

  const stats = useMemo(() => ({
    total:       obligations.length,
    compliant:   obligations.filter(o => o.compliance_status === "compliant").length,
    nonComp:     obligations.filter(o => o.compliance_status === "non_compliant").length,
    upcoming:    obligations.filter(o => o.next_review_date && o.next_review_date >= today && o.next_review_date <= in30Days).length,
  }), [obligations, today, in30Days]);

  const heatmapRisks: HeatmapRisk[] = obligations
    .filter(o => o.likelihood != null && o.impact != null)
    .map(o => ({
      id: o.id,
      risk_number: o.obligation_number,
      likelihood: o.likelihood!,
      impact: o.impact!,
      risk_level: (o.likelihood! * o.impact!) >= 16 ? "critical"
        : (o.likelihood! * o.impact!) >= 11 ? "high"
        : (o.likelihood! * o.impact!) >= 6  ? "medium" : "low",
    }));

  const tableByCell = useMemo(() => {
    if (!selectedCell) return obligations.filter(o => o.likelihood != null && o.impact != null);
    return obligations.filter(o => o.likelihood === selectedCell.likelihood && o.impact === selectedCell.impact);
  }, [obligations, selectedCell]);

  const tabs: { key: TabKey; label: string; count?: number }[] = [
    { key: "의무목록", label: "준법의무 등록부", count: obligations.length },
    { key: "리스크",   label: "준법 리스크" },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "calc(100vh - 56px)" }}>

      {/* KPI */}
      <div style={{ display: "flex", borderBottom: "1px solid #F0F0F0", flexShrink: 0 }}>
        {[
          { label: "전체 준법의무",       value: stats.total,    sub: "등록 건수",      color: "#1a1a1a" },
          { label: "준수",                value: stats.compliant, sub: "준수 건수",      color: "#2F9E44" },
          { label: "미준수",              value: stats.nonComp,  sub: "즉시 확인 필요", color: stats.nonComp > 0 ? "#E03131" : "#999" },
          { label: "30일 내 검토 예정",    value: stats.upcoming, sub: "검토 필요",      color: stats.upcoming > 0 ? "#E67700" : "#999" },
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
              border: activeTab === t.key ? "1px solid #1098AD" : "1px solid #E5E5E5",
              background: activeTab === t.key ? "#E3FAFC" : "#fff",
              color: activeTab === t.key ? "#1098AD" : "#555",
            }}>
              {t.label}
              {t.count !== undefined && (
                <span style={{
                  fontSize: 10, fontWeight: 700, padding: "0 4px", borderRadius: 8,
                  background: activeTab === t.key ? "#1098AD" : "#F0F0F0",
                  color: activeTab === t.key ? "#fff" : "#999",
                }}>{t.count}</span>
              )}
            </button>
          ))}
        </div>
        <div style={{ flex: 1 }} />
        <Link href="/compliance-mgmt/new" style={{
          display: "flex", alignItems: "center", gap: 5,
          padding: "5px 12px", borderRadius: 6, textDecoration: "none",
          fontSize: 12, fontWeight: 600, color: "#fff", background: "#1098AD",
        }} className="hover:opacity-90 transition-opacity">
          <Plus size={13} />준법의무 등록
        </Link>
      </div>

      {/* 본문 */}
      <div style={{ flex: 1, overflow: "hidden" }}>
        {activeTab === "의무목록" && <ObligationTab obligations={obligations} today={today} in30Days={in30Days} router={router} />}
        {activeTab === "리스크" && (
          <RiskTab
            heatmapRisks={heatmapRisks}
            tableByCell={tableByCell}
            selectedCell={selectedCell}
            onCellClick={(l, i) => setSelectedCell(prev => prev?.likelihood === l && prev?.impact === i ? null : { likelihood: l, impact: i })}
            onRiskClick={id => router.push(`/compliance-mgmt/${id}`)}
          />
        )}
      </div>

      <div style={{ background: "#fff", borderTop: "1px solid #E5E5E5", padding: "10px 16px", flexShrink: 0 }}>
        <span style={{ fontSize: 12, color: "#999" }}>총 <span style={{ fontWeight: 600, color: "#555" }}>{obligations.length}</span>건</span>
      </div>
    </div>
  );
}

function ObligationTab({
  obligations, today, in30Days, router,
}: {
  obligations: ComplianceObligation[];
  today: string;
  in30Days: string;
  router: ReturnType<typeof useRouter>;
}) {
  if (obligations.length === 0) {
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", gap: 12 }}>
        <Scale size={40} color="#ddd" />
        <p style={{ margin: 0, fontSize: 14, fontWeight: 600, color: "#999" }}>준법의무가 없습니다</p>
        <Link href="/compliance-mgmt/new" style={{
          marginTop: 4, padding: "7px 16px", borderRadius: 6, textDecoration: "none",
          fontSize: 13, fontWeight: 600, color: "#fff", background: "#1098AD",
        }}>새로 등록</Link>
      </div>
    );
  }
  return (
    <div style={{ overflowY: "auto", height: "100%" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 900 }}>
        <thead style={{ position: "sticky", top: 0, zIndex: 10, background: "#FAFAFA", borderBottom: "1px solid #E5E5E5" }}>
          <tr>
            {["번호", "구분", "법규명", "조항", "요구사항", "적용부서", "준수여부", "검토일", "담당자"].map((col, i) => (
              <th key={i} style={{ padding: "8px 14px", textAlign: "left", fontSize: 11, fontWeight: 600, color: "#999", whiteSpace: "nowrap" }}>{col}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {obligations.map((o, i) => {
            const ss = STATUS_STYLE[o.compliance_status] ?? { label: o.compliance_status, color: "#999", bg: "#F5F5F5" };
            const isUpcoming = o.next_review_date && o.next_review_date >= today && o.next_review_date <= in30Days;
            const isOverdue  = o.next_review_date && o.next_review_date < today;
            return (
              <tr key={o.id} onClick={() => router.push(`/compliance-mgmt/${o.id}`)}
                style={{ borderBottom: i < obligations.length - 1 ? "1px solid #F0F0F0" : "none", cursor: "pointer" }}
                className="hover:bg-[#FAFAFA] transition-colors">
                <td style={{ padding: "10px 14px", fontSize: 12, fontFamily: "monospace", color: "#1098AD" }}>{o.obligation_number}</td>
                <td style={{ padding: "10px 14px", fontSize: 12, color: "#555" }}>{o.category}</td>
                <td style={{ padding: "10px 14px", fontSize: 13, color: "#1a1a1a", fontWeight: 500 }}>{o.law_name}</td>
                <td style={{ padding: "10px 14px", fontSize: 12, color: "#555" }}>{o.article ?? "—"}</td>
                <td style={{ padding: "10px 14px", fontSize: 12, color: "#555", maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{o.requirement}</td>
                <td style={{ padding: "10px 14px", fontSize: 12, color: "#555" }}>{o.applicable_dept ?? "—"}</td>
                <td style={{ padding: "10px 14px" }}>
                  <span style={{ fontSize: 11, fontWeight: 600, padding: "2px 7px", borderRadius: 4, color: ss.color, background: ss.bg }}>{ss.label}</span>
                </td>
                <td style={{ padding: "10px 14px", fontSize: 12, color: isOverdue ? "#E03131" : isUpcoming ? "#E67700" : "#555" }}>
                  {o.next_review_date ?? "—"}
                </td>
                <td style={{ padding: "10px 14px", fontSize: 12, color: "#555" }}>{o.owner_name ?? "—"}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function RiskTab({
  heatmapRisks, tableByCell, selectedCell, onCellClick, onRiskClick,
}: {
  heatmapRisks: HeatmapRisk[];
  tableByCell: ComplianceObligation[];
  selectedCell: { likelihood: number; impact: number } | null;
  onCellClick: (l: number, i: number) => void;
  onRiskClick: (id: string) => void;
}) {
  return (
    <div style={{ display: "flex", height: "100%", overflow: "hidden" }}>
      <div style={{ flex: 55, overflowY: "auto", padding: "20px 24px", borderRight: "1px solid #E5E5E5" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
          <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: "#1a1a1a" }}>준법 리스크 히트맵</p>
          {selectedCell && (
            <button onClick={() => onCellClick(selectedCell.likelihood, selectedCell.impact)}
              style={{ fontSize: 11, fontWeight: 500, color: "#1098AD", background: "#E3FAFC", border: "1px solid #99E9F2", borderRadius: 4, padding: "3px 8px", cursor: "pointer" }}>
              필터 해제 ✕
            </button>
          )}
        </div>
        {heatmapRisks.length === 0 ? (
          <p style={{ fontSize: 13, color: "#bbb" }}>리스크 평가 데이터가 없습니다. 준법의무 등록 시 발생가능성·영향도를 입력하면 표시됩니다.</p>
        ) : (
          <RiskHeatmap risks={heatmapRisks} selectedCell={selectedCell} onCellClick={onCellClick} onRiskClick={onRiskClick} />
        )}
      </div>
      <div style={{ flex: 45, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <div style={{ padding: "10px 14px", borderBottom: "1px solid #E5E5E5", flexShrink: 0 }}>
          <span style={{ fontSize: 12, color: "#999" }}>
            {selectedCell ? `가능성 ${selectedCell.likelihood} × 영향도 ${selectedCell.impact} — ${tableByCell.length}건` : `평가 데이터 ${heatmapRisks.length}건`}
          </span>
        </div>
        <div style={{ flex: 1, overflowY: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead style={{ position: "sticky", top: 0, zIndex: 10, background: "#FAFAFA", borderBottom: "1px solid #E5E5E5" }}>
              <tr>
                {["번호", "법규명", "가능성", "영향도", "준수여부"].map((col, i) => (
                  <th key={i} style={{ padding: "7px 10px", textAlign: "left", fontSize: 10, fontWeight: 600, color: "#999", whiteSpace: "nowrap" }}>{col}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tableByCell.length === 0 ? (
                <tr><td colSpan={5} style={{ textAlign: "center", padding: "36px 0", fontSize: 13, color: "#bbb" }}>셀을 클릭하면 해당 항목이 표시됩니다.</td></tr>
              ) : tableByCell.map((o, i) => {
                const ss = STATUS_STYLE[o.compliance_status] ?? { label: o.compliance_status, color: "#999", bg: "#F5F5F5" };
                return (
                  <tr key={o.id} onClick={() => onRiskClick(o.id)}
                    style={{ borderBottom: i < tableByCell.length - 1 ? "1px solid #F0F0F0" : "none", cursor: "pointer" }}
                    className="hover:bg-[#FAFAFA] transition-colors">
                    <td style={{ padding: "8px 10px" }}><span style={{ fontFamily: "monospace", fontSize: 10, fontWeight: 700, color: "#1098AD" }}>{o.obligation_number.slice(-4)}</span></td>
                    <td style={{ padding: "8px 10px", fontSize: 12, color: "#1a1a1a", maxWidth: 140, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{o.law_name}</td>
                    <td style={{ padding: "8px 10px", textAlign: "center", fontSize: 12, fontWeight: 600, color: "#555" }}>{o.likelihood}</td>
                    <td style={{ padding: "8px 10px", textAlign: "center", fontSize: 12, fontWeight: 600, color: "#555" }}>{o.impact}</td>
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
