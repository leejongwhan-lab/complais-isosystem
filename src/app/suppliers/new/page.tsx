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

export default function SupplierNewPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    company_name:         "",
    category:             "",
    iso_certified:        false,
    contact:              "",
    next_evaluation_date: "",
  });
  const [saving, setSaving] = useState(false);
  const [error,  setError]  = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.company_name.trim() || !form.category.trim()) {
      setError("업체명과 주요 품목을 입력해주세요.");
      return;
    }
    setSaving(true);
    setError(null);

    const { data, error: err } = await supabase
      .from("suppliers")
      .insert({
        company_name:         form.company_name.trim(),
        category:             form.category.trim(),
        iso_certified:        form.iso_certified,
        contact:              form.contact.trim() || null,
        next_evaluation_date: form.next_evaluation_date || null,
        status:               "pending",
        grade:                "C",
        total_score:          0,
        quality_score:        0,
        delivery_score:       0,
        price_score:          0,
        cooperation_score:    0,
      })
      .select()
      .single();

    setSaving(false);
    if (err) { setError(err.message); return; }
    router.push(`/suppliers/${data.id}`);
  }

  return (
    <AppLayout>
      <div style={{ display: "flex", justifyContent: "center", padding: "40px 24px", background: "#fff", minHeight: "calc(100vh - 56px)" }}>
        <div style={{ width: "100%", maxWidth: 520 }}>

          <div style={{ marginBottom: 28 }}>
            <h1 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: "#1a1a1a" }}>공급자 등록</h1>
            <p style={{ margin: "4px 0 0", fontSize: 13, color: "#999" }}>새 공급업체를 등록합니다. 등급과 점수는 최초 평가 후 업데이트됩니다.</p>
          </div>

          <form onSubmit={handleSubmit}>

            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#555", marginBottom: 4 }}>업체명 *</label>
              <input
                type="text"
                value={form.company_name}
                onChange={e => setForm(p => ({ ...p, company_name: e.target.value }))}
                placeholder="(주)한국정밀"
                style={INPUT_STYLE}
                className="focus:border-[#3B5BDB] transition-colors placeholder:text-[#bbb]"
              />
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#555", marginBottom: 4 }}>주요 품목/카테고리 *</label>
              <input
                type="text"
                value={form.category}
                onChange={e => setForm(p => ({ ...p, category: e.target.value }))}
                placeholder="기계부품, 전자부품, 원자재 등"
                style={INPUT_STYLE}
                className="focus:border-[#3B5BDB] transition-colors placeholder:text-[#bbb]"
              />
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#555", marginBottom: 4 }}>담당자 연락처</label>
              <input
                type="text"
                value={form.contact}
                onChange={e => setForm(p => ({ ...p, contact: e.target.value }))}
                placeholder="031-000-0000"
                style={INPUT_STYLE}
                className="focus:border-[#3B5BDB] transition-colors placeholder:text-[#bbb]"
              />
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#555", marginBottom: 4 }}>최초 평가 예정일</label>
              <input
                type="date"
                value={form.next_evaluation_date}
                onChange={e => setForm(p => ({ ...p, next_evaluation_date: e.target.value }))}
                style={INPUT_STYLE}
                className="focus:border-[#3B5BDB] transition-colors"
              />
            </div>

            <div style={{ marginBottom: 28 }}>
              <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
                <input
                  type="checkbox"
                  checked={form.iso_certified}
                  onChange={e => setForm(p => ({ ...p, iso_certified: e.target.checked }))}
                  style={{ width: 15, height: 15, accentColor: "#3B5BDB" }}
                />
                <span style={{ fontSize: 13, color: "#555" }}>ISO 인증 보유</span>
              </label>
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
