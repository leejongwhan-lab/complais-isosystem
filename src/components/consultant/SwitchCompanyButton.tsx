"use client";

export default function SwitchCompanyButton({ companyId }: { companyId: string }) {
  return (
    <button
      onClick={async () => {
        await fetch("/api/consultant/switch", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ companyId }),
        });
        window.location.href = "/";
      }}
      style={{
        padding: "8px 16px",
        borderRadius: 6,
        fontSize: 13,
        fontWeight: 600,
        background: "#7C3AED",
        color: "#fff",
        border: "none",
        cursor: "pointer",
      }}
    >
      고객사 시스템 접속
    </button>
  );
}
