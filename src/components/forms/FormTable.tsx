"use client";

import { TableColumn } from "@/types/form";

type Row = Record<string, string>;

const COLUMN_AUTO_OPTIONS: Record<string, string[]> = {
  unit:        ['개', 'EA', 'kg', 'g', 'ton', 'L', 'mL', 'm', 'cm', 'mm', 'm²', 'm³', 'kWh', 'MWh', 'tCO₂eq', 'Nm³', '%', '점', '건', '명', '시간', '일', '회', '원', '천원', '만원', '억원', '기타'],
  cycle:       ['매일', '주 1회', '주 2회', '월 1회', '월 2회', '분기 1회', '반기 1회', '연 1회', '수시'],
  frequency:   ['매일', '주 1회', '주 2회', '월 1회', '월 2회', '분기 1회', '반기 1회', '연 1회', '수시'],
  condition:   ['정상', '비정상', '긴급'],
  work_type:   ['일상작업', '비일상작업', '긴급작업', '유지보수'],
  risk_grade:  ['상(즉시개선)', '중(단기개선)', '하(모니터링)'],
  judgment:    ['적합', '부적합', '해당없음(N/A)'],
  result:      ['적합', '부적합', '해당없음(N/A)'],
  fuel_type:   ['전력', 'LNG(도시가스)', '경유', 'LPG', '휘발유', '등유', '벙커C유', '스팀', '기타'],
  energy_type: ['전력', 'LNG(도시가스)', '경유', 'LPG', '휘발유', '등유', '벙커C유', '스팀', '기타'],
  scope:       ['Scope 1', 'Scope 2', 'Scope 3'],
  grade:       ['A급(최우수)', 'B급(우수)', 'C급(보통)', 'D급(미흡)', 'F급(불량)'],
  signal:      ['G', 'Y', 'R'],
};

interface FormTableProps {
  columns: TableColumn[];
  value: Row[];
  onChange?: (rows: Row[]) => void;
  readOnly?: boolean;
}

export default function FormTable({ columns, value, onChange, readOnly }: FormTableProps) {
  function update(rowIdx: number, key: string, val: string) {
    const next = value.map((r, i) => (i === rowIdx ? { ...r, [key]: val } : r));
    onChange?.(next);
  }

  function addRow() {
    const blank: Row = {};
    columns.forEach(c => { blank[c.key] = ""; });
    onChange?.([...value, blank]);
  }

  function removeRow(idx: number) {
    onChange?.(value.filter((_, i) => i !== idx));
  }

  return (
    <div style={{ overflowX: "auto" }}>
      <table style={{
        width: "100%", borderCollapse: "collapse",
        fontSize: 13, tableLayout: "fixed",
      }}>
        <colgroup>
          {columns.map(c => (
            <col key={c.key} style={{ width: c.width ? `${c.width}px` : undefined }} />
          ))}
          {!readOnly && <col style={{ width: 36 }} />}
        </colgroup>
        <thead>
          <tr style={{ background: "#F8F9FA" }}>
            {columns.map(c => (
              <th key={c.key} style={{
                padding: "6px 8px", textAlign: "left",
                border: "1px solid #E5E5E5", fontWeight: 600,
                color: "#555", fontSize: 12,
              }}>
                {c.label}
              </th>
            ))}
            {!readOnly && <th style={{ border: "1px solid #E5E5E5", width: 36 }} />}
          </tr>
        </thead>
        <tbody>
          {value.length === 0 && (
            <tr>
              <td
                colSpan={columns.length + (readOnly ? 0 : 1)}
                style={{
                  padding: "16px 8px", textAlign: "center",
                  color: "#bbb", fontSize: 12, border: "1px solid #E5E5E5",
                }}
              >
                {readOnly ? "데이터 없음" : "행을 추가하세요"}
              </td>
            </tr>
          )}
          {value.map((row, ri) => (
            <tr key={ri} style={{ background: ri % 2 === 0 ? "#fff" : "#FAFAFA" }}>
              {columns.map(c => (
                <td key={c.key} style={{ border: "1px solid #E5E5E5", padding: "2px 4px" }}>
                  {readOnly ? (
                    <span style={{ padding: "4px", display: "block", fontSize: 13 }}>
                      {row[c.key] ?? ""}
                    </span>
                  ) : COLUMN_AUTO_OPTIONS[c.key] ? (
                    <select
                      value={row[c.key] ?? ""}
                      onChange={e => update(ri, c.key, e.target.value)}
                      style={{
                        width: "100%", border: "none", outline: "none",
                        background: "transparent", fontSize: 13,
                        padding: "4px", color: "#1a1a1a", cursor: "pointer",
                      }}
                    >
                      <option value="">—</option>
                      {COLUMN_AUTO_OPTIONS[c.key].map(o => (
                        <option key={o} value={o}>{o}</option>
                      ))}
                    </select>
                  ) : (
                    <input
                      value={row[c.key] ?? ""}
                      onChange={e => update(ri, c.key, e.target.value)}
                      style={{
                        width: "100%", border: "none", outline: "none",
                        background: "transparent", fontSize: 13,
                        padding: "4px", color: "#1a1a1a",
                      }}
                    />
                  )}
                </td>
              ))}
              {!readOnly && (
                <td style={{ border: "1px solid #E5E5E5", textAlign: "center", padding: 0 }}>
                  <button
                    onClick={() => removeRow(ri)}
                    style={{
                      border: "none", background: "transparent",
                      cursor: "pointer", color: "#ccc", fontSize: 15,
                      lineHeight: 1, padding: "4px 8px",
                    }}
                    className="hover:text-red-400 transition-colors"
                    title="행 삭제"
                  >
                    ×
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
      {!readOnly && (
        <button
          onClick={addRow}
          style={{
            marginTop: 6, fontSize: 12, color: "#3B5BDB",
            background: "transparent", border: "1px dashed #C5D0FC",
            borderRadius: 4, padding: "4px 12px", cursor: "pointer",
            width: "100%",
          }}
          className="hover:bg-[#EEF2FF] transition-colors"
        >
          + 행 추가
        </button>
      )}
    </div>
  );
}
