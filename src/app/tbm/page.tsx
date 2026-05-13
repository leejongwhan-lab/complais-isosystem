import { Suspense } from "react";
import AppLayoutServer from "@/components/layout/AppLayoutServer";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { ClipboardCheck, Plus } from "lucide-react";

function ContentSpinner() {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "calc(100vh - 56px)" }}>
      <div className="w-7 h-7 border-2 border-[#3B5BDB] border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

async function TBMContent() {
  let records: Array<{
    id: string;
    tbm_date: string;
    work_location: string;
    work_content: string;
    hazards: string | null;
    safety_instructions: string | null;
    weather: string | null;
    temperature: string | null;
    leader_name: string;
    attendee_count: number;
    created_at: string;
  }> = [];

  try {
    const { data, error } = await supabase
      .from("tbm_records")
      .select("*")
      .order("tbm_date", { ascending: false })
      .limit(50);

    if (!error && data) {
      records = data;
    }
  } catch {
    // ignore fetch errors — show empty state
  }

  // Compute stats from fetched records
  const today = new Date();

  // First day of this month
  const firstOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)
    .toISOString()
    .slice(0, 10);

  // First day of this week (Monday)
  const dayOfWeek = today.getDay(); // 0=Sun
  const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  const firstOfWeek = new Date(today);
  firstOfWeek.setDate(today.getDate() + diffToMonday);
  const firstOfWeekStr = firstOfWeek.toISOString().slice(0, 10);

  const monthRecords = records.filter(r => r.tbm_date >= firstOfMonth);
  const weekRecords = records.filter(r => r.tbm_date >= firstOfWeekStr);
  const monthlyCount = monthRecords.length;
  const monthlyAttendees = monthRecords.reduce((sum, r) => sum + (r.attendee_count ?? 0), 0);
  const weeklyCount = weekRecords.length;

  // Consecutive days ending today
  let consecutiveDays = 0;
  {
    const dateSet = new Set(records.map(r => r.tbm_date));
    const check = new Date(today);
    while (true) {
      const ds = check.toISOString().slice(0, 10);
      if (dateSet.has(ds)) {
        consecutiveDays++;
        check.setDate(check.getDate() - 1);
      } else {
        break;
      }
    }
  }

  const KPI_CARD_STYLE = {
    background: "#fff",
    border: "1px solid #E5E5E5",
    borderRadius: 8,
    padding: "16px 20px",
    flex: 1,
    minWidth: 0,
  };

  return (
    <div style={{ background: "#fff", minHeight: "calc(100vh - 56px)" }}>
      {/* KPI Strip */}
      <div style={{
        display: "flex",
        gap: 16,
        padding: "20px 24px",
        background: "#FAFAFA",
        borderBottom: "1px solid #E5E5E5",
      }}>
        <div style={KPI_CARD_STYLE}>
          <div style={{ fontSize: 28, fontWeight: 700, color: "#1a1a1a" }}>{monthlyCount}</div>
          <div style={{ fontSize: 12, color: "#999", marginTop: 4 }}>이번달 TBM 실시</div>
        </div>
        <div style={KPI_CARD_STYLE}>
          <div style={{ fontSize: 28, fontWeight: 700, color: "#1a1a1a" }}>{monthlyAttendees}</div>
          <div style={{ fontSize: 12, color: "#999", marginTop: 4 }}>이번달 총 참석자</div>
        </div>
        <div style={KPI_CARD_STYLE}>
          <div style={{ fontSize: 28, fontWeight: 700, color: "#1a1a1a" }}>{weeklyCount}</div>
          <div style={{ fontSize: 12, color: "#999", marginTop: 4 }}>이번주 실시</div>
        </div>
        <div style={KPI_CARD_STYLE}>
          <div style={{ fontSize: 28, fontWeight: 700, color: "#3B5BDB" }}>{consecutiveDays}</div>
          <div style={{ fontSize: 12, color: "#999", marginTop: 4 }}>연속 실시 일수</div>
        </div>
      </div>

      {/* Toolbar */}
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "16px 24px",
        borderBottom: "1px solid #E5E5E5",
      }}>
        <span style={{ fontSize: 13, color: "#555" }}>총 {records.length}건</span>
        <Link
          href="/tbm/new"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            padding: "8px 16px",
            borderRadius: 6,
            background: "#3B5BDB",
            color: "#fff",
            textDecoration: "none",
            fontSize: 13,
            fontWeight: 600,
          }}
          className="hover:opacity-90 transition-opacity"
        >
          <Plus size={14} />
          오늘 TBM 등록
        </Link>
      </div>

      {/* Table */}
      {records.length === 0 ? (
        <div style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 16,
          padding: "80px 24px",
          textAlign: "center",
        }}>
          <ClipboardCheck size={48} color="#E5E5E5" />
          <div>
            <p style={{ margin: 0, fontSize: 15, fontWeight: 600, color: "#1a1a1a" }}>등록된 TBM이 없습니다.</p>
            <p style={{ margin: "4px 0 0", fontSize: 13, color: "#999" }}>오늘 TBM을 등록해보세요.</p>
          </div>
          <Link
            href="/tbm/new"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "10px 20px",
              borderRadius: 6,
              background: "#3B5BDB",
              color: "#fff",
              textDecoration: "none",
              fontSize: 13,
              fontWeight: 600,
            }}
          >
            <Plus size={14} />
            오늘 TBM 등록
          </Link>
        </div>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{
                position: "sticky",
                top: 0,
                background: "#FAFAFA",
                zIndex: 1,
              }}>
                {["날짜", "장소", "작업내용", "참석자수", "등록자", "상태", ""].map(col => (
                  <th
                    key={col}
                    style={{
                      padding: "10px 16px",
                      fontSize: 11,
                      fontWeight: 600,
                      color: "#999",
                      textAlign: "left",
                      borderBottom: "1px solid #E5E5E5",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {records.map(tbm => (
                <tr
                  key={tbm.id}
                  style={{ borderBottom: "1px solid #F0F0F0" }}
                  className="hover:bg-[#FAFAFA] transition-colors"
                >
                  <td style={{ padding: "12px 16px", fontSize: 13, color: "#1a1a1a", whiteSpace: "nowrap" }}>
                    {tbm.tbm_date}
                  </td>
                  <td style={{ padding: "12px 16px", fontSize: 13, color: "#1a1a1a" }}>
                    {tbm.work_location}
                  </td>
                  <td style={{ padding: "12px 16px", fontSize: 13, color: "#555" }}>
                    {tbm.work_content.length > 40
                      ? tbm.work_content.slice(0, 40) + "…"
                      : tbm.work_content}
                  </td>
                  <td style={{ padding: "12px 16px", fontSize: 13, color: "#1a1a1a", whiteSpace: "nowrap" }}>
                    {tbm.attendee_count}명
                  </td>
                  <td style={{ padding: "12px 16px", fontSize: 13, color: "#555" }}>
                    {tbm.leader_name}
                  </td>
                  <td style={{ padding: "12px 16px" }}>
                    <span style={{
                      fontSize: 11,
                      fontWeight: 600,
                      padding: "3px 8px",
                      borderRadius: 12,
                      background: "#EBFBEE",
                      color: "#2F9E44",
                    }}>
                      완료
                    </span>
                  </td>
                  <td style={{ padding: "12px 16px" }}>
                    <Link
                      href={`/tbm/${tbm.id}`}
                      style={{
                        fontSize: 12,
                        color: "#3B5BDB",
                        textDecoration: "none",
                        padding: "4px 10px",
                        border: "1px solid #C5D0FF",
                        borderRadius: 5,
                        whiteSpace: "nowrap",
                      }}
                      className="hover:bg-[#EEF2FF] transition-colors"
                    >
                      보기
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default function TBMPage() {
  return (
    <AppLayoutServer>
      <Suspense fallback={<ContentSpinner />}>
        <TBMContent />
      </Suspense>
    </AppLayoutServer>
  );
}
