"use client";
import type { TextData } from "@/types/sections";

interface Props { data: TextData; onChange: (d: TextData) => void; readonly?: boolean }

export default function SectionText({ data, onChange, readonly = false }: Props) {
  if (readonly) {
    return (
      <div style={{ fontSize: 14, color: "#374151", lineHeight: 1.75, whiteSpace: "pre-wrap" }}>
        {data.content || <span style={{ color: "#bbb", fontStyle: "italic" }}>내용 없음</span>}
      </div>
    );
  }
  return (
    <textarea
      value={data.content}
      onChange={e => onChange({ content: e.target.value })}
      placeholder="내용을 입력하세요. 마크다운 지원: **굵게**, *기울임*, - 목록"
      style={{
        width: "100%", minHeight: 140, padding: "10px 12px",
        fontSize: 14, color: "#374151", lineHeight: 1.75,
        border: "1px solid #E5E7EB", borderRadius: 8,
        resize: "vertical", outline: "none", boxSizing: "border-box",
        fontFamily: "inherit",
      }}
      className="focus:border-[#2563EB] transition-colors"
    />
  );
}
