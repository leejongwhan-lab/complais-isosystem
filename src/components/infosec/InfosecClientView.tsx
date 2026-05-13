"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Plus, Lock, AlertTriangle } from "lucide-react";
import RiskHeatmap from "@/components/common/RiskHeatmap";
import type { HeatmapRisk } from "@/components/common/RiskHeatmap";

export type InfoAsset = {
  id: string; asset_number: string; asset_name: string; asset_type: string;
  location: string | null; owner_name: string | null; classification: string;
  likelihood: number | null; impact: number | null; risk_score: number | null;
  control_measure: string | null; status: string;
};

type TabKey = "자산목록" | "위험평가" | "보안사고";

const CLASS_STYLE: Record<string, { label: string; color: string; bg: string }> = {
  public:       { label: "공개",  color: "#999",    bg: "#F5F5F5" },
  internal:     { label: "내부",  color: "#3B5BDB", bg: "#EEF2FF" },
  confidential: { label: "기밀",  color: "#E67700", bg: "#FFF9DB" },
  secret:       { label: "비밀",  color: "#E03131", bg: "#FFF0F0" },
};

const TYPE_COLOR: Record<string, string> = {
  "하드웨어":   "#3B5BDB",
  "소프트웨어": "#7048E8",
  "데이터":     "#E03131",
  "서비스":     "#2F9E44",
  "인원":       "#1098AD",
  "시설":       "#E67700",
};

function scoreColor(s: number) {
  if (s >= 16) return "#E03131";
  if (s >= 11) return "#E67700";
  if (s >= 6)  return "#854D0E";
  return "#166534";
}

export default function InfosecClientView({ assets }: { assets: InfoAsset[] }) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabKey>("자산목록");
  const [selectedCell, setSelectedCell] = useState<{ likelihood: number; impact: number } | null>(null);

  const stats = useMemo(() => ({
    total:    assets.length,
    highRisk: assets.filter(a => (a.risk_score ?? 0) >= 12).length,
    secret:   assets.filter(a => a.classification === "confidential" || a.classification === "secret").length,
    active:   assets.filter(a => a.status === "active").length,
  }), [assets]);

  const heatmapRisks: HeatmapRisk[] = assets
    .filter(a => a.likelihood != null && a.impact != null)
    .map(a => ({
      id: a.id,
      risk_number: a.asset_number,
      likelihood: a.likelihood!,
      impact: a.impact!,
      risk_level: (a.risk_score ?? a.likelihood! * a.impact!) >= 16 ? "critical"
        : (a.risk_score ?? a.likelihood! * a.impact!) >= 11 ? "high"
        : (a.risk_score ?? a.likelihood! * a.impact!) >= 6  ? "medium" : "low",
    }));

  const tableByCell = useMemo(() => {
    if (!selectedCell) return assets.filter(a => a.likelihood != null && a.impact != null);
    return assets.filter(a => a.likelihood === selectedCell.likelihood && a.impact === selectedCell.impact);
  }, [assets, selectedCell]);

  const tabs: { key: TabKey; label: string; count?: number }[] = [
    { key: "자산목록", label: "정보자산 목록",    count: assets.length },
    { key: "위험평가", label: "위험평가 현황" },
    { key: "보안사고", label: "보안사고" },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "calc(100vh - 56px)" }}>

      {/* KPI */}
      <div style={{ display: "flex", borderBottom: "1px solid #F0F0F0", flexShrink: 0 }}>
        {[
          { label: "전체 정보자산",   value: stats.total,    sub: "등록 건수",      color: "#1a1a1a" },
          { label: "고위험 자산",     value: stats.highRisk, sub: "즉시 검토 필요", color: stats.highRisk > 0 ? "#E03131" : "#2F9E44" },
          { label: "기밀·비밀 자산",  value: stats.secret,   sub: "보안 강화 대상",  color: "#E67700" },
          { label: "관리 중",         value: stats.active,   sub: "운영 중 자산",    color: "#3B5BDB" },
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
              border: activeTab === t.key ? "1px solid #7048E8" : "1px solid #E5E5E5",
              background: activeTab === t.key ? "#F3F0FF" : "#fff",
              color: activeTab === t.key ? "#7048E8" : "#555",
            }}>
              {t.label}
              {t.count !== undefined && (
                <span style={{
                  fontSize: 10, fontWeight: 700, padding: "0 4px", borderRadius: 8,
                  background: activeTab === t.key ? "#7048E8" : "#F0F0F0",
                  color: activeTab === t.key ? "#fff" : "#999",
                }}>{t.count}</span>
              )}
            </button>
          ))}
        </div>
        <div style={{ flex: 1 }} />
        {activeTab === "자산목록" && (
          <Link href="/infosec/new" style={{
            display: "flex", alignItems: "center", gap: 5,
            padding: "5px 12px", borderRadius: 6, textDecoration: "none",
            fontSize: 12, fontWeight: 600, color: "#fff", background: "#7048E8",
          }} className="hover:opacity-90 transition-opacity">
            <Plus size={13} />자산 등록
          </Link>
        )}
        {activeTab === "보안사고" && (
          <Link href="/forms/F-820-03/new" style={{
            display: "flex", alignItems: "center", gap: 5,
            padding: "5px 12px", borderRadius: 6, textDecoration: "none",
            fontSize: 12, fontWeight: 600, color: "#fff", background: "#E03131",
          }} className="hover:opacity-90 transition-opacity">
            <Plus size={13} />사고 보고
          </Link>
        )}
      </div>

      {/* 본문 */}
      <div style={{ flex: 1, overflow: "hidden" }}>
        {activeTab === "자산목록" && <AssetTab assets={assets} router={router} />}
        {activeTab === "위험평가" && (
          <RiskTab
            heatmapRisks={heatmapRisks}
            tableByCell={tableByCell}
            selectedCell={selectedCell}
            onCellClick={(l, i) => setSelectedCell(prev => prev?.likelihood === l && prev?.impact === i ? null : { likelihood: l, impact: i })}
            onRiskClick={id => router.push(`/infosec/${id}`)}
          />
        )}
        {activeTab === "보안사고" && <IncidentTab />}
      </div>

      <div style={{ background: "#fff", borderTop: "1px solid #E5E5E5", padding: "10px 16px", flexShrink: 0 }}>
        <span style={{ fontSize: 12, color: "#999" }}>총 <span style={{ fontWeight: 600, color: "#555" }}>{assets.length}</span>건</span>
      </div>
    </div>
  );
}

