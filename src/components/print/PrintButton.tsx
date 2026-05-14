"use client";

import { useState, useRef, useEffect } from "react";
import { Printer, ChevronDown, Eye, Settings } from "lucide-react";

export default function PrintButton({ label = "인쇄" }: { label?: string }) {
  const [open, setOpen] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <>
      <div ref={ref} style={{ position: "relative" }}>
        {/* Main button with dropdown arrow */}
        <div style={{ display: "flex", borderRadius: 6, overflow: "hidden", border: "1px solid #E5E5E5" }}>
          <button
            onClick={() => window.print()}
            className="no-print hover:bg-[#F5F5F5] transition-colors"
            style={{
              display: "flex", alignItems: "center", gap: 5,
              padding: "5px 10px",
              fontSize: 12, fontWeight: 500, color: "#555",
              border: "none", background: "#fff", cursor: "pointer",
              borderRight: "1px solid #E5E5E5",
            }}
          >
            <Printer size={12} color="#999" />
            {label}
          </button>
          <button
            onClick={() => setOpen(v => !v)}
            className="no-print hover:bg-[#F5F5F5] transition-colors"
            style={{
              padding: "5px 7px", border: "none", background: "#fff",
              cursor: "pointer", display: "flex", alignItems: "center",
            }}
          >
            <ChevronDown size={11} color="#999" />
          </button>
        </div>

        {/* Dropdown */}
        {open && (
          <div style={{
            position: "absolute", top: "calc(100% + 4px)", right: 0,
            background: "#fff", border: "1px solid #E5E5E5", borderRadius: 8,
            boxShadow: "0 4px 16px rgba(0,0,0,0.08)", zIndex: 200, minWidth: 180,
            padding: 4,
          }}>
            {[
              { icon: <Printer size={13} color="#555" />, label: "인쇄 (Ctrl+P)", onClick: () => { window.print(); setOpen(false); } },
              { icon: <Eye size={13} color="#555" />, label: "인쇄 미리보기", onClick: () => { setShowPreview(true); setOpen(false); } },
              { icon: <Settings size={13} color="#555" />, label: "인쇄 설정", onClick: () => { window.print(); setOpen(false); } },
            ].map(item => (
              <button
                key={item.label}
                onClick={item.onClick}
                style={{
                  display: "flex", alignItems: "center", gap: 8, width: "100%",
                  padding: "7px 10px", border: "none", borderRadius: 6,
                  background: "transparent", cursor: "pointer", textAlign: "left",
                  fontSize: 13, color: "#333",
                }}
                className="hover:bg-[#F5F5F5] transition-colors"
              >
                {item.icon}
                {item.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Preview Modal */}
      {showPreview && (
        <div
          style={{
            position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)",
            zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center",
            padding: 40,
          }}
          onClick={e => { if (e.target === e.currentTarget) setShowPreview(false); }}
        >
          <div style={{
            background: "#F5F7FA", borderRadius: 12,
            width: "100%", maxWidth: 800, maxHeight: "90vh",
            display: "flex", flexDirection: "column",
            boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
          }}>
            {/* Modal Header */}
            <div style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              padding: "14px 20px", borderBottom: "1px solid #E5E5E5",
              background: "#fff", borderRadius: "12px 12px 0 0",
              flexShrink: 0,
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <Printer size={15} color="#3B5BDB" />
                <span style={{ fontSize: 14, fontWeight: 700, color: "#1a1a1a" }}>인쇄 미리보기</span>
              </div>
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <span style={{ fontSize: 11, color: "#999" }}>A4 · 세로</span>
                <button
                  onClick={() => { window.print(); }}
                  style={{
                    padding: "6px 16px", borderRadius: 6, fontSize: 12, fontWeight: 600,
                    background: "#3B5BDB", color: "#fff", border: "none", cursor: "pointer",
                  }}
                  className="hover:opacity-90 transition-opacity"
                >
                  인쇄하기
                </button>
                <button
                  onClick={() => setShowPreview(false)}
                  style={{
                    width: 28, height: 28, borderRadius: 6, border: "1px solid #E5E5E5",
                    background: "#fff", cursor: "pointer", fontSize: 14, color: "#999",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}
                >
                  ✕
                </button>
              </div>
            </div>
            {/* A4 Preview */}
            <div style={{ flex: 1, overflowY: "auto", padding: "24px", display: "flex", justifyContent: "center" }}>
              <div style={{
                width: "100%", maxWidth: 595,
                background: "#fff",
                boxShadow: "0 2px 16px rgba(0,0,0,0.12)",
                padding: "40px 48px",
                minHeight: 842,
                fontFamily: "'Noto Sans KR', 'Malgun Gothic', sans-serif",
              }}>
                <div style={{
                  display: "flex", flexDirection: "column", alignItems: "center",
                  justifyContent: "center", gap: 12, color: "#bbb",
                  minHeight: 300,
                }}>
                  <Printer size={36} color="#e0e0e0" />
                  <p style={{ margin: 0, fontSize: 13, color: "#999", textAlign: "center" }}>
                    인쇄 미리보기는 실제 인쇄 결과와 동일합니다.
                    <br />
                    <span style={{ fontSize: 11, color: "#bbb" }}>
                      Ctrl+P 또는 &quot;인쇄하기&quot; 버튼을 사용하세요.
                    </span>
                  </p>
                  <button
                    onClick={() => { window.print(); setShowPreview(false); }}
                    style={{
                      marginTop: 8, padding: "8px 24px", borderRadius: 6,
                      background: "#3B5BDB", color: "#fff", border: "none",
                      fontSize: 13, fontWeight: 600, cursor: "pointer",
                    }}
                  >
                    인쇄하기
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
