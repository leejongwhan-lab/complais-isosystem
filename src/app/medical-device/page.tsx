import AppLayout from "@/components/layout/AppLayoutServer";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default async function MedicalDevicePage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const { tab: rawTab } = await searchParams;
  const tab =
    rawTab === "design" || rawTab === "complaints" ? rawTab : "devices";

  let deviceCount = 0;
  let designCount = 0;
  const complaintRate = 0;
  let riskFileCount = 0;

  try {
    const { count } = await supabase
      .from("medical_devices")
      .select("*", { count: "exact", head: true });
    deviceCount = count ?? 0;
  } catch { deviceCount = 0; }

  try {
    const { count } = await supabase
      .from("design_history_files")
      .select("*", { count: "exact", head: true })
      .eq("status", "진행중");
    designCount = count ?? 0;
  } catch { designCount = 0; }

  try {
    const { count } = await supabase
      .from("risk_management_files")
      .select("*", { count: "exact", head: true });
    riskFileCount = count ?? 0;
  } catch { riskFileCount = 0; }

  let deviceRows: { device_code: string; device_name: string; serial_no: string; manufacture_date: string; release_approved: string }[] = [];
  try {
    const { data } = await supabase
      .from("medical_devices")
      .select("device_code, device_name, serial_no, manufacture_date, release_approved")
      .order("manufacture_date", { ascending: false })
      .limit(50);
    deviceRows = (data ?? []) as typeof deviceRows;
  } catch { deviceRows = []; }

  let designRows: { device_name: string; device_code: string; established_date: string; project_owner: string; status: string }[] = [];
  try {
    const { data } = await supabase
      .from("design_history_files")
      .select("device_name, device_code, established_date, project_owner, status")
      .order("established_date", { ascending: false })
      .limit(50);
    designRows = (data ?? []) as typeof designRows;
  } catch { designRows = []; }

  let complaintRows: { complaint_no: string; received_date: string; customer: string; device_name: string; complaint_type: string; mdr_reported: string }[] = [];
  try {
    const { data } = await supabase
      .from("customer_complaints")
      .select("complaint_no, received_date, customer, device_name, complaint_type, mdr_reported")
      .order("received_date", { ascending: false })
      .limit(50);
    complaintRows = (data ?? []) as typeof complaintRows;
  } catch { complaintRows = []; }

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

  const actionLinkStyle: React.CSSProperties = {
    fontSize: 13,
    fontWeight: 600,
    background: "#EEF2FF",
    color: "#3B5BDB",
    padding: "6px 12px",
    borderRadius: 6,
    textDecoration: "none",
  };

  const tabLink = (value: string, label: string) => (
    <Link
      href={`/medical-device?tab=${value}`}
      style={{
        padding: "12px 20px",
        fontSize: 13,
        fontWeight: tab === value ? 600 : 400,
        color: tab === value ? "#3B5BDB" : "#666",
        textDecoration: "none",
        borderBottom: tab === value ? "2px solid #3B5BDB" : "2px solid transparent",
        marginBottom: -1,
        display: "inline-block",
      }}
    >
      {label}
    </Link>
  );

  return (
    <AppLayout>
      <div style={{ padding: 32 }}>
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 28,
          }}
        >
          <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: "#1a1a1a" }}>
            의료기기 품질 관리 (ISO 13485)
          </h1>
          <Link href="/forms/F-MD-02/new" style={buttonStyle}>
            기기이력 등록
          </Link>
        </div>

        {/* KPI Cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 16,
            marginBottom: 28,
          }}
        >
          <div style={{ background: "#fff", border: "1px solid #E5E5E5", borderRadius: 8, padding: "20px 22px" }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: "#999", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>등록 의료기기 수</div>
            <div style={{ fontSize: 28, fontWeight: 700, color: "#1a1a1a", lineHeight: 1.1 }}>{deviceCount}</div>
            <div style={{ fontSize: 12, color: "#888", marginTop: 4 }}>누적 등록 기기</div>
          </div>
          <div style={{ background: "#fff", border: "1px solid #E5E5E5", borderRadius: 8, padding: "20px 22px" }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: "#999", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>설계개발 진행 건수</div>
            <div style={{ fontSize: 28, fontWeight: 700, color: "#1a1a1a", lineHeight: 1.1 }}>{designCount}</div>
            <div style={{ fontSize: 12, color: "#888", marginTop: 4 }}>진행 중인 DHF</div>
          </div>
          <div style={{ background: "#fff", border: "1px solid #E5E5E5", borderRadius: 8, padding: "20px 22px" }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: "#999", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>고객불만 처리율</div>
            <div style={{ fontSize: 28, fontWeight: 700, color: "#1a1a1a", lineHeight: 1.1 }}>{complaintRate}%</div>
            <div style={{ fontSize: 12, color: "#888", marginTop: 4 }}>불만 처리 완료율</div>
          </div>
          <div style={{ background: "#fff", border: "1px solid #E5E5E5", borderRadius: 8, padding: "20px 22px" }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: "#999", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>위험관리 파일 수</div>
            <div style={{ fontSize: 28, fontWeight: 700, color: "#1a1a1a", lineHeight: 1.1 }}>{riskFileCount}</div>
            <div style={{ fontSize: 12, color: "#888", marginTop: 4 }}>등록된 위험관리 파일</div>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ background: "#fff", border: "1px solid #E5E5E5", borderRadius: 10, overflow: "hidden" }}>
          <div style={{ display: "flex", borderBottom: "1px solid #E5E5E5" }}>
            {tabLink("devices", "기기이력")}
            {tabLink("design", "설계개발 (DHF)")}
            {tabLink("complaints", "고객불만")}
          </div>

          <div style={{ padding: 24 }}>
            {tab === "devices" && (
              <>
                <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 16 }}>
                  <Link href="/forms/F-MD-02/new" style={actionLinkStyle}>기기이력 등록 →</Link>
                </div>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr>
                      <th style={thStyle}>기기코드</th>
                      <th style={thStyle}>기기명</th>
                      <th style={thStyle}>제조번호</th>
                      <th style={thStyle}>제조일</th>
                      <th style={thStyle}>출하승인</th>
                    </tr>
                  </thead>
                  <tbody>
                    {deviceRows.length === 0 ? (
                      <tr>
                        <td colSpan={5} style={{ padding: "48px 16px", textAlign: "center", color: "#bbb", fontSize: 13 }}>
                          등록된 기기이력이 없습니다
                        </td>
                      </tr>
                    ) : (
                      deviceRows.map((row, i) => (
                        <tr key={i}>
                          <td style={{ padding: "10px 16px", fontSize: 13, borderBottom: "1px solid #F0F0F0" }}>{row.device_code}</td>
                          <td style={{ padding: "10px 16px", fontSize: 13, borderBottom: "1px solid #F0F0F0" }}>{row.device_name}</td>
                          <td style={{ padding: "10px 16px", fontSize: 13, borderBottom: "1px solid #F0F0F0" }}>{row.serial_no}</td>
                          <td style={{ padding: "10px 16px", fontSize: 13, borderBottom: "1px solid #F0F0F0" }}>{row.manufacture_date}</td>
                          <td style={{ padding: "10px 16px", fontSize: 13, borderBottom: "1px solid #F0F0F0" }}>{row.release_approved}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </>
            )}

            {tab === "design" && (
              <>
                <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 16 }}>
                  <Link href="/forms/F-MD-01/new" style={actionLinkStyle}>DHF 작성 →</Link>
                </div>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr>
                      <th style={thStyle}>기기명</th>
                      <th style={thStyle}>기기코드</th>
                      <th style={thStyle}>수립일</th>
                      <th style={thStyle}>과제책임자</th>
                      <th style={thStyle}>상태</th>
                    </tr>
                  </thead>
                  <tbody>
                    {designRows.length === 0 ? (
                      <tr>
                        <td colSpan={5} style={{ padding: "48px 16px", textAlign: "center", color: "#bbb", fontSize: 13 }}>
                          등록된 DHF가 없습니다
                        </td>
                      </tr>
                    ) : (
                      designRows.map((row, i) => (
                        <tr key={i}>
                          <td style={{ padding: "10px 16px", fontSize: 13, borderBottom: "1px solid #F0F0F0" }}>{row.device_name}</td>
                          <td style={{ padding: "10px 16px", fontSize: 13, borderBottom: "1px solid #F0F0F0" }}>{row.device_code}</td>
                          <td style={{ padding: "10px 16px", fontSize: 13, borderBottom: "1px solid #F0F0F0" }}>{row.established_date}</td>
                          <td style={{ padding: "10px 16px", fontSize: 13, borderBottom: "1px solid #F0F0F0" }}>{row.project_owner}</td>
                          <td style={{ padding: "10px 16px", fontSize: 13, borderBottom: "1px solid #F0F0F0" }}>{row.status}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </>
            )}

            {tab === "complaints" && (
              <>
                <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 16 }}>
                  <Link href="/forms/F-MD-05/new" style={actionLinkStyle}>불만 접수 →</Link>
                </div>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr>
                      <th style={thStyle}>불만번호</th>
                      <th style={thStyle}>접수일</th>
                      <th style={thStyle}>고객명</th>
                      <th style={thStyle}>기기명</th>
                      <th style={thStyle}>불만유형</th>
                      <th style={thStyle}>MDR보고</th>
                    </tr>
                  </thead>
                  <tbody>
                    {complaintRows.length === 0 ? (
                      <tr>
                        <td colSpan={6} style={{ padding: "48px 16px", textAlign: "center", color: "#bbb", fontSize: 13 }}>
                          등록된 고객불만이 없습니다
                        </td>
                      </tr>
                    ) : (
                      complaintRows.map((row, i) => (
                        <tr key={i}>
                          <td style={{ padding: "10px 16px", fontSize: 13, borderBottom: "1px solid #F0F0F0" }}>{row.complaint_no}</td>
                          <td style={{ padding: "10px 16px", fontSize: 13, borderBottom: "1px solid #F0F0F0" }}>{row.received_date}</td>
                          <td style={{ padding: "10px 16px", fontSize: 13, borderBottom: "1px solid #F0F0F0" }}>{row.customer}</td>
                          <td style={{ padding: "10px 16px", fontSize: 13, borderBottom: "1px solid #F0F0F0" }}>{row.device_name}</td>
                          <td style={{ padding: "10px 16px", fontSize: 13, borderBottom: "1px solid #F0F0F0" }}>{row.complaint_type}</td>
                          <td style={{ padding: "10px 16px", fontSize: 13, borderBottom: "1px solid #F0F0F0" }}>{row.mdr_reported}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
