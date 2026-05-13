"use client";

import { useMemo, useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard, FileText, ClipboardCheck, AlertCircle,
  Building2, GraduationCap, Settings, Bell, Search, ChevronDown,
  ShieldAlert, ClipboardList, Leaf, FileSpreadsheet, FileX,
  Zap, Shield, Scale, Lock, Plus, HardHat, Smartphone, MessageSquare,
  UtensilsCrossed, ShieldCheck, Stethoscope, Bot, Sparkles,
  LogOut, User, BarChart3,
} from "lucide-react";
import type { Company } from "@/lib/company";
import { ROLE_LABELS } from "@/lib/permissions";
import { supabase } from "@/lib/supabase";

// ── 페이지 타이틀 매핑 ──────────────────────────────────────
const TITLE_MAP: Array<{ prefix: string; exact?: boolean; title: string }> = [
  { prefix: "/tbm/",                          title: "TBM 상세" },
  { prefix: "/tbm/new",                       title: "오늘 TBM 등록" },
  { prefix: "/tbm",                           title: "TBM 관리" },
  { prefix: "/forms/",                       title: "서식" },
  { prefix: "/forms",                        title: "서식 라이브러리" },
  { prefix: "/documents/new",                title: "새 문서 작성" },
  { prefix: "/documents/",                   title: "문서 상세" },
  { prefix: "/documents",                    title: "문서관리" },
  { prefix: "/capa/",                        title: "CAPA 상세" },
  { prefix: "/capa",                         title: "CAPA 관리" },
  { prefix: "/nonconformity",                title: "부적합 관리" },
  { prefix: "/audit/new",                    title: "심사 계획 등록" },
  { prefix: "/audit/",                       title: "심사 상세" },
  { prefix: "/audit",                        title: "내부심사" },
  { prefix: "/suppliers/new",                title: "공급자 등록" },
  { prefix: "/suppliers/",                   title: "공급자 상세" },
  { prefix: "/suppliers",                    title: "공급자 관리" },
  { prefix: "/trainings/new",                title: "교육 등록" },
  { prefix: "/trainings/",                   title: "교육훈련 상세" },
  { prefix: "/trainings",                    title: "교육훈련" },
  { prefix: "/risks/new",                    title: "리스크 등록" },
  { prefix: "/risks/",                       title: "리스크 상세" },
  { prefix: "/risks",                        title: "리스크 관리" },
  { prefix: "/management-review/new",        title: "경영검토 등록" },
  { prefix: "/management-review/",           title: "경영검토 상세" },
  { prefix: "/management-review",            title: "경영검토" },
  { prefix: "/environment/aspects/new",      title: "환경측면 등록" },
  { prefix: "/environment/hazards/new",      title: "위험성평가 등록" },
  { prefix: "/environment/legal/new",        title: "법규 등록" },
  { prefix: "/environment/materials/new",    title: "물질 등록" },
  { prefix: "/environment",                  title: "환경·안전 관리" },
  { prefix: "/energy/new",                    title: "에너지 사용량 기록" },
  { prefix: "/energy",                       title: "에너지 관리" },
  { prefix: "/antibribery/risks/new",        title: "부패리스크 등록" },
  { prefix: "/antibribery/gifts/new",        title: "선물·접대 신고서" },
  { prefix: "/antibribery",                  title: "반부패 관리" },
  { prefix: "/compliance-mgmt/new",          title: "준법의무 등록" },
  { prefix: "/compliance-mgmt",              title: "준법 관리" },
  { prefix: "/infosec/new",                  title: "정보자산 등록" },
  { prefix: "/infosec",                      title: "정보보안" },
  { prefix: "/food-safety/haccp",            title: "HACCP 관리" },
  { prefix: "/food-safety",                  title: "식품안전 관리" },
  { prefix: "/bcms/bcp",                     title: "BCP 관리" },
  { prefix: "/bcms",                         title: "사업연속성 관리" },
  { prefix: "/medical-device/dhf",           title: "설계개발 이력" },
  { prefix: "/medical-device",               title: "의료기기 품질" },
  { prefix: "/ai-mgmt/risks",               title: "AI 리스크" },
  { prefix: "/ai-mgmt",                     title: "AI 경영" },
  { prefix: "/nuclear/itns",                title: "ITNS 관리" },
  { prefix: "/nuclear",                     title: "원자력 품질" },
  { prefix: "/cosmetic/batch",              title: "제조 기록" },
  { prefix: "/cosmetic",                    title: "화장품 GMP" },
  { prefix: "/compliance",                   title: "인증·ESG 관리" },
  { prefix: "/settings/users",               title: "사용자 관리" },
  { prefix: "/settings",                     title: "설정" },
  { prefix: "/profile",                      title: "내 프로필" },
  { prefix: "/onboarding",                   title: "온보딩" },
  { prefix: "/mobile",                       title: "현장 작업자 홈" },
  { prefix: "/reports/",                     title: "제보 상세" },
  { prefix: "/reports",                      title: "익명 제보함" },
  { prefix: "/consultant",                   title: "컨설턴트 포털" },
  { prefix: "/", exact: true,                title: "대시보드" },
];

