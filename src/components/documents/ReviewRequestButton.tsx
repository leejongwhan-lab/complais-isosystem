"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import type { DocumentApproval } from "@/types/document";

interface Props {
  documentId: string;
  approvals: DocumentApproval[];
}

export default function ReviewRequestButton({ documentId, approvals }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleRequest() {
    setLoading(true);

    await supabase
      .from("documents")
      .update({ status: "review" })
      .eq("id", documentId);

    // Reset all rejections back to pending, activate step 1
    if (approvals.length > 0) {
      // Reset any rejected/pending steps so step 1 is pending again
      await supabase
        .from("document_approvals")
        .update({ status: "pending", acted_at: null })
        .eq("document_id", documentId)
        .in("status", ["rejected", "pending"]);

      // Ensure step 1 is pending
      const step1 = approvals.find(a => a.step === 1);
      if (step1) {
        await supabase
          .from("document_approvals")
          .update({ status: "pending", acted_at: null })
          .eq("id", step1.id);
      }
    } else {
      await supabase.from("document_approvals").insert({
        document_id: documentId,
        step: 1,
        step_name: "1차 검토",
        status: "pending",
      });
    }

    setLoading(false);
    router.refresh();
  }

  return (
    <button
      onClick={handleRequest}
      disabled={loading}
      style={{
        display: "flex", alignItems: "center", gap: 5,
        padding: "5px 10px", borderRadius: 6,
        fontSize: 12, fontWeight: 600, color: "#fff",
        border: "none", background: "#E67700",
        cursor: loading ? "not-allowed" : "pointer",
        opacity: loading ? 0.5 : 1,
      }}
      className="hover:opacity-90 transition-opacity"
    >
      {loading ? "처리 중..." : "검토 요청"}
    </button>
  );
}
