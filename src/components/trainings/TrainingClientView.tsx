"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Plus, Search } from "lucide-react";
import type { Training, TrainingType, TrainingStatus } from "@/types/training";
import StatCard from "@/components/common/StatCard";

const TYPE_LABEL: Record<TrainingType, string> = {
  internal: "내부교육",
  external: "외부교육",
  ojt:      "OJT",
};

const STATUS_STYLE: Record<TrainingStatus, { label: string; color: string; bg: string }> = {
  planned:     { label: "예정",   color: "#999",    bg: "#F5F5F5" },
  in_progress: { label: "진행중", color: "#3B5BDB", bg: "#EEF2FF" },
  completed:   { label: "완료",   color: "#2F9E44", bg: "#F0FBF4" },
};

type FilterKey = "전체" | "예정" | "진행중" | "완료";

function RateBar({ rate }: { rate: number }) {
  const color = rate === 100 ? "#2F9E44" : rate >= 80 ? "#3B5BDB" : "#E67700";
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 100 }}>
      <span style={{ fontSize: 12, fontWeight: 700, color, minWidth: 34 }}>{rate}%</span>
      <div style={{ flex: 1, height: 3, background: "#F0F0F0", borderRadius: 2 }}>
        <div style={{ height: "100%", width: `${rate}%`, background: color, borderRadius: 2 }} />
      </div>
    </div>
  );
}

