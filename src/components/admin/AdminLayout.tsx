"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Building2,
  Users,
  FileSpreadsheet,
  CreditCard,
} from "lucide-react";

const NAV_ITEMS = [
  { label: "전체 현황",  href: "/admin",          icon: LayoutDashboard },
  { label: "회사 관리",  href: "/admin/companies", icon: Building2 },
  { label: "사용자 관리", href: "/admin/users",    icon: Users },
  { label: "플랜/결제",  href: "/admin/plans",     icon: CreditCard },
  { label: "서식 관리",  href: "/admin/forms",     icon: FileSpreadsheet },
];

function isActive(href: string, pathname: string): boolean {
  if (href === "/admin") return pathname === "/admin";
  return pathname.startsWith(href);
}

export default function AdminLayout({
  children,
  active,
}: {
  children: React.ReactNode;
  active?: string;
}) {
  const pathname = usePathname();

  return (
    <div style={{ minWidth: 1100 }}>
      {/* ── 사이드바 ── */}
      <aside style={{
        position: "fixed", left: 0, top: 0, zIndex: 40,
        width: 220, height: "100vh",
        background: "#fff", borderRight: "1px solid #E5E5E5",
        display: "flex", flexDirection: "column",
      }}>
        {/* 로고 */}
        <div style={{ padding: "20px 16px 16px", borderBottom: "1px solid #E5E5E5", flexShrink: 0 }}>
          <div style={{ fontSize: 17, fontWeight: 700, color: "#3B5BDB", lineHeight: 1.2 }}>
            complAIs
          </div>
          <div style={{ fontSize: 11, color: "#999", marginTop: 2 }}>
            관리자 포털
          </div>
        </div>

        {/* 내비게이션 */}
        <nav style={{ flex: 1, overflowY: "auto", padding: "10px 10px" }}>
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const activeState = active ? active === item.href : isActive(item.href, pathname);
            return (
              <Link
                key={item.href}
                href={item.href}
                style={{
                  display: "flex", alignItems: "center", gap: 8,
                  padding: "6px 12px", borderRadius: 6, marginBottom: 2,
                  textDecoration: "none", fontSize: 13,
                  background: activeState ? "#EEF2FF" : "transparent",
                  color: activeState ? "#3B5BDB" : "#555",
                  fontWeight: activeState ? 600 : 400,
                }}
                className={!activeState ? "hover:bg-[#F5F5F5] transition-colors" : ""}
              >
                <Icon size={14} color={activeState ? "#3B5BDB" : "#999"} strokeWidth={activeState ? 2.2 : 1.8} />
                <span style={{ flex: 1 }}>{item.label}</span>
              </Link>
            );
          })}
        </nav>

      </aside>

      {/* ── 메인 콘텐츠 ── */}
      <div style={{ marginLeft: 220, minHeight: "100vh", background: "#F9F9F9" }}>
        {children}
      </div>
    </div>
  );
}
