"use client";

import { useRouter, useSearchParams } from "next/navigation";

interface Counts {
  layerCounts: Record<string, number>;
  typeCounts: Record<string, number>;
  statusCounts: Record<string, number>;
  total: number;
}

const LAYERS = [
  { value: "", label: "전체" },
  { value: "C", label: "공통 (C)" },
  { value: "I", label: "특화 (I)" },
  { value: "E", label: "환경안전 (E)" },
];

const TYPES = [
  { value: "M", label: "매뉴얼" },
  { value: "P", label: "프로세스" },
  { value: "R", label: "지침서" },
  { value: "F", label: "서식" },
];

const STATUSES = [
  { value: "active",   label: "유효",     alert: false },
  { value: "review",   label: "검토대기", alert: true },
  { value: "draft",    label: "초안",     alert: false },
  { value: "obsolete", label: "폐기",     alert: false },
];

export default function DocumentsFilterSidebar({ layerCounts, typeCounts, statusCounts, total }: Counts) {
  const router = useRouter();
  const sp = useSearchParams();
  const activeLayer  = sp.get("layer")  ?? "";
  const activeType   = sp.get("type")   ?? "";
  const activeStatus = sp.get("status") ?? "";

  function navigate(key: string, value: string) {
    const params = new URLSearchParams(sp.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    router.push(`/documents?${params.toString()}`);
  }

  return (
    <aside style={{
      width: 192, flexShrink: 0,
      background: "#fff", borderRight: "1px solid #E5E5E5",
      overflowY: "auto",
    }}>
      {/* 레이어 */}
      <div style={{ padding: "16px 12px 10px" }}>
        <p style={{ margin: "0 0 6px 4px", fontSize: 10, fontWeight: 600, color: "#bbb", textTransform: "uppercase", letterSpacing: "0.06em" }}>
          레이어
        </p>
        {LAYERS.map(item => {
          const count = item.value === "" ? total : (layerCounts[item.value] ?? 0);
          const active = activeLayer === item.value;
          return (
            <button
              key={item.value}
              onClick={() => navigate("layer", item.value)}
              style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                width: "100%", padding: "5px 8px", borderRadius: 5,
                border: "none", cursor: "pointer", marginBottom: 1,
                background: active ? "#EEF2FF" : "transparent",
                color: active ? "#3B5BDB" : "#555",
              }}
              className={!active ? "hover:bg-[#F5F5F5] transition-colors" : ""}
            >
              <span style={{ fontSize: 13, fontWeight: active ? 600 : 400 }}>{item.label}</span>
              <span style={{ fontSize: 11, color: active ? "#3B5BDB" : "#bbb" }}>{count}</span>
            </button>
          );
        })}
      </div>

      <div style={{ height: 1, background: "#F0F0F0", margin: "0 12px" }} />

      {/* 유형 */}
      <div style={{ padding: "10px 12px" }}>
        <p style={{ margin: "0 0 6px 4px", fontSize: 10, fontWeight: 600, color: "#bbb", textTransform: "uppercase", letterSpacing: "0.06em" }}>
          유형
        </p>
        {TYPES.map(item => {
          const count  = typeCounts[item.value] ?? 0;
          const active = activeType === item.value;
          return (
            <button
              key={item.value}
              onClick={() => navigate("type", active ? "" : item.value)}
              style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                width: "100%", padding: "5px 8px", borderRadius: 5,
                border: "none", cursor: "pointer", marginBottom: 1,
                background: active ? "#EEF2FF" : "transparent",
                color: active ? "#3B5BDB" : "#555",
              }}
              className={!active ? "hover:bg-[#F5F5F5] transition-colors" : ""}
            >
              <span style={{ fontSize: 13, fontWeight: active ? 600 : 400 }}>{item.label}</span>
              <span style={{ fontSize: 11, color: active ? "#3B5BDB" : "#bbb" }}>{count}</span>
            </button>
          );
        })}
      </div>

      <div style={{ height: 1, background: "#F0F0F0", margin: "0 12px" }} />

      {/* 상태 */}
      <div style={{ padding: "10px 12px" }}>
        <p style={{ margin: "0 0 6px 4px", fontSize: 10, fontWeight: 600, color: "#bbb", textTransform: "uppercase", letterSpacing: "0.06em" }}>
          상태
        </p>
        {STATUSES.map(item => {
          const count = statusCounts[item.value] ?? 0;
          const active = activeStatus === item.value;
          return (
            <button
              key={item.value}
              onClick={() => navigate("status", active ? "" : item.value)}
              style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                width: "100%", padding: "5px 8px", borderRadius: 5,
                border: "none", cursor: "pointer", marginBottom: 1,
                background: active ? "#EEF2FF" : "transparent",
                color: active ? "#3B5BDB" : "#555",
              }}
              className={!active ? "hover:bg-[#F5F5F5] transition-colors" : ""}
            >
              <span style={{ fontSize: 13, fontWeight: active ? 600 : 400 }}>{item.label}</span>
              {item.alert && count > 0 ? (
                <span style={{ fontSize: 11, fontWeight: 700, color: "#E03131", background: "#FFF0F0", borderRadius: 8, padding: "0 5px" }}>
                  {count}
                </span>
              ) : (
                <span style={{ fontSize: 11, color: active ? "#3B5BDB" : "#bbb" }}>{count}</span>
              )}
            </button>
          );
        })}
      </div>
    </aside>
  );
}
