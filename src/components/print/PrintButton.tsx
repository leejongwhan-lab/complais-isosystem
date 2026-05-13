"use client";

import { Printer } from "lucide-react";

export default function PrintButton({ label = "PDF 출력" }: { label?: string }) {
  return (
    <button
      onClick={() => window.print()}
      className="no-print hover:bg-[#F5F5F5] transition-colors"
      style={{
        display: "flex", alignItems: "center", gap: 5,
        padding: "5px 10px", borderRadius: 6,
        fontSize: 12, fontWeight: 500, color: "#555",
        border: "1px solid #E5E5E5", background: "#fff", cursor: "pointer",
      }}
    >
      <Printer size={12} color="#999" />
      {label}
    </button>
  );
}
