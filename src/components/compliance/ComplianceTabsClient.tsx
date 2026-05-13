"use client";

import { useState } from "react";
import ComplianceESGClient, { type KpiMaster, type KpiActual } from "./ComplianceESGClient";
import ComplianceMBClient, { type MBItem, type MBActual, type EmissionFactor } from "./ComplianceMBClient";
import ComplianceCarbonClient from "./ComplianceCarbonClient";

type TabKey = "esg" | "mb" | "carbon";

const TABS: { key: TabKey; label: string }[] = [
  { key: "esg",    label: "ESG 지표" },
  { key: "mb",     label: "물질수지표" },
  { key: "carbon", label: "탄소계산" },
];

export default function ComplianceTabsClient({
  companyId, kpiMaster, kpiActuals, autoValues,
  mbItems, mbActuals, emissionFactors, currentYear,
}: {
  companyId: string;
  kpiMaster: KpiMaster[];
  kpiActuals: KpiActual[];
  autoValues: Record<string, number>;
  mbItems: MBItem[];
  mbActuals: MBActual[];
  emissionFactors: EmissionFactor[];
  currentYear: number;
}) {
  const [tab, setTab] = useState<TabKey>("esg");

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "calc(100vh - 52px)" }}>
      {/* 탭 헤더 */}
      <div style={{
        display: "flex", gap: 0, borderBottom: "1px solid #E5E5E5",
        background: "#fff", padding: "0 24px", flexShrink: 0,
      }}>
        {TABS.map(t => (
          <button key={t.key} onClick={() => setTab(t.key)} style={{
            padding: "12px 20px", fontSize: 13, fontWeight: tab === t.key ? 600 : 400,
            color: tab === t.key ? "#3B5BDB" : "#888",
            background: "transparent", border: "none",
            borderBottom: tab === t.key ? "2px solid #3B5BDB" : "2px solid transparent",
            cursor: "pointer", marginBottom: -1,
          }}>
            {t.label}
          </button>
        ))}
      </div>

      {/* 콘텐츠 */}
      <div style={{ flex: 1, overflowY: "auto" }}>
        {tab === "esg" && (
          <ComplianceESGClient
            companyId={companyId}
            kpiMaster={kpiMaster}
            kpiActuals={kpiActuals}
            autoValues={autoValues}
            currentYear={currentYear}
          />
        )}
        {tab === "mb" && (
          <ComplianceMBClient
            companyId={companyId}
            initialItems={mbItems}
            initialActuals={mbActuals}
            emissionFactors={emissionFactors}
            currentYear={currentYear}
          />
        )}
        {tab === "carbon" && (
          <ComplianceCarbonClient
            initialItems={mbItems}
            initialActuals={mbActuals}
            emissionFactors={emissionFactors}
            currentYear={currentYear}
          />
        )}
      </div>
    </div>
  );
}
