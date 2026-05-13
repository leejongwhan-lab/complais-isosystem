"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Plus, Zap, Target } from "lucide-react";

export type EnergyRecord = {
  id: string;
  record_month: string;
  energy_type: string;
  amount: number;
  unit: string;
  cost: number | null;
  memo: string | null;
};

type TabKey = "현황" | "목표" | "SEU";

const TYPE_COLOR: Record<string, { color: string; bg: string }> = {
  "전력":     { color: "#3B5BDB", bg: "#EEF2FF" },
  "도시가스": { color: "#E67700", bg: "#FFF9DB" },
  "LPG":      { color: "#E03131", bg: "#FFF0F0" },
  "경유":     { color: "#854D0E", bg: "#FEF9C3" },
  "기타":     { color: "#999",    bg: "#F5F5F5" },
};

const GOAL_RATE = 75;

export default function EnergyClientView({ records }: { records: EnergyRecord[] }) {
  const [activeTab, setActiveTab] = useState<TabKey>("현황");

  const now = new Date();
  const fmt = (y: number, m: number) => `${y}-${String(m).padStart(2, "0")}`;
  const thisMonth = fmt(now.getFullYear(), now.getMonth() + 1);
  const prevMonth = now.getMonth() === 0
    ? fmt(now.getFullYear() - 1, 12)
    : fmt(now.getFullYear(), now.getMonth());

  const stats = useMemo(() => {
    const thisElec  = records.filter(r => r.record_month === thisMonth && r.energy_type === "전력").reduce((s, r) => s + r.amount, 0);
    const thisGas   = records.filter(r => r.record_month === thisMonth && r.energy_type === "도시가스").reduce((s, r) => s + r.amount, 0);
    const prevElec  = records.filter(r => r.record_month === prevMonth && r.energy_type === "전력").reduce((s, r) => s + r.amount, 0);
    const trend     = prevElec > 0 ? ((thisElec - prevElec) / prevElec * 100) : null;
    return { thisElec, thisGas, trend };
  }, [records, thisMonth, prevMonth]);

  const tabs: { key: TabKey; label: string }[] = [
    { key: "현황", label: "에너지 사용 현황" },
    { key: "목표", label: "에너지 목표" },
    { key: "SEU",  label: "SEU (중요에너지사용처)" },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "calc(100vh - 56px)" }}>

      {/* KPI 스트립 */}
      <div style={{ display: "flex", borderBottom: "1px solid #F0F0F0", flexShrink: 0 }}>
        {[
          {
            label: "이번달 전력",
            value: `${stats.thisElec.toLocaleString()} kWh`,
            sub: thisMonth,
            color: "#3B5BDB",
          },
          {
            label: "이번달 가스",
            value: `${stats.thisGas.toLocaleString()} Nm³`,
            sub: thisMonth,
            color: "#E67700",
          },
          {
            label: "전월 대비",
            value: stats.trend !== null
              ? `${stats.trend > 0 ? "+" : ""}${stats.trend.toFixed(1)}%`
              : "—",
            sub: "전력 기준",
            color: stats.trend === null ? "#999" : stats.trend > 0 ? "#E03131" : "#2F9E44",
          },
          {
            label: "연간 목표 달성률",
            value: `${GOAL_RATE}%`,
            sub: "에너지 절감 목표",
            color: GOAL_RATE >= 80 ? "#2F9E44" : GOAL_RATE >= 60 ? "#E67700" : "#E03131",
          },
        ].map((kpi, i, arr) => (
          <div key={kpi.label} style={{
            flex: 1, padding: "18px 22px",
            borderRight: i < arr.length - 1 ? "1px solid #F0F0F0" : "none",
          }}>
            <p style={{ margin: "0 0 5px", fontSize: 11, fontWeight: 500, color: "#999", textTransform: "uppercase", letterSpacing: "0.05em" }}>
              {kpi.label}
            </p>
            <p style={{ margin: "0 0 4px", fontSize: 22, fontWeight: 600, lineHeight: 1, color: kpi.color }}>
              {kpi.value}
            </p>
            <p style={{ margin: 0, fontSize: 11, color: "#bbb" }}>{kpi.sub}</p>
          </div>
        ))}
      </div>

      {/* 탭 툴바 */}
      <div style={{
        background: "#fff", borderBottom: "1px solid #E5E5E5",
        padding: "10px 16px", display: "flex", alignItems: "center", gap: 8, flexShrink: 0,
      }}>
        <div style={{ display: "flex", gap: 4 }}>
          {tabs.map(t => (
            <button key={t.key} onClick={() => setActiveTab(t.key)} style={{
              padding: "5px 12px", borderRadius: 4, cursor: "pointer",
              fontSize: 12, fontWeight: activeTab === t.key ? 600 : 400,
              border: activeTab === t.key ? "1px solid #3B5BDB" : "1px solid #E5E5E5",
              background: activeTab === t.key ? "#EEF2FF" : "#fff",
              color: activeTab === t.key ? "#3B5BDB" : "#555",
            }}>
              {t.label}
            </button>
          ))}
        </div>
        <div style={{ flex: 1 }} />
        {activeTab === "현황" && (
          <Link href="/energy/new" style={{
            display: "flex", alignItems: "center", gap: 5,
            padding: "5px 12px", borderRadius: 6, textDecoration: "none",
            fontSize: 12, fontWeight: 600, color: "#fff", background: "#3B5BDB",
          }} className="hover:opacity-90 transition-opacity">
            <Plus size={13} />에너지 사용량 기록
          </Link>
        )}
        {activeTab === "목표" && (
          <Link href="/forms/F-810-01/new" style={{
            display: "flex", alignItems: "center", gap: 5,
            padding: "5px 12px", borderRadius: 6, textDecoration: "none",
            fontSize: 12, fontWeight: 600, color: "#fff", background: "#E67700",
          }} className="hover:opacity-90 transition-opacity">
            <Target size={13} />목표 설정
          </Link>
        )}
      </div>

      {/* 탭 본문 */}
      <div style={{ flex: 1, overflowY: "auto", background: "#fff" }}>
        {activeTab === "현황" && <CurrentTab records={records} />}
        {activeTab === "목표" && <GoalTab />}
        {activeTab === "SEU"  && <SeuTab />}
      </div>

      {/* 하단 */}
      <div style={{ background: "#fff", borderTop: "1px solid #E5E5E5", padding: "10px 16px", flexShrink: 0 }}>
        <span style={{ fontSize: 12, color: "#999" }}>
          총 <span style={{ fontWeight: 600, color: "#555" }}>{records.length}</span>건
        </span>
      </div>
    </div>
  );
}

