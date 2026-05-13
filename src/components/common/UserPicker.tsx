"use client";

import { useState, useEffect, useRef } from "react";
import { supabase } from "@/lib/supabase";

type Profile = { id: string; full_name: string; department: string | null };

interface UserPickerProps {
  value: string;
  onChange: (name: string) => void;
  placeholder?: string;
  companyId: string;
}

export default function UserPicker({ value, onChange, placeholder = "이름 입력 또는 선택", companyId }: UserPickerProps) {
  const [open, setOpen] = useState(false);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [search, setSearch] = useState("");
  const [myId, setMyId] = useState<string | null>(null);
  const [myName, setMyName] = useState<string>("");
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!companyId) return;
    supabase
      .from("profiles")
      .select("id, full_name, department")
      .eq("company_id", companyId)
      .order("full_name")
      .then(({ data }) => setProfiles((data ?? []) as Profile[]));

    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return;
      setMyId(user.id);
      supabase.from("profiles").select("full_name").eq("id", user.id).single()
        .then(({ data }) => { if (data) setMyName((data as { full_name: string }).full_name ?? ""); });
    });
  }, [companyId]);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
        setSearch("");
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  const filtered = profiles.filter(p =>
    p.full_name.toLowerCase().includes(search.toLowerCase())
  );

  function pick(name: string) {
    onChange(name);
    setOpen(false);
    setSearch("");
  }

  const inputStyle: React.CSSProperties = {
    width: "100%", padding: "8px 10px", fontSize: 13,
    border: "1px solid #E5E5E5", borderRadius: 6,
    outline: "none", color: "#1a1a1a", background: "#fff",
    boxSizing: "border-box",
  };

  return (
    <div ref={containerRef} style={{ position: "relative" }}>
      <div style={{ display: "flex", gap: 6 }}>
        <input
          type="text"
          value={value}
          onChange={e => onChange(e.target.value)}
          onFocus={() => setOpen(true)}
          placeholder={placeholder}
          style={inputStyle}
          className="focus:border-[#3B5BDB] transition-colors placeholder:text-[#bbb]"
          autoComplete="off"
        />
        {myName && (
          <button
            type="button"
            onClick={() => pick(myName)}
            title="내 이름 입력"
            style={{
              flexShrink: 0, padding: "0 10px", borderRadius: 6, fontSize: 12, fontWeight: 600,
              border: "1px solid #C5D0FF", background: value === myName ? "#EEF2FF" : "#F8F9FF",
              color: "#3B5BDB", cursor: "pointer", whiteSpace: "nowrap",
            }}
            className="hover:bg-[#EEF2FF] transition-colors"
          >
            나
          </button>
        )}
      </div>

      {open && (
        <div style={{
          position: "absolute", top: "calc(100% + 4px)", left: 0, right: 0,
          background: "#fff", border: "1px solid #E5E5E5", borderRadius: 8,
          boxShadow: "0 4px 16px rgba(0,0,0,0.08)", zIndex: 100,
          maxHeight: 240, overflow: "hidden", display: "flex", flexDirection: "column",
        }}>
          <div style={{ padding: "8px 10px", borderBottom: "1px solid #F0F0F0", flexShrink: 0 }}>
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="이름 검색..."
              style={{ ...inputStyle, padding: "5px 8px", fontSize: 12, border: "1px solid #E5E5E5" }}
              autoFocus
            />
          </div>
          <div style={{ overflowY: "auto" }}>
            {filtered.length === 0 && (
              <div style={{ padding: "14px 12px", fontSize: 12, color: "#bbb", textAlign: "center" }}>
                {profiles.length === 0 ? "직원 정보가 없습니다" : "검색 결과 없음"}
              </div>
            )}
            {filtered.map(p => {
              const isMe = p.id === myId;
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => pick(p.full_name)}
                  style={{
                    display: "flex", alignItems: "center", gap: 10, width: "100%",
                    padding: "8px 12px", border: "none", background: value === p.full_name ? "#EEF2FF" : "transparent",
                    cursor: "pointer", textAlign: "left",
                  }}
                  className="hover:bg-[#F5F5F5] transition-colors"
                >
                  <div style={{
                    width: 28, height: 28, borderRadius: "50%", flexShrink: 0,
                    background: isMe ? "#EEF2FF" : "#F0F0F0",
                    color: isMe ? "#3B5BDB" : "#777",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 12, fontWeight: 700,
                  }}>
                    {p.full_name.charAt(0) || "?"}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                      <span style={{ fontSize: 13, fontWeight: 500, color: "#1a1a1a" }}>{p.full_name}</span>
                      {isMe && (
                        <span style={{ fontSize: 10, fontWeight: 700, color: "#3B5BDB", background: "#EEF2FF", padding: "1px 5px", borderRadius: 4 }}>나</span>
                      )}
                    </div>
                    {p.department && (
                      <span style={{ fontSize: 11, color: "#999" }}>{p.department}</span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
