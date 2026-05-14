import React from "react";
import type { Section } from "@/types/sections";
import SectionsPrintView from "./SectionsPrintView";

interface PrintLayoutProps {
  docNumber?: string;
  title?: string;
  version?: string;
  status?: string;
  layer?: string;
  isoClause?: string;
  ownerName?: string;
  companyName?: string;
  approvals?: Array<{
    step: number;
    step_name: string;
    approver_name?: string | null;
    status?: string;
    approved_at?: string | null;
  }>;
  versions?: Array<{
    version: string;
    change_reason?: string | null;
    changed_by?: string | null;
    created_at: string;
  }>;
  isForm?: boolean;
  formCode?: string;
  richSections?: Section[];
  children: React.ReactNode;
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}.${m}.${day}`;
}

export default function PrintLayout({
  docNumber,
  title,
  version,
  status,
  layer,
  isoClause,
  ownerName,
  companyName,
  approvals,
  versions,
  isForm,
  formCode,
  richSections,
  children,
}: PrintLayoutProps) {
  const today = formatDate(new Date().toISOString());

  return (
    <>
      {/* 인쇄 전용 헤더 */}
      <div className="print-only" style={{ display: "none" }}>
        {isForm ? (
          /* ── 서식 헤더 (compact 3-column grid) ── */
          <div style={{ marginBottom: 16 }}>
            <table style={{ width: "100%", borderCollapse: "collapse", border: "1px solid #E2E8F0" }}>
              <tbody>
                <tr>
                  <td style={{ width: "30%", padding: "10px 14px", border: "1px solid #E2E8F0", fontSize: 12, fontWeight: 600, color: "#1A1A2E" }}>
                    {companyName ?? ""}
                  </td>
                  <td style={{ width: "40%", padding: "10px 14px", border: "1px solid #E2E8F0", textAlign: "center", fontSize: 16, fontWeight: 800, color: "#1A1A2E" }}>
                    {title ?? ""}
                  </td>
                  <td style={{ width: "30%", padding: "10px 14px", border: "1px solid #E2E8F0", textAlign: "right", fontSize: 11, color: "#555" }}>
                    {formCode && <div style={{ fontFamily: "monospace", fontWeight: 700, color: "#3B5BDB" }}>{formCode}</div>}
                    {version && <div>Ver. {version}</div>}
                  </td>
                </tr>
              </tbody>
            </table>
            {/* 작성 정보 바 */}
            <div style={{
              marginTop: 4,
              padding: "6px 14px",
              background: "#F8FAFC",
              border: "1px solid #E2E8F0",
              fontSize: 11,
              color: "#555",
              display: "flex",
              gap: 24,
            }}>
              <span>작성일: _____________</span>
              <span>작성부서: _____________</span>
              <span>작성자: _____________</span>
            </div>
          </div>
        ) : (
          /* ── 문서 헤더 (full design) ── */
          <div style={{ marginBottom: 0 }}>
            {/* Brand bar */}
            <div className="print-brand-bar" style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              padding: "10px 16px 10px 20px",
              borderLeft: "5px solid #3B5BDB",
              background: "white",
            }}>
              {/* Left */}
              <div>
                {companyName && (
                  <div style={{ fontSize: 11, color: "#666", fontWeight: 500 }}>{companyName}</div>
                )}
                {docNumber && (
                  <div style={{ fontFamily: "monospace", fontSize: 11, fontWeight: 700, color: "#3B5BDB" }}>{docNumber}</div>
                )}
              </div>
              {/* Right */}
              <div style={{ textAlign: "right", display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 3 }}>
                {version && (
                  <span style={{
                    display: "inline-block",
                    padding: "1px 8px",
                    background: "#EEF2FF",
                    color: "#3B5BDB",
                    borderRadius: 4,
                    fontSize: 11,
                    fontWeight: 700,
                    fontFamily: "monospace",
                  }}>
                    v{version}
                  </span>
                )}
                {status && (
                  <span style={{ fontSize: 11, color: "#555", fontWeight: 500 }}>{status}</span>
                )}
              </div>
            </div>

            {/* Bottom border + title */}
            <div style={{ borderBottom: "2px solid #1A1A2E", margin: "6px 0 10px" }} />

            {title && (
              <div style={{ fontSize: 20, fontWeight: 800, color: "#1A1A2E", marginBottom: 8 }}>{title}</div>
            )}

            {/* Meta row */}
            <div style={{ display: "flex", gap: 20, fontSize: 11, color: "#555", marginBottom: 16 }}>
              {isoClause && <span>ISO {isoClause}</span>}
              {layer && <span>계층 {layer}</span>}
              {ownerName && <span>담당자 <strong style={{ color: "#1A1A2E" }}>{ownerName}</strong></span>}
            </div>

            {/* Approval boxes */}
            {approvals && approvals.length > 0 && (
              <div style={{
                display: "grid",
                gridTemplateColumns: `repeat(${Math.min(approvals.length, 3)}, 1fr)`,
                gap: 0,
                marginBottom: 16,
                border: "1px solid #E2E8F0",
              }}>
                {approvals.map((a) => (
                  <div key={a.step} style={{
                    border: "1px solid #E2E8F0",
                    textAlign: "center",
                    padding: "12px 8px",
                  }}>
                    <div style={{ fontSize: 10, fontWeight: 700, color: "#999", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 6 }}>
                      {a.step_name}
                    </div>
                    <div style={{ minHeight: 32, borderBottom: "1px dashed #E2E8F0", marginBottom: 6 }} />
                    <div style={{ fontSize: 13, fontWeight: 600, color: "#1A1A2E" }}>
                      {a.approver_name ?? ""}
                    </div>
                    <div style={{ fontSize: 10, color: "#999" }}>
                      {a.approved_at ? formatDate(a.approved_at) : ""}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Revision history table */}
            {versions && versions.length > 0 && (
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11, marginTop: 16 }}>
                <thead>
                  <tr style={{ background: "#F8FAFC" }}>
                    {["개정번호", "개정일", "개정 내용", "개정자"].map((col) => (
                      <th key={col} style={{
                        padding: "6px 10px",
                        fontWeight: 700,
                        color: "#374151",
                        borderBottom: "2px solid #E2E8F0",
                        textAlign: "left",
                      }}>
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {versions.map((v, i) => (
                    <tr key={v.version} style={{
                      background: i % 2 === 0 ? "#fff" : "#F8FAFC",
                      border: "1px solid #E9ECEF",
                    }}>
                      <td style={{ padding: "5px 10px", border: "1px solid #E9ECEF", fontFamily: "monospace", fontWeight: 700, color: "#3B5BDB" }}>{v.version}</td>
                      <td style={{ padding: "5px 10px", border: "1px solid #E9ECEF" }}>{formatDate(v.created_at)}</td>
                      <td style={{ padding: "5px 10px", border: "1px solid #E9ECEF" }}>{v.change_reason ?? "—"}</td>
                      <td style={{ padding: "5px 10px", border: "1px solid #E9ECEF" }}>{v.changed_by ?? "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>

      {/* 인쇄 전용 섹션 본문 */}
      {richSections && richSections.length > 0 && (
        <div className="print-only" style={{ display: "none" }}>
          <div style={{ borderTop: "2px solid #1A1A2E", margin: "16px 0 20px" }} />
          <SectionsPrintView sections={richSections} />
        </div>
      )}

      {children}

      {/* 인쇄 전용 푸터 */}
      <div className="print-only" style={{ display: "none" }}>
        <div style={{
          borderTop: "2px solid #E2E8F0",
          marginTop: 32,
          paddingTop: 8,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontSize: 9,
          color: "#999",
        }}>
          <span>
            {[companyName, docNumber, version ? `v${version}` : undefined, today].filter(Boolean).join(" | ")}
          </span>
          <span style={{ fontStyle: "italic" }}>이 문서를 인쇄하면 비관리본입니다</span>
        </div>
      </div>
    </>
  );
}
