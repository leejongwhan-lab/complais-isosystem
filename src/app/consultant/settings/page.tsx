"use client";

import { useState } from "react";
import ConsultantLayout from "@/components/consultant/ConsultantLayout";

const ISO_STANDARDS = [
  { key: "iso9001",  label: "ISO 9001" },
  { key: "iso14001", label: "ISO 14001" },
  { key: "iso45001", label: "ISO 45001" },
  { key: "iso50001", label: "ISO 50001" },
  { key: "iso37001", label: "ISO 37001" },
  { key: "iso37301", label: "ISO 37301" },
  { key: "iso27001", label: "ISO 27001" },
] as const;

type IsoKey = (typeof ISO_STANDARDS)[number]["key"];

export default function ConsultantSettingsPage() {
  const [name, setName] = useState("");
  const [email] = useState("consultant@example.com");
  const [phone, setPhone] = useState("");
  const [expertise, setExpertise] = useState<Record<IsoKey, boolean>>({
    iso9001: false,
    iso14001: false,
    iso45001: false,
    iso50001: false,
    iso37001: false,
    iso37301: false,
    iso27001: false,
  });

  function toggleExpertise(key: IsoKey) {
    setExpertise((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  function handleSave() {
    alert("저장되었습니다");
  }

  return (
    <ConsultantLayout active="/consultant/settings">
      <div style={{ padding: 32, maxWidth: 600 }}>
        {/* Title */}
        <div style={{ marginBottom: 28 }}>
          <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: "#1a1a1a" }}>
            설정
          </h1>
          <p style={{ margin: "4px 0 0", fontSize: 13, color: "#888" }}>
            컨설턴트 프로필을 관리합니다
          </p>
        </div>

        <div
          style={{
            background: "#fff",
            border: "1px solid #E5E5E5",
            borderRadius: 10,
            padding: 28,
            display: "flex",
            flexDirection: "column",
            gap: 20,
          }}
        >
          {/* 이름 */}
          <div>
            <label style={labelStyle}>이름</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="이름을 입력하세요"
              style={inputStyle}
            />
          </div>

          {/* 이메일 */}
          <div>
            <label style={labelStyle}>이메일</label>
            <input
              type="text"
              value={email}
              readOnly
              style={{ ...inputStyle, background: "#F5F5F5", color: "#888", cursor: "default" }}
            />
          </div>

          {/* 연락처 */}
          <div>
            <label style={labelStyle}>연락처</label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="010-0000-0000"
              style={inputStyle}
            />
          </div>

          {/* 전문 분야 */}
          <div>
            <label style={labelStyle}>전문 분야</label>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))",
                gap: 10,
                marginTop: 8,
              }}
            >
              {ISO_STANDARDS.map(({ key, label }) => (
                <label
                  key={key}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "8px 12px",
                    border: `1px solid ${expertise[key] ? "#7C3AED" : "#E5E5E5"}`,
                    borderRadius: 6,
                    cursor: "pointer",
                    background: expertise[key] ? "#F5F0FF" : "#fff",
                    fontSize: 13,
                    color: expertise[key] ? "#7C3AED" : "#555",
                    fontWeight: expertise[key] ? 600 : 400,
                    transition: "all 0.15s",
                    userSelect: "none",
                  }}
                >
                  <input
                    type="checkbox"
                    checked={expertise[key]}
                    onChange={() => toggleExpertise(key)}
                    style={{ accentColor: "#7C3AED", width: 14, height: 14 }}
                  />
                  {label}
                </label>
              ))}
            </div>
          </div>

          {/* Save button */}
          <div style={{ paddingTop: 8 }}>
            <button
              onClick={handleSave}
              style={{
                padding: "10px 28px",
                borderRadius: 7,
                border: "none",
                background: "#7C3AED",
                color: "#fff",
                fontSize: 14,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              저장
            </button>
          </div>
        </div>
      </div>
    </ConsultantLayout>
  );
}

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: 13,
  fontWeight: 600,
  color: "#374151",
  marginBottom: 6,
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "9px 12px",
  border: "1px solid #E5E5E5",
  borderRadius: 6,
  fontSize: 13,
  color: "#1a1a1a",
  outline: "none",
  boxSizing: "border-box",
};
