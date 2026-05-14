"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import AppLayout from "@/components/layout/AppLayout";
import { supabase } from "@/lib/supabase";
import UserPicker from "@/components/common/UserPicker";
import { Search, X } from "lucide-react";

const INPUT_STYLE = {
  width: "100%", padding: "8px 12px", fontSize: 13,
  border: "1px solid #E5E5E5", borderRadius: 6,
  outline: "none", color: "#1a1a1a", background: "#fff",
  boxSizing: "border-box" as const,
};

type DocResult = { id: string; doc_number: string; title: string };

function CAPANewContent() {
  const router       = useRouter();
  const searchParams = useSearchParams();

  // query params (from audit → CAPA)
  const qSource   = searchParams.get("source");
  const qAuditId  = searchParams.get("audit_id") ?? "";
  const qAuditNo  = searchParams.get("audit_no") ?? "";
  const qTitle    = searchParams.get("title") ?? "";
  const qGrade    = searchParams.get("grade") ?? "";

  const [companyId, setCompanyId] = useState("");
  const [form, setForm] = useState({
    source:      qSource === "audit" ? "내부심사 지적" : "",
    grade:       qGrade || "",
    title:       qTitle,
    description: "",
    owner_name:  "",
    due_date:    "",
  });

  // related document search
  const [docQuery,    setDocQuery]    = useState("");
  const [docResults,  setDocResults]  = useState<DocResult[]>([]);
  const [selectedDoc, setSelectedDoc] = useState<DocResult | null>(null);
  const [showDocDrop, setShowDocDrop] = useState(false);
  const docDebounce = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [saving, setSaving] = useState(false);
  const [error,  setError]  = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) return;
      const { data: profile } = await supabase.from("profiles").select("company_id, full_name").eq("id", user.id).single();
      if (profile?.company_id) setCompanyId(profile.company_id as string);
      if (profile?.full_name) setForm(p => ({ ...p, owner_name: (profile.full_name as string) || p.owner_name }));
    });
  }, []);

  useEffect(() => {
    if (!docQuery.trim()) { setDocResults([]); setShowDocDrop(false); return; }
    if (docDebounce.current) clearTimeout(docDebounce.current);
    docDebounce.current = setTimeout(async () => {
      const { data } = await supabase
        .from("documents")
        .select("id, doc_number, title")
        .or(`doc_number.ilike.%${docQuery}%,title.ilike.%${docQuery}%`)
        .limit(6);
      setDocResults((data ?? []) as DocResult[]);
      setShowDocDrop(true);
    }, 300);
    return () => { if (docDebounce.current) clearTimeout(docDebounce.current); };
  }, [docQuery]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title.trim() || !form.source) {
      setError("발생원과 제목을 입력해주세요.");
      return;
    }
    setSaving(true);
    setError(null);

    const { data, error: err } = await supabase
      .from("capas")
      .insert({
        source:           form.source,
        grade:            form.grade || null,
        title:            form.title.trim(),
        description:      form.description.trim() || null,
        owner_name:       form.owner_name.trim() || null,
        due_date:         form.due_date || null,
        related_doc_id:   selectedDoc?.id ?? null,
        related_audit_id: qAuditId || null,
        status:           "open",
        current_step:     0,
      })
      .select()
      .single();

    setSaving(false);
    if (err) { setError(err.message); return; }
    router.push(`/capa/${data.id}`);
  }

  return (
    <AppLayout>
      <div style={{ display: "flex", justifyContent: "center", padding: "40px 24px", background: "#fff", minHeight: "calc(100vh - 56px)" }}>
        <div style={{ width: "100%", maxWidth: 520 }}>

          <div style={{ marginBottom: 28 }}>
            <h1 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: "#1a1a1a" }}>CAPA 등록</h1>
            <p style={{ margin: "4px 0 0", fontSize: 13, color: "#999" }}>새 시정 및 예방조치를 등록합니다.</p>
          </div>

          {/* 심사 연계 배너 */}
          {qAuditNo && (
            <div style={{ marginBottom: 20, padding: "10px 14px", background: "#EEF2FF", border: "1px solid #C5D0FF", borderRadius: 8, display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 12, color: "#3B5BDB", fontWeight: 600 }}>🔗 내부심사 연계</span>
              <span style={{ fontFamily: "monospace", fontSize: 12, color: "#3B5BDB" }}>{qAuditNo}</span>
              <span style={{ fontSize: 12, color: "#555", flex: 1 }}>부적합 지적사항에서 자동 연결됩니다.</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>

            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#555", marginBottom: 4 }}>발생원 *</label>
              <select
                value={form.source}
                onChange={e => setForm(p => ({ ...p, source: e.target.value }))}
                style={INPUT_STYLE}
                className="focus:border-[#3B5BDB] transition-colors"
              >
                <option value="">선택하세요</option>
                <option value="고객클레임">고객클레임</option>
                <option value="내부심사 지적">내부심사 지적</option>
                <option value="공정불량">공정불량</option>
                <option value="외부심사">외부심사</option>
                <option value="기타">기타</option>
              </select>
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#555", marginBottom: 4 }}>등급</label>
              <select
                value={form.grade}
                onChange={e => setForm(p => ({ ...p, grade: e.target.value }))}
                style={INPUT_STYLE}
                className="focus:border-[#3B5BDB] transition-colors"
              >
                <option value="">선택하세요</option>
                <option value="A">A — 즉각 대응 (72h 이내 D3)</option>
                <option value="B">B — 우선 처리 (1주 이내 D3)</option>
                <option value="C">C — 정기 처리 (1개월 이내)</option>
              </select>
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#555", marginBottom: 4 }}>제목 *</label>
              <input
                type="text"
                value={form.title}
                onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
                placeholder="CAPA 제목을 입력하세요"
                style={INPUT_STYLE}
                className="focus:border-[#3B5BDB] transition-colors placeholder:text-[#bbb]"
              />
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#555", marginBottom: 4 }}>발생 내용</label>
              <textarea
                value={form.description}
                onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
                placeholder="발생 내용을 상세히 입력하세요"
                rows={4}
                style={{ ...INPUT_STYLE, resize: "vertical" }}
                className="focus:border-[#3B5BDB] transition-colors placeholder:text-[#bbb]"
              />
            </div>

            {/* 관련 문서 검색 */}
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#555", marginBottom: 4 }}>관련 문서</label>
              {selectedDoc ? (
                <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "7px 10px", border: "1px solid #C5D0FF", borderRadius: 6, background: "#EEF2FF" }}>
                  <span style={{ fontFamily: "monospace", fontSize: 11, fontWeight: 700, color: "#3B5BDB" }}>{selectedDoc.doc_number}</span>
                  <span style={{ fontSize: 13, color: "#1a1a1a", flex: 1 }}>{selectedDoc.title}</span>
                  <button type="button" onClick={() => setSelectedDoc(null)} style={{ border: "none", background: "none", cursor: "pointer", padding: 2 }}>
                    <X size={14} color="#9CA3AF" />
                  </button>
                </div>
              ) : (
                <div style={{ position: "relative" }}>
                  <div style={{ position: "relative" }}>
                    <Search size={13} style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "#9CA3AF" }} />
                    <input
                      type="text"
                      value={docQuery}
                      onChange={e => setDocQuery(e.target.value)}
                      onFocus={() => docResults.length && setShowDocDrop(true)}
                      placeholder="문서번호 또는 문서명 검색..."
                      style={{ ...INPUT_STYLE, paddingLeft: 30 }}
                      className="focus:border-[#3B5BDB] transition-colors placeholder:text-[#bbb]"
                    />
                  </div>
                  {showDocDrop && docResults.length > 0 && (
                    <div style={{ position: "absolute", top: "100%", left: 0, right: 0, zIndex: 100, background: "#fff", border: "1px solid #E5E5E5", borderRadius: 6, boxShadow: "0 4px 12px rgba(0,0,0,0.1)", marginTop: 2 }}>
                      {docResults.map(doc => (
                        <button
                          key={doc.id}
                          type="button"
                          onClick={() => { setSelectedDoc(doc); setDocQuery(""); setShowDocDrop(false); }}
                          style={{ display: "flex", gap: 8, alignItems: "center", width: "100%", padding: "8px 12px", border: "none", background: "none", cursor: "pointer", textAlign: "left" }}
                          className="hover:bg-[#F9FAFB] transition-colors"
                        >
                          <span style={{ fontFamily: "monospace", fontSize: 11, fontWeight: 700, color: "#3B5BDB", flexShrink: 0 }}>{doc.doc_number}</span>
                          <span style={{ fontSize: 12, color: "#374151", flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{doc.title}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#555", marginBottom: 4 }}>담당자</label>
              <UserPicker
                value={form.owner_name}
                onChange={name => setForm(p => ({ ...p, owner_name: name }))}
                placeholder="담당자 이름"
                companyId={companyId}
              />
            </div>

            <div style={{ marginBottom: 28 }}>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#555", marginBottom: 4 }}>마감일</label>
              <input
                type="date"
                value={form.due_date}
                onChange={e => setForm(p => ({ ...p, due_date: e.target.value }))}
                style={INPUT_STYLE}
                className="focus:border-[#3B5BDB] transition-colors"
              />
            </div>

            {error && (
              <p style={{ marginBottom: 16, fontSize: 12, color: "#E03131" }}>{error}</p>
            )}

            <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
              <button
                type="button"
                onClick={() => router.back()}
                style={{
                  padding: "8px 18px", borderRadius: 6, cursor: "pointer",
                  fontSize: 13, fontWeight: 500, color: "#555",
                  border: "1px solid #E5E5E5", background: "#fff",
                }}
                className="hover:bg-[#F5F5F5] transition-colors"
              >
                취소
              </button>
              <button
                type="submit"
                disabled={saving}
                style={{
                  padding: "8px 18px", borderRadius: 6,
                  cursor: saving ? "not-allowed" : "pointer",
                  fontSize: 13, fontWeight: 600, color: "#fff",
                  border: "none", background: saving ? "#C5D0FF" : "#3B5BDB",
                }}
                className={saving ? "" : "hover:opacity-90 transition-opacity"}
              >
                {saving ? "저장 중..." : "저장"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </AppLayout>
  );
}

export default function CapaNewPage() {
  return (
    <Suspense fallback={<div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh" }}>로딩 중...</div>}>
      <CAPANewContent />
    </Suspense>
  );
}
