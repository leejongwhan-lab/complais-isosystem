interface PrintLayoutProps {
  docNumber?: string;
  title?: string;
  version?: string;
  children: React.ReactNode;
}

export default function PrintLayout({ docNumber, title, version, children }: PrintLayoutProps) {
  const today = new Date().toLocaleDateString("ko-KR", { year: "numeric", month: "2-digit", day: "2-digit" });
  return (
    <>
      {/* 인쇄 전용 헤더: 화면에서는 hidden, @media print에서 block으로 표시 */}
      <div className="print-only" style={{ display: "none" }}>
        <div style={{
          display: "flex", justifyContent: "space-between", alignItems: "flex-end",
          borderBottom: "2px solid #1a1a1a", paddingBottom: 10, marginBottom: 16,
        }}>
          <div>
            {docNumber && (
              <p style={{ margin: 0, fontSize: 11, fontFamily: "monospace", color: "#555" }}>{docNumber}</p>
            )}
            {title && (
              <h2 style={{ margin: "4px 0 0", fontSize: 16, fontWeight: 700, color: "#1a1a1a" }}>{title}</h2>
            )}
          </div>
          <div style={{ textAlign: "right", fontSize: 11, color: "#555" }}>
            {version && <p style={{ margin: 0 }}>버전: {version}</p>}
            <p style={{ margin: 0 }}>출력일: {today}</p>
          </div>
        </div>
      </div>

      {children}

      {/* 인쇄 전용 푸터 */}
      <div className="print-only" style={{ display: "none" }}>
        <div style={{
          borderTop: "1px solid #ccc", marginTop: 24, paddingTop: 8,
          display: "flex", justifyContent: "space-between",
          fontSize: 10, color: "#888",
        }}>
          <span>본 문서는 인쇄본이며 최신본 여부를 확인하시기 바랍니다</span>
          <span>{today}</span>
        </div>
        {/* 결재란 */}
        <table style={{ width: "100%", borderCollapse: "collapse", marginTop: 12, fontSize: 11 }}>
          <tbody>
            <tr>
              {["작성", "검토", "승인"].map(role => (
                <td key={role} style={{ border: "1px solid #ccc", padding: "6px 12px", width: "33%", height: 40, textAlign: "center", verticalAlign: "top" }}>
                  <span style={{ fontWeight: 600 }}>{role}</span>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
}
