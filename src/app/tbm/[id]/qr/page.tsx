"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { QRCodeSVG } from "qrcode.react";

export default function TBMQRPage() {
  const params = useParams();
  const id = params.id as string;
  const [signUrl, setSignUrl] = useState("");

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setSignUrl(`${window.location.origin}/tbm/${id}/sign`);
    }, 0);

    return () => window.clearTimeout(timer);
  }, [id]);

  return (
    <div style={{
      minHeight: "100vh",
      background: "#fff",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: 32,
    }}>
      <h1 style={{ fontSize: 22, fontWeight: 700, color: "#1a1a1a", marginBottom: 8 }}>
        TBM 서명 QR 코드
      </h1>
      <p style={{ fontSize: 14, color: "#999", marginBottom: 32 }}>
        현장에서 작업자들이 스캔하세요
      </p>

      <div style={{
        padding: 24,
        border: "2px solid #E5E5E5",
        borderRadius: 12,
        background: "#fff",
        boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
      }}>
        {signUrl ? (
          <QRCodeSVG value={signUrl} size={256} level="H" />
        ) : (
          <div style={{
            width: 256,
            height: 256,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#bbb",
            fontSize: 13,
          }}>
            로딩 중...
          </div>
        )}
      </div>

      <p style={{
        marginTop: 20,
        fontSize: 12,
        color: "#bbb",
        wordBreak: "break-all",
        maxWidth: 320,
        textAlign: "center",
      }}>
        {signUrl}
      </p>

      <Link
        href={`/tbm/${id}`}
        style={{
          marginTop: 32,
          padding: "10px 24px",
          borderRadius: 8,
          border: "1px solid #E5E5E5",
          fontSize: 13,
          color: "#555",
          textDecoration: "none",
          background: "#fff",
        }}
        className="hover:bg-[#F5F5F5] transition-colors"
      >
        ← TBM 상세로 돌아가기
      </Link>
    </div>
  );
}
