"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, X } from "lucide-react";
import { supabase } from "@/lib/supabase";
import type { DocumentApproval } from "@/types/document";

export default function ApprovalPanel({
  documentId,
  approvals,
}: {
  documentId: string;
  approvals: DocumentApproval[];
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const pendingStep = approvals.find(a => a.status === "pending");
  if (!pendingStep) return null;

  const handleAction = async (action: "approved" | "rejected") => {
    setLoading(true);

    await supabase
      .from("document_approvals")
      .update({ status: action, acted_at: new Date().toISOString() })
      .eq("id", pendingStep.id);

    if (action === "approved") {
      const remaining = approvals.filter(
        a => a.id !== pendingStep.id && a.status === "pending"
      );
      if (remaining.length === 0) {
        await supabase.from("documents").update({ status: "active" }).eq("id", documentId);
      }
    } else {
      await supabase.from("documents").update({ status: "review" }).eq("id", documentId);
    }

    setLoading(false);
    router.refresh();
  };

  return (
    <div>
      <p style={{ margin: "0 0 4px", fontSize: 11, fontWeight: 600, color: "#999", textTransform: "uppercase", letterSpacing: "0.05em" }}>
        현재 승인 단계 · Step {pendingStep.step}
      </p>
      <p style={{ margin: "0 0 10px", fontSize: 12, color: "#555" }}>
        {pendingStep.step_name}
        {pendingStep.approver_name ? ` — ${pendingStep.approver_name}` : ""}
      </p>
      <div style={{ display: "flex", gap: 6 }}>
        <button
          onClick={() => handleAction("approved")}
          disabled={loading}
          style={{
            flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 4,
            padding: "6px 0", borderRadius: 6, border: "none",
            fontSize: 12, fontWeight: 600, color: "#fff",
            background: "#2F9E44", cursor: loading ? "not-allowed" : "pointer",
            opacity: loading ? 0.5 : 1,
          }}
          className="hover:opacity-90 transition-opacity"
        >
          <Check size={12} />
          승인
        </button>
        <button
          onClick={() => handleAction("rejected")}
          disabled={loading}
          style={{
            flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 4,
            padding: "6px 0", borderRadius: 6, border: "1px solid #E5E5E5",
            fontSize: 12, fontWeight: 600, color: "#E03131",
            background: "#fff", cursor: loading ? "not-allowed" : "pointer",
            opacity: loading ? 0.5 : 1,
          }}
          className="hover:bg-[#FFF0F0] transition-colors"
        >
          <X size={12} />
          반려
        </button>
      </div>
    </div>
  );
}
