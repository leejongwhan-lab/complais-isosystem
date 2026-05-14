import React from "react";

const VALUE_COLORS = {
  default: "#111827",
  red:     "#DC2626",
  green:   "#16A34A",
  orange:  "#D97706",
  blue:    "#2563EB",
  purple:  "#7C3AED",
};

interface StatCardProps {
  label: string;
  value: string | number;
  sub?: string;
  color?: "default" | "red" | "green" | "orange" | "blue" | "purple";
  icon?: React.ReactNode;
}

export default function StatCard({ label, value, sub, color = "default", icon }: StatCardProps) {
  return (
    <div style={{
      minHeight: 110,
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      padding: "20px 24px",
      borderRadius: 12,
      border: "1px solid #F3F4F6",
      background: "#fff",
      boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
    }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
        <p style={{
          margin: 0, fontSize: 12, fontWeight: 500, color: "#6B7280",
          textTransform: "uppercase", letterSpacing: "0.5px",
        }}>
          {label}
        </p>
        {icon && <span style={{ color: "#D1D5DB" }}>{icon}</span>}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        <p style={{
          margin: 0, fontSize: 36, fontWeight: 700, lineHeight: 1,
          letterSpacing: "-1px", color: VALUE_COLORS[color],
        }}>
          {value}
        </p>
        {sub && (
          <p style={{ margin: 0, fontSize: 11, color: "#9CA3AF" }}>{sub}</p>
        )}
      </div>
    </div>
  );
}
