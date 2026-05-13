"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Plus, Search } from "lucide-react";
import type { Supplier, SupplierStatus, SupplierGrade } from "@/types/supplier";

const GRADE_STYLE: Record<SupplierGrade, { color: string; bg: string }> = {
  A: { color: "#2F9E44", bg: "#F0FBF4" },
  B: { color: "#3B5BDB", bg: "#EEF2FF" },
  C: { color: "#E67700", bg: "#FFF9DB" },
  D: { color: "#E03131", bg: "#FFF0F0" },
};

const STATUS_STYLE: Record<SupplierStatus, { label: string; color: string; bg: string }> = {
  approved:    { label: "승인",    color: "#2F9E44", bg: "#F0FBF4" },
  conditional: { label: "조건부",  color: "#E67700", bg: "#FFF9DB" },
  pending:     { label: "평가대기", color: "#999",   bg: "#F5F5F5" },
  suspended:   { label: "거래정지", color: "#E03131", bg: "#FFF0F0" },
};

type FilterKey = "전체" | "승인" | "조건부" | "평가대기" | "거래정지";

function scoreColor(s: number) {
  if (s >= 80) return "#2F9E44";
  if (s >= 60) return "#E67700";
  return "#E03131";
}

function ScoreBar({ score }: { score: number }) {
  const color = scoreColor(score);
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 90 }}>
      <span style={{ fontSize: 12, fontWeight: 700, color, minWidth: 22, textAlign: "right" }}>{score}</span>
      <div style={{ flex: 1, height: 3, background: "#F0F0F0", borderRadius: 2 }}>
        <div style={{ height: "100%", width: `${score}%`, background: color, borderRadius: 2 }} />
      </div>
    </div>
  );
}

