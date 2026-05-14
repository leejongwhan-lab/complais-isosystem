"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Plus, Search } from "lucide-react";
import type { Capa } from "@/types/capa";
import StatCard from "@/components/common/StatCard";

// ── 상수 ──────────────────────────────────────────────────────
const GRADE_COLOR: Record<string, string> = { A: "#E03131", B: "#E67700", C: "#F59F00" };
type FilterKey = "전체" | "진행중" | "완료" | "기한초과";

// ── D 진행바 (3px, 8 세그먼트) ───────────────────────────────
function DBar({ step, status }: { step: number; status: string }) {
  if (status === "completed") return (
    <span style={{
      fontSize: 11, fontWeight: 600,
      color: "#2F9E44", background: "#F0FBF4",
      borderRadius: 4, padding: "2px 6px",
    }}>
      완료
    </span>
  );
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
      <div style={{ display: "flex", gap: 2 }}>
        {Array.from({ length: 8 }, (_, i) => (
          <div key={i} style={{
            width: 14, height: 3, borderRadius: 2,
            background: i < step ? "#3B5BDB" : i === step ? "#C5D0FF" : "#EBEBEB",
          }} />
        ))}
      </div>
      <span style={{ fontSize: 11, fontWeight: 700, color: "#3B5BDB", fontFamily: "monospace" }}>
        D{step}
      </span>
    </div>
  );
}