function getTitle(pathname: string): string {
  for (const { prefix, exact, title } of TITLE_MAP) {
    if (exact ? pathname === prefix : pathname.startsWith(prefix)) return title;
  }
  return "";
}

function isActive(href: string, pathname: string): boolean {
  if (href === "#") return false;
  if (href === "/") return pathname === "/";
  return pathname.startsWith(href);
}

// ── 표준 뱃지 ───────────────────────────────────────────────
const STD_BADGES = [
  { key: "std_iso9001",  label: "ISO 9001",  color: "#3B5BDB", bg: "#EEF2FF" },
  { key: "std_iso14001", label: "ISO 14001", color: "#2F9E44", bg: "#EBFBEE" },
  { key: "std_iso45001", label: "ISO 45001", color: "#E67700", bg: "#FFF9DB" },
  { key: "std_iso50001", label: "ISO 50001", color: "#E67700", bg: "#FFF9DB" },
  { key: "std_iso37001", label: "ISO 37001", color: "#2F9E44", bg: "#EBFBEE" },
  { key: "std_iso37301", label: "ISO 37301", color: "#1098AD", bg: "#E3FAFC" },
  { key: "std_iso27001", label: "ISO 27001", color: "#7048E8", bg: "#F3F0FF" },
] as const;

type NavItem = {
  icon: React.ComponentType<{ size?: number; color?: string; strokeWidth?: number }>;
  label: string;
  href: string;
  badge: number | null;
  danger: boolean;
};

type NavSection = { label: string; items: NavItem[] };

