"use client";

import { useRouter } from "next/navigation";
import { Eye, Pencil } from "lucide-react";
import type { Document } from "@/types/document";

const LAYER_COLOR: Record<string, { color: string; bg: string }> = {
  C: { color: "#3B5BDB", bg: "#EEF2FF" },
  I: { color: "#E67700", bg: "#FFF9DB" },
  E: { color: "#2F9E44", bg: "#F0FBF4" },
};

const STATUS_STYLE: Record<string, { label: string; color: string; bg: string }> = {
  active:   { label: "유효",     color: "#2F9E44", bg: "#F0FBF4" },
  review:   { label: "검토대기", color: "#E03131", bg: "#FFF0F0" },
  draft:    { label: "초안",     color: "#999",    bg: "#F5F5F5" },
  obsolete: { label: "폐기",     color: "#bbb",    bg: "#F5F5F5" },
};

const VALID_DOC_NUM = /^[A-Z0-9]{2,5}-[A-Z]-\d{3}-[A-Z]-\d{2}$/;

export default function DocumentRow({ doc, isLast }: { doc: Document; isLast: boolean }) {
  const router = useRouter();
  const ls = LAYER_COLOR[doc.layer]  ?? { color: "#999", bg: "#F5F5F5" };
  const sd = STATUS_STYLE[doc.status] ?? { label: doc.status, color: "#999", bg: "#F5F5F5" };
  const isValidDocNum = VALID_DOC_NUM.test(doc.doc_number);

  return (
    <tr
      onClick={() => router.push(`/documents/${doc.id}`)}
      style={{ borderBottom: isLast ? "none" : "1px solid #F0F0F0" }}
      className="hover:bg-[#FAFAFA] transition-colors group cursor-pointer"
    >
      {/* 문서번호 */}
      <td style={{ padding: "9px 14px", whiteSpace: "nowrap" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
          {!isValidDocNum && (
            <span title="잘못된 채번 형식" style={{ fontSize: 11, color: "#E67700" }}>⚠</span>
          )}
          <span style={{
            fontFamily: "monospace", fontSize: 12, fontWeight: 700,
            color: isValidDocNum ? "#3B5BDB" : "#E67700",
          }}>
            {doc.doc_number}
          </span>
        </div>
      </td>

      {/* 문서명 */}
      <td style={{ padding: "9px 14px" }}>
        <p style={{ margin: 0, fontSize: 13, fontWeight: 500, color: "#1a1a1a" }}>{doc.title}</p>
        {doc.description && (
          <p style={{ margin: 0, fontSize: 11, color: "#999", marginTop: 1 }}>{doc.description}</p>
        )}
      </td>

      {/* 레이어 */}
      <td style={{ padding: "9px 14px", whiteSpace: "nowrap" }}>
        <span style={{
          fontSize: 11, fontWeight: 700, borderRadius: 4,
          padding: "2px 6px",
          color: ls.color, background: ls.bg,
        }}>
          {doc.layer}
        </span>
      </td>

      {/* 버전 */}
      <td style={{ padding: "9px 14px", fontSize: 12, color: "#999", fontFamily: "monospace", whiteSpace: "nowrap" }}>
        {doc.version}
      </td>

      {/* 상태 */}
      <td style={{ padding: "9px 14px", whiteSpace: "nowrap" }}>
        <span style={{
          fontSize: 11, fontWeight: 600, borderRadius: 4,
          padding: "2px 6px",
          color: sd.color, background: sd.bg,
        }}>
          {sd.label}
        </span>
      </td>

      {/* 담당자 */}
      <td style={{ padding: "9px 14px", fontSize: 13, color: "#555", whiteSpace: "nowrap" }}>
        {doc.owner_name ?? "—"}
      </td>

      {/* 최종수정 */}
      <td style={{ padding: "9px 14px", fontSize: 12, color: "#999", whiteSpace: "nowrap" }}>
        {doc.updated_at.slice(0, 10)}
      </td>

      {/* 액션 */}
      <td style={{ padding: "9px 14px", whiteSpace: "nowrap" }}>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={e => { e.stopPropagation(); router.push(`/documents/${doc.id}`); }}
            style={{ padding: 5, borderRadius: 5, border: "none", background: "transparent", cursor: "pointer" }}
            className="hover:bg-[#F0F0F0] transition-colors"
          >
            <Eye size={13} color="#999" />
          </button>
          <button
            onClick={e => { e.stopPropagation(); router.push(`/documents/${doc.id}/edit`); }}
            style={{ padding: 5, borderRadius: 5, border: "none", background: "transparent", cursor: "pointer" }}
            className="hover:bg-[#F0F0F0] transition-colors"
          >
            <Pencil size={13} color="#999" />
          </button>
        </div>
      </td>
    </tr>
  );
}
