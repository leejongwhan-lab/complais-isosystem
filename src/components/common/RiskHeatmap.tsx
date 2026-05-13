"use client";

export type HeatmapRisk = {
  id: string;
  risk_number: string;
  likelihood: number;
  impact: number;
  risk_level: string;
};

type Props = {
  risks: HeatmapRisk[];
  selectedCell?: { likelihood: number; impact: number } | null;
  onCellClick?: (likelihood: number, impact: number) => void;
  onRiskClick?: (riskId: string) => void;
};

const LIKELIHOOD_LABELS = ["거의없음", "낮음", "보통", "높음", "매우높음"];
const IMPACT_LABELS     = ["미미",     "경미", "보통", "심각", "치명적"];

function cellBg(l: number, i: number): string {
  const s = l * i;
  if (s >= 16) return "#FECACA";
  if (s >= 11) return "#FED7AA";
  if (s >= 6)  return "#FEF9C3";
  return "#DCFCE7";
}
function cellBorder(l: number, i: number): string {
  const s = l * i;
  if (s >= 16) return "#FCA5A5";
  if (s >= 11) return "#FDBA74";
  if (s >= 6)  return "#FDE047";
  return "#86EFAC";
}

export default function RiskHeatmap({ risks, selectedCell, onCellClick, onRiskClick }: Props) {
  const cellMap: Record<string, HeatmapRisk[]> = {};
  for (const r of risks) {
    const key = `${r.likelihood}-${r.impact}`;
    (cellMap[key] ??= []).push(r);
  }

  const CELL = 52;
  const GAP  = 3;

  return (
    <div>
      {/* 영향도 레이블 + 그리드 */}
      <div style={{ display: "flex", alignItems: "flex-start" }}>

        {/* Y축 레이블 */}
        <div style={{ display: "flex", flexDirection: "column", gap: GAP, marginRight: 8 }}>
          {[5, 4, 3, 2, 1].map(imp => (
            <div key={imp} style={{ height: CELL, display: "flex", alignItems: "center", justifyContent: "flex-end" }}>
              <span style={{ fontSize: 10, color: "#999", whiteSpace: "nowrap" }}>
                {IMPACT_LABELS[imp - 1]}
              </span>
            </div>
          ))}
        </div>

        {/* 그리드 */}
        <div style={{ display: "flex", flexDirection: "column", gap: GAP }}>
          {[5, 4, 3, 2, 1].map(imp => (
            <div key={imp} style={{ display: "flex", gap: GAP }}>
              {[1, 2, 3, 4, 5].map(lik => {
                const key      = `${lik}-${imp}`;
                const cell     = cellMap[key] ?? [];
                const isSel    = selectedCell?.likelihood === lik && selectedCell?.impact === imp;
                const bg       = cellBg(lik, imp);
                const border   = cellBorder(lik, imp);
                return (
                  <div
                    key={lik}
                    onClick={() => onCellClick?.(lik, imp)}
                    style={{
                      width: CELL, height: CELL, borderRadius: 6,
                      background: bg,
                      border: isSel ? "2px solid #3B5BDB" : `1px solid ${border}`,
                      boxSizing: "border-box",
                      cursor: onCellClick ? "pointer" : "default",
                      display: "flex", flexDirection: "column",
                      alignItems: "center", justifyContent: "center",
                      gap: 2, padding: "3px 2px",
                    }}
                  >
                    {cell.slice(0, 3).map(r => (
                      <span
                        key={r.id}
                        onClick={e => { e.stopPropagation(); onRiskClick?.(r.id); }}
                        title={r.risk_number}
                        style={{
                          fontSize: 9, fontWeight: 700, fontFamily: "monospace",
                          padding: "1px 4px", borderRadius: 3,
                          background: "rgba(255,255,255,0.75)",
                          color: "#1a1a1a",
                          cursor: onRiskClick ? "pointer" : "default",
                          maxWidth: CELL - 8, overflow: "hidden",
                          textOverflow: "ellipsis", whiteSpace: "nowrap",
                        }}
                      >
                        {r.risk_number.slice(-3)}
                      </span>
                    ))}
                    {cell.length > 3 && (
                      <span style={{ fontSize: 9, fontWeight: 600, color: "#555" }}>
                        +{cell.length - 3}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* X축 레이블 */}
      <div style={{ display: "flex", paddingLeft: 60, gap: GAP, marginTop: 6 }}>
        {LIKELIHOOD_LABELS.map((label, i) => (
          <div key={i} style={{ width: CELL, textAlign: "center" }}>
            <span style={{ fontSize: 9, color: "#999" }}>{label}</span>
          </div>
        ))}
      </div>

      {/* 범례 */}
      <div style={{ display: "flex", gap: 14, marginTop: 10, paddingLeft: 60 }}>
        {[
          { bg: "#DCFCE7", border: "#86EFAC", label: "낮음 ≤5"  },
          { bg: "#FEF9C3", border: "#FDE047", label: "중간 6-10" },
          { bg: "#FED7AA", border: "#FDBA74", label: "높음 11-15" },
          { bg: "#FECACA", border: "#FCA5A5", label: "매우높음 ≥16" },
        ].map(item => (
          <div key={item.label} style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <div style={{ width: 10, height: 10, background: item.bg, border: `1px solid ${item.border}`, borderRadius: 2, flexShrink: 0 }} />
            <span style={{ fontSize: 10, color: "#999" }}>{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
