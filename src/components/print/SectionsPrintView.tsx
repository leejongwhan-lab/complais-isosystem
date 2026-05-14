import type { Section, PurposeData, TextData, ScopeData, DefinitionsData, RaciData, ProcedureData, SipocData, KpiData, RiskData, RelatedDocsData, RelatedFormsData } from "@/types/sections";

// ── shared print table styles ──────────────────────────────
const TH: React.CSSProperties = {
  padding: "6px 10px", fontWeight: 700, fontSize: 11, color: "#1A1A2E",
  background: "#F0F4FF", border: "1px solid #D1D5DB", textAlign: "left",
};
const TD: React.CSSProperties = {
  padding: "5px 10px", fontSize: 12, border: "1px solid #D1D5DB", verticalAlign: "top",
};

function SectionTitle({ title }: { title: string }) {
  return (
    <div style={{ borderLeft: "3px solid #3B5BDB", paddingLeft: 10, marginBottom: 10 }}>
      <span style={{ fontSize: 13, fontWeight: 700, color: "#1A1A2E" }}>{title}</span>
    </div>
  );
}

function PurposePrint({ data }: { data: PurposeData }) {
  return <p style={{ margin: 0, fontSize: 13, color: "#374151", lineHeight: 1.75, whiteSpace: "pre-wrap" }}>{data.content || "—"}</p>;
}

function TextPrint({ data }: { data: TextData }) {
  return <p style={{ margin: 0, fontSize: 13, color: "#374151", lineHeight: 1.75, whiteSpace: "pre-wrap" }}>{data.content || "—"}</p>;
}

function ScopePrint({ data }: { data: ScopeData }) {
  return (
    <table style={{ width: "100%", borderCollapse: "collapse" }}>
      <thead>
        <tr>
          <th style={{ ...TH, width: "50%" }}>✅ 적용 대상 (In Scope)</th>
          <th style={{ ...TH, width: "50%" }}>❌ 제외 대상 (Out of Scope)</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td style={TD}>
            {data.in_scope.filter(Boolean).map((item, i) => (
              <div key={i} style={{ fontSize: 12, marginBottom: 3 }}>• {item}</div>
            ))}
          </td>
          <td style={TD}>
            {data.out_scope.filter(Boolean).map((item, i) => (
              <div key={i} style={{ fontSize: 12, marginBottom: 3 }}>• {item}</div>
            ))}
          </td>
        </tr>
      </tbody>
    </table>
  );
}

