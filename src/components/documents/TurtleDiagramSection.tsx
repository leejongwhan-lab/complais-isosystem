"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import TurtleDiagram, { type TurtleData } from "./TurtleDiagram";

interface TurtleDiagramSectionProps {
  documentId: string;
  docType: string;
  initialData: TurtleData | null;
  canWrite: boolean;
}

const EMPTY_TURTLE: TurtleData = {
  processName: "",
  purpose: "",
  responsible: "",
  input: [],
  output: [],
  who: { items: [], links: [] },
  withWhat: { items: [], links: [] },
  how: { items: [], links: [] },
  kpi: { items: [], links: [] },
};

function normalizeTurtleField(raw: unknown): import("./TurtleDiagram").TurtleField {
  if (Array.isArray(raw)) return { items: raw as string[], links: [] };
  if (raw && typeof raw === "object" && "items" in raw) return raw as import("./TurtleDiagram").TurtleField;
  return { items: [], links: [] };
}

function normalizeTurtleData(raw: TurtleData | null): TurtleData {
  if (!raw) return EMPTY_TURTLE;
  return {
    processName: raw.processName ?? "",
    purpose: raw.purpose ?? "",
    responsible: raw.responsible ?? "",
    input: Array.isArray(raw.input) ? raw.input : [],
    output: Array.isArray(raw.output) ? raw.output : [],
    who: normalizeTurtleField(raw.who),
    withWhat: normalizeTurtleField(raw.withWhat),
    how: normalizeTurtleField(raw.how),
    kpi: normalizeTurtleField(raw.kpi),
  };
}

export default function TurtleDiagramSection({
  documentId,
  docType,
  initialData,
  canWrite,
}: TurtleDiagramSectionProps) {
  const [data, setData] = useState<TurtleData>(normalizeTurtleData(initialData));
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  if (docType !== "P") return null;

  async function handleSave() {
    setSaving(true);
    await supabase
      .from("documents")
      .update({ turtle_data: data })
      .eq("id", documentId);
    setSaving(false);
    setEditing(false);
  }

  return (
    <div style={{ padding: "24px 32px", borderTop: "1px solid #F0F0F0" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 16,
          maxWidth: 720,
        }}
      >
        <h2 style={{ margin: 0, fontSize: 14, fontWeight: 700, color: "#1a1a1a" }}>
          프로세스 거북이표
        </h2>
        <div style={{ display: "flex", gap: 8 }} className="no-print">
          {canWrite && !editing && (
            <button
              onClick={() => setEditing(true)}
              style={{
                padding: "4px 12px",
                borderRadius: 6,
                border: "1px solid #E5E5E5",
                background: "#fff",
                fontSize: 12,
                fontWeight: 500,
                color: "#555",
                cursor: "pointer",
              }}
            >
              거북이표 편집
            </button>
          )}
          {editing && (
            <>
              <button
                onClick={handleSave}
                disabled={saving}
                style={{
                  padding: "4px 12px",
                  borderRadius: 6,
                  border: "none",
                  background: "#3B5BDB",
                  color: "#fff",
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: saving ? "not-allowed" : "pointer",
                  opacity: saving ? 0.6 : 1,
                }}
              >
                {saving ? "저장 중..." : "저장"}
              </button>
              <button
                onClick={() => {
                  setData(normalizeTurtleData(initialData));
                  setEditing(false);
                }}
                style={{
                  padding: "4px 12px",
                  borderRadius: 6,
                  border: "1px solid #E5E5E5",
                  background: "#fff",
                  fontSize: 12,
                  fontWeight: 500,
                  color: "#555",
                  cursor: "pointer",
                }}
              >
                취소
              </button>
            </>
          )}
        </div>
      </div>
      <div style={{ maxWidth: 720 }}>
        <TurtleDiagram
          {...data}
          editable={editing}
          onChange={setData}
        />
      </div>
    </div>
  );
}
