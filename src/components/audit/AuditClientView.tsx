"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Plus, Search } from "lucide-react";
import type { Audit, AuditType } from "@/types/audit";

const TYPE_LABEL: Record<AuditType, string> = {
  system:  "시스템심사",
  process: "공정심사",
  product: "제품심사",
};

const STATUS_STYLE = {
  planned:     { label: "예정",   color: "#999",    bg: "#F5F5F5" },
  in_progress: { label: "진행중", color: "#3B5BDB", bg: "#EEF2FF" },
  completed:   { label: "완료",   color: "#2F9E44", bg: "#F0FBF4" },
} as const;

type FilterKey = "전체" | "예정" | "진행중" | "완료";

export default function AuditClientView({ audits, canWrite = false }: { audits: Audit[]; canWrite?: boolean }) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<FilterKey>("전체");
  const [search, setSearch] = useState("");

  const stats = useMemo(() => ({
    total:      audits.length,
    inProgress: audits.filter(a => a.status === "in_progress").length,
    completed:  audits.filter(a => a.status === "completed").length,
    totalNc:    audits.reduce((sum, a) => sum + a.nonconformity_count, 0),
  }), [audits]);

  const tabs: { key: FilterKey; count: number }[] = [
    { key: "전체",  count: audits.length },
    { key: "예정",  count: audits.filter(a => a.status === "planned").length },
    { key: "진행중", count: stats.inProgress },
    { key: "완료",  count: stats.completed },
  ];

  const filtered = useMemo(() => {
    let list = audits;
    if (activeTab === "예정")   list = list.filter(a => a.status === "planned");
    if (activeTab === "진행중") list = list.filter(a => a.status === "in_progress");
    if (activeTab === "완료")   list = list.filter(a => a.status === "completed");
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(a =>
        a.audit_number.toLowerCase().includes(q) ||
        a.target_process.toLowerCase().includes(q) ||
        a.auditor_name.toLowerCase().includes(q)
      );
    }
    return list;
  }, [audits, activeTab, search]);

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "calc(100vh - 56px)" }}>

      {/* ── KPI 스트립 ── */}
      <div style={{ display: "flex", borderBottom: "1px solid #EBEBEB", flexShrink: 0 }}>
        {[
          { label: "전체 심사", value: stats.total,      sub: "등록 건수" },
          { label: "진행중",    value: stats.inProgress, sub: "심사 진행" },
          { label: "완료",      value: stats.completed,  sub: "종결",      ok: true },
          { label: "총 부적합", value: stats.totalNc,    sub: "발견 건수", danger: stats.totalNc > 0 },
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
              color: kpi.danger && kpi.value > 0 ? "#E03131" : kpi.ok ? "#2F9E44" : "#1a1a1a",
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
            placeholder="심사번호, 프로세스, 심사원 검색..."
            style={{
              paddingLeft: 28, paddingRight: 12, paddingTop: 6, paddingBottom: 6,
              fontSize: 13, background: "#fff",
              border: "1px solid #E5E5E5", borderRadius: 6,
              width: 250, outline: "none", color: "#1a1a1a",
            }}
            className="focus:border-[#3B5BDB] transition-colors placeholder:text-[#bbb]"
          />
        </div>

        {canWrite && (
          <Link
            href="/audit/new"
            style={{
              display: "flex", alignItems: "center", gap: 5,
              padding: "5px 12px", borderRadius: 6, textDecoration: "none",
              fontSize: 12, fontWeight: 600, color: "#fff", background: "#3B5BDB",
            }}
            className="hover:opacity-90 transition-opacity"
          >
            <Plus size={13} />
            심사 계획 등록
          </Link>
        )}
      </div>

      {/* ── 테이블 ── */}
      <div style={{ flex: 1, overflowY: "auto", background: "#fff" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 960 }}>
          <thead style={{ position: "sticky", top: 0, zIndex: 10, background: "#F8F8F8", borderBottom: "1px solid #E8E8E8" }}>
            <tr>
              {["심사번호", "심사유형", "대상 프로세스", "심사원", "예정일", "상태", "적합", "부적합", "관찰"].map((col, i) => (
                <th key={i} style={{ padding: "10px 14px", textAlign: "left", fontSize: 12, fontWeight: 600, color: "#555555", whiteSpace: "nowrap" }}>
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={9} style={{ textAlign: "center", padding: "48px 0", fontSize: 14, color: "#999999" }}>
                  해당하는 심사가 없습니다.
                </td>
              </tr>
            ) : (
              filtered.map((audit, i) => {
                const ss = STATUS_STYLE[audit.status];
                return (
                  <tr
                    key={audit.id}
                    onClick={() => router.push(`/audit/${audit.id}`)}
                    style={{
                      borderBottom: i < filtered.length - 1 ? "1px solid #F0F0F0" : "none",
                      cursor: "pointer",
                    }}
                    className="hover:bg-[#FAFAFA] transition-colors"
                  >
                    <td style={{ padding: "10px 14px", whiteSpace: "nowrap" }}>
                      <span style={{ fontFamily: "monospace", fontSize: 12, fontWeight: 700, color: "#3B5BDB" }}>
                        {audit.audit_number}
                      </span>
                    </td>
                    <td style={{ padding: "10px 14px", fontSize: 12, color: "#444444", whiteSpace: "nowrap" }}>
                      {TYPE_LABEL[audit.audit_type]}
                    </td>
                    <td style={{ padding: "10px 14px" }}>
                      <span style={{ fontSize: 14, color: "#1a1a1a", display: "block", maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {audit.target_process}
                      </span>
                    </td>
                    <td style={{ padding: "10px 14px", fontSize: 14, color: "#444444", whiteSpace: "nowrap" }}>
                      {audit.auditor_name}
                    </td>
                    <td style={{ padding: "10px 14px", fontSize: 12, color: "#444444", whiteSpace: "nowrap" }}>
                      {audit.planned_date}
                    </td>
                    <td style={{ padding: "10px 14px", whiteSpace: "nowrap" }}>
                      <span style={{ fontSize: 12, fontWeight: 600, padding: "2px 6px", borderRadius: 4, color: ss.color, background: ss.bg }}>
                        {ss.label}
                      </span>
                    </td>
                    <td style={{ padding: "10px 14px", fontSize: 12, fontWeight: 600, color: "#2F9E44", whiteSpace: "nowrap" }}>
                      {audit.conformity_count}
                    </td>
                    <td style={{ padding: "10px 14px", whiteSpace: "nowrap" }}>
                      <span style={{ fontSize: 12, fontWeight: 600, color: audit.nonconformity_count > 0 ? "#E03131" : "#888888" }}>
                        {audit.nonconformity_count}
                      </span>
                    </td>
                    <td style={{ padding: "10px 14px", fontSize: 12, fontWeight: 600, color: "#E67700", whiteSpace: "nowrap" }}>
                      {audit.observation_count}
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
          총 <span style={{ fontWeight: 600, color: "#555" }}>{filtered.length}</span>건 표시
          {activeTab !== "전체" && ` (전체 ${audits.length}건)`}
        </span>
      </div>
    </div>
  );
}