// ── 메인 컴포넌트 ─────────────────────────────────────────────
export default function CAPAClientView({ capas, canWrite = false, currentUserName = "" }: { capas: Capa[]; canWrite?: boolean; currentUserName?: string }) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<FilterKey>("전체");
  const [search, setSearch] = useState("");
  const [myOnly, setMyOnly] = useState(false);

  const today = useMemo(() => {
    const d = new Date(); d.setHours(0, 0, 0, 0);
    return d.toISOString().slice(0, 10);
  }, []);

  const firstOfMonth = useMemo(() => {
    const d = new Date(); d.setDate(1); d.setHours(0, 0, 0, 0);
    return d.toISOString().slice(0, 10);
  }, []);

  const stats = useMemo(() => ({
    total:            capas.length,
    active:           capas.filter(c => c.status !== "completed").length,
    overdue:          capas.filter(c => c.due_date && c.due_date < today && c.status !== "completed").length,
    monthlyCompleted: capas.filter(c => c.status === "completed" && c.updated_at.slice(0, 10) >= firstOfMonth).length,
  }), [capas, today, firstOfMonth]);

  const tabs: { key: FilterKey; count: number }[] = [
    { key: "전체",    count: capas.length },
    { key: "진행중",  count: stats.active },
    { key: "완료",    count: capas.filter(c => c.status === "completed").length },
    { key: "기한초과",count: stats.overdue },
  ];

  const filtered = useMemo(() => {
    let list = capas;
    if (activeTab === "진행중")   list = list.filter(c => c.status !== "completed");
    if (activeTab === "완료")     list = list.filter(c => c.status === "completed");
    if (activeTab === "기한초과") list = list.filter(c => c.due_date && c.due_date < today && c.status !== "completed");
    if (myOnly && currentUserName) list = list.filter(c => c.owner_name === currentUserName);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(c => c.title.toLowerCase().includes(q) || c.capa_number.toLowerCase().includes(q) || c.source.toLowerCase().includes(q));
    }
    return list;
  }, [capas, activeTab, search, today, myOnly, currentUserName]);

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "calc(100vh - 56px)" }}>

      {/* ── KPI 스트립 ── */}
      <div className="card-grid" style={{ padding: "16px 20px", borderBottom: "1px solid #EBEBEB", flexShrink: 0 }}>
        <StatCard label="전체 CAPA" value={stats.total} sub="등록 건수" />
        <StatCard label="진행중" value={stats.active} sub="미완료" />
        <StatCard label="기한 초과" value={stats.overdue} sub="즉시 확인" color={stats.overdue > 0 ? "red" : "default"} />
        <StatCard label="이번달 완료" value={stats.monthlyCompleted} sub="이번달 종결" color="green" />
      </div>

      {/* ── 툴바 ── */}
      <div style={{
        background: "#fff", borderBottom: "1px solid #E8E8E8",
        padding: "10px 16px", display: "flex", alignItems: "center", gap: 8, flexShrink: 0,
      }}>
        {/* 필터 탭 */}
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
                background: activeTab === t.key ? "#3B5BDB" : (t.key === "기한초과" && t.count > 0) ? "#FFF0F0" : "#F0F0F0",
                color: activeTab === t.key ? "#fff" : (t.key === "기한초과" && t.count > 0) ? "#E03131" : "#999",
              }}>
                {t.count}
              </span>
            </button>
          ))}
        </div>

        {currentUserName && (
          <button
            onClick={() => setMyOnly(v => !v)}
            style={{
              padding: "5px 10px", borderRadius: 4, cursor: "pointer",
              fontSize: 12, fontWeight: myOnly ? 600 : 400,
              border: myOnly ? "1px solid #3B5BDB" : "1px solid #E8E8E8",
              background: myOnly ? "#EFF6FF" : "#fff",
              color: myOnly ? "#3B5BDB" : "#555",
            }}
          >
            {myOnly ? "✓ 내 CAPA" : "내 CAPA만"}
          </button>
        )}

        <div style={{ flex: 1 }} />

        {/* 검색 */}
        <div style={{ position: "relative" }}>
          <Search size={13} color="#bbb" style={{ position: "absolute", left: 9, top: "50%", transform: "translateY(-50%)" }} />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="CAPA 번호, 제목 검색..."
            style={{
              paddingLeft: 28, paddingRight: 12, paddingTop: 6, paddingBottom: 6,
              fontSize: 13, background: "#fff",
              border: "1px solid #E5E5E5", borderRadius: 6,
              width: 220, outline: "none", color: "#1a1a1a",
            }}
            className="focus:border-[#3B5BDB] transition-colors placeholder:text-[#bbb]"
          />
        </div>

        {/* 등록 버튼 */}
        {canWrite && <Link
          href="/capa/new"
          style={{
            display: "flex", alignItems: "center", gap: 5,
            padding: "5px 12px", borderRadius: 6, textDecoration: "none",
            fontSize: 12, fontWeight: 600, color: "#fff", background: "#3B5BDB",
          }}
          className="hover:opacity-90 transition-opacity"
        >
          <Plus size={13} />
          CAPA 등록
        </Link>}
      </div>

      {/* ── 테이블 ── */}
      <div style={{ flex: 1, overflowY: "auto", background: "#fff" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 960 }}>
          <thead style={{ position: "sticky", top: 0, zIndex: 10, background: "#F8F8F8", borderBottom: "1px solid #E8E8E8" }}>
            <tr>
              {["CAPA 번호", "제목", "발생원", "등급", "현재 단계", "담당자", "마감일", "상태"].map((col, i) => (
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
                  {capas.length === 0 ? (
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
                      <span style={{ fontSize: 36 }}>📋</span>
                      <p style={{ margin: 0, fontSize: 15, fontWeight: 600, color: "#333" }}>아직 등록된 CAPA가 없습니다</p>
                      <p style={{ margin: 0, fontSize: 13, color: "#999" }}>부적합 또는 개선 사항을 CAPA로 등록하고 추적하세요.</p>
                      {canWrite && (
                        <a href="/capa/new" style={{ marginTop: 4, padding: "7px 20px", borderRadius: 6, background: "#3B5BDB", color: "#fff", fontSize: 13, fontWeight: 600, textDecoration: "none" }}>
                          + CAPA 등록
                        </a>
                      )}
                    </div>
                  ) : (
                    <span style={{ fontSize: 14, color: "#999" }}>해당하는 CAPA가 없습니다.</span>
                  )}
                </td>
              </tr>
            ) : (
              filtered.map((capa, i) => {
                const isOverdue = !!(capa.due_date && capa.due_date < today && capa.status !== "completed");
                const dday = (() => {
                  if (!capa.due_date || capa.status === "completed") return null;
                  const diff = Math.ceil((new Date(capa.due_date).setHours(0,0,0,0) - new Date(today).setHours(0,0,0,0)) / 86400000);
                  const text = diff < 0 ? `D+${Math.abs(diff)}` : diff === 0 ? "D-Day" : `D-${diff}`;
                  const color = diff <= 3 ? "#E03131" : diff <= 7 ? "#E67700" : "#999";
                  return { text, color };
                })();

                return (
                  <tr
                    key={capa.id}
                    onClick={() => router.push(`/capa/${capa.id}`)}
                    style={{
                      borderBottom: i < filtered.length - 1 ? "1px solid #F0F0F0" : "none",
                      cursor: "pointer",
                    }}
                    className="hover:bg-[#FAFAFA] transition-colors"
                  >
                    <td style={{ padding: "10px 14px", whiteSpace: "nowrap" }}>
                      <span style={{ fontFamily: "monospace", fontSize: 12, fontWeight: 700, color: "#3B5BDB" }}>
                        {capa.capa_number}
                      </span>
                    </td>
                    <td style={{ padding: "10px 14px" }}>
                      <span style={{ fontSize: 14, color: "#1a1a1a", display: "block", maxWidth: 220, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {capa.title}
                      </span>
                    </td>
                    <td style={{ padding: "10px 14px", fontSize: 12, color: "#444444", whiteSpace: "nowrap" }}>
                      {capa.source}
                    </td>
                    <td style={{ padding: "10px 14px", whiteSpace: "nowrap" }}>
                      <span style={{ fontSize: 12, fontWeight: 700, color: GRADE_COLOR[capa.grade] }}>
                        {capa.grade}급
                      </span>
                    </td>
                    <td style={{ padding: "10px 14px", whiteSpace: "nowrap" }}>
                      <DBar step={capa.current_step} status={capa.status} />
                    </td>
                    <td style={{ padding: "10px 14px", fontSize: 14, color: "#444444", whiteSpace: "nowrap" }}>
                      {capa.owner_name ?? "—"}
                    </td>
                    <td style={{ padding: "10px 14px", whiteSpace: "nowrap" }}>
                      <span style={{ fontSize: 12, color: "#444444" }}>{capa.due_date ?? "—"}</span>
                      {dday && (
                        <span style={{ marginLeft: 6, fontSize: 12, fontWeight: 600, color: dday.color }}>
                          {dday.text}
                        </span>
                      )}
                    </td>
                    <td style={{ padding: "10px 14px", whiteSpace: "nowrap" }}>
                      {capa.status === "completed" ? (
                        <span style={{ fontSize: 11, fontWeight: 600, color: "#2F9E44", background: "#F0FBF4", borderRadius: 4, padding: "2px 6px" }}>완료</span>
                      ) : isOverdue ? (
                        <span style={{ fontSize: 11, fontWeight: 600, color: "#E03131", background: "#FFF0F0", borderRadius: 4, padding: "2px 6px" }}>기한초과</span>
                      ) : (
                        <span style={{ fontSize: 11, fontWeight: 600, color: "#3B5BDB", background: "#EEF2FF", borderRadius: 4, padding: "2px 6px" }}>진행중</span>
                      )}
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
          {activeTab !== "전체" && ` (전체 ${capas.length}건)`}
        </span>
      </div>
    </div>
  );
}
