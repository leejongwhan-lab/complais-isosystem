"use client";

import { useState } from "react";
import { Sparkles } from "lucide-react";

const TEXTAREA_STYLE: React.CSSProperties = {
  width: "100%", padding: "7px 10px",
  fontSize: 12, color: "#1a1a1a",
  border: "1px solid #E5E5E5", borderRadius: 6,
  background: "#fff", outline: "none",
  boxSizing: "border-box", resize: "vertical", lineHeight: 1.6,
};

export default function CAPAFiveWhyPanel({
  description,
  source,
}: {
  description: string;
  source: string;
}) {
  const [whys, setWhys]   = useState<string[]>(["", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState<string | null>(null);

  const handleAI = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/ai/capa-analysis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description, source }),
      });
      const json = await res.json() as { whys?: string[]; error?: string };
      if (!res.ok) throw new Error(json.error ?? "분석 실패");
      const result = json.whys ?? [];
      setWhys([
        result[0] ?? "",
        result[1] ?? "",
        result[2] ?? "",
        result[3] ?? "",
        result[4] ?? "",
      ]);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "알 수 없는 오류");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ marginTop: 12, padding: "14px 16px", background: "#F9F7FF", border: "1px solid #E9E3FF", borderRadius: 8 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
        <p style={{ margin: 0, fontSize: 12, fontWeight: 700, color: "#7048E8" }}>5-Why 근본원인 분석</p>
        <button
          onClick={handleAI}
          disabled={loading}
          style={{
            display: "flex", alignItems: "center", gap: 4,
            padding: "3px 8px", borderRadius: 4, cursor: loading ? "not-allowed" : "pointer",
            fontSize: 11, fontWeight: 600, color: "#7048E8",
            border: "1px solid #D4BFFF", background: "#fff",
            opacity: loading ? 0.6 : 1,
          }}
          className="hover:opacity-80 transition-opacity"
        >
          {loading ? (
            <div className="w-3 h-3 border border-[#7048E8] border-t-transparent rounded-full animate-spin" />
          ) : (
            <Sparkles size={10} />
          )}
          {loading ? "분석 중..." : "AI 자동 분석"}
        </button>
      </div>

      {error && <p style={{ margin: "0 0 8px", fontSize: 11, color: "#E03131" }}>{error}</p>}

      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {whys.map((w, i) => (
          <div key={i}>
            <label style={{ display: "block", marginBottom: 4, fontSize: 11, fontWeight: 600, color: "#7048E8" }}>
              Why {i + 1}
            </label>
            <textarea
              rows={2}
              value={w}
              onChange={e => {
                const idx = i;
                setWhys(prev => { const n = [...prev]; n[idx] = e.target.value; return n; });
              }}
              placeholder={`${i + 1}번째 Why를 입력하세요...`}
              style={TEXTAREA_STYLE}
              className="focus:border-[#7048E8] transition-colors placeholder:text-[#bbb]"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
