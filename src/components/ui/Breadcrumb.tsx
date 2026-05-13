import Link from "next/link";

interface BreadcrumbItem { label: string; href?: string; }

export default function Breadcrumb({ items }: { items: BreadcrumbItem[] }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 12, fontSize: 12, color: "#bbb" }}>
      {items.map((item, i) => (
        <span key={i} style={{ display: "flex", alignItems: "center", gap: 5 }}>
          {i > 0 && <span style={{ color: "#ddd" }}>/</span>}
          {item.href ? (
            <Link href={item.href} style={{ color: "#bbb", textDecoration: "none" }} className="hover:text-[#555] transition-colors">
              {item.label}
            </Link>
          ) : (
            <span style={{ color: "#555", fontWeight: 500 }}>{item.label}</span>
          )}
        </span>
      ))}
    </div>
  );
}
