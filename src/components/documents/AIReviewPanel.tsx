"use client";

import { useState } from "react";
import { Sparkles } from "lucide-react";

type SectionProp = { section_title: string; content: string | null };

export default function AIReviewPanel({
  title,
  isoClause,
  sections,
}: {
  title: string;
  isoClause: string | null;
  sections: SectionProp[];
}) {
  const [loading, setLoading]         = useState(false);
  const [suggestions, setSuggestions] = useState<string[] | null>(null);
  const [error, setError]             = useState<string | null>(null);

  const handleAnalyze = async () => {
    setLoading(true);
    setError(null);
    setSuggestions(null);
    try {
      const res = await fetch("/api/ai/review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          isoClause,
          sections: sections.map(s => ({ title: s.section_title, content: s.content ?? "" })),
        }),
      });
      const json = await res.json() as { suggestions?: string[]; error?: string };
      if (!res.ok) throw new Error(json.error ?? "분석 실패");
      setSuggestions(json.suggestions ?? []);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "알 수 없는 오류");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "16px", borderTop: "1px solid #F0F0F0" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
        <p style={{ margin: 0, fontSize: 10, fontWeight: 600, color: "#bbb", textTransform: "uppercase", letterSpacing: "0.06em" }}>
          AI 개선 제안
        </p>
        <button
          onClick={handleAnalyze}
          disabled={loading}
          style={{
            display: "flex", alignItems: "center", gap: 4,
            padding: "3px 8px", borderRadius: 4, cursor: loading ? "not-allowed" : "pointer",
            fontSize: 11, fontWeight: 600, color: "#7048E8",
            border: "1px solid #D4BFFF", background: "#F3F0FF",
            opacity: loading ? 0.6 : 1,
          }}
          className="hover:opacity-80 transition-opacity"
        >
          {loading ? (
            <div className="w-3 h-3 border border-[#7048E8] border-t-transparent rounded-full animate-spin" />
          ) : (
            <Sparkles size={10} />
          )}
          {loading ? "분석 중..." : "분석"}
        </button>
      </div>

      {error && (
        <p style={{ margin: 0, fontSize: 11, color: "#E03131" }}>{error}</p>
      )}

      {suggestions !== null && suggestions.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {suggestions.map((s, i) => (
            <div key={i} style={{
              padding: "8px 10px", background: "#F9F7FF",
              border: "1px solid #E9E3FF", borderRadius: 6,
              fontSize: 11, color: "#555", lineHeight: 1.5,
            }}>
              <span style={{ fontWeight: 600, color: "#7048E8", marginRight: 4 }}>{i + 1}.</span>
              {s}
            </div>
          ))}
        </div>
      )}

      {suggestions !== null && suggestions.length === 0 && !error && (
        <p style={{ margin: 0, fontSize: 11, color: "#bbb" }}>개선 제안이 없습니다.</p>
      )}

      {suggestions === null && !loading && !error && (
        <p style={{ margin: 0, fontSize: 11, color: "#bbb" }}>분석 버튼을 클릭하면 AI가 문서를 검토합니다.</p>
      )}
    </div>
  );
}