// ── 알림 벨 ─────────────────────────────────────────────────
function NotificationBell({ router }: { router: ReturnType<typeof useRouter> }) {
  const [open, setOpen] = useState(false);
  const [overdueCapas, setOverdueCapas] = useState(0);
  const [reviewDocs,   setReviewDocs]   = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const today = new Date().toISOString().slice(0, 10);
    supabase.from("capas")
      .select("id", { count: "exact", head: true })
      .lt("due_date", today)
      .neq("status", "completed")
      .then(({ count }) => setOverdueCapas(count ?? 0));
    supabase.from("documents")
      .select("id", { count: "exact", head: true })
      .eq("status", "review")
      .then(({ count }) => setReviewDocs(count ?? 0));
  }, []);

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const total = overdueCapas + reviewDocs;

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <button
        onClick={() => setOpen(v => !v)}
        style={{ position: "relative", padding: 7, borderRadius: 6, border: "none", background: "transparent", cursor: "pointer", display: "flex", alignItems: "center" }}
        className="hover:bg-[#F5F5F5] transition-colors"
      >
        <Bell size={18} color="#666666" />
        {total > 0 && (
          <span style={{
            position: "absolute", top: 4, right: 4, minWidth: 14, height: 14,
            background: "#E03131", color: "#fff", borderRadius: 7,
            fontSize: 9, fontWeight: 700, display: "flex", alignItems: "center",
            justifyContent: "center", padding: "0 3px",
          }}>
            {total > 9 ? "9+" : total}
          </span>
        )}
      </button>

      {open && (
        <div style={{
          position: "absolute", top: "calc(100% + 4px)", right: 0,
          background: "#fff", border: "1px solid #E5E5E5", borderRadius: 10,
          boxShadow: "0 4px 20px rgba(0,0,0,0.10)", zIndex: 200,
          minWidth: 240, padding: 8,
        }}>
          <p style={{ margin: "0 0 8px 8px", fontSize: 11, fontWeight: 700, color: "#999", textTransform: "uppercase", letterSpacing: "0.06em" }}>
            알림
          </p>
          {overdueCapas === 0 && reviewDocs === 0 && (
            <div style={{ padding: "12px 8px", fontSize: 12, color: "#bbb", textAlign: "center" }}>
              새 알림이 없습니다
            </div>
          )}
          {overdueCapas > 0 && (
            <button
              onClick={() => { router.push("/capa?tab=기한초과"); setOpen(false); }}
              style={{
                display: "flex", alignItems: "center", gap: 10, width: "100%",
                padding: "8px 10px", border: "none", borderRadius: 6, background: "#FFF0F0",
                cursor: "pointer", textAlign: "left",
              }}
              className="hover:bg-[#FFE5E5] transition-colors"
            >
              <span style={{ fontSize: 15 }}>⚠</span>
              <div>
                <p style={{ margin: 0, fontSize: 12, fontWeight: 600, color: "#E03131" }}>기한 초과 CAPA</p>
                <p style={{ margin: 0, fontSize: 11, color: "#E03131" }}>{overdueCapas}건 즉시 확인 필요</p>
              </div>
            </button>
          )}
          {reviewDocs > 0 && (
            <button
              onClick={() => { router.push("/documents?status=review"); setOpen(false); }}
              style={{
                display: "flex", alignItems: "center", gap: 10, width: "100%",
                padding: "8px 10px", border: "none", borderRadius: 6, background: "#EEF2FF",
                cursor: "pointer", textAlign: "left", marginTop: overdueCapas > 0 ? 4 : 0,
              }}
              className="hover:bg-[#E0E8FF] transition-colors"
            >
              <span style={{ fontSize: 15 }}>📄</span>
              <div>
                <p style={{ margin: 0, fontSize: 12, fontWeight: 600, color: "#3B5BDB" }}>검토 대기 문서</p>
                <p style={{ margin: 0, fontSize: 11, color: "#3B5BDB" }}>{reviewDocs}건 검토 대기 중</p>
              </div>
            </button>
          )}
        </div>
      )}
    </div>
  );
}

