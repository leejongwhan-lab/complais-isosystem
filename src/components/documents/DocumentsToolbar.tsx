"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, Plus } from "lucide-react";
import { useRef } from "react";

export default function DocumentsToolbar({ total, canWrite = false }: { total: number; canWrite?: boolean }) {
  const router = useRouter();
  const sp = useSearchParams();
  const currentQ = sp.get("q") ?? "";
  const isMine = sp.get("mine") === "1";
  const debounceRef = useRef<number | null>(null);

  function toggleMine() {
    const params = new URLSearchParams(sp.toString());
    if (isMine) params.delete("mine");
    else params.set("mine", "1");
    router.push(`/documents?${params.toString()}`);
  }

  function navigateWithQuery(q: string) {
    const params = new URLSearchParams(sp.toString());
    if (q) params.set("q", q);
    else params.delete("q");
    router.push(`/documents?${params.toString()}`);
  }

  function scheduleSearch(q: string) {
    if (debounceRef.current) window.clearTimeout(debounceRef.current);
    debounceRef.current = window.setTimeout(() => {
      navigateWithQuery(q);
    }, 250);
  }

  return (
    <div style={{
      background: "#fff", borderBottom: "1px solid #E5E5E5",
      padding: "10px 16px", display: "flex", alignItems: "center", gap: 8, flexShrink: 0,
    }}>
      <div style={{ position: "relative" }}>
        <Search size={13} color="#bbb" style={{ position: "absolute", left: 9, top: "50%", transform: "translateY(-50%)" }} />
        <input
          key={currentQ}
          type="text"
          defaultValue={currentQ}
          placeholder="문서번호, 제목 검색..."
          onChange={e => scheduleSearch(e.target.value)}
          onKeyDown={e => {
            if (e.key === "Enter") navigateWithQuery((e.currentTarget as HTMLInputElement).value);
          }}
          style={{
            paddingLeft: 28, paddingRight: 12, paddingTop: 6, paddingBottom: 6,
            fontSize: 13, background: "#fff",
            border: "1px solid #E5E5E5", borderRadius: 6,
            width: 220, outline: "none", color: "#1a1a1a",
          }}
          className="focus:border-[#3B5BDB] transition-colors placeholder:text-[#bbb]"
        />
      </div>

      <button
        onClick={toggleMine}
        style={{
          padding: "5px 10px", borderRadius: 4, cursor: "pointer",
          fontSize: 12, fontWeight: isMine ? 600 : 400,
          border: isMine ? "1px solid #3B5BDB" : "1px solid #E5E5E5",
          background: isMine ? "#EEF2FF" : "#fff",
          color: isMine ? "#3B5BDB" : "#555",
        }}
      >
        {isMine ? "✓ 내 문서" : "내 문서만"}
      </button>

      <span style={{ fontSize: 12, color: "#bbb" }}>
        총 <span style={{ fontWeight: 600, color: "#555" }}>{total}</span>건
      </span>

      <div style={{ flex: 1 }} />

      {canWrite && (
        <Link
          href="/documents/new"
          style={{
            display: "flex", alignItems: "center", gap: 5,
            padding: "5px 12px", borderRadius: 6, textDecoration: "none",
            fontSize: 12, fontWeight: 600, color: "#fff", background: "#3B5BDB",
          }}
          className="hover:opacity-90 transition-opacity"
        >
          <Plus size={13} />
          신규문서
        </Link>
      )}
    </div>
  );
}
