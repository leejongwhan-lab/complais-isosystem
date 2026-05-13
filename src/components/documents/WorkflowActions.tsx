"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import WorkflowModal, { type WorkflowModalType } from "./WorkflowModal";

interface WorkflowActionsProps {
  documentId: string;
  status: string;
  canWrite?: boolean;
}

export default function WorkflowActions({ documentId, status, canWrite = false }: WorkflowActionsProps) {
  const router = useRouter();
  const [modal, setModal]               = useState<WorkflowModalType | null>(null);
  const [revisePending, setRevisePending] = useState(false);

  async function handleRevise() {
    if (!confirm("현재 문서의 개정본을 생성하시겠습니까?")) return;
    setRevisePending(true);
    try {
      const res = await fetch(`/api/documents/${documentId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "revise" }),
      });
      const data = await res.json() as { newDocId?: string; error?: string };
      if (!res.ok) throw new Error(data.error ?? "개정 실패");
      if (data.newDocId) router.push(`/documents/${data.newDocId}`);
    } catch (e) {
      alert(e instanceof Error ? e.message : "오류가 발생했습니다");
    } finally {
      setRevisePending(false);
    }
  }

  if (!canWrite) return null;

  return (
    <>
      {/* ── 초안 ── */}
      {status === "draft" && (
        <>
          <Btn onClick={() => setModal("review")} bg="#3B5BDB" color="#fff">검토 요청</Btn>
          <Btn onClick={() => setModal("delete")} bg="#fff" color="#E03131" border="1px solid #E03131">삭제</Btn>
        </>
      )}

      {/* ── 검토대기 ── */}
      {status === "review" && (
        <>
          <Btn onClick={() => setModal("approve")} bg="#2F9E44" color="#fff">승인</Btn>
          <Btn onClick={() => setModal("reject")}  bg="#fff" color="#E03131" border="1px solid #E03131">반려</Btn>
        </>
      )}

      {/* ── 유효 ── */}
      {status === "active" && (
        <>
          <Btn onClick={handleRevise} bg="#E67700" color="#fff" disabled={revisePending}>
            {revisePending ? "처리 중..." : "개정"}
          </Btn>
          <Btn onClick={() => setModal("obsolete")} bg="#fff" color="#E03131" border="1px solid #E03131">폐기</Btn>
        </>
      )}

      {/* ── 폐기 ── */}
      {status === "obsolete" && (
        <Btn onClick={() => setModal("restore")} bg="#fff" color="#555" border="1px solid #E5E5E5">복원</Btn>
      )}

      {modal && (
        <WorkflowModal
          type={modal}
          documentId={documentId}
          onClose={() => setModal(null)}
        />
      )}
    </>
  );
}

function Btn({
  children, onClick, bg, color, border, disabled,
}: {
  children: React.ReactNode;
  onClick: () => void;
  bg: string;
  color: string;
  border?: string;
  disabled?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        padding: "5px 12px", borderRadius: 6,
        fontSize: 12, fontWeight: 600,
        background: bg, color,
        border: border ?? "none",
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.6 : 1,
        whiteSpace: "nowrap",
      }}
    >
      {children}
    </button>
  );
}
