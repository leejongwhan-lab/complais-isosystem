"use client";
import { useState, useCallback, useRef, useEffect } from "react";
import { ChevronDown, ChevronUp, X, Plus, Check, Loader2 } from "lucide-react";
import type { Section, SectionType } from "@/types/sections";
import { SECTION_TYPE_LABELS, createDefaultSection } from "@/types/sections";
import SectionPurpose from "./sections/SectionPurpose";
import SectionText from "./sections/SectionText";
import SectionScope from "./sections/SectionScope";
import SectionDefinitions from "./sections/SectionDefinitions";
import SectionRaci from "./sections/SectionRaci";
import SectionProcedure from "./sections/SectionProcedure";
import SectionSipoc from "./sections/SectionSipoc";
import SectionKpi from "./sections/SectionKpi";
import SectionRisk from "./sections/SectionRisk";
import SectionRelatedDocs from "./sections/SectionRelatedDocs";
import SectionRelatedForms from "./sections/SectionRelatedForms";

interface Props {
  documentId: string;
  initialSections: Section[];
  readonly?: boolean;
}

function SectionBody({ section, onChange, readonly }: { section: Section; onChange: (d: Section["data"]) => void; readonly: boolean }) {
  const props = { data: section.data as never, onChange: onChange as never, readonly };
  switch (section.type) {
    case "purpose":       return <SectionPurpose       {...props} />;
    case "text":          return <SectionText           {...props} />;
    case "scope":         return <SectionScope          {...props} />;
    case "definitions":   return <SectionDefinitions    {...props} />;
    case "raci":          return <SectionRaci           {...props} />;
    case "procedure":     return <SectionProcedure      {...props} />;
    case "sipoc":         return <SectionSipoc          {...props} />;
    case "kpi":           return <SectionKpi            {...props} />;
    case "risk":          return <SectionRisk           {...props} />;
    case "related_docs":  return <SectionRelatedDocs    {...props} />;
    case "related_forms": return <SectionRelatedForms   {...props} />;
    default:              return null;
  }
}

const SECTION_TYPES: SectionType[] = [
  "purpose", "scope", "definitions", "raci", "procedure",
  "sipoc", "kpi", "risk", "related_docs", "related_forms", "text",
];

