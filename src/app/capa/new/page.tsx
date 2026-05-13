"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AppLayout from "@/components/layout/AppLayout";
import { supabase } from "@/lib/supabase";

const INPUT_STYLE = {
  width: "100%", padding: "8px 12px", fontSize: 13,
  border: "1px solid #E5E5E5", borderRadius: 6,
  outline: "none", color: "#1a1a1a", background: "#fff",
  boxSizing: "border-box" as const,
};

export default function CapaNewPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    source:      "",
    grade:       "",
    title:       "",
    description: "",
    owner_name:  "",
    due_date:    "",
  });
  const [saving, setSaving] = useState(false);
  const [error,  setError]  = useState<string | null>(null);

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
        source:       form.source,
        grade:        form.grade || null,
        title:        form.title.trim(),
        description:  form.description.trim() || null,
        owner_name:   form.owner_name.trim() || null,
        due_date:     form.due_date || null,
        status:       "open",
        current_step: 0,
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
                <option value="내부심사">내부심사</option>
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
                <option value="A">A</option>
                <option value="B">B</option>
                <option value="C">C</option>
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

            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#555", marginBottom: 4 }}>담당자</label>
              <input
                type="text"
                value={form.owner_name}
                onChange={e => setForm(p => ({ ...p, owner_name: e.target.value }))}
                placeholder="담당자 이름"
                style={INPUT_STYLE}
                className="focus:border-[#3B5BDB] transition-colors placeholder:text-[#bbb]"
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