function AssetTab({ assets, router }: { assets: InfoAsset[]; router: ReturnType<typeof useRouter> }) {
  if (assets.length === 0) {
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", gap: 12 }}>
        <Lock size={40} color="#ddd" />
        <p style={{ margin: 0, fontSize: 14, fontWeight: 600, color: "#999" }}>정보자산이 없습니다</p>
        <Link href="/infosec/new" style={{
          marginTop: 4, padding: "7px 16px", borderRadius: 6, textDecoration: "none",
          fontSize: 13, fontWeight: 600, color: "#fff", background: "#7048E8",
        }}>새로 등록</Link>
      </div>
    );
  }
  return (
    <div style={{ overflowY: "auto", height: "100%" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 900 }}>
        <thead style={{ position: "sticky", top: 0, zIndex: 10, background: "#FAFAFA", borderBottom: "1px solid #E5E5E5" }}>
          <tr>
            {["자산번호", "자산명", "유형", "위치", "소유자", "분류등급", "위험점수", "관리방안", "상태"].map((col, i) => (
              <th key={i} style={{ padding: "8px 14px", textAlign: "left", fontSize: 11, fontWeight: 600, color: "#999", whiteSpace: "nowrap" }}>{col}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {assets.map((a, i) => {
            const cs = CLASS_STYLE[a.classification] ?? { label: a.classification, color: "#999", bg: "#F5F5F5" };
            const typeColor = TYPE_COLOR[a.asset_type] ?? "#888";
            const score = a.risk_score ?? (a.likelihood != null && a.impact != null ? a.likelihood * a.impact : 0);
            return (
              <tr key={a.id} onClick={() => router.push(`/infosec/${a.id}`)}
                style={{ borderBottom: i < assets.length - 1 ? "1px solid #F0F0F0" : "none", cursor: "pointer" }}
                className="hover:bg-[#FAFAFA] transition-colors">
                <td style={{ padding: "10px 14px", fontSize: 12, fontFamily: "monospace", color: "#7048E8" }}>{a.asset_number}</td>
                <td style={{ padding: "10px 14px", fontSize: 13, fontWeight: 500, color: "#1a1a1a" }}>{a.asset_name}</td>
                <td style={{ padding: "10px 14px" }}>
                  <span style={{ fontSize: 11, fontWeight: 600, padding: "2px 7px", borderRadius: 4, color: typeColor, background: `${typeColor}18` }}>{a.asset_type}</span>
                </td>
                <td style={{ padding: "10px 14px", fontSize: 12, color: "#555" }}>{a.location ?? "—"}</td>
                <td style={{ padding: "10px 14px", fontSize: 12, color: "#555" }}>{a.owner_name ?? "—"}</td>
                <td style={{ padding: "10px 14px" }}>
                  <span style={{ fontSize: 11, fontWeight: 600, padding: "2px 7px", borderRadius: 4, color: cs.color, background: cs.bg }}>{cs.label}</span>
                </td>
                <td style={{ padding: "10px 14px" }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: score > 0 ? scoreColor(score) : "#bbb" }}>{score > 0 ? score : "—"}</span>
                </td>
                <td style={{ padding: "10px 14px", fontSize: 12, color: "#555", maxWidth: 160, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {a.control_measure ?? "—"}
                </td>
                <td style={{ padding: "10px 14px", fontSize: 12, color: a.status === "active" ? "#2F9E44" : "#999" }}>
                  {a.status === "active" ? "관리중" : "폐기"}
                </td>
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
  tableByCell: InfoAsset[];
  selectedCell: { likelihood: number; impact: number } | null;
  onCellClick: (l: number, i: number) => void;
  onRiskClick: (id: string) => void;
}) {
  return (
    <div style={{ display: "flex", height: "100%", overflow: "hidden" }}>
      <div style={{ flex: 55, overflowY: "auto", padding: "20px 24px", borderRight: "1px solid #E5E5E5" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
          <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: "#1a1a1a" }}>정보자산 위험평가 히트맵</p>
          {selectedCell && (
            <button onClick={() => onCellClick(selectedCell.likelihood, selectedCell.impact)}
              style={{ fontSize: 11, fontWeight: 500, color: "#7048E8", background: "#F3F0FF", border: "1px solid #D0BFFF", borderRadius: 4, padding: "3px 8px", cursor: "pointer" }}>
              필터 해제 ✕
            </button>
          )}
        </div>
        {heatmapRisks.length === 0 ? (
          <p style={{ fontSize: 13, color: "#bbb" }}>위험평가 데이터가 없습니다. 자산 등록 시 발생가능성·영향도를 입력하면 표시됩니다.</p>
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
                {["번호", "자산명", "유형", "가능성", "영향도", "점수", "등급"].map((col, i) => (
                  <th key={i} style={{ padding: "7px 10px", textAlign: "left", fontSize: 10, fontWeight: 600, color: "#999", whiteSpace: "nowrap" }}>{col}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tableByCell.length === 0 ? (
                <tr><td colSpan={7} style={{ textAlign: "center", padding: "36px 0", fontSize: 13, color: "#bbb" }}>셀을 클릭하면 해당 자산이 표시됩니다.</td></tr>
              ) : tableByCell.map((a, i) => {
                const score = a.risk_score ?? (a.likelihood != null && a.impact != null ? a.likelihood * a.impact : 0);
                const color = score > 0 ? scoreColor(score) : "#bbb";
                return (
                  <tr key={a.id} onClick={() => onRiskClick(a.id)}
                    style={{ borderBottom: i < tableByCell.length - 1 ? "1px solid #F0F0F0" : "none", cursor: "pointer" }}
                    className="hover:bg-[#FAFAFA] transition-colors">
                    <td style={{ padding: "8px 10px" }}><span style={{ fontFamily: "monospace", fontSize: 10, fontWeight: 700, color: "#7048E8" }}>{a.asset_number.slice(-4)}</span></td>
                    <td style={{ padding: "8px 10px", fontSize: 12, color: "#1a1a1a", maxWidth: 120, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{a.asset_name}</td>
                    <td style={{ padding: "8px 10px", fontSize: 11, color: "#555", whiteSpace: "nowrap" }}>{a.asset_type}</td>
                    <td style={{ padding: "8px 10px", textAlign: "center", fontSize: 12, fontWeight: 600, color: "#555" }}>{a.likelihood}</td>
                    <td style={{ padding: "8px 10px", textAlign: "center", fontSize: 12, fontWeight: 600, color: "#555" }}>{a.impact}</td>
                    <td style={{ padding: "8px 10px", textAlign: "center", fontSize: 12, fontWeight: 700, color }}>{score}</td>
                    <td style={{ padding: "8px 10px", fontSize: 10, fontWeight: 700, color }}>
                      {score >= 16 ? "매우높음" : score >= 11 ? "높음" : score >= 6 ? "중간" : "낮음"}
                    </td>
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

function IncidentTab() {
  return (
    <div style={{ padding: "32px 28px" }}>
      <div style={{ maxWidth: 560 }}>
        <p style={{ margin: "0 0 8px", fontSize: 13, fontWeight: 600, color: "#1a1a1a" }}>보안사고 관리</p>
        <p style={{ margin: "0 0 20px", fontSize: 13, color: "#555", lineHeight: 1.6 }}>
          ISO 27001은 정보보안 사고를 기록하고, 대응 절차를 수립·이행하며, 재발 방지 조치를 취하도록 요구합니다.
          서식 라이브러리의 F-820-03 (보안사고 보고서)을 활용하세요.
        </p>
        <div style={{
          display: "flex", flexDirection: "column", alignItems: "center", gap: 12,
          padding: "48px 0", border: "1px dashed #E5E5E5", borderRadius: 8,
        }}>
          <AlertTriangle size={36} color="#ddd" />
          <p style={{ margin: 0, fontSize: 13, color: "#bbb" }}>등록된 보안사고가 없습니다</p>
          <Link href="/forms/F-820-03/new" style={{
            padding: "7px 16px", borderRadius: 6, textDecoration: "none",
            fontSize: 13, fontWeight: 600, color: "#fff", background: "#E03131",
          }} className="hover:opacity-90 transition-opacity">
            사고 보고 (F-820-03)
          </Link>
        </div>
      </div>
    </div>
  );
}
