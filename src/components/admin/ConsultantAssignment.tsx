"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

type Consultant = { id: string; name: string; email: string };
type Assigned = { id: string; consultant_id: string; users: { name: string; email: string } | null };

export default function ConsultantAssignment({ companyId }: { companyId: string }) {
  const [consultants, setConsultants] = useState<Consultant[]>([]);
  const [assigned, setAssigned] = useState<Assigned[]>([]);
  const [selected, setSelected] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const { data: c } = await supabase
          .from("users")
          .select("id, name, email")
          .eq("is_consultant", true)
          .eq("is_active", true);
        if (c) setConsultants(c as Consultant[]);
      } catch {}

      try {
        const { data: a } = await supabase
          .from("consultant_clients")
          .select("id, consultant_id, users(name, email)")
          .eq("company_id", companyId)
          .eq("status", "active");
        if (a) setAssigned(a as unknown as Assigned[]);
      } catch {}
    }
    load();
  }, [companyId]);

  async function handleAssign() {
    if (!selected) return;
    setSaving(true);
    try {
      await supabase.from("consultant_clients").insert({
        consultant_id: selected,
        company_id: companyId,
        status: "active",
      });
      const c = consultants.find((c) => c.id === selected);
      if (c) {
        setAssigned((prev) => [
          ...prev,
          { id: crypto.randomUUID(), consultant_id: selected, users: { name: c.name, email: c.email } },
        ]);
      }
      setSelected("");
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch {}
    setSaving(false);
  }

  async function handleRemove(ccId: string) {
    try {
      await supabase.from("consultant_clients").update({ status: "inactive" }).eq("id", ccId);
      setAssigned((prev) => prev.filter((a) => a.id !== ccId));
    } catch {}
  }

  return (
    <div style={{ background: "#fff", border: "1px solid #E5E5E5", borderRadius: 8, overflow: "hidden" }}>
      <div style={{ padding: "14px 20px", borderBottom: "1px solid #E5E5E5", background: "#FAFAFA" }}>
        <span style={{ fontSize: 10, fontWeight: 600, color: "#bbb", textTransform: "uppercase", letterSpacing: "0.06em" }}>
          컨설턴트 배정
        </span>
      </div>
      <div style={{ padding: 20 }}>
        {/* Current assignments */}
        {assigned.length > 0 ? (
          <div style={{ marginBottom: 16 }}>
            <p style={{ fontSize: 12, color: "#888", marginBottom: 8, fontWeight: 600 }}>현재 담당 컨설턴트</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {assigned.map((a) => (
                <div key={a.id} style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  padding: "8px 12px", borderRadius: 6,
                  background: "#F5F0FF", border: "1px solid #DDD6FE",
                }}>
                  <div>
                    <span style={{ fontSize: 13, fontWeight: 600, color: "#7C3AED" }}>
                      {a.users?.name ?? "알 수 없음"}
                    </span>
                    <span style={{ fontSize: 12, color: "#999", marginLeft: 8 }}>
                      {a.users?.email}
                    </span>
                  </div>
                  <button
                    onClick={() => handleRemove(a.id)}
                    style={{
                      fontSize: 11, color: "#999", background: "none",
                      border: "none", cursor: "pointer", padding: "2px 6px",
                    }}
                  >
                    해제
                  </button>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <p style={{ fontSize: 13, color: "#bbb", marginBottom: 16 }}>배정된 컨설턴트가 없습니다.</p>
        )}

        {/* Assign new */}
        <div style={{ display: "flex", gap: 8 }}>
          <select
            value={selected}
            onChange={(e) => setSelected(e.target.value)}
            style={{
              flex: 1, padding: "8px 10px", borderRadius: 6, fontSize: 13,
              border: "1px solid #E5E5E5", background: "#fff", color: "#1a1a1a",
            }}
          >
            <option value="">컨설턴트 선택</option>
            {consultants.map((c) => (
              <option key={c.id} value={c.id}>{c.name} ({c.email})</option>
            ))}
          </select>
          <button
            onClick={handleAssign}
            disabled={!selected || saving}
            style={{
              padding: "8px 16px", borderRadius: 6, fontSize: 13, fontWeight: 600,
              background: saved ? "#2F9E44" : "#7C3AED", color: "#fff",
              border: "none", cursor: !selected || saving ? "not-allowed" : "pointer",
              opacity: !selected || saving ? 0.6 : 1, transition: "background 0.2s",
              whiteSpace: "nowrap",
            }}
          >
            {saved ? "✓ 배정완료" : saving ? "처리중..." : "배정"}
          </button>
        </div>
        {consultants.length === 0 && (
          <p style={{ fontSize: 12, color: "#bbb", marginTop: 8 }}>
            등록된 컨설턴트 계정이 없습니다. 사용자 관리에서 컨설턴트를 등록해주세요.
          </p>
        )}
      </div>
    </div>
  );
}
