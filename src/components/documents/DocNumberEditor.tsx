"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { Pencil, Check, X } from "lucide-react";

interface DocNumberEditorProps {
  documentId: string;
  currentNumber: string;
  canEdit: boolean;
}

// 형식: LPB-C-150-P-01 (회사코드-레이어-프로세스-유형-일련번호)
const VALID_DOC_NUM = /^[A-Z]{1,3}-[A-Z]{1,3}-\d{3}-[MPRF]-\d{2}$/;

export default function DocNumberEditor({ documentId, currentNumber, canEdit }: DocNumberEditorProps) {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(currentNumber);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isValid = VALID_DOC_NUM.test(value);

  async function handleSave() {
    if (!isValid) { setError("올바른 형식이 아닙니다 (예: LPB-C-110-P-01)"); return; }
    setSaving(true);
    const { error: dbErr } = await supabase
      .from("documents")
      .update({ doc_number: value })
      .eq("id", documentId);
    setSaving(false);
    if (dbErr) { setError(dbErr.message); return; }
    setEditing(false);
    setError(null);
  }

  function handleCancel() {
    setValue(currentNumber);
    setEditing(false);
    setError(null);
  }

  if (!editing) {
    return (
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <span style={{ fontFamily: "monospace", fontSize: 12, fontWeight: 700, color: "#3B5BDB" }}>
          {currentNumber}
        </span>
        {canEdit && (
          <button
            onClick={() => setEditing(true)}
            title="문서번호 수정"
            style={{ padding: 3, background: "transparent", border: "none", cursor: "pointer", opacity: 0.45, lineHeight: 1 }}
            className="hover:opacity-100 transition-opacity"
          >
            <Pencil size={11} color="#3B5BDB" />
          </button>
        )}
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <input
          autoFocus
          value={value}
          onChange={(e) => { setValue(e.target.value.toUpperCase()); setError(null); }}
          onKeyDown={(e) => { if (e.key === "Enter") handleSave(); if (e.key === "Escape") handleCancel(); }}
          style={{
            fontFamily: "monospace", fontSize: 13, fontWeight: 700,
            color: isValid ? "#3B5BDB" : "#E03131",
            border: `1.5px solid ${isValid ? "#3B5BDB" : "#E03131"}`,
            borderRadius: 5, padding: "3px 8px", outline: "none",
            width: 180, background: "#fff",
          }}
        />
        <button
          onClick={handleSave}
          disabled={saving || !isValid}
          style={{ padding: 5, borderRadius: 5, border: "none", background: isValid ? "#3B5BDB" : "#E5E5E5", cursor: isValid && !saving ? "pointer" : "not-allowed", lineHeight: 1 }}
        >
          <Check size={12} color={isValid ? "#fff" : "#bbb"} />
        </button>
        <button
          onClick={handleCancel}
          style={{ padding: 5, borderRadius: 5, border: "1px solid #E5E5E5", background: "#fff", cursor: "pointer", lineHeight: 1 }}
        >
          <X size={12} color="#999" />
        </button>
      </div>
      {error && <p style={{ margin: 0, fontSize: 11, color: "#E03131" }}>{error}</p>}
      <p style={{ margin: 0, fontSize: 10, color: "#bbb" }}>
        올바른 형식: 회사코드-레이어-프로세스번호-유형-일련번호 (예: LPB-C-150-P-01)
      </p>
    </div>
  );
}
