import Link from "next/link";

interface EmptyStateProps {
  icon: string;
  title: string;
  description?: string;
  action?: { label: string; href: string };
}

export default function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div style={{
      padding: "60px 20px",
      textAlign: "center",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    }}>
      <div style={{ fontSize: 48, opacity: 0.3, marginBottom: 16 }}>{icon}</div>
      <p style={{ margin: 0, fontSize: 16, fontWeight: 600, color: "#374151" }}>{title}</p>
      {description && (
        <p style={{ margin: "8px 0 0", fontSize: 14, color: "#9CA3AF" }}>{description}</p>
      )}
      {action && (
        <Link
          href={action.href}
          style={{
            marginTop: 20, padding: "8px 20px", borderRadius: 8,
            background: "#2563EB", color: "#fff", textDecoration: "none",
            fontSize: 14, fontWeight: 600, display: "inline-block",
          }}
        >
          {action.label}
        </Link>
      )}
    </div>
  );
}
