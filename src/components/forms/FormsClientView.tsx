"use client";

import { useState } from "react";
import Link from "next/link";
import { FormTemplate } from "@/types/form";

const CATEGORY_COLORS: Record<string, string> = {
  "경영관리":   "#3B5BDB",
  "고객영업":   "#2F9E44",
  "구매공급자": "#E67700",
  "생산관리":   "#7048E8",
  "품질관리":   "#E03131",
  "인사교육":   "#1098AD",
  "환경안전":   "#2F9E44",
  "신제품개발": "#D6336C",
  "식품안전":   "#087F5B",
  "사업연속성": "#1C7ED6",
  "의료기기":   "#D6336C",
  "AI경영":     "#9C36B5",
  "원자력품질": "#F08C00",
  "화장품GMP":  "#E64980",
};

const ALL_STANDARDS = [
  { key: "전체",      label: "전체",        color: "#555",    bg: "#F0F0F0" },
  { key: "common",    label: "공통",        color: "#555",    bg: "#F0F0F0" },
  { key: "iso9001",   label: "ISO 9001",   color: "#3B5BDB", bg: "#EEF2FF" },
  { key: "iso14001",  label: "ISO 14001",  color: "#2F9E44", bg: "#EBFBEE" },
  { key: "iso45001",  label: "ISO 45001",  color: "#E67700", bg: "#FFF9DB" },
  { key: "iso50001",  label: "ISO 50001",  color: "#E67700", bg: "#FFEAAF" },
  { key: "iso37001",  label: "ISO 37001",  color: "#E03131", bg: "#FFF0F0" },
  { key: "iso37301",  label: "ISO 37301",  color: "#1098AD", bg: "#E3FAFC" },
  { key: "iso27001",  label: "ISO 27001",  color: "#7048E8", bg: "#F3F0FF" },
  { key: "iso22000",  label: "ISO 22000",  color: "#087F5B", bg: "#E6FCF5" },
  { key: "iso22301",  label: "ISO 22301",  color: "#1C7ED6", bg: "#D0EBFF" },
  { key: "iso13485",  label: "ISO 13485",  color: "#D6336C", bg: "#FFE3EC" },
  { key: "iso42001",  label: "ISO 42001",  color: "#9C36B5", bg: "#F8F0FC" },
  { key: "iso19443",  label: "ISO 19443",  color: "#F08C00", bg: "#FFF3BF" },
  { key: "iatf16949", label: "IATF 16949", color: "#5F3DC4", bg: "#EDE9FE" },
  { key: "iso22716",  label: "ISO 22716",  color: "#E64980", bg: "#FFE3EC" },
] as const;

type StandardKey = typeof ALL_STANDARDS[number]["key"];

interface CategoryCount { name: string; count: number; }

interface FormsClientViewProps {
  templates: FormTemplate[];
  categories: CategoryCount[];
  enabledStandards: string[];
}