export default function TrainingClientView({ trainings }: { trainings: Training[] }) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<FilterKey>("전체");
  const [search, setSearch] = useState("");

  const stats = useMemo(() => {
    const totalPlan      = trainings.reduce((s, t) => s + t.total_count, 0);
    const totalCompleted = trainings.reduce((s, t) => s + t.completed_count, 0);
    return {
      total:          trainings.length,
      completed:      trainings.filter(t => t.status === "completed").length,
      completionRate: totalPlan > 0 ? Math.round((totalCompleted / totalPlan) * 100) : 0,
      missing:        totalPlan - totalCompleted,
    };
  }, [trainings]);

  const tabs: { key: FilterKey; count: number }[] = [
    { key: "전체",  count: trainings.length },
    { key: "예정",  count: trainings.filter(t => t.status === "planned").length },
    { key: "진행중", count: trainings.filter(t => t.status === "in_progress").length },
    { key: "완료",  count: stats.completed },
  ];

  const filtered = useMemo(() => {
    let list = trainings;
    if (activeTab === "예정")   list = list.filter(t => t.status === "planned");
    if (activeTab === "진행중") list = list.filter(t => t.status === "in_progress");
    if (activeTab === "완료")   list = list.filter(t => t.status === "completed");
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(t => t.title.toLowerCase().includes(q));
    }
    return list;
  }, [trainings, activeTab, search]);

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "calc(100vh - 56px)" }}>

      {/* ── KPI 스트립 ── */}
      <div className="card-grid" style={{ padding: "16px 20px", borderBottom: "1px solid #F0F0F0", flexShrink: 0 }}>
        <StatCard label="연간 계획" value={String(stats.total)} sub="등록 건수" />
        <StatCard label="완료" value={String(stats.completed)} sub="종결" color="green" />
        <StatCard label="이수율" value={`${stats.completionRate}%`} sub="전체 대비" />
        <StatCard label="미이수 인원" value={String(stats.missing)} sub="미완료" color={stats.missing > 0 ? "orange" : "default"} />
      </div>

      {/* ── 툴바 ── */}
      <div style={{
        background: "#fff", borderBottom: "1px solid #E5E5E5",
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
                fontSize: 12, fontWeight: activeTab === t.key ? 600 : 400,
                border: activeTab === t.key ? "1px solid #3B5BDB" : "1px solid #E5E5E5",
                background: activeTab === t.key ? "#EEF2FF" : "#fff",
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
            placeholder="교육명 검색..."
            style={{
              paddingLeft: 28, paddingRight: 12, paddingTop: 6, paddingBottom: 6,
              fontSize: 13, background: "#fff",
              border: "1px solid #E5E5E5", borderRadius: 6,
              width: 200, outline: "none", color: "#1a1a1a",
            }}
            className="focus:border-[#3B5BDB] transition-colors placeholder:text-[#bbb]"
          />
        </div>

        <Link
          href="/trainings/new"
          style={{
            display: "flex", alignItems: "center", gap: 5,
            padding: "5px 12px", borderRadius: 6, textDecoration: "none",
            fontSize: 12, fontWeight: 600, color: "#fff", background: "#3B5BDB",
          }}
          className="hover:opacity-90 transition-opacity"
        >
          <Plus size={13} />
          교육 등록
        </Link>
      </div>

      {/* ── 테이블 ── */}
      <div style={{ flex: 1, overflowY: "auto", background: "#fff" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 900 }}>
          <thead style={{ position: "sticky", top: 0, zIndex: 10, background: "#FAFAFA", borderBottom: "1px solid #E5E5E5" }}>
            <tr>
              {["교육명", "유형", "예정일", "계획인원", "이수인원", "이수율", "상태"].map((col, i) => (
                <th key={i} style={{ padding: "8px 14px", textAlign: "left", fontSize: 11, fontWeight: 600, color: "#999", whiteSpace: "nowrap" }}>
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ textAlign: "center", padding: "64px 0" }}>
                  {trainings.length === 0 ? (
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
                      <span style={{ fontSize: 36 }}>🎓</span>
                      <p style={{ margin: 0, fontSize: 15, fontWeight: 600, color: "#333" }}>아직 등록된 교육이 없습니다</p>
                      <p style={{ margin: 0, fontSize: 13, color: "#999" }}>임직원 교육훈련 계획을 등록하고 이수 현황을 관리하세요.</p>
                      <a href="/trainings/new" style={{ marginTop: 4, padding: "7px 20px", borderRadius: 6, background: "#3B5BDB", color: "#fff", fontSize: 13, fontWeight: 600, textDecoration: "none" }}>
                        + 교육 등록
                      </a>
                    </div>
                  ) : (
                    <span style={{ fontSize: 14, color: "#999" }}>해당하는 교육이 없습니다.</span>
                  )}
                </td>
              </tr>
            ) : (
              filtered.map((t, i) => {
                const ss   = STATUS_STYLE[t.status];
                const rate = t.total_count > 0
                  ? Math.round((t.completed_count / t.total_count) * 100)
                  : 0;
                return (
                  <tr
                    key={t.id}
                    onClick={() => router.push(`/trainings/${t.id}`)}
                    style={{ borderBottom: i < filtered.length - 1 ? "1px solid #F0F0F0" : "none", cursor: "pointer" }}
                    className="hover:bg-[#FAFAFA] transition-colors"
                  >
                    <td style={{ padding: "9px 14px" }}>
                      <span style={{ fontSize: 13, color: "#1a1a1a", display: "block", maxWidth: 260, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {t.title}
                      </span>
                    </td>
                    <td style={{ padding: "9px 14px", whiteSpace: "nowrap" }}>
                      <span style={{
                        fontSize: 11, fontWeight: 500, padding: "2px 6px", borderRadius: 4,
                        color: "#555", background: "#F5F5F5",
                      }}>
                        {TYPE_LABEL[t.type]}
                      </span>
                    </td>
                    <td style={{ padding: "9px 14px", fontSize: 12, color: "#555", whiteSpace: "nowrap" }}>
                      {t.planned_date}
                    </td>
                    <td style={{ padding: "9px 14px", fontSize: 12, color: "#555", textAlign: "right", whiteSpace: "nowrap" }}>
                      {t.total_count}명
                    </td>
                    <td style={{ padding: "9px 14px", fontSize: 12, color: "#555", textAlign: "right", whiteSpace: "nowrap" }}>
                      {t.completed_count}명
                    </td>
                    <td style={{ padding: "9px 14px", minWidth: 130 }}>
                      <RateBar rate={rate} />
                    </td>
                    <td style={{ padding: "9px 14px", whiteSpace: "nowrap" }}>
                      <span style={{
                        fontSize: 11, fontWeight: 600, padding: "2px 6px", borderRadius: 4,
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
        <span style={{ fontSize: 12, color: "#999" }}>
          총 <span style={{ fontWeight: 600, color: "#555" }}>{filtered.length}</span>건 표시
          {activeTab !== "전체" && ` (전체 ${trainings.length}건)`}
        </span>
      </div>
    </div>
  );
}