function CurrentTab({ records }: { records: EnergyRecord[] }) {
  if (records.length === 0) {
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", gap: 12 }}>
        <Zap size={40} color="#ddd" />
        <p style={{ margin: 0, fontSize: 14, fontWeight: 600, color: "#999" }}>에너지 기록이 없습니다</p>
        <p style={{ margin: 0, fontSize: 13, color: "#bbb" }}>아직 등록된 데이터가 없습니다. 새로 등록해보세요.</p>
        <Link href="/energy/new" style={{
          marginTop: 4, padding: "7px 16px", borderRadius: 6, textDecoration: "none",
          fontSize: 13, fontWeight: 600, color: "#fff", background: "#3B5BDB",
        }} className="hover:opacity-90 transition-opacity">새로 등록</Link>
      </div>
    );
  }
  return (
    <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 760 }}>
      <thead style={{ position: "sticky", top: 0, zIndex: 10, background: "#FAFAFA", borderBottom: "1px solid #E5E5E5" }}>
        <tr>
          {["기록 월", "에너지 구분", "사용량", "단위", "비용(원)", "메모"].map((col, i) => (
            <th key={i} style={{ padding: "8px 14px", textAlign: "left", fontSize: 11, fontWeight: 600, color: "#999", whiteSpace: "nowrap" }}>{col}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {records.map((r, i) => {
          const tc = TYPE_COLOR[r.energy_type] ?? TYPE_COLOR["기타"];
          return (
            <tr key={r.id} style={{ borderBottom: i < records.length - 1 ? "1px solid #F0F0F0" : "none" }}
              className="hover:bg-[#FAFAFA] transition-colors">
              <td style={{ padding: "10px 14px", fontSize: 13, color: "#1a1a1a", fontFamily: "monospace" }}>{r.record_month}</td>
              <td style={{ padding: "10px 14px" }}>
                <span style={{ fontSize: 11, fontWeight: 600, padding: "2px 7px", borderRadius: 4, color: tc.color, background: tc.bg }}>{r.energy_type}</span>
              </td>
              <td style={{ padding: "10px 14px", fontSize: 13, fontWeight: 600, color: "#1a1a1a" }}>{r.amount.toLocaleString()}</td>
              <td style={{ padding: "10px 14px", fontSize: 12, color: "#999" }}>{r.unit}</td>
              <td style={{ padding: "10px 14px", fontSize: 13, color: "#555" }}>{r.cost != null ? r.cost.toLocaleString() : "—"}</td>
              <td style={{ padding: "10px 14px", fontSize: 12, color: "#999" }}>{r.memo ?? "—"}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

function GoalTab() {
  return (
    <div style={{ padding: "32px 28px" }}>
      <div style={{ maxWidth: 560 }}>
        <p style={{ margin: "0 0 8px", fontSize: 13, fontWeight: 600, color: "#1a1a1a" }}>에너지 목표 관리</p>
        <p style={{ margin: "0 0 20px", fontSize: 13, color: "#555", lineHeight: 1.6 }}>
          ISO 50001은 에너지 목표 및 세부 목표(EnPI)를 수립하고 주기적으로 검토할 것을 요구합니다.
          서식 라이브러리의 F-810-01 (EHS 목표 및 세부목표) 양식을 활용해 등록하세요.
        </p>
        <div style={{ background: "#FAFAFA", border: "1px solid #F0F0F0", borderRadius: 8, padding: "20px", marginBottom: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
            <div style={{ width: 40, height: 40, borderRadius: 8, background: "#FFF9DB", border: "1px solid #FFD43B", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Target size={20} color="#E67700" />
            </div>
            <div>
              <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: "#1a1a1a" }}>에너지 절감 목표</p>
              <p style={{ margin: "2px 0 0", fontSize: 12, color: "#999" }}>F-810-01 · 연간 목표 달성률</p>
            </div>
            <div style={{ marginLeft: "auto", textAlign: "right" }}>
              <p style={{ margin: 0, fontSize: 22, fontWeight: 700, color: GOAL_RATE >= 80 ? "#2F9E44" : "#E67700" }}>{GOAL_RATE}%</p>
              <p style={{ margin: 0, fontSize: 11, color: "#bbb" }}>달성</p>
            </div>
          </div>
          <div style={{ background: "#E5E5E5", borderRadius: 4, height: 6, overflow: "hidden" }}>
            <div style={{ width: `${GOAL_RATE}%`, height: "100%", background: GOAL_RATE >= 80 ? "#2F9E44" : "#E67700", borderRadius: 4 }} />
          </div>
        </div>
        <Link href="/forms/F-810-01/new" style={{
          display: "inline-flex", alignItems: "center", gap: 5,
          padding: "7px 16px", borderRadius: 6, textDecoration: "none",
          fontSize: 13, fontWeight: 600, color: "#fff", background: "#E67700",
        }} className="hover:opacity-90 transition-opacity">
          <Plus size={14} />목표 설정 (F-810-01)
        </Link>
      </div>
    </div>
  );
}

function SeuTab() {
  return (
    <div style={{ padding: "32px 28px" }}>
      <div style={{ maxWidth: 560 }}>
        <p style={{ margin: "0 0 8px", fontSize: 13, fontWeight: 600, color: "#1a1a1a" }}>중요에너지사용처 (SEU)</p>
        <p style={{ margin: "0 0 20px", fontSize: 13, color: "#555", lineHeight: 1.6 }}>
          SEU(Significant Energy Use)는 에너지 소비량이 크거나 에너지 성과 개선 기회가 상당한 설비·시스템·공정입니다.
          ISO 50001은 SEU를 식별하고 관련 변수를 모니터링하도록 요구합니다.
        </p>
        <div style={{
          display: "flex", flexDirection: "column", alignItems: "center", gap: 12,
          padding: "48px 0", border: "1px dashed #E5E5E5", borderRadius: 8,
        }}>
          <Zap size={36} color="#ddd" />
          <p style={{ margin: 0, fontSize: 13, color: "#bbb" }}>등록된 SEU가 없습니다</p>
          <button style={{
            padding: "7px 16px", borderRadius: 6,
            fontSize: 13, fontWeight: 600, color: "#fff", background: "#3B5BDB",
            border: "none", cursor: "pointer",
          }} className="hover:opacity-90 transition-opacity">
            SEU 등록
          </button>
        </div>
      </div>
    </div>
  );
}
