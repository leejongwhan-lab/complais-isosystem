"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Building2, Settings } from "lucide-react";

const NAV_ITEMS = [
  { icon: LayoutDashboard, label: "내 대시보드", href: "/consultant" },
  { icon: Building2, label: "고객사 목록", href: "/consultant/clients" },
  { icon: Settings, label: "설정", href: "/consultant/settings" },
] as const;

interface ConsultantLayoutProps {
  children: React.ReactNode;
  active?: string;
}

export default function ConsultantLayout({
  children,
  active,
}: ConsultantLayoutProps) {
  const pathname = usePathname();

  function isActive(href: string): boolean {
    const current = active ?? pathname ?? "";
    if (href === "/consultant") {
      return current === "/consultant";
    }
    return current.startsWith(href);
  }

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      {/* Sidebar */}
      <aside
        style={{
          width: 220,
          minWidth: 220,
          maxWidth: 220,
          background: "#7C3AED",
          display: "flex",
          flexDirection: "column",
          position: "fixed",
          top: 0,
          left: 0,
          bottom: 0,
          zIndex: 100,
        }}
      >
        {/* Logo */}
        <div style={{ padding: "28px 20px 24px" }}>
          <div
            style={{
              fontSize: 22,
              fontWeight: 800,
              color: "#fff",
              letterSpacing: "-0.5px",
            }}
          >
            complAIs
          </div>
          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.65)", marginTop: 2 }}>
            컨설턴트 포털
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: "0 12px" }}>
          {NAV_ITEMS.map(({ icon: Icon, label, href }) => {
            const active_ = isActive(href);
            return (
              <Link
                key={href}
                href={href}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "9px 12px",
                  borderRadius: 7,
                  marginBottom: 2,
                  fontSize: 13,
                  fontWeight: active_ ? 600 : 400,
                  color: active_ ? "#7C3AED" : "rgba(255,255,255,0.85)",
                  background: active_ ? "#F5F0FF" : "transparent",
                  textDecoration: "none",
                  transition: "background 0.15s, color 0.15s",
                }}
                onMouseEnter={(e) => {
                  if (!active_) {
                    (e.currentTarget as HTMLAnchorElement).style.background = "#F5F5F5";
                    (e.currentTarget as HTMLAnchorElement).style.color = "#7C3AED";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!active_) {
                    (e.currentTarget as HTMLAnchorElement).style.background = "transparent";
                    (e.currentTarget as HTMLAnchorElement).style.color = "rgba(255,255,255,0.85)";
                  }
                }}
              >
                <Icon size={16} />
                {label}
              </Link>
            );
          })}
        </nav>

      </aside>

      {/* Main content */}
      <main style={{ marginLeft: 220, flex: 1, minHeight: "100vh", background: "#F9FAFB" }}>
        {children}
      </main>
    </div>
  );
}
