import AppLayout from "@/components/layout/AppLayoutServer";
import Link from "next/link";

const thStyle: React.CSSProperties = {
  padding: "10px 16px",
  textAlign: "left",
  fontSize: 11,
  fontWeight: 600,
  color: "#999",
  background: "#FAFAFA",
  borderBottom: "1px solid #E5E5E5",
  whiteSpace: "nowrap",
};

export default async function CosmeticBatchPage() {
  return (
    <AppLayout>
      <div style={{ padding: 32 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 28 }}>
          <div>
            <div style={{ fontSize: 12, color: "#888", marginBottom: 4 }}>
              <Link href="/cosmetic" style={{ color: "#888", textDecoration: "none" }}>
                화장품 GMP
              </Link>
              {" / "}제조 기록
            </div>
            <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: "#1a1a1a" }}>제조 배치 기록 관리</h1>
          </div>
          <Link
            href="/forms/F-CG-01/new"
            style={{ background: "#E64980", color: "#fff", padding: "7px 14px", borderRadius: 6, fontSize: 13, fontWeight: 600, textDecoration: "none" }}
          >
            배치 기록 작성
          </Link>
        </div>

        <div style={{ background: "#fff", border: "1px solid #E5E5E5", borderRadius: 10, overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th style={thStyle}>배치번호</th>
                <th style={thStyle}>제품명</th>
                <th style={thStyle}>제품코드</th>
                <th style={thStyle}>제조일</th>
                <th style={thStyle}>배치규모</th>
                <th style={thStyle}>수율(%)</th>
                <th style={thStyle}>품질검사</th>
                <th style={thStyle}>출하결정</th>
                <th style={thStyle}>품질책임자</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan={9} style={{ padding: "48px 16px", textAlign: "center", color: "#bbb", fontSize: 13 }}>
                  등록된 배치 기록이 없습니다
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </AppLayout>
  );
}