export default function SupplierClientView({ suppliers, canWrite = false }: { suppliers: Supplier[]; canWrite?: boolean }) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<FilterKey>("전체");
  const [search, setSearch] = useState("");

  const today = useMemo(() => new Date().toISOString().slice(0, 10), []);

  const stats = useMemo(() => ({
    total:       suppliers.length,
    approved:    suppliers.filter(s => s.status === "approved").length,
    conditional: suppliers.filter(s => s.status === "conditional").length,
    pending:     suppliers.filter(s => s.status === "pending").length,
  }), [suppliers]);

  const tabs: { key: FilterKey; count: number }[] = [
    { key: "전체",    count: suppliers.length },
    { key: "승인",    count: stats.approved },
    { key: "조건부",  count: stats.conditional },
    { key: "평가대기", count: stats.pending },
    { key: "거래정지", count: suppliers.filter(s => s.status === "suspended").length },
  ];

  const filtered = useMemo(() => {
    let list = suppliers;
    if (activeTab === "승인")    list = list.filter(s => s.status === "approved");
    if (activeTab === "조건부")  list = list.filter(s => s.status === "conditional");
    if (activeTab === "평가대기") list = list.filter(s => s.status === "pending");
    if (activeTab === "거래정지") list = list.filter(s => s.status === "suspended");
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(s =>
        s.company_name.toLowerCase().includes(q) || s.category.toLowerCase().includes(q)
      );
    }
    return list;
  }, [suppliers, activeTab, search]);

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "calc(100vh - 56px)" }}>

      {/* ── KPI 스트립 ── */}
      <div style={{ display: "flex", borderBottom: "1px solid #EBEBEB", flexShrink: 0 }}>
        {[
          { label: "전체 공급자", value: stats.total,       sub: "등록 업체" },
          { label: "승인",        value: stats.approved,    sub: "거래 승인",    ok: true },
          { label: "조건부",      value: stats.conditional, sub: "조건부 승인" },
          { label: "평가 대기",   value: stats.pending,     sub: "미평가",        warn: stats.pending > 0 },
        ].map((kpi, i, arr) => (
          <div key={kpi.label} style={{
            flex: 1, padding: "20px 24px",
            borderRight: i < arr.length - 1 ? "1px solid #EBEBEB" : "none",
          }}>
            <p style={{ margin: "0 0 5px", fontSize: 12, fontWeight: 500, color: "#666666", textTransform: "uppercase", letterSpacing: "0.03em" }}>
              {kpi.label}
            </p>
            <p style={{
              margin: "0 0 4px", fontSize: 32, fontWeight: 700, lineHeight: 1,
              color: kpi.ok ? "#2F9E44" : kpi.warn && kpi.value > 0 ? "#E67700" : "#1a1a1a",
            }}>
              {kpi.value}
            </p>
            <p style={{ margin: 0, fontSize: 11, color: "#999999" }}>{kpi.sub}</p>
          </div>
        ))}
      </div>

      {/* ── 툴바 ── */}
      <div style={{
        background: "#fff", borderBottom: "1px solid #E8E8E8",
        padding: "10px 16px", display: "flex", alignItems: "center", gap: 8, flexShrink: 0,
      }}>
        <div style={{ display: "flex", gap: 4 }}>
          {tabs.map(t => (
            <button
              key={t.key}
              onClick={() => setActiveTab(t.key)}
              style={{
                display: "flex", alignItems: "center", gap: 5,
                padding: "5px 10px", borderRadius: 4, cursor: "pointer",
                fontSize: 13, fontWeight: activeTab === t.key ? 600 : 400,
                border: activeTab === t.key ? "1px solid #3B5BDB" : "1px solid #E8E8E8",
                background: activeTab === t.key ? "#EFF6FF" : "#fff",
                color: activeTab === t.key ? "#3B5BDB" : "#555",
              }}
            >
              {t.key}
              <span style={{
                fontSize: 10, fontWeight: 700, padding: "0 4px", borderRadius: 8,
                background: activeTab === t.key ? "#3B5BDB" : "#F0F0F0",
                color: activeTab === t.key ? "#fff" : "#999",
              }}>
                {t.count}
              </span>
            </button>
          ))}
        </div>

        <div style={{ flex: 1 }} />

        <div style={{ position: "relative" }}>
          <Search size={13} color="#bbb" style={{ position: "absolute", left: 9, top: "50%", transform: "translateY(-50%)" }} />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="업체명, 품목 검색..."
            style={{
              paddingLeft: 28, paddingRight: 12, paddingTop: 6, paddingBottom: 6,
              fontSize: 13, background: "#fff",
              border: "1px solid #E5E5E5", borderRadius: 6,
              width: 220, outline: "none", color: "#1a1a1a",
            }}
            className="focus:border-[#3B5BDB] transition-colors placeholder:text-[#bbb]"
          />
        </div>

        {canWrite && (
          <Link
            href="/suppliers/new"
            style={{
              display: "flex", alignItems: "center", gap: 5,
              padding: "5px 12px", borderRadius: 6, textDecoration: "none",
              fontSize: 12, fontWeight: 600, color: "#fff", background: "#3B5BDB",
            }}
            className="hover:opacity-90 transition-opacity"
          >
            <Plus size={13} />
            공급자 등록
          </Link>
        )}
      </div>

      {/* ── 테이블 ── */}
      <div style={{ flex: 1, overflowY: "auto", background: "#fff" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 1000 }}>
          <thead style={{ position: "sticky", top: 0, zIndex: 10, background: "#F8F8F8", borderBottom: "1px solid #E8E8E8" }}>
            <tr>
              {["업체명", "품목", "등급", "종합점수", "ISO인증", "최근평가일", "다음평가일", "상태"].map((col, i) => (
                <th key={i} style={{ padding: "10px 14px", textAlign: "left", fontSize: 12, fontWeight: 600, color: "#555555", whiteSpace: "nowrap" }}>
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={8} style={{ textAlign: "center", padding: "64px 0" }}>
                  {suppliers.length === 0 ? (
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
                      <span style={{ fontSize: 36 }}>🏢</span>
                      <p style={{ margin: 0, fontSize: 15, fontWeight: 600, color: "#333" }}>아직 등록된 공급자가 없습니다</p>
                      <p style={{ margin: 0, fontSize: 13, color: "#999" }}>협력업체 및 공급자를 등록하고 평가를 관리하세요.</p>
                      {canWrite && (
                        <a href="/suppliers/new" style={{ marginTop: 4, padding: "7px 20px", borderRadius: 6, background: "#3B5BDB", color: "#fff", fontSize: 13, fontWeight: 600, textDecoration: "none" }}>
                          + 공급자 등록
                        </a>
                      )}
                    </div>
                  ) : (
                    <span style={{ fontSize: 14, color: "#999" }}>해당하는 공급자가 없습니다.</span>
                  )}
                </td>
              </tr>
            ) : (
              filtered.map((s, i) => {
                const gs  = GRADE_STYLE[s.grade]   ?? { color: "#999", bg: "#F5F5F5" };
                const ss  = STATUS_STYLE[s.status] ?? { label: s.status, color: "#999", bg: "#F5F5F5" };
                const nextDays = s.next_evaluation_date
                  ? Math.ceil((new Date(s.next_evaluation_date).setHours(0,0,0,0) - new Date(today).setHours(0,0,0,0)) / 86400000)
                  : null;
                const nextUrgent = nextDays !== null && nextDays <= 30;

                return (
                  <tr
                    key={s.id}
                    onClick={() => router.push(`/suppliers/${s.id}`)}
                    style={{ borderBottom: i < filtered.length - 1 ? "1px solid #F0F0F0" : "none", cursor: "pointer" }}
                    className="hover:bg-[#FAFAFA] transition-colors"
                  >
                    <td style={{ padding: "10px 14px" }}>
                      <span style={{ fontSize: 14, fontWeight: 600, color: "#1a1a1a" }}>{s.company_name}</span>
                    </td>
                    <td style={{ padding: "10px 14px", fontSize: 12, color: "#444444", whiteSpace: "nowrap" }}>
                      {s.category}
                    </td>
                    <td style={{ padding: "10px 14px", whiteSpace: "nowrap" }}>
                      <span style={{
                        fontSize: 12, fontWeight: 700, padding: "2px 8px", borderRadius: 4,
                        color: gs.color, background: gs.bg,
                      }}>
                        {s.grade}
                      </span>
                    </td>
                    <td style={{ padding: "10px 14px", minWidth: 120 }}>
                      <ScoreBar score={s.total_score} />
                    </td>
                    <td style={{ padding: "10px 14px", textAlign: "center", whiteSpace: "nowrap" }}>
                      <span style={{ fontSize: 12, color: s.iso_certified ? "#2F9E44" : "#888888", fontWeight: 500 }}>
                        {s.iso_certified ? "O" : "—"}
                      </span>
                    </td>
                    <td style={{ padding: "10px 14px", fontSize: 12, color: "#444444", whiteSpace: "nowrap" }}>
                      {s.last_evaluation_date ?? "—"}
                    </td>
                    <td style={{ padding: "10px 14px", whiteSpace: "nowrap" }}>
                      <span style={{ fontSize: 12, color: nextUrgent ? "#E67700" : "#444444", fontWeight: nextUrgent ? 600 : 400 }}>
                        {s.next_evaluation_date ?? "—"}
                      </span>
                      {nextUrgent && nextDays !== null && (
                        <span style={{ marginLeft: 5, fontSize: 12, fontWeight: 600, color: "#E67700" }}>
                          {nextDays <= 0 ? "D-Day" : `D-${nextDays}`}
                        </span>
                      )}
                    </td>
                    <td style={{ padding: "10px 14px", whiteSpace: "nowrap" }}>
                      <span style={{
                        fontSize: 12, fontWeight: 600, padding: "2px 6px", borderRadius: 4,
                        color: ss.color, background: ss.bg,
                      }}>
                        {ss.label}
                      </span>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* ── 하단 카운트 ── */}
      <div style={{ background: "#fff", borderTop: "1px solid #E5E5E5", padding: "10px 16px", flexShrink: 0 }}>
        <span style={{ fontSize: 13, color: "#666666" }}>
          총 <span style={{ fontWeight: 600, color: "#555" }}>{filtered.length}</span>개 업체
          {activeTab !== "전체" && ` (전체 ${suppliers.length}개)`}
        </span>
      </div>
    </div>
  );
}
