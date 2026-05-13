import Link from "next/link";
import { notFound } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { FormTemplate, FormRecord } from "@/types/form";
import AppLayout from "@/components/layout/AppLayoutServer";

interface Props {
  params: Promise<{ form_code: string }>;
}

const STATUS_LABEL: Record<string, { label: string; color: string; bg: string }> = {
  draft:     { label: "임시저장", color: "#E67700", bg: "#FFF9DB" },
  completed: { label: "완료",    color: "#2F9E44", bg: "#EBFBEE" },
  approved:  { label: "승인",    color: "#3B5BDB", bg: "#EEF2FF" },
};

export default async function FormRecordsPage({ params }: Props) {
  const { form_code } = await params;

  const [{ data: tmpl }, { data: records }] = await Promise.all([
    supabase.from("form_templates").select("form_name,category").eq("form_code", form_code).single(),
    supabase.from("form_records").select("*").eq("form_code", form_code).order("created_at", { ascending: false }),
  ]);

  if (!tmpl) notFound();

  const template = tmpl as Pick<FormTemplate, "form_name" | "category">;
  const list: FormRecord[] = (records ?? []) as FormRecord[];

  return (
    <AppLayout>
    <div style={{ padding: 24 }}>
      {/* 헤더 */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <div>
          <p style={{ margin: 0, fontSize: 12, color: "#bbb" }}>
            {form_code} · {template.category}
          </p>
          <h1 style={{ margin: "4px 0 0", fontSize: 18, fontWeight: 700, color: "#1a1a1a" }}>
            {template.form_name} 기록
          </h1>
        </div>
        <Link
          href={`/forms/${form_code}/new`}
          style={{
            padding: "8px 16px", borderRadius: 6, fontSize: 13, fontWeight: 600,
            background: "#3B5BDB", color: "#fff", textDecoration: "none",
          }}
          className="hover:bg-[#3451C7] transition-colors"
        >
          + 새 서식 작성
        </Link>
      </div>

      {/* 기록 테이블 */}
      <div style={{ background: "#fff", border: "1px solid #E5E5E5", borderRadius: 8, overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead>
            <tr style={{ background: "#F8F9FA", borderBottom: "1px solid #E5E5E5" }}>
              {["서식번호", "상태", "작성자", "작성일"].map(h => (
                <th key={h} style={{ padding: "10px 16px", textAlign: "left", fontWeight: 600, color: "#555", fontSize: 12 }}>
                  {h}
                </th>
              ))}
              <th style={{ padding: "10px 16px", width: 80 }} />
            </tr>
          </thead>
          <tbody>
            {list.length === 0 && (
              <tr>
                <td colSpan={5} style={{ padding: "40px 16px", textAlign: "center", color: "#bbb" }}>
                  작성된 서식 기록이 없습니다
                </td>
              </tr>
            )}
            {list.map((rec, i) => {
              const st = STATUS_LABEL[rec.status] ?? STATUS_LABEL.draft;
              return (
                <tr key={rec.id} style={{
                  borderBottom: i < list.length - 1 ? "1px solid #F5F5F5" : "none",
                }}>
                  <td style={{ padding: "12px 16px", fontWeight: 500, color: "#1a1a1a" }}>
                    {rec.record_number}
                  </td>
                  <td style={{ padding: "12px 16px" }}>
                    <span style={{
                      fontSize: 11, padding: "3px 8px", borderRadius: 8,
                      background: st.bg, color: st.color, fontWeight: 600,
                    }}>
                      {st.label}
                    </span>
                  </td>
                  <td style={{ padding: "12px 16px", color: "#555" }}>
                    {rec.created_by ?? "-"}
                  </td>
                  <td style={{ padding: "12px 16px", color: "#999" }}>
                    {rec.created_at.slice(0, 10)}
                  </td>
                  <td style={{ padding: "12px 16px" }}>
                    <Link
                      href={`/forms/${form_code}/records/${rec.id}`}
                      style={{
                        fontSize: 12, color: "#3B5BDB", textDecoration: "none",
                        fontWeight: 500,
                      }}
                      className="hover:underline"
                    >
                      보기
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* 뒤로 */}
      <div style={{ marginTop: 16 }}>
        <Link href="/forms" style={{ fontSize: 12, color: "#bbb", textDecoration: "none" }}
          className="hover:text-gray-500 transition-colors">
          ← 서식 라이브러리로
        </Link>
      </div>
    </div>
    </AppLayout>
  );
}
