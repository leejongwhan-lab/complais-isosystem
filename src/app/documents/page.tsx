import { Suspense } from "react";
import AppLayout from "@/components/layout/AppLayoutServer";
import DocumentRow from "@/components/documents/DocumentRow";
import DocumentsFilterSidebar from "@/components/documents/DocumentsFilterSidebar";
import DocumentsToolbar from "@/components/documents/DocumentsToolbar";
import { supabase } from "@/lib/supabase";
import { getUserProfile } from "@/lib/supabase-server";
import { canWrite } from "@/lib/permissions";
import type { Document } from "@/types/document";
import { ChevronLeft, ChevronRight } from "lucide-react";

function ContentSpinner() {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "calc(100vh - 56px)" }}>
      <div className="w-7 h-7 border-2 border-[#3B5BDB] border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

function ErrorState({ message }: { message: string }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 6, height: "calc(100vh - 56px)" }}>
      <p style={{ fontSize: 13, fontWeight: 600, color: "#E03131" }}>데이터 로드 실패</p>
      <p style={{ fontSize: 12, color: "#999" }}>{message}</p>
    </div>
  );
}

async function DocumentsContent({
  layer, type, status, q, mine,
}: {
  layer?: string; type?: string; status?: string; q?: string; mine?: string;
}) {
  const [allDocsRes, profile] = await Promise.all([
    supabase.from("documents").select("layer, doc_type, status"),
    getUserProfile(),
  ]);
  const { data: allDocs, error } = allDocsRes;
  const writeOk = canWrite(profile?.role ?? "viewer");

  if (error) return <ErrorState message={error.message} />;

  const all = (allDocs ?? []) as Pick<Document, "layer" | "doc_type" | "status">[];

  const layerCounts:  Record<string, number> = {};
  const typeCounts:   Record<string, number> = {};
  const statusCounts: Record<string, number> = {};
  const total = all.length;

  for (const doc of all) {
    layerCounts[doc.layer]    = (layerCounts[doc.layer]    ?? 0) + 1;
    typeCounts[doc.doc_type]  = (typeCounts[doc.doc_type]  ?? 0) + 1;
    statusCounts[doc.status]  = (statusCounts[doc.status]  ?? 0) + 1;
  }

  // Fetch filtered docs for table
  let query = supabase.from("documents").select("*").order("created_at", { ascending: false });
  if (layer)  query = query.eq("layer",    layer);
  if (type)   query = query.eq("doc_type", type);
  if (status) query = query.eq("status",   status);
  if (q)      query = query.or(`title.ilike.%${q}%,doc_number.ilike.%${q}%`);
  if (mine === "1" && profile?.full_name) query = query.eq("owner_name", profile.full_name);

  const { data: filteredData } = await query;
  const documents = (filteredData ?? []) as Document[];

  return (
    <div style={{ display: "flex", height: "calc(100vh - 56px)" }}>
      <DocumentsFilterSidebar
        layerCounts={layerCounts}
        typeCounts={typeCounts}
        statusCounts={statusCounts}
        total={total}
      />

      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <DocumentsToolbar total={documents.length} canWrite={writeOk} />

        {/* 테이블 */}
        <div style={{ flex: 1, overflowY: "auto", background: "#fff" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 900 }}>
            <thead style={{ position: "sticky", top: 0, zIndex: 10, background: "#FAFAFA", borderBottom: "1px solid #E5E5E5" }}>
              <tr>
                {["문서번호", "문서명", "레이어", "버전", "상태", "담당자", "최종수정", ""].map((col, i) => (
                  <th key={i} style={{
                    padding: "8px 14px", textAlign: "left",
                    fontSize: 11, fontWeight: 600, color: "#999", whiteSpace: "nowrap",
                  }}>
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {documents.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ padding: "48px 16px", textAlign: "center", color: "#bbb", fontSize: 13 }}>
                    조건에 맞는 문서가 없습니다
                  </td>
                </tr>
              ) : (
                documents.map((doc, i) => (
                  <DocumentRow key={doc.id} doc={doc} isLast={i === documents.length - 1} />
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* 페이지네이션 */}
        <div style={{
          background: "#fff", borderTop: "1px solid #E5E5E5",
          padding: "10px 16px", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0,
        }}>
          <span style={{ fontSize: 12, color: "#999" }}>
            총 <span style={{ fontWeight: 600, color: "#555" }}>{total}</span>건
            {(layer || type || status || q) && (
              <span style={{ marginLeft: 8 }}>
                (필터 결과: <span style={{ fontWeight: 600, color: "#3B5BDB" }}>{documents.length}</span>건)
              </span>
            )}
          </span>
          <div style={{ display: "flex", alignItems: "center", gap: 2 }}>
            <button disabled style={{ padding: 5, borderRadius: 4, border: "1px solid #E5E5E5", background: "#fff", cursor: "not-allowed", opacity: 0.4 }}>
              <ChevronLeft size={13} color="#999" />
            </button>
            <button style={{
              minWidth: 28, height: 28, padding: "0 8px", borderRadius: 4,
              border: "none", background: "#3B5BDB", color: "#fff",
              fontSize: 12, fontWeight: 600, cursor: "pointer",
            }}>
              1
            </button>
            <button disabled style={{ padding: 5, borderRadius: 4, border: "1px solid #E5E5E5", background: "#fff", cursor: "not-allowed", opacity: 0.4 }}>
              <ChevronRight size={13} color="#555" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default async function DocumentsPage({
  searchParams,
}: {
  searchParams: Promise<{ layer?: string; type?: string; status?: string; q?: string; mine?: string }>;
}) {
  const { layer, type, status, q, mine } = await searchParams;
  return (
    <AppLayout>
      <Suspense fallback={<ContentSpinner />}>
        <DocumentsContent layer={layer} type={type} status={status} q={q} mine={mine} />
      </Suspense>
    </AppLayout>
  );
}
