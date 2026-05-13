import AdminLayout from "@/components/admin/AdminLayout";
import { supabase } from "@/lib/supabase";

type FormTemplate = {
  id: string;
  form_code: string;
  form_name: string;
  category: string | null;
  iso_standard: string | null;
  sort_order: number | null;
};

function IsoStandardBadge({ standard }: { standard: string | null }) {
  if (!standard) {
    return (
      <span style={{
        fontSize: 11, fontWeight: 600,
        padding: "2px 8px", borderRadius: 4,
        background: "#F5F5F5", color: "#888",
      }}>
        -
      </span>
    );
  }
  const lower = standard.toLowerCase();
  let bg = "#F5F5F5";
  let color = "#888";
  if (lower.includes("9001"))  { bg = "#EEF2FF"; color = "#3B5BDB"; }
  else if (lower.includes("14001")) { bg = "#EBFBEE"; color = "#2F9E44"; }
  else if (lower.includes("45001")) { bg = "#FFF9DB"; color = "#E67700"; }
  else if (lower === "공통")         { bg = "#F5F5F5"; color = "#888"; }

  return (
    <span style={{
      fontSize: 11, fontWeight: 600,
      padding: "2px 8px", borderRadius: 4,
      background: bg, color,
    }}>
      {standard}
    </span>
  );
}

export default async function AdminFormsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;

  let forms: FormTemplate[] = [];
  let totalCount = 0;
  let count9001 = 0;
  let count14001 = 0;
  let count45001 = 0;

  // KPI: 전체 서식 수
  try {
    const { count } = await supabase
      .from("form_templates")
      .select("*", { count: "exact", head: true });
    totalCount = count ?? 0;
  } catch {}

  // KPI: ISO 9001
  try {
    const { count } = await supabase
      .from("form_templates")
      .select("*", { count: "exact", head: true })
      .ilike("iso_standard", "%9001%");
    count9001 = count ?? 0;
  } catch {}

  // KPI: ISO 14001
  try {
    const { count } = await supabase
      .from("form_templates")
      .select("*", { count: "exact", head: true })
      .ilike("iso_standard", "%14001%");
    count14001 = count ?? 0;
  } catch {}

  // KPI: ISO 45001
  try {
    const { count } = await supabase
      .from("form_templates")
      .select("*", { count: "exact", head: true })
      .ilike("iso_standard", "%45001%");
    count45001 = count ?? 0;
  } catch {}

  // 서식 목록 (검색 필터 포함)
  try {
    let query = supabase
      .from("form_templates")
      .select("id, form_code, form_name, category, iso_standard, sort_order")
      .order("sort_order", { ascending: true });

    if (q && q.trim()) {
      query = query.or(
        `form_name.ilike.%${q.trim()}%,form_code.ilike.%${q.trim()}%`
      );
    }

    const { data } = await query;
    if (data) forms = data as FormTemplate[];
  } catch {}

  const kpiCards = [
    { label: "전체 서식 수",      value: totalCount, color: "#1a1a1a", bg: "#fff" },
    { label: "ISO 9001 서식 수",  value: count9001,  color: "#3B5BDB", bg: "#EEF2FF" },
    { label: "ISO 14001 서식 수", value: count14001, color: "#2F9E44", bg: "#EBFBEE" },
    { label: "ISO 45001 서식 수", value: count45001, color: "#E67700", bg: "#FFF9DB" },
  ];

  return (
    <AdminLayout active="/admin/forms">
      <div style={{ padding: 32 }}>
        {/* 타이틀 + 버튼 */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
          <h1 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: "#1a1a1a" }}>
            서식 관리
          </h1>
          <button
            disabled
            style={{
              fontSize: 13, fontWeight: 600,
              padding: "8px 16px", borderRadius: 6,
              border: "1px solid #E5E5E5",
              background: "#F5F5F5", color: "#bbb",
              cursor: "not-allowed",
            }}
          >
            + 서식 추가 기능은 준비 중입니다
          </button>
        </div>

        {/* KPI 카드 */}
        <div style={{ display: "flex", gap: 16, marginBottom: 32 }}>
          {kpiCards.map((card) => (
            <div
              key={card.label}
              style={{
                flex: 1,
                background: card.bg,
                border: "1px solid #E5E5E5",
                borderRadius: 8,
                padding: "20px 24px",
              }}
            >
              <div style={{ fontSize: 30, fontWeight: 700, color: card.color, lineHeight: 1.2 }}>
                {card.value.toLocaleString()}
              </div>
              <div style={{ fontSize: 12, color: "#888", marginTop: 6 }}>
                {card.label}
              </div>
            </div>
          ))}
        </div>

        {/* 검색 힌트 */}
        <div style={{ marginBottom: 16 }}>
          <p style={{ margin: 0, fontSize: 12, color: "#bbb" }}>
            검색은 URL 파라미터로 동작합니다 (?q=검색어)
          </p>
          {q && (
            <p style={{ margin: "4px 0 0", fontSize: 12, color: "#888" }}>
              검색어: <strong style={{ color: "#3B5BDB" }}>{q}</strong> — {forms.length}건 결과
            </p>
          )}
        </div>

        {/* 서식 테이블 */}
        <div style={{
          background: "#fff",
          border: "1px solid #E5E5E5",
          borderRadius: 8,
          overflow: "hidden",
        }}>
          <div style={{ padding: "16px 20px", borderBottom: "1px solid #E5E5E5" }}>
            <span style={{
              fontSize: 10, fontWeight: 600, color: "#bbb",
              textTransform: "uppercase", letterSpacing: "0.06em",
            }}>
              서식 목록 ({forms.length})
            </span>
          </div>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <thead>
                <tr style={{ background: "#FAFAFA", borderBottom: "1px solid #E5E5E5" }}>
                  {["서식코드", "서식명", "카테고리", "표준", "sort_order"].map((col) => (
                    <th
                      key={col}
                      style={{
                        padding: "10px 16px", textAlign: "left",
                        fontWeight: 600, color: "#888", fontSize: 12,
                      }}
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {forms.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      style={{ padding: "32px 16px", textAlign: "center", color: "#bbb" }}
                    >
                      {q ? `"${q}"에 해당하는 서식이 없습니다` : "등록된 서식이 없습니다"}
                    </td>
                  </tr>
                ) : (
                  forms.map((form) => (
                    <tr
                      key={form.id}
                      style={{ borderBottom: "1px solid #F0F0F0" }}
                      className="hover:bg-[#FAFAFA] transition-colors"
                    >
                      <td style={{ padding: "12px 16px", fontWeight: 600, color: "#3B5BDB", fontFamily: "monospace" }}>
                        {form.form_code}
                      </td>
                      <td style={{ padding: "12px 16px", color: "#1a1a1a" }}>
                        {form.form_name}
                      </td>
                      <td style={{ padding: "12px 16px", color: "#555" }}>
                        {form.category ?? "-"}
                      </td>
                      <td style={{ padding: "12px 16px" }}>
                        <IsoStandardBadge standard={form.iso_standard} />
                      </td>
                      <td style={{ padding: "12px 16px", color: "#888", textAlign: "right" }}>
                        {form.sort_order ?? "-"}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
