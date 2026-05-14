"use client";
import type { PurposeData } from "@/types/sections";

interface Props { data: PurposeData; onChange: (d: PurposeData) => void; readonly?: boolean }

export default function SectionPurpose({ data, onChange, readonly = false }: Props) {
  if (readonly) {
    return (
      <p style={{ margin: 0, fontSize: 14, color: "#374151", lineHeight: 1.75, whiteSpace: "pre-wrap" }}>
        {data.content || <span style={{ color: "#bbb", fontStyle: "italic" }}>내용 없음</span>}
      </p>
    );
  }
  return (
    <textarea
      value={data.content}
      onChange={e => onChange({ content: e.target.value })}
      placeholder={"이 문서/프로세스의 목적을 기술하세요.\n예: 본 절차서는 내부심사 계획, 실시, 보고 및 시정조치 처리에 대한 요구사항을 규정한다."}
      style={{
        width: "100%", minHeight: 120, padding: "10px 12px",
        fontSize: 14, color: "#374151", lineHeight: 1.75,
        border: "1px solid #E5E7EB", borderRadius: 8,
        resize: "vertical", outline: "none", boxSizing: "border-box",
        fontFamily: "inherit",
      }}
      className="focus:border-[#2563EB] transition-colors"
    />
  );
}
