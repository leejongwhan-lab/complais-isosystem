import Link from "next/link";

export type ModuleKpiItem = {
  label: string;
  value: React.ReactNode;
  description: string;
  valueColor?: string;
};

export type ModuleTabItem = {
  value: string;
  label: string;
};

export const MODULE_TABLE_HEADER_STYLE: React.CSSProperties = {
  padding: "10px 16px",
  textAlign: "left",
  fontSize: 11,
  fontWeight: 600,
  color: "#999",
  background: "#FAFAFA",
  borderBottom: "1px solid #E5E5E5",
};

export const MODULE_TABLE_CELL_STYLE: React.CSSProperties = {
  padding: "10px 16px",
  fontSize: 13,
  borderBottom: "1px solid #F0F0F0",
};

export function ModulePageHeader({
  title,
  actionHref,
  actionLabel,
}: {
  title: string;
  actionHref: string;
  actionLabel: string;
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 28,
      }}
    >
      <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: "#1a1a1a" }}>
        {title}
      </h1>
      <Link href={actionHref} style={MODULE_PRIMARY_ACTION_STYLE}>
        {actionLabel}
      </Link>
    </div>
  );
}

export function ModuleKpiGrid({ items }: { items: ModuleKpiItem[] }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
        gap: 16,
        marginBottom: 28,
      }}
    >
      {items.map((item) => (
        <div
          key={item.label}
          style={{ background: "#fff", border: "1px solid #E5E5E5", borderRadius: 8, padding: "20px 22px" }}
        >
          <div
            style={{
              fontSize: 11,
              fontWeight: 600,
              color: "#999",
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              marginBottom: 8,
            }}
          >
            {item.label}
          </div>
          <div style={{ fontSize: 28, fontWeight: 700, color: item.valueColor ?? "#1a1a1a", lineHeight: 1.1 }}>
            {item.value}
          </div>
          <div style={{ fontSize: 12, color: "#888", marginTop: 4 }}>{item.description}</div>
        </div>
      ))}
    </div>
  );
}

export function ModuleTabs({
  basePath,
  items,
  activeValue,
}: {
  basePath: string;
  items: ModuleTabItem[];
  activeValue: string;
}) {
  return (
    <div style={{ display: "flex", borderBottom: "1px solid #E5E5E5" }}>
      {items.map((item) => {
        const active = item.value === activeValue;
        return (
          <Link
            key={item.value}
            href={`${basePath}?tab=${item.value}`}
            style={{
              padding: "12px 20px",
              fontSize: 13,
              fontWeight: active ? 600 : 400,
              color: active ? "#3B5BDB" : "#666",
              textDecoration: "none",
              borderBottom: active ? "2px solid #3B5BDB" : "2px solid transparent",
              marginBottom: -1,
              display: "inline-block",
            }}
          >
            {item.label}
          </Link>
        );
      })}
    </div>
  );
}

export function ModulePanel({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ background: "#fff", border: "1px solid #E5E5E5", borderRadius: 10, overflow: "hidden" }}>
      {children}
    </div>
  );
}

export function ModulePanelAction({
  href,
  label,
}: {
  href: string;
  label: string;
}) {
  return (
    <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 16 }}>
      <Link href={href} style={MODULE_SECONDARY_ACTION_STYLE}>
        {label}
      </Link>
    </div>
  );
}

const MODULE_PRIMARY_ACTION_STYLE: React.CSSProperties = {
  background: "#3B5BDB",
  color: "#fff",
  padding: "7px 14px",
  borderRadius: 6,
  fontSize: 13,
  fontWeight: 600,
  border: "none",
  cursor: "pointer",
  textDecoration: "none",
};

const MODULE_SECONDARY_ACTION_STYLE: React.CSSProperties = {
  fontSize: 13,
  fontWeight: 600,
  background: "#EEF2FF",
  color: "#3B5BDB",
  padding: "6px 12px",
  borderRadius: 6,
  textDecoration: "none",
};