export default function SectionEditor({ documentId, initialSections, readonly = false }: Props) {
  const [sections, setSections] = useState<Section[]>(initialSections);
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set());
  const [showAddMenu, setShowAddMenu] = useState(false);
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved">("idle");
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const save = useCallback(async (secs: Section[]) => {
    setSaveState("saving");
    try {
      await fetch(`/api/documents/${documentId}/sections`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sections: secs }),
      });
      setSaveState("saved");
      setTimeout(() => setSaveState("idle"), 2000);
    } catch {
      setSaveState("idle");
    }
  }, [documentId]);

  const update = useCallback((newSecs: Section[]) => {
    setSections(newSecs);
    if (readonly) return;
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => save(newSecs), 2000);
  }, [readonly, save]);

  const updateSectionData = (id: string, data: Section["data"]) => {
    update(sections.map(s => s.id === id ? { ...s, data } : s));
  };

  const removeSection = (id: string) => update(sections.filter(s => s.id !== id));
  const moveSection = (i: number, dir: -1 | 1) => {
    const arr = [...sections];
    const [item] = arr.splice(i, 1);
    arr.splice(i + dir, 0, item);
    update(arr.map((s, idx) => ({ ...s, order: idx + 1 })));
  };
  const toggleCollapse = (id: string) => setCollapsed(prev => {
    const next = new Set(prev);
    next.has(id) ? next.delete(id) : next.add(id);
    return next;
  });
  const addSection = (type: SectionType) => {
    const title = SECTION_TYPE_LABELS[type];
    const newSection = createDefaultSection(type, title, sections.length + 1);
    update([...sections, newSection]);
    setShowAddMenu(false);
  };

  useEffect(() => () => { if (timerRef.current) clearTimeout(timerRef.current); }, []);

  return (
    <div>
      {/* Save indicator */}
      {!readonly && (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
          <span style={{ fontSize: 12, color: "#9CA3AF" }}>
            {saveState === "saving" && <><Loader2 size={12} style={{ display: "inline", marginRight: 4 }} />저장 중...</>}
            {saveState === "saved" && <><Check size={12} style={{ display: "inline", marginRight: 4, color: "#16A34A" }} /><span style={{ color: "#16A34A" }}>저장됨</span></>}
          </span>
          <div style={{ position: "relative" }}>
            <button
              onClick={() => setShowAddMenu(v => !v)}
              style={{
                display: "flex", alignItems: "center", gap: 5,
                padding: "6px 12px", borderRadius: 8, border: "1px solid #E5E7EB",
                background: "#fff", cursor: "pointer", fontSize: 13, fontWeight: 500, color: "#374151",
              }}
              className="hover:bg-[#F9FAFB] transition-colors"
            >
              <Plus size={14} /> 섹션 추가
            </button>
            {showAddMenu && (
              <div style={{
                position: "absolute", top: "100%", right: 0, marginTop: 4,
                background: "#fff", border: "1px solid #E5E7EB", borderRadius: 10,
                boxShadow: "0 8px 24px rgba(0,0,0,0.1)", zIndex: 100,
                minWidth: 200, padding: 4,
              }}>
                {SECTION_TYPES.map(type => (
                  <button
                    key={type}
                    onClick={() => addSection(type)}
                    style={{ display: "block", width: "100%", padding: "7px 12px", border: "none", background: "none", cursor: "pointer", textAlign: "left", fontSize: 13, color: "#374151", borderRadius: 6 }}
                    className="hover:bg-[#F9FAFB] transition-colors"
                  >
                    {SECTION_TYPE_LABELS[type]}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Sections */}
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {sections.map((section, i) => {
          const isCollapsed = collapsed.has(section.id);
          return (
            <div key={section.id} style={{ border: "1px solid #E5E7EB", borderRadius: 12, overflow: "hidden" }}>
              <div
                style={{
                  display: "flex", alignItems: "center", gap: 8, padding: "12px 16px",
                  background: "#F9FAFB", borderBottom: isCollapsed ? "none" : "1px solid #E5E7EB",
                  cursor: "pointer",
                }}
                onClick={() => toggleCollapse(section.id)}
              >
                <span style={{ fontSize: 11, fontWeight: 700, color: "#6B7280", background: "#E5E7EB", borderRadius: 4, padding: "1px 6px", flexShrink: 0 }}>
                  {SECTION_TYPE_LABELS[section.type]}
                </span>
                <span style={{ fontSize: 14, fontWeight: 600, color: "#111827", flex: 1 }}>{section.title}</span>
                {!readonly && (
                  <div style={{ display: "flex", gap: 2 }} onClick={e => e.stopPropagation()}>
                    {i > 0 && <button onClick={() => moveSection(i, -1)} style={{ border: "none", background: "none", cursor: "pointer", padding: 3 }}><ChevronUp size={14} color="#9CA3AF" /></button>}
                    {i < sections.length - 1 && <button onClick={() => moveSection(i, 1)} style={{ border: "none", background: "none", cursor: "pointer", padding: 3 }}><ChevronDown size={14} color="#9CA3AF" /></button>}
                    <button onClick={() => removeSection(section.id)} style={{ border: "none", background: "none", cursor: "pointer", padding: 3 }}><X size={14} color="#9CA3AF" /></button>
                  </div>
                )}
                <span style={{ color: "#9CA3AF" }}>{isCollapsed ? <ChevronDown size={14} /> : <ChevronUp size={14} />}</span>
              </div>
              {!isCollapsed && (
                <div style={{ padding: "16px 20px" }}>
                  <SectionBody
                    section={section}
                    onChange={d => updateSectionData(section.id, d)}
                    readonly={readonly}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {sections.length === 0 && (
        <div style={{ textAlign: "center", padding: "40px 20px", color: "#9CA3AF" }}>
          <p style={{ margin: 0, fontSize: 14 }}>{readonly ? "등록된 섹션이 없습니다." : "위의 '섹션 추가' 버튼으로 섹션을 추가하세요."}</p>
        </div>
      )}
    </div>
  );
}
