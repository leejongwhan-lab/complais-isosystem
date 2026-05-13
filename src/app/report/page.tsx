"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function ReportPage() {
  const router = useRouter();
  const [companyCode, setCompanyCode] = useState("");

  function handleSubmit() {
    if (companyCode.trim()) {
      router.push(`/report/new?company=${encodeURIComponent(companyCode.trim())}`);
    } else {
      router.push("/report/new");
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#F9FAFB",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 480,
          background: "#fff",
          borderRadius: 12,
          padding: 40,
          boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
        }}
      >
        {/* 대시보드 링크 */}
        <div style={{ marginBottom: 20 }}>
          <Link href="/" style={{ fontSize: 12, color: "#bbb", textDecoration: "none" }}>
            ← 대시보드로
          </Link>
        </div>

        {/* Logo */}
        <div style={{ marginBottom: 28, textAlign: "center" }}>
          <span style={{ fontSize: 22, fontWeight: 800, color: "#3B5BDB" }}>complAIs</span>
          <span style={{ fontSize: 22, fontWeight: 800, color: "#1a1a1a" }}> ISOSystem</span>
        </div>

        <div
          style={{
            height: 1,
            background: "#E5E5E5",
            marginBottom: 28,
          }}
        />

        <h1
          style={{
            fontSize: 20,
            fontWeight: 700,
            color: "#1a1a1a",
            marginBottom: 8,
            textAlign: "center",
          }}
        >
          안전하고 익명으로 제보하세요
        </h1>
        <p
          style={{
            fontSize: 13,
            color: "#555",
            textAlign: "center",
            marginBottom: 32,
            lineHeight: 1.6,
          }}
        >
          제보 내용은 완전히 익명으로 처리되며,
          <br />
          IP 주소는 수집되지 않습니다.
        </p>

        <p style={{ fontSize: 12, color: "#999", marginBottom: 8, textAlign: "center" }}>
          회사 코드를 입력하거나 아래 버튼을 눌러 시작하세요
        </p>

        <div style={{ marginBottom: 16 }}>
          <input
            type="text"
            value={companyCode}
            onChange={(e) => setCompanyCode(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            placeholder="회사 코드를 입력하세요 (선택)"
            style={{
              width: "100%",
              padding: "10px 14px",
              fontSize: 14,
              border: "1px solid #E5E5E5",
              borderRadius: 8,
              outline: "none",
              color: "#1a1a1a",
              boxSizing: "border-box",
            }}
          />
        </div>

        <button
          onClick={handleSubmit}
          style={{
            width: "100%",
            padding: "12px 0",
            borderRadius: 8,
            fontSize: 15,
            fontWeight: 600,
            color: "#fff",
            background: "#3B5BDB",
            border: "none",
            cursor: "pointer",
            marginBottom: 12,
            transition: "opacity 0.15s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.9")}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
        >
          🔔 제보하기
        </button>

        <Link
          href="/report/track"
          style={{
            display: "block",
            width: "100%",
            padding: "12px 0",
            borderRadius: 8,
            fontSize: 15,
            fontWeight: 500,
            color: "#555",
            textAlign: "center",
            border: "1px solid #E5E5E5",
            background: "#fff",
            textDecoration: "none",
            boxSizing: "border-box",
            transition: "background 0.15s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "#F5F5F5")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "#fff")}
        >
          🔍 처리현황 확인
        </Link>

        <p
          style={{
            textAlign: "center",
            fontSize: 11,
            color: "#bbb",
            marginTop: 24,
            marginBottom: 4,
          }}
        >
          본 시스템은 제보자 보호를 위해 익명성을 완전히 보장합니다.
        </p>
        <div style={{ textAlign: "center" }}>
          <Link
            href="/admin/reports"
            style={{ fontSize: 11, color: "#ccc", textDecoration: "none" }}
          >
            관리자 로그인
          </Link>
        </div>
      </div>
    </div>
  );
}