function DefinitionsPrint({ data }: { data: DefinitionsData }) {
  return (
    <table style={{ width: "100%", borderCollapse: "collapse" }}>
      <thead>
        <tr>
          <th style={{ ...TH, width: 36 }}>#</th>
          <th style={{ ...TH, width: "25%" }}>용어</th>
          <th style={TH}>정의</th>
          <th style={{ ...TH, width: "18%" }}>출처</th>
        </tr>
      </thead>
      <tbody>
        {data.rows.map((row, i) => (
          <tr key={row.id}>
            <td style={{ ...TD, textAlign: "center", color: "#9CA3AF" }}>{i + 1}</td>
            <td style={{ ...TD, fontWeight: 600 }}>{row.term}</td>
            <td style={TD}>{row.definition}</td>
            <td style={{ ...TD, color: "#6B7280" }}>{row.source}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

const RACI_COLORS: Record<string, { color: string; bg: string }> = {
  R: { color: "#1D4ED8", bg: "#DBEAFE" },
  A: { color: "#15803D", bg: "#DCFCE7" },
  C: { color: "#92400E", bg: "#FEF3C7" },
  I: { color: "#6B7280", bg: "#F3F4F6" },
};

function RaciPrint({ data }: { data: RaciData }) {
  return (
    <>
      <div style={{ display: "flex", gap: 8, marginBottom: 8, flexWrap: "wrap" }}>
        {[["R", "실행책임"], ["A", "최종책임"], ["C", "협의"], ["I", "통보"]].map(([k, label]) => {
          const c = RACI_COLORS[k] ?? { color: "#555", bg: "#F3F4F6" };
          return (
            <span key={k} style={{ fontSize: 10, padding: "2px 7px", borderRadius: 4, fontWeight: 700, color: c.color, background: c.bg }}>
              {k} = {label}
            </span>
          );
        })}
      </div>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={{ ...TH, minWidth: 120 }}>활동/업무</th>
            {data.roles.map(role => (
              <th key={role} style={{ ...TH, width: 80, textAlign: "center" }}>{role}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.activities.map(activity => (
            <tr key={activity}>
              <td style={{ ...TD, fontWeight: 500 }}>{activity}</td>
              {data.roles.map(role => {
                const val = data.matrix[activity]?.[role] ?? "-";
                const c = val !== "-" ? (RACI_COLORS[val] ?? null) : null;
                return (
                  <td key={role} style={{ ...TD, textAlign: "center" }}>
                    {c ? (
                      <span style={{ fontSize: 12, fontWeight: 700, color: c.color, background: c.bg, padding: "1px 6px", borderRadius: 3 }}>{val}</span>
                    ) : (
                      <span style={{ fontSize: 12, color: "#9CA3AF" }}>—</span>
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}

const SIPOC_HEADERS = [
  { key: "suppliers" as const, label: "S 공급자", color: "#7C3AED", bg: "#F3F0FF" },
  { key: "inputs"    as const, label: "I 입력",   color: "#1D4ED8", bg: "#DBEAFE" },
  { key: "processes" as const, label: "P 프로세스", color: "#15803D", bg: "#DCFCE7" },
  { key: "outputs"   as const, label: "O 출력",   color: "#C2410C", bg: "#FED7AA" },
  { key: "customers" as const, label: "C 고객",   color: "#B91C1C", bg: "#FEE2E2" },
];

function SipocPrint({ data }: { data: SipocData }) {
  return (
    <table style={{ width: "100%", borderCollapse: "collapse" }}>
      <thead>
        <tr>
          {SIPOC_HEADERS.map(h => (
            <th key={h.key} style={{ ...TH, textAlign: "center", color: h.color, background: h.bg, width: "20%" }}>{h.label}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        <tr>
          {SIPOC_HEADERS.map(h => (
            <td key={h.key} style={{ ...TD, verticalAlign: "top" }}>
              {data[h.key].filter(Boolean).map((item, i) => (
                <div key={i} style={{ fontSize: 12, marginBottom: 4, padding: "2px 6px", background: h.bg, borderRadius: 3, color: h.color }}>
                  {item}
                </div>
              ))}
            </td>
          ))}
        </tr>
      </tbody>
    </table>
  );
}

function ProcedurePrint({ data }: { data: ProcedureData }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {data.steps.map((step, i) => (
        <table key={step.id} style={{ width: "100%", borderCollapse: "collapse", border: "1px solid #E5E7EB", borderRadius: 8 }}>
          <thead>
            <tr>
              <th colSpan={2} style={{ padding: "8px 12px", background: "#1A1A2E", color: "#fff", fontSize: 12, fontWeight: 700, textAlign: "left" }}>
                Step {i + 1}. {step.title}
              </th>
            </tr>
          </thead>
          <tbody>
            {step.owner && (
              <tr>
                <td style={{ ...TD, width: 90, fontWeight: 600, background: "#F9FAFB" }}>담당자</td>
                <td style={TD}>{step.owner}</td>
              </tr>
            )}
            {step.input && (
              <tr>
                <td style={{ ...TD, width: 90, fontWeight: 600, background: "#F9FAFB" }}>입력물</td>
                <td style={TD}>{step.input}</td>
              </tr>
            )}
            {step.output && (
              <tr>
                <td style={{ ...TD, width: 90, fontWeight: 600, background: "#F9FAFB" }}>출력물</td>
                <td style={TD}>{step.output}</td>
              </tr>
            )}
            {step.content && (
              <tr>
                <td style={{ ...TD, fontWeight: 600, background: "#F9FAFB" }}>상세 내용</td>
                <td style={{ ...TD, whiteSpace: "pre-wrap" }}>{step.content}</td>
              </tr>
            )}
            {step.note && (
              <tr>
                <td style={{ ...TD, fontWeight: 600, background: "#FFFBEB", color: "#92400E" }}>비고</td>
                <td style={{ ...TD, background: "#FFFBEB", color: "#92400E" }}>{step.note}</td>
              </tr>
            )}
          </tbody>
        </table>
      ))}
    </div>
  );
}

function KpiPrint({ data }: { data: KpiData }) {
  return (
    <table style={{ width: "100%", borderCollapse: "collapse" }}>
      <thead>
        <tr>
          <th style={{ ...TH, width: 36 }}>#</th>
          <th style={TH}>지표명</th>
          <th style={{ ...TH, width: 70 }}>단위</th>
          <th style={{ ...TH, width: 90 }}>목표값</th>
          <th style={{ ...TH, width: 90 }}>측정주기</th>
          <th style={{ ...TH, width: 100 }}>담당자</th>
        </tr>
      </thead>
      <tbody>
        {data.rows.map((row, i) => (
          <tr key={row.id}>
            <td style={{ ...TD, textAlign: "center", color: "#9CA3AF" }}>{i + 1}</td>
            <td style={{ ...TD, fontWeight: 500 }}>{row.name}</td>
            <td style={TD}>{row.unit}</td>
            <td style={TD}>{row.target}</td>
            <td style={TD}>{row.cycle}</td>
            <td style={TD}>{row.owner}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function scoreColor(score: number) {
  if (score >= 10) return { color: "#DC2626", bg: "#FEE2E2" };
  if (score >= 5)  return { color: "#D97706", bg: "#FEF3C7" };
  return { color: "#16A34A", bg: "#DCFCE7" };
}

function RiskPrint({ data }: { data: RiskData }) {
  return (
    <>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={{ ...TH, width: 36 }}>#</th>
            <th style={{ ...TH, width: 60 }}>구분</th>
            <th style={TH}>내용</th>
            <th style={{ ...TH, width: 55 }}>가능성</th>
            <th style={{ ...TH, width: 55 }}>영향</th>
            <th style={{ ...TH, width: 55 }}>점수</th>
            <th style={TH}>대응방안</th>
            <th style={{ ...TH, width: 90 }}>담당자</th>
          </tr>
        </thead>
        <tbody>
          {data.rows.map((row, i) => {
            const score = row.likelihood * row.impact;
            const sc = scoreColor(score);
            return (
              <tr key={row.id}>
                <td style={{ ...TD, textAlign: "center", color: "#9CA3AF" }}>{i + 1}</td>
                <td style={{ ...TD, textAlign: "center" }}>
                  <span style={{
                    fontSize: 11, padding: "1px 5px", borderRadius: 3, fontWeight: 600,
                    background: row.type === "위험" ? "#FEE2E2" : "#DCFCE7",
                    color: row.type === "위험" ? "#DC2626" : "#15803D",
                  }}>{row.type}</span>
                </td>
                <td style={TD}>{row.content}</td>
                <td style={{ ...TD, textAlign: "center" }}>{row.likelihood}</td>
                <td style={{ ...TD, textAlign: "center" }}>{row.impact}</td>
                <td style={{ ...TD, textAlign: "center" }}>
                  <span style={{ fontWeight: 700, padding: "1px 6px", borderRadius: 3, color: sc.color, background: sc.bg }}>{score}</span>
                </td>
                <td style={TD}>{row.response}</td>
                <td style={TD}>{row.owner}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <div style={{ marginTop: 6, display: "flex", gap: 8 }}>
        {[["저위험 (1–4)", scoreColor(3)], ["중위험 (5–9)", scoreColor(6)], ["고위험 (10+)", scoreColor(12)]].map(
          ([label, c]) => {
            const sc = c as ReturnType<typeof scoreColor>;
            return (
              <span key={label as string} style={{ fontSize: 10, padding: "1px 7px", borderRadius: 3, color: sc.color, background: sc.bg, fontWeight: 600 }}>
                {label as string}
              </span>
            );
          }
        )}
      </div>
    </>
  );
}

function RelatedDocsPrint({ data }: { data: RelatedDocsData }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      {data.docs.map(doc => (
        <div key={doc.id} style={{ display: "flex", gap: 10, fontSize: 12 }}>
          <span style={{ fontFamily: "monospace", fontWeight: 700, color: "#3B5BDB", flexShrink: 0 }}>{doc.doc_number}</span>
          <span style={{ color: "#374151" }}>{doc.title}</span>
        </div>
      ))}
    </div>
  );
}

function RelatedFormsPrint({ data }: { data: RelatedFormsData }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      {data.forms.map(form => (
        <div key={form.id} style={{ display: "flex", gap: 10, fontSize: 12 }}>
          <span style={{ fontFamily: "monospace", fontWeight: 700, color: "#15803D", flexShrink: 0 }}>{form.form_code}</span>
          <span style={{ color: "#374151" }}>{form.title}</span>
        </div>
      ))}
    </div>
  );
}

function SectionPrintBody({ section }: { section: Section }) {
  const d = section.data;
  switch (section.type) {
    case "purpose":      return <PurposePrint data={d as PurposeData} />;
    case "text":         return <TextPrint    data={d as TextData} />;
    case "scope":        return <ScopePrint   data={d as ScopeData} />;
    case "definitions":  return <DefinitionsPrint data={d as DefinitionsData} />;
    case "raci":         return <RaciPrint    data={d as RaciData} />;
    case "sipoc":        return <SipocPrint   data={d as SipocData} />;
    case "procedure":    return <ProcedurePrint data={d as ProcedureData} />;
    case "kpi":          return <KpiPrint     data={d as KpiData} />;
    case "risk":         return <RiskPrint    data={d as RiskData} />;
    case "related_docs": return <RelatedDocsPrint data={d as RelatedDocsData} />;
    case "related_forms":return <RelatedFormsPrint data={d as RelatedFormsData} />;
    default:             return null;
  }
}

export default function SectionsPrintView({ sections }: { sections: Section[] }) {
  if (!sections.length) return null;
  return (
    <div style={{ fontFamily: "inherit" }}>
      {sections
        .slice()
        .sort((a, b) => a.order - b.order)
        .map(section => (
          <div key={section.id} style={{ marginBottom: 24, pageBreakInside: "avoid" }}>
            <SectionTitle title={section.title} />
            <SectionPrintBody section={section} />
          </div>
        ))}
    </div>
  );
}