// ── 레이아웃 ────────────────────────────────────────────────
export default function AppLayout({
  children,
  company,
  docCount,
  capaOpenCount,
  isConsultantMode = false,
  originalCompanyName,
  userFullName,
  userRole,
}: {
  children: React.ReactNode;
  company?: Company | null;
  docCount?: number | null;
  capaOpenCount?: number | null;
  isConsultantMode?: boolean;
  originalCompanyName?: string | null;
  userFullName?: string | null;
  userRole?: string | null;
}) {
  const pathname = usePathname();
  const router   = useRouter();
  const initial     = company?.company_name?.charAt(0) ?? "C";
  const displayName = company?.company_name ?? "complAIs";
  const userLabel   = userFullName || company?.management_rep || "사용자";
  const userInitial = userLabel.charAt(0);
  const roleLabel   = userRole ? (ROLE_LABELS[userRole as keyof typeof ROLE_LABELS] ?? userRole) : null;

  // 역할 뱃지 색상
  const ROLE_BADGE: Record<string, { color: string; bg: string }> = {
    admin:   { color: "#3B5BDB", bg: "#EEF2FF" },
    manager: { color: "#2F9E44", bg: "#F0FBF4" },
    member:  { color: "#999",    bg: "#F5F5F5" },
    viewer:  { color: "#bbb",    bg: "#F5F5F5" },
  };
  const roleBadge = userRole ? (ROLE_BADGE[userRole] ?? { color: "#999", bg: "#F5F5F5" }) : null;

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  };

  const allSections = useMemo((): NavSection[] => {
    const adminOnly = userRole === "admin";

    const base: NavSection[] = [
      {
        label: "문서",
        items: [
          { icon: LayoutDashboard, label: "대시보드",        href: "/",          badge: null,              danger: false },
          { icon: FileText,        label: "문서관리",        href: "/documents", badge: docCount ?? null,  danger: false },
          { icon: FileSpreadsheet, label: "서식 라이브러리", href: "/forms",     badge: null,              danger: false },
        ],
      },
      {
        label: "품질",
        items: [
          { icon: ClipboardCheck, label: "CAPA",       href: "/capa",          badge: capaOpenCount ?? null, danger: true  },
          { icon: AlertCircle,    label: "내부심사",    href: "/audit",         badge: null,                 danger: false },
          { icon: FileX,          label: "부적합",      href: "/nonconformity", badge: null,                 danger: false },
          { icon: ShieldAlert,    label: "리스크 관리", href: "/risks",         badge: null,                 danger: false },
        ],
      },
      {
        label: "경영",
        items: [
          { icon: Building2,     label: "공급자 관리", href: "/suppliers",         badge: null, danger: false },
          { icon: GraduationCap, label: "교육훈련",    href: "/trainings",         badge: null, danger: false },
          { icon: ClipboardList, label: "경영검토",    href: "/management-review", badge: null, danger: false },
        ],
      },
    ];

    const std: NavSection[] = [];
    const has14001 = company?.std_iso14001 ?? false;
    const has45001 = company?.std_iso45001 ?? false;

    if (has14001 && has45001) {
      std.push({ label: "환경·안전 EHS", items: [{ icon: Leaf, label: "환경·안전", href: "/environment", badge: null, danger: false }] });
    } else if (has14001) {
      std.push({ label: "환경 ISO 14001", items: [{ icon: Leaf, label: "환경·안전", href: "/environment", badge: null, danger: false }] });
    } else if (has45001) {
      std.push({ label: "안전보건 ISO 45001", items: [{ icon: ShieldAlert, label: "위험성평가", href: "/environment", badge: null, danger: false }] });
    }
    if (company?.std_iso50001) std.push({ label: "에너지 ISO 50001", items: [
      { icon: Zap,  label: "에너지 현황", href: "/energy",     badge: null, danger: false },
      { icon: Plus, label: "사용량 기록", href: "/energy/new", badge: null, danger: false },
    ]});
    if (company?.std_iso37001) std.push({ label: "반부패 ISO 37001", items: [
      { icon: Shield, label: "리스크 현황",   href: "/antibribery",           badge: null, danger: false },
      { icon: Plus,   label: "선물·접대 신고", href: "/antibribery/gifts/new", badge: null, danger: false },
    ]});
    if (company?.std_iso37301) std.push({ label: "준법 ISO 37301", items: [
      { icon: Scale, label: "준법의무",  href: "/compliance-mgmt",     badge: null, danger: false },
      { icon: Plus,  label: "의무 등록", href: "/compliance-mgmt/new", badge: null, danger: false },
    ]});
    if (company?.std_iso27001) std.push({ label: "정보보안 ISO 27001", items: [
      { icon: Lock, label: "정보자산",  href: "/infosec",     badge: null, danger: false },
      { icon: Plus, label: "자산 등록", href: "/infosec/new", badge: null, danger: false },
    ]});
    if (company?.std_iso22000) std.push({ label: "식품안전 ISO 22000", items: [
      { icon: UtensilsCrossed, label: "식품안전 관리", href: "/food-safety",       badge: null, danger: false },
      { icon: Plus,            label: "HACCP 관리",    href: "/food-safety/haccp", badge: null, danger: false },
    ]});
    if (company?.std_iso22301) std.push({ label: "사업연속성 ISO 22301", items: [
      { icon: ShieldCheck, label: "사업연속성", href: "/bcms",     badge: null, danger: false },
      { icon: Plus,        label: "BCP 관리",   href: "/bcms/bcp", badge: null, danger: false },
    ]});
    if (company?.std_iso13485) std.push({ label: "의료기기 ISO 13485", items: [
      { icon: Stethoscope, label: "의료기기 품질", href: "/medical-device",     badge: null, danger: false },
      { icon: Plus,        label: "설계개발 이력", href: "/medical-device/dhf", badge: null, danger: false },
    ]});
    if (company?.std_iso42001) std.push({ label: "AI경영 ISO 42001", items: [
      { icon: Bot,  label: "AI 경영",  href: "/ai-mgmt",       badge: null, danger: false },
      { icon: Plus, label: "AI 리스크", href: "/ai-mgmt/risks", badge: null, danger: false },
    ]});
    if (company?.std_iso19443) std.push({ label: "원자력 ISO 19443", items: [
      { icon: Zap,  label: "원자력 품질", href: "/nuclear",      badge: null, danger: false },
      { icon: Plus, label: "ITNS 관리",   href: "/nuclear/itns", badge: null, danger: false },
    ]});
    if (company?.std_iso22716) std.push({ label: "화장품 ISO 22716", items: [
      { icon: Sparkles, label: "화장품 GMP", href: "/cosmetic",       badge: null, danger: false },
      { icon: Plus,     label: "제조 기록",   href: "/cosmetic/batch", badge: null, danger: false },
    ]});

    const settingsItems: NavItem[] = [
      { icon: BarChart3, label: "인증·ESG", href: "/compliance", badge: null, danger: false },
    ];
    if (adminOnly) {
      settingsItems.push({ icon: Settings, label: "설정", href: "/settings", badge: null, danger: false });
    }

    const tail: NavSection[] = [
      {
        label: "현장",
        items: [
          { icon: HardHat,       label: "TBM 관리",       href: "/tbm",     badge: null, danger: false },
          { icon: Smartphone,    label: "현장 작업자 홈",  href: "/mobile",  badge: null, danger: false },
          { icon: MessageSquare, label: "익명 제보함",     href: "/reports", badge: null, danger: false },
        ],
      },
      { label: "연계·설정", items: settingsItems },
    ];

    return [...base, ...std, ...tail];
  }, [company, userRole, docCount, capaOpenCount]);

  const BANNER_H = isConsultantMode ? 40 : 0;
  const TOPBAR_H = 52;

  return (
    <div style={{ minWidth: 1280, overflowX: "auto" }}>

      {/* ── 컨설턴트 모드 배너 ── */}
      {isConsultantMode && (
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, height: 40, zIndex: 60,
          background: "#F59F00", color: "#fff",
          display: "flex", alignItems: "center", justifyContent: "center", gap: 16,
          fontSize: 13, fontWeight: 600,
        }}>
          🔍 {company?.company_name} 고객사 접속 중
          {originalCompanyName && (
            <span style={{ fontSize: 12, fontWeight: 400, opacity: 0.85 }}>
              ({originalCompanyName} 계정)
            </span>
          )}
          <button
            onClick={() => {
              fetch("/api/consultant/restore", { method: "POST" })
                .then(() => { window.location.href = "/consultant"; });
            }}
            style={{
              padding: "4px 12px", borderRadius: 5, fontSize: 12, fontWeight: 600,
              background: "rgba(0,0,0,0.2)", color: "#fff",
              border: "1px solid rgba(255,255,255,0.4)", cursor: "pointer",
            }}
          >
            ← 내 대시보드로 돌아가기
          </button>
        </div>
      )}

      {/* ── 사이드바 ── */}
      <aside style={{
        position: "fixed", left: 0, top: BANNER_H, zIndex: 40,
        width: 220, flexShrink: 0, height: `calc(100vh - ${BANNER_H}px)`,
        background: "#FFFFFF", borderRight: "1px solid #EBEBEB",
        display: "flex", flexDirection: "column",
      }}>

        {/* 워크스페이스 헤더 */}
        <div style={{ padding: "14px 12px 10px", borderBottom: "1px solid #F0F0F0", flexShrink: 0 }}>
          <button style={{
            display: "flex", alignItems: "center", gap: 8,
            width: "100%", padding: "6px 6px", borderRadius: 6,
            background: "transparent", border: "none", cursor: "pointer",
          }}
            className="hover:bg-[#F5F5F5] transition-colors"
          >
            <div style={{
              width: 24, height: 24, borderRadius: 6, flexShrink: 0,
              background: "#3B5BDB", color: "#fff",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 13, fontWeight: 700,
            }}>
              {initial}
            </div>
            <span style={{ fontSize: 14, fontWeight: 600, color: "#0A0A0A", flex: 1, textAlign: "left", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {displayName}
            </span>
            <ChevronDown size={13} color="#AAAAAA" />
          </button>

          <button style={{
            display: "flex", alignItems: "center", gap: 6,
            width: "100%", padding: "5px 6px", marginTop: 4,
            borderRadius: 6, background: "transparent", border: "none", cursor: "pointer",
          }}
            className="hover:bg-[#F5F5F5] transition-colors"
          >
            <Search size={13} color="#BBBBBB" />
            <span style={{ fontSize: 13, color: "#BBBBBB", flex: 1, textAlign: "left" }}>검색</span>
            <kbd style={{
              fontSize: 10, color: "#CCCCCC",
              background: "#F5F5F5", border: "1px solid #EBEBEB",
              borderRadius: 3, padding: "1px 4px", fontFamily: "monospace",
            }}>
              ⌘K
            </kbd>
          </button>
        </div>

        {/* 메뉴 섹션 */}
        <nav style={{ flex: 1, overflowY: "auto", padding: "6px 8px 8px" }}>
          {allSections.map((section, si) => (
            <div key={section.label} style={{ marginTop: si === 0 ? 4 : 0 }}>
              {si > 0 && (
                <div style={{ height: 1, background: "#F0F0F0", margin: "8px 4px 6px" }} />
              )}
              <p style={{
                fontSize: 11, fontWeight: 600, color: "#AAAAAA",
                textTransform: "uppercase", letterSpacing: "0.06em",
                padding: "8px 6px 3px", margin: 0,
              }}>
                {section.label}
              </p>
              {section.items.map(item => {
                const Icon   = item.icon;
                const active = isActive(item.href, pathname);
                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    style={{
                      display: "flex", alignItems: "center", gap: 8,
                      padding: "7px 8px", borderRadius: 6, margin: "1px 0",
                      textDecoration: "none",
                      background: active ? "#EFF6FF" : "transparent",
                      color: active ? "#3B5BDB" : "#444444",
                    }}
                    className={!active ? "hover:bg-[#F5F5F5] transition-colors" : ""}
                  >
                    <span style={{ display: "flex", flexShrink: 0, opacity: active ? 1 : 0.7 }}>
                      <Icon
                        size={15}
                        color={active ? "#3B5BDB" : "#888888"}
                        strokeWidth={active ? 2.2 : 1.8}
                      />
                    </span>
                    <span style={{ fontSize: 14, fontWeight: active ? 500 : 400, flex: 1 }}>
                      {item.label}
                    </span>
                    {item.badge !== null && item.badge > 0 && (
                      <span style={{
                        fontSize: 11, fontWeight: 700,
                        padding: "1px 6px", borderRadius: 100,
                        background: item.danger ? "#FEE2E2" : "#EFF6FF",
                        color: item.danger ? "#DC2626" : "#3B5BDB",
                      }}>
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>

        {/* 유저 영역 */}
        <div style={{ padding: "10px 8px", borderTop: "1px solid #EBEBEB", flexShrink: 0 }}>
          <Link
            href="/profile"
            style={{ display: "flex", alignItems: "center", gap: 9, padding: "6px 8px", borderRadius: 6, textDecoration: "none" }}
            className="hover:bg-[#F5F5F5] transition-colors"
          >
            <div style={{
              width: 28, height: 28, borderRadius: "50%",
              background: "#EFF6FF", color: "#3B5BDB", flexShrink: 0,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 12, fontWeight: 700,
            }}>
              {userInitial}
            </div>
            <div style={{ minWidth: 0, flex: 1 }}>
              <p style={{ margin: 0, fontSize: 13, fontWeight: 500, color: "#111111", lineHeight: 1.4, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {userLabel}
              </p>
              {roleLabel && (
                <p style={{ margin: 0, fontSize: 11, color: "#999999", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {roleLabel}
                </p>
              )}
            </div>
          </Link>
          <button
            onClick={handleLogout}
            style={{
              display: "flex", alignItems: "center", gap: 7,
              width: "100%", padding: "6px 8px", borderRadius: 6, marginTop: 1,
              background: "transparent", border: "none", cursor: "pointer",
              color: "#888888", fontSize: 13,
            }}
            className="hover:bg-[#F5F5F5] transition-colors"
          >
            <LogOut size={13} color="#AAAAAA" />
            로그아웃
          </button>
        </div>
      </aside>

      {/* ── 탑바 ── */}
      <header style={{
        position: "fixed", top: BANNER_H, right: 0, left: 220, height: TOPBAR_H, zIndex: 50,
        background: "#FFFFFF", borderBottom: "1px solid #EBEBEB",
        display: "flex", alignItems: "center", padding: "0 24px",
      }}>
        <span style={{ fontSize: 16, fontWeight: 600, color: "#0A0A0A" }}>
          {getTitle(pathname)}
        </span>
        <div style={{ display: "flex", gap: 4, marginLeft: 14, flex: 1, alignItems: "center" }}>
          {company && STD_BADGES.filter(b => company[b.key]).map(b => (
            <span key={b.key} style={{
              fontSize: 11, fontWeight: 600, padding: "2px 7px", borderRadius: 100,
              background: b.bg, color: b.color,
            }}>
              {b.label}
            </span>
          ))}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
          {roleBadge && roleLabel && (
            <span style={{
              fontSize: 11, fontWeight: 600, padding: "3px 9px", borderRadius: 100,
              background: roleBadge.bg, color: roleBadge.color,
              border: `1px solid ${roleBadge.color}40`,
            }}>
              {roleLabel}
            </span>
          )}
          <button
            style={{ padding: 7, borderRadius: 6, border: "none", background: "transparent", cursor: "pointer", display: "flex", alignItems: "center" }}
            className="hover:bg-[#F5F5F5] transition-colors"
          >
            <Search size={18} color="#666666" />
          </button>
          <NotificationBell router={router} />
          <Link
            href="/settings"
            title="설정"
            style={{ padding: 7, borderRadius: 6, display: "flex", alignItems: "center" }}
            className="hover:bg-[#F5F5F5] transition-colors"
          >
            <Settings size={18} color="#666666" />
          </Link>
          <Link
            href="/profile"
            title="내 프로필"
            style={{ display: "flex", alignItems: "center", marginLeft: 4 }}
            className="hover:opacity-80 transition-opacity"
          >
            <div style={{
              width: 30, height: 30, borderRadius: "50%",
              background: "#EFF6FF", color: "#3B5BDB",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 12, fontWeight: 700,
            }}>
              {userInitial}
            </div>
          </Link>
        </div>
      </header>

      {/* ── 메인 콘텐츠 ── */}
      <div className="print-main" style={{ marginLeft: 220, paddingTop: TOPBAR_H + BANNER_H, minHeight: "100vh", background: "#FFFFFF", flex: 1, minWidth: 0, overflow: "hidden" }}>
        {children}
      </div>
    </div>
  );
}
