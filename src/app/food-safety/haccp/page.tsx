import AppLayout from "@/components/layout/AppLayoutServer";
import Link from "next/link";

export default function HaccpPage() {
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
            HACCP 계획서 관리
          </h1>
          <Link href="/forms/F-FS-02/new" style={buttonStyle}>
            HACCP 계획서 작성
          </Link>
        </div>

        <div style={{ background: "#fff", border: "1px solid #E5E5E5", borderRadius: 10, overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th style={thStyle}>계획서번호</th>
                <th style={thStyle}>제품명</th>
                <th style={thStyle}>수립일</th>
                <th style={thStyle}>식품안전팀장</th>
                <th style={thStyle}>상태</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td
                  colSpan={5}
                  style={{ padding: "48px 16px", textAlign: "center", color: "#bbb", fontSize: 13 }}
                >
                  등록된 HACCP 계획서가 없습니다
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </AppLayout>
  );
}
