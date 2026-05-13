"use client";

import { useState } from "react";
import { Trash2, Plus, Save } from "lucide-react";
import { supabase } from "@/lib/supabase";

export type Branch = {
  id: string;
  company_id: string;
  name: string;
  address: string;
  address_en: string;
  employee_count: number;
  scope_kr: string | null;
  is_active: boolean;
};

type BranchDraft = Omit<Branch, "id" | "created_at"> & { _tempId?: string };

export default function SettingsBranchClient({
  companyId,
  initialBranches,
}: {
  companyId: string | null;
  initialBranches: Branch[];
}) {
  const [branches, setBranches] = useState<(Branch & { _editing?: boolean })[]>(initialBranches);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [newCards, setNewCards] = useState<(BranchDraft & { _tempId: string })[]>([]);

  if (!companyId) {
    return (
      <div style={{ maxWidth: 740, margin: "0 auto", padding: "28px 24px" }}>
        <h2 style={{ margin: "0 0 8px", fontSize: 16, fontWeight: 700, color: "#1a1a1a" }}>추가사업장</h2>
        <div style={{ textAlign: "center", padding: "48px 0", color: "#bbb", fontSize: 13 }}>
          기업 기본정보를 먼저 등록해주세요.
        </div>
      </div>
    );
  }

  function addNew() {
    const tempId = `new-${Date.now()}`;
    setNewCards(prev => [...prev, {
      _tempId: tempId, company_id: companyId as string,
      name: "", address: "", address_en: "",
      employee_count: 0, scope_kr: "", is_active: true,
    }]);
  }

  function removeNew(tempId: string) {
    setNewCards(prev => prev.filter(c => c._tempId !== tempId));
  }

  function updateNew(tempId: string, field: string, value: string | number) {
    setNewCards(prev => prev.map(c => c._tempId === tempId ? { ...c, [field]: value } : c));
  }

  async function deleteBranch(id: string) {
    if (!confirm("이 사업장을 삭제하겠습니까?")) return;
    await supabase.from("company_branches").delete().eq("id", id);
    setBranches(prev => prev.filter(b => b.id !== id));
  }

  async function handleSave() {
    setSaving(true);
    for (const nc of newCards) {
      if (!nc.name.trim()) continue;
      await supabase.from("company_branches").insert({
        company_id:     companyId,
        name:           nc.name.trim(),
        address:        nc.address.trim(),
        address_en:     nc.address_en.trim(),
        employee_count: nc.employee_count || 0,
        scope_kr:       nc.scope_kr?.trim() || null,
        is_active:      true,
      });
    }
    const { data: fresh } = await supabase
      .from("company_branches")
      .select("*")
      .eq("company_id", companyId)
      .order("created_at");
    setBranches((fresh as Branch[]) ?? []);
    setNewCards([]);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  const cardStyle: React.CSSProperties = {
    border: "1px solid #E5E5E5", borderRadius: 10,
    padding: "16px 18px", background: "#fff",
  };

  const inpSt: React.CSSProperties = {
    fontSize: 13, border: "1px solid #E5E5E5", borderRadius: 5,
    padding: "5px 9px", outline: "none", color: "#1a1a1a",
    width: "100%",
  };

  return (
    <div style={{ maxWidth: 740, margin: "0 auto", padding: "28px 24px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
        <div>
          <h2 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: "#1a1a1a" }}>추가사업장</h2>
          <p style={{ margin: "3px 0 0", fontSize: 12, color: "#999" }}>본사 외 추가 사업장을 등록합니다.</p>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={addNew} style={{
            display: "flex", alignItems: "center", gap: 5,
            padding: "6px 14px", borderRadius: 6, fontSize: 13, fontWeight: 500,
            border: "1px solid #E5E5E5", background: "#fff", color: "#3B5BDB", cursor: "pointer",
          }}>
            <Plus size={14} /> 사업장 추가
          </button>
          {(newCards.length > 0) && (
            <button onClick={handleSave} disabled={saving} style={{
              display: "flex", alignItems: "center", gap: 5,
              padding: "6px 14px", borderRadius: 6, fontSize: 13, fontWeight: 600,
              border: "none", background: "#3B5BDB", color: "#fff",
              cursor: saving ? "not-allowed" : "pointer", opacity: saving ? 0.7 : 1,
            }}>
              <Save size={14} /> {saving ? "저장 중..." : "저장"}
            </button>
          )}
        </div>
      </div>

      {saved && (
        <div style={{ marginBottom: 16, padding: "10px 14px", borderRadius: 6, background: "#F0FBF4", color: "#2F9E44", fontSize: 13 }}>
          저장되었습니다.
        </div>
      )}

      {branches.length === 0 && newCards.length === 0 && (
        <div style={{ textAlign: "center", padding: "48px 0", color: "#bbb", fontSize: 13 }}>
          등록된 사업장이 없습니다. &ldquo;+ 사업장 추가&rdquo;를 클릭하세요.
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {branches.map(branch => (
          <div key={branch.id} style={cardStyle}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
              <span style={{ fontSize: 14, fontWeight: 700, color: "#1a1a1a" }}>{branch.name}</span>
              <button onClick={() => deleteBranch(branch.id)} style={{
                display: "flex", alignItems: "center", gap: 4,
                padding: "4px 10px", borderRadius: 5, fontSize: 12,
                border: "1px solid #FFD8D8", background: "#FFF0F0", color: "#E03131", cursor: "pointer",
              }}>
                <Trash2 size={12} /> 삭제
              </button>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, fontSize: 12, color: "#555" }}>
              <div><span style={{ color: "#999" }}>임직원 수:</span> {branch.employee_count}명</div>
              <div><span style={{ color: "#999" }}>국문 주소:</span> {branch.address || "—"}</div>
              <div><span style={{ color: "#999" }}>영문 주소:</span> {branch.address_en || "—"}</div>
              <div><span style={{ color: "#999" }}>심사 범위:</span> {branch.scope_kr || "—"}</div>
            </div>
          </div>
        ))}

        {newCards.map(nc => (
          <div key={nc._tempId} style={{ ...cardStyle, border: "1.5px dashed #3B5BDB", background: "#F8F9FF" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: "#3B5BDB" }}>새 사업장</span>
              <button onClick={() => removeNew(nc._tempId)} style={{
                padding: "3px 8px", borderRadius: 4, fontSize: 12,
                border: "1px solid #E5E5E5", background: "#fff", color: "#999", cursor: "pointer",
              }}>취소</button>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              {([
                ["사업장명 *", "name", "text"],
                ["임직원 수", "employee_count", "number"],
                ["국문 주소", "address", "text"],
                ["영문 주소", "address_en", "text"],
              ] as [string, keyof typeof nc, string][]).map(([label, field, type]) => (
                <div key={String(field)}>
                  <label style={{ display: "block", fontSize: 11, color: "#888", marginBottom: 3 }}>{label}</label>
                  <input
                    type={type}
                    value={String(nc[field as keyof typeof nc] ?? "")}
                    onChange={e => updateNew(nc._tempId, String(field), type === "number" ? parseInt(e.target.value) || 0 : e.target.value)}
                    style={inpSt}
                  />
                </div>
              ))}
              <div style={{ gridColumn: "1 / -1" }}>
                <label style={{ display: "block", fontSize: 11, color: "#888", marginBottom: 3 }}>심사 범위 (scope_kr)</label>
                <input
                  value={nc.scope_kr ?? ""}
                  onChange={e => updateNew(nc._tempId, "scope_kr", e.target.value)}
                  style={inpSt}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
