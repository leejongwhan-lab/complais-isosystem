"use client";
import { useState, useEffect } from "react";
import { Search, X, Plus } from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import type { RelatedFormsData } from "@/types/sections";

interface Props { data: RelatedFormsData; onChange: (d: RelatedFormsData) => void; readonly?: boolean }

type FormResult = { id: string; form_code: string; title: string };

export default function SectionRelatedForms({ data, onChange, readonly = false }: Props) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<FormResult[]>([]);
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    if (!query.trim()) { setResults([]); return; }
    const t = setTimeout(async () => {
      setSearching(true);
      const { data: rows } = await supabase.from("form_templates").select("id, form_code, title")
        .or(`title.ilike.%${query}%,form_code.ilike.%${query}%`)
        .limit(8);
      setResults((rows ?? []) as FormResult[]);
      setSearching(false);
    }, 300);
    return () => clearTimeout(t);
  }, [query]);

  const addForm = (form: FormResult) => {
    if (data.forms.some(f => f.id === form.id)) return;
    onChange({ forms: [...data.forms, form] });
    setQuery("");
    setResults([]);
  };
  const removeForm = (id: string) => onChange({ forms: data.forms.filter(f => f.id !== id) });

  return (
    <div>
      {!readonly && (
        <div style={{ position: "relative", marginBottom: 10 }}>
          <Search size={13} color="#9CA3AF" style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)" }} />
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="서식 코드 또는 제목으로 검색..."
            style={{ width: "100%", padding: "7px 10px 7px 30px", fontSize: 13, border: "1px solid #E5E7EB", borderRadius: 8, outline: "none", boxSizing: "border-box" }}
          />
          {results.length > 0 && (
            <div style={{ position: "absolute", top: "100%", left: 0, right: 0, background: "#fff", border: "1px solid #E5E7EB", borderRadius: 8, boxShadow: "0 4px 16px rgba(0,0,0,0.08)", zIndex: 20 }}>
              {results.map(form => (
                <button key={form.id} onClick={() => addForm(form)} style={{ display: "flex", alignItems: "center", gap: 8, width: "100%", padding: "8px 12px", border: "none", background: "none", cursor: "pointer", textAlign: "left" }}
                  className="hover:bg-[#F9FAFB] transition-colors"
                >
                  <span style={{ fontFamily: "monospace", fontSize: 11, fontWeight: 700, color: "#7C3AED" }}>{form.form_code}</span>
                  <span style={{ fontSize: 13, color: "#374151" }}>{form.title}</span>
                </button>
              ))}
              {searching && <div style={{ padding: "8px 12px", fontSize: 12, color: "#9CA3AF" }}>검색 중...</div>}
            </div>
          )}
        </div>
      )}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
        {data.forms.length === 0 && readonly && <span style={{ fontSize: 13, color: "#9CA3AF", fontStyle: "italic" }}>연결된 서식 없음</span>}
        {data.forms.map(form => (
          <div key={form.id} style={{ display: "flex", alignItems: "center", gap: 6, padding: "5px 10px", border: "1px solid #EDE9FE", borderRadius: 6, background: "#F5F3FF" }}>
            <span style={{ fontFamily: "monospace", fontSize: 11, fontWeight: 700, color: "#7C3AED" }}>{form.form_code}</span>
            <span style={{ fontSize: 13, color: "#5B21B6" }}>{form.title}</span>
            <Link href={`/forms/${form.form_code}/new`} target="_blank" style={{ display: "flex", alignItems: "center", gap: 3, fontSize: 10, fontWeight: 600, color: "#7C3AED", textDecoration: "none", padding: "1px 5px", borderRadius: 3, background: "#EDE9FE" }}>
              <Plus size={9} /> 작성
            </Link>
            {!readonly && <button onClick={() => removeForm(form.id)} style={{ border: "none", background: "none", cursor: "pointer", display: "flex", padding: 0 }}><X size={11} color="#C4B5FD" /></button>}
          </div>
        ))}
      </div>
    </div>
  );
}
