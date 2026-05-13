"use client";
import Link from "next/link";
import { useState } from "react";

const NAV_ITEMS = [
  { href: "/mobile", label: "현장 홈", emoji: "🏠" },
  { href: "/tbm", label: "TBM", emoji: "📋" },
  { href: "/forms", label: "서식", emoji: "📝" },
  { href: "/report", label: "제보", emoji: "📢" },
];

const GRID_BUTTONS = [
  {
    href: "/tbm",
    emoji: "🔨",
    label: "TBM 서명",
    desc: "오늘의 안전교육 서명",
    featured: true,
  },
  {
    href: "/forms",
    emoji: "📋",
    label: "작업허가서",
    desc: "작업허가 신청",
    featured: false,
  },
  {
    href: "/forms",
    emoji: "⚠️",
    label: "아차사고 보고",
    desc: "위험상황 즉시 보고",
    featured: false,
  },
  {
    href: "/forms",
    emoji: "🔧",
    label: "설비 점검",
    desc: "설비 점검 기록",
    featured: false,
  },
  {
    href: "/forms",
    emoji: "📸",
    label: "5S 점검",
    desc: "작업장 5S 점검",
    featured: false,
  },
  {
    href: "/report",
    emoji: "📢",
    label: "익명 제보",
    desc: "안전/부패 익명 제보",
    featured: false,
  },
];

export default function MobilePage() {
  const [today] = useState(() =>
    new Date().toLocaleDateString("ko-KR", {
      month: "long",
      day: "numeric",
      weekday: "short",
    })
  );
  const [activeNav, setActiveNav] = useState("/mobile");
  const [hoveredBtn, setHoveredBtn] = useState<number | null>(null);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#F9FAFB",
        display: "flex",
        flexDirection: "column",
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      }}
    >
      {/* Header */}
      <header
        style={{
          background: "#fff",
          borderBottom: "1px solid #E5E5E5",
          padding: "16px 20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          position: "sticky",
          top: 0,
          zIndex: 10,
        }}
      >
        <div>
          <div style={{ fontSize: 16, fontWeight: 700, color: "#1a1a1a" }}>현장 작업자</div>
          <div style={{ fontSize: 12, color: "#999", marginTop: 2 }}>{today}</div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <span style={{ fontSize: 14, fontWeight: 800, color: "#3B5BDB" }}>complAIs</span>
        </div>
      </header>

      {/* Main Content */}
      <main
        style={{
          flex: 1,
          padding: "20px 16px",
          paddingBottom: 80,
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 12,
          }}
        >
          {GRID_BUTTONS.map((btn, i) => (
            <Link
              key={i}
              href={btn.href}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                background: btn.featured ? "#3B5BDB" : "#fff",
                border: btn.featured
                  ? "none"
                  : hoveredBtn === i
                  ? "1.5px solid #3B5BDB"
                  : "1px solid #E5E5E5",
                borderRadius: 12,
                padding: "24px 16px",
                textAlign: "center",
                cursor: "pointer",
                textDecoration: "none",
                boxShadow: hoveredBtn === i ? "0 4px 12px rgba(59,91,219,0.15)" : "none",
                transition: "all 0.15s",
                minHeight: 130,
              }}
              onMouseEnter={() => setHoveredBtn(i)}
              onMouseLeave={() => setHoveredBtn(null)}
            >
              <span style={{ fontSize: 36, display: "block", marginBottom: 10 }}>{btn.emoji}</span>
              <div
                style={{
                  fontSize: 15,
                  fontWeight: 700,
                  color: btn.featured ? "#fff" : "#1a1a1a",
                  marginBottom: 4,
                }}
              >
                {btn.label}
              </div>
              <div
                style={{
                  fontSize: 11,
                  color: btn.featured ? "rgba(255,255,255,0.75)" : "#999",
                  lineHeight: 1.4,
                }}
              >
                {btn.desc}
              </div>
            </Link>
          ))}
        </div>
      </main>

      {/* Bottom Navigation */}
      <nav
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          background: "#fff",
          borderTop: "1px solid #E5E5E5",
          display: "flex",
          alignItems: "stretch",
          height: 60,
          zIndex: 20,
        }}
      >
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setActiveNav(item.href)}
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 2,
              textDecoration: "none",
              color: activeNav === item.href ? "#3B5BDB" : "#999",
              fontSize: 10,
              fontWeight: activeNav === item.href ? 600 : 400,
              transition: "color 0.15s",
            }}
          >
            <span style={{ fontSize: 20 }}>{item.emoji}</span>
            {item.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}