export default function FormsClientView({ templates, categories, enabledStandards }: FormsClientViewProps) {
  const [selectedCat, setSelectedCat] = useState("전체");
  const [selectedStd, setSelectedStd] = useState<StandardKey>("전체");
  const [search, setSearch] = useState("");

  console.log("[FormsClientView] templates received:", templates?.length);
  console.log("[FormsClientView] enabledStandards:", enabledStandards);

  const enabledSet = new Set(enabledStandards);
  const visibleStandards = ALL_STANDARDS.filter(s => enabledSet.has(s.key));

  // 회사가 활성화한 표준 서식만 표시 (common/null/빈문자열 및 iso9001 은 항상 포함)
  // enabledStandards 가 비어있으면(폴백) 전체 표시
  const noFilter = enabledStandards.length <= 2; // ["전체","common"] 뿐이면 전체 표시
  const availableTemplates = noFilter ? templates : templates.filter(t => {
    const std = t.standard ?? "";
    return !std || std === "common" || enabledSet.has(std);
  });

  console.log("[FormsClientView] noFilter:", noFilter, "availableTemplates:", availableTemplates?.length);

  const stdFiltered = selectedStd === "전체"
    ? availableTemplates
    : availableTemplates.filter(t => t.standard === selectedStd);

  const catCounts = new Map<string, number>();
  for (const t of stdFiltered) {
    catCounts.set(t.category, (catCounts.get(t.category) ?? 0) + 1);
  }

  const filtered = stdFiltered.filter(t => {
    const matchCat = selectedCat === "전체" || t.category === selectedCat;
    const q = search.toLowerCase();
    const matchSearch = !q || t.form_name.toLowerCase().includes(q) || t.form_code.toLowerCase().includes(q);
    return matchCat && matchSearch;
  });

  function handleStdClick(key: StandardKey) {
    setSelectedStd(key);
    setSelectedCat("전체");
  }

  return (
    <div style={{ display: "flex", height: "calc(100vh - 56px)" }}>
      {/* 사이드바 */}
      <aside style={{
        width: 200, flexShrink: 0,
        borderRight: "1px solid #F0F0F0",
        padding: "16px 8px",
        overflowY: "auto",
      }}>
        {/* 표준 필터 */}
        <p style={{ margin: "0 8px 8px", fontSize: 10, fontWeight: 600, color: "#ccc", letterSpacing: "0.06em", textTransform: "uppercase" }}>
          표준
        </p>
        {visibleStandards.map(s => {
          const count = s.key === "전체"
            ? availableTemplates.length
            : availableTemplates.filter(t => t.standard === s.key).length;
          const active = selectedStd === s.key;
          return (
            <button
              key={s.key}
              onClick={() => handleStdClick(s.key)}
              style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                width: "100%", padding: "5px 10px", borderRadius: 6,
                border: "none", cursor: "pointer", textAlign: "left",
                background: active ? s.bg : "transparent",
                color: active ? s.color : "#555",
                marginBottom: 2,
              }}
              className={!active ? "hover:bg-[#F5F5F5] transition-colors" : ""}
            >
              <span style={{ fontSize: 12, fontWeight: active ? 600 : 400 }}>{s.label}</span>
              <span style={{
                fontSize: 11, padding: "1px 5px", borderRadius: 8,
                background: active ? `${s.color}20` : "#F0F0F0",
                color: active ? s.color : "#999",
              }}>
                {count}
              </span>
            </button>
          );
        })}

        {/* 카테고리 필터 */}
        <p style={{ margin: "16px 8px 8px", fontSize: 10, fontWeight: 600, color: "#ccc", letterSpacing: "0.06em", textTransform: "uppercase" }}>
          카테고리
        </p>
        {/* 전체 카테고리 */}
        <button
          onClick={() => setSelectedCat("전체")}
          style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            width: "100%", padding: "6px 10px", borderRadius: 6,
            border: "none", cursor: "pointer", textAlign: "left",
            background: selectedCat === "전체" ? "#EEF2FF" : "transparent",
            color: selectedCat === "전체" ? "#3B5BDB" : "#555",
            marginBottom: 2,
          }}
          className={selectedCat !== "전체" ? "hover:bg-[#F5F5F5] transition-colors" : ""}
        >
          <span style={{ fontSize: 13, fontWeight: selectedCat === "전체" ? 600 : 400 }}>전체</span>
          <span style={{
            fontSize: 11, padding: "1px 6px", borderRadius: 8,
            background: selectedCat === "전체" ? "#D0E4FF" : "#F0F0F0",
            color: selectedCat === "전체" ? "#3B5BDB" : "#999",
          }}>
            {stdFiltered.length}
          </span>
        </button>
        {categories.map(cat => {
          const count = catCounts.get(cat.name) ?? 0;
          if (count === 0) return null;
          const active = selectedCat === cat.name;
          return (
            <button
              key={cat.name}
              onClick={() => setSelectedCat(cat.name)}
              style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                width: "100%", padding: "6px 10px", borderRadius: 6,
                border: "none", cursor: "pointer", textAlign: "left",
                background: active ? "#EEF2FF" : "transparent",
                color: active ? "#3B5BDB" : "#555",
                marginBottom: 2,
              }}
              className={!active ? "hover:bg-[#F5F5F5] transition-colors" : ""}
            >
              <span style={{ fontSize: 13, fontWeight: active ? 600 : 400 }}>{cat.name}</span>
              <span style={{
                fontSize: 11, padding: "1px 6px", borderRadius: 8,
                background: active ? "#D0E4FF" : "#F0F0F0",
                color: active ? "#3B5BDB" : "#999",
              }}>
                {count}
              </span>
            </button>
          );
        })}
      </aside>

      {/* 메인 영역 */}
      <div style={{ flex: 1, overflowY: "auto", padding: 24 }}>
        {/* 검색 */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="서식명 또는 코드 검색..."
            style={{
              flex: 1, maxWidth: 320, padding: "7px 12px", fontSize: 13,
              border: "1px solid #E5E5E5", borderRadius: 6, outline: "none",
            }}
            className="focus:border-[#3B5BDB] transition-colors placeholder:text-[#bbb]"
          />
          <span style={{ fontSize: 13, color: "#bbb" }}>
            {filtered.length}개의 서식
          </span>
        </div>

        {/* 카드 그리드 */}
        {filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 0", color: "#bbb", fontSize: 14 }}>
            검색 결과가 없습니다
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
            {filtered.map(t => {
              const catColor = CATEGORY_COLORS[t.category] ?? "#888";
              const std = ALL_STANDARDS.find(s => s.key === t.standard);
              return (
                <div
                  key={t.form_code}
                  style={{
                    background: "#fff", border: "1px solid #E5E5E5", borderRadius: 8,
                    padding: 20, display: "flex", flexDirection: "column", gap: 12,
                  }}
                  className="hover:shadow-sm transition-shadow"
                >
                  {/* 상단: 코드 + 뱃지 */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
                    <span style={{ fontSize: 11, color: "#bbb", fontWeight: 500, fontFamily: "monospace" }}>
                      {t.form_code}
                    </span>
                    <div style={{ display: "flex", gap: 4, flexWrap: "wrap", justifyContent: "flex-end" }}>
                      {std && std.key !== "전체" && (
                        <span style={{
                          fontSize: 10, padding: "2px 6px", borderRadius: 8,
                          background: std.bg, color: std.color, fontWeight: 600,
                          whiteSpace: "nowrap",
                        }}>
                          {std.label}
                        </span>
                      )}
                      <span style={{
                        fontSize: 11, padding: "2px 8px", borderRadius: 10,
                        background: `${catColor}15`, color: catColor, fontWeight: 600,
                        whiteSpace: "nowrap",
                      }}>
                        {t.category}
                      </span>
                    </div>
                  </div>

                  {/* 서식명 */}
                  <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: "#1a1a1a", lineHeight: 1.4 }}>
                    {t.form_name}
                  </p>

                  {/* ISO 조항 */}
                  {t.iso_clause && (
                    <p style={{ margin: 0, fontSize: 12, color: "#999" }}>조항 {t.iso_clause}</p>
                  )}

                  {/* 하단 버튼 */}
                  <div style={{ display: "flex", gap: 8, marginTop: "auto" }}>
                    <Link
                      href={`/forms/${t.form_code}/new`}
                      style={{
                        flex: 1, textAlign: "center", fontSize: 12, fontWeight: 600,
                        padding: "6px 0", borderRadius: 5,
                        background: "#3B5BDB", color: "#fff", textDecoration: "none",
                      }}
                      className="hover:opacity-90 transition-opacity"
                    >
                      새 서식 작성
                    </Link>
                    <Link
                      href={`/forms/${t.form_code}/records`}
                      style={{
                        flex: 1, textAlign: "center", fontSize: 12, fontWeight: 500,
                        padding: "6px 0", borderRadius: 5,
                        background: "#fff", color: "#555",
                        border: "1px solid #E5E5E5", textDecoration: "none",
                      }}
                      className="hover:bg-[#F5F5F5] transition-colors"
                    >
                      기록 보기
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
