"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";

export type WorkflowModalType = "review" | "approve" | "reject" | "obsolete" | "delete" | "restore";

const MODAL_CONFIG: Record<WorkflowModalType, {
  title: string;
  action: string;
  confirmColor: string;
  confirmLabel: string;
}> = {
  review:   { title: "검토 요청",  action: "request_review", confirmColor: "#3B5BDB", confirmLabel: "검토 요청" },
  approve:  { title: "승인",       action: "approve",        confirmColor: "#2F9E44", confirmLabel: "승인" },
  reject:   { title: "반려",       action: "reject",         confirmColor: "#E03131", confirmLabel: "반려" },
  obsolete: { title: "폐기 처리",  action: "obsolete",       confirmColor: "#E03131", confirmLabel: "폐기" },
  delete:   { title: "문서 삭제",  action: "delete",         confirmColor: "#E03131", confirmLabel: "삭제" },
  restore:  { title: "복원",       action: "restore",        confirmColor: "#555",    confirmLabel: "복원" },
};

interface WorkflowModalProps {
  type: WorkflowModalType;
  documentId: string;
  onClose: () => void;
}

export default function WorkflowModal({ type, documentId, onClose }: WorkflowModalProps) {
  const router = useRouter();
  const [actorName, setActorName] = useState("");
  const [note, setNote]           = useState("");
  const [confirmed, setConfirmed] = useState(false);
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState("");

  const cfg        = MODAL_CONFIG[type];
  const needsActor = type === "review" || type === "approve";
  const needsNote  = type === "reject";
  const needsCheck = type === "obsolete" || type === "delete";

  const canConfirm =
    (!needsActor || actorName.trim().length > 0) &&
    (!needsNote  || note.trim().length > 0) &&
    (!needsCheck || confirmed);

  async function handleConfirm() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/documents/${documentId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action:     cfg.action,
          actor_name: actorName || undefined,
          note:       note      || undefined,
        }),
      });
      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.error ?? "처리 실패");
      }
      if (type === "delete") {
        router.push("/documents");
        return;
      }
      onClose();
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "오류가 발생했습니다");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        position: "fixed", inset: 0, zIndex: 1000,
        background: "rgba(0,0,0,0.4)",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: "#fff", borderRadius: 10,
          padding: 24, width: 400, maxWidth: "90vw",
          display: "flex", flexDirection: "column", gap: 16,
          boxShadow: "0 8px 32px rgba(0,0,0,0.16)",
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* 헤더 */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <p style={{ margin: 0, fontSize: 15, fontWeight: 700, color: "#1a1a1a" }}>{cfg.title}</p>
          <button onClick={onClose} style={{ border: "none", background: "none", cursor: "pointer", padding: 4, borderRadius: 4 }}>
            <X size={16} color="#999" />
          </button>
        </div>

        {/* 검토자/승인자 입력 */}
        {needsActor && (
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: "#555", display: "block", marginBottom: 6 }}>
              {type === "review" ? "검토자 이름" : "승인자 이름"}
              <span style={{ color: "#E03131", marginLeft: 2 }}>*</span>
            </label>
            <input
              value={actorName}
              onChange={e => setActorName(e.target.value)}
              placeholder={type === "review" ? "검토자 이름 입력" : "승인자 이름 입력"}
              autoFocus
              style={{
                width: "100%", padding: "7px 10px", fontSize: 13,
                border: "1px solid #E5E5E5", borderRadius: 6, outline: "none",
                boxSizing: "border-box",
              }}
            />
          </div>
        )}

        {/* 반려 사유 */}
        {needsNote && (
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: "#555", display: "block", marginBottom: 6 }}>
              반려 사유<span style={{ color: "#E03131", marginLeft: 2 }}>*</span>
            </label>
            <textarea
              value={note}
              onChange={e => setNote(e.target.value)}
              placeholder="반려 사유를 입력하세요"
              autoFocus
              rows={3}
              style={{
                width: "100%", padding: "7px 10px", fontSize: 13,
                border: "1px solid #E5E5E5", borderRadius: 6, outline: "none",
                resize: "vertical", boxSizing: "border-box",
              }}
            />
          </div>
        )}

        {/* 확인 체크박스 */}
        {needsCheck && (
          <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
            <input
              type="checkbox"
              checked={confirmed}
              onChange={e => setConfirmed(e.target.checked)}
              style={{ width: 15, height: 15, cursor: "pointer" }}
            />
            <span style={{ fontSize: 13, color: "#555" }}>
              {type === "delete"
                ? "정말 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다."
                : "정말 폐기 처리하시겠습니까?"}
            </span>
          </label>
        )}

        {/* 에러 */}
        {error && (
          <p style={{ margin: 0, fontSize: 12, color: "#E03131" }}>{error}</p>
        )}

        {/* 버튼 */}
        <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
          <button
            onClick={onClose}
            style={{
              padding: "7px 16px", borderRadius: 6, fontSize: 13, fontWeight: 500,
              border: "1px solid #E5E5E5", background: "#fff", color: "#555", cursor: "pointer",
            }}
          >
            취소
          </button>
          <button
            onClick={handleConfirm}
            disabled={!canConfirm || loading}
            style={{
              padding: "7px 16px", borderRadius: 6, fontSize: 13, fontWeight: 600,
              border: "none", background: cfg.confirmColor, color: "#fff",
              cursor: !canConfirm || loading ? "not-allowed" : "pointer",
              opacity: !canConfirm || loading ? 0.6 : 1,
            }}
          >
            {loading ? "처리 중..." : cfg.confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
