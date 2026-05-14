"use client";
import { useState, useEffect } from "react";
import { Search, X, ExternalLink } from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import type { RelatedDocsData } from "@/types/sections";

interface Props { data: RelatedDocsData; onChange: (d: RelatedDocsData) => void; readonly?: boolean }

type DocResult = { id: string; doc_number: string; title: string };

export default function SectionRelatedDocs({ data, onChange, readonly = false }: Props) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<DocResult[]>([]);
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    if (!query.trim()) { setResults([]); return; }
    const t = setTimeout(async () => {
      setSearching(true);
      const { data: rows } = await supabase.from("documents").select("id, doc_number, title")
        .or(`title.ilike.%${query}%,doc_number.ilike.%${query}%`)
        .limit(8);
      setResults((rows ?? []) as DocResult[]);
      setSearching(false);
    }, 300);
    return () => clearTimeout(t);
  }, [query]);

  const addDoc = (doc: DocResult) => {
    if (data.docs.some(d => d.id === doc.id)) return;
    onChange({ docs: [...data.docs, doc] });
    setQuery("");
    setResults([]);
  };
  const removeDoc = (id: string) => onChange({ docs: data.docs.filter(d => d.id !== id) });

  return (
    <div>
      {!readonly && (
        <div style={{ position: "relative", marginBottom: 10 }}>
          <Search size={13} color="#9CA3AF" style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)" }} />
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="문서번호 또는 제목으로 검색..."
            style={{ width: "100%", padding: "7px 10px 7px 30px", fontSize: 13, border: "1px solid #E5E7EB", borderRadius: 8, outline: "none", boxSizing: "border-box" }}
          />
          {results.length > 0 && (
            <div style={{ position: "absolute", top: "100%", left: 0, right: 0, background: "#fff", border: "1px solid #E5E7EB", borderRadius: 8, boxShadow: "0 4px 16px rgba(0,0,0,0.08)", zIndex: 20 }}>
              {results.map(doc => (
                <button key={doc.id} onClick={() => addDoc(doc)} style={{ display: "flex", alignItems: "center", gap: 8, width: "100%", padding: "8px 12px", border: "none", background: "none", cursor: "pointer", textAlign: "left" }}
                  className="hover:bg-[#F9FAFB] transition-colors"
                >
                  <span style={{ fontFamily: "monospace", fontSize: 11, fontWeight: 700, color: "#2563EB" }}>{doc.doc_number}</span>
                  <span style={{ fontSize: 13, color: "#374151" }}>{doc.title}</span>
                </button>
              ))}
              {searching && <div style={{ padding: "8px 12px", fontSize: 12, color: "#9CA3AF" }}>검색 중...</div>}
            </div>
          )}
        </div>
      )}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
        {data.docs.length === 0 && readonly && <span style={{ fontSize: 13, color: "#9CA3AF", fontStyle: "italic" }}>연결된 문서 없음</span>}
        {data.docs.map(doc => (
          <div key={doc.id} style={{ display: "flex", alignItems: "center", gap: 6, padding: "5px 10px", border: "1px solid #DBEAFE", borderRadius: 6, background: "#EFF6FF" }}>
            <span style={{ fontFamily: "monospace", fontSize: 11, fontWeight: 700, color: "#2563EB" }}>{doc.doc_number}</span>
            <span style={{ fontSize: 13, color: "#1E40AF" }}>{doc.title}</span>
            <Link href={`/documents/${doc.id}`} target="_blank" style={{ color: "#93C5FD", display: "flex" }}><ExternalLink size={11} /></Link>
            {!readonly && <button onClick={() => removeDoc(doc.id)} style={{ border: "none", background: "none", cursor: "pointer", display: "flex", padding: 0 }}><X size={11} color="#93C5FD" /></button>}
          </div>
        ))}
      </div>
    </div>
  );
}
