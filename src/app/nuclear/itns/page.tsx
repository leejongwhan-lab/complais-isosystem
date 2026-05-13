import AppLayout from "@/components/layout/AppLayoutServer";
import Link from "next/link";

export default function ItnsPage() {
  const buttonStyle: React.CSSProperties = {
    background: "#3B5BDB",
    color: "#fff",
    padding: "7px 14px",
    borderRadius: 6,
    fontSize: 13,
    fontWeight: 600,
    border: "none",
    cursor: "pointer",
    textDecoration: "none",
  };

  const thStyle: React.CSSProperties = {
    padding: "10px 16px",
    textAlign: "left",
    fontSize: 11,
    fontWeight: 600,
    color: "#999",
    background: "#FAFAFA",
    borderBottom: "1px solid #E5E5E5",
  };

  return (
    <AppLayout>
      <div style={{ padding: 32 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 28,
          }}
        >
          <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: "#1a1a1a" }}>
            ITNS 품목/용역 관리
          </h1>
          <Link href="/forms/F-NQ-01/new" style={buttonStyle}>
            ITNS 등록
          </Link>
        </div>

        <div style={{ background: "#fff", border: "1px solid #E5E5E5", borderRadius: 10, overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th style={thStyle}>품목코드</th>
                <th style={thStyle}>품목/용역명</th>
                <th style={thStyle}>품질등급</th>
                <th style={thStyle}>안전분류</th>
                <th style={thStyle}>공급자</th>
                <th style={thStyle}>일반규격품</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td
                  colSpan={6}
                  style={{ padding: "48px 16px", textAlign: "center", color: "#bbb", fontSize: 13 }}
                >
                  등록된 ITNS 품목이 없습니다
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </AppLayout>
  );
}
