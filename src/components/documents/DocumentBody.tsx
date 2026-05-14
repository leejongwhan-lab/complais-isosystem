"use client";
import { useState } from "react";
import type { DocumentSection } from "@/types/document";
import type { Section } from "@/types/sections";
import { DOCUMENT_SECTION_TEMPLATES, createDefaultSection } from "@/types/sections";
import SectionEditor from "./SectionEditor";
import TurtleDiagramSection from "./TurtleDiagramSection";
import type { TurtleData } from "./TurtleDiagram";

type Tab = "본문" | "거북이표" | "변경이력";

interface HistoryItem {
  id: string;
  action: string;
  from_status: string | null;
  to_status: string | null;
  actor_name: string | null;
  note: string | null;
  created_at: string;
}

interface Props {
  documentId: string;
  docType: string;
  richSections: Section[];
  legacySections: DocumentSection[];
  turtleData: TurtleData | null;
  history: HistoryItem[];
  canWrite: boolean;
  historyColors: Record<string, string>;
  historyLabels: Record<string, string>;
}

function LegacyView({ sections }: { sections: DocumentSection[] }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
      {sections.map(s => (
        <div key={s.id}>
          <h2 style={{ margin: "0 0 8px", fontSize: 14, fontWeight: 700, color: "#1a1a1a" }}>{s.section_title}</h2>
          {s.content ? (
            <p style={{ margin: 0, fontSize: 13, color: "#555", lineHeight: 1.75, whiteSpace: "pre-wrap" }}>{s.content}</p>
          ) : (
            <p style={{ margin: 0, fontSize: 13, color: "#bbb", fontStyle: "italic" }}>내용 없음</p>
          )}
        </div>
      ))}
    </div>
  );
}

export default function DocumentBody({
  documentId, docType, richSections, legacySections, turtleData,
  history, canWrite, historyColors, historyLabels,
}: Props) {
  const [activeTab, setActiveTab] = useState<Tab>("본문");
  const [localSections, setLocalSections] = useState<Section[]>(richSections);
  const [generating, setGenerating] = useState(false);

  const hasRichContent = localSections.length > 0;
  const hasLegacyContent = legacySections.length > 0;

  const generateDefaultSections = async () => {
    setGenerating(true);
    const template = DOCUMENT_SECTION_TEMPLATES[docType] ?? DOCUMENT_SECTION_TEMPLATES["P"];
    const newSections: Section[] = template.map((t, i) => createDefaultSection(t.type, t.title, i + 1));
    setLocalSections(newSections);
    try {
      await fetch(`/api/documents/${documentId}/sections`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sections: newSections }),
      });
    } finally {
      setGenerating(false);
    }
  };

  const TABS: Tab[] = ["본문", "거북이표", "변경이력"];

  return (
    <div style={{ flex: 1, overflowY: "auto", background: "#fff" }}>
      {/* Tab bar */}
      <div style={{ display: "flex", gap: 0, borderBottom: "1px solid #E5E7EB", padding: "0 32px", background: "#fff", flexShrink: 0 }}>
        {TABS.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: "10px 16px", border: "none", background: "none", cursor: "pointer",
              fontSize: 13, fontWeight: activeTab === tab ? 600 : 400,
              color: activeTab === tab ? "#2563EB" : "#6B7280",
              borderBottom: activeTab === tab ? "2px solid #2563EB" : "2px solid transparent",
              marginBottom: -1,
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* 본문 Tab */}
      {activeTab === "본문" && (
        <div style={{ padding: "24px 32px", maxWidth: 860 }}>
          {!hasRichContent && !hasLegacyContent && canWrite && (
            <div style={{
              marginBottom: 20, padding: "14px 18px", background: "#FFFBEB",
              border: "1px solid #FDE68A", borderRadius: 10, display: "flex",
              alignItems: "center", justifyContent: "space-between", gap: 12,
            }}>
              <div>
                <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: "#92400E" }}>이 문서에 본문 내용이 없습니다.</p>
                <p style={{ margin: "2px 0 0", fontSize: 12, color: "#A16207" }}>문서 유형에 맞는 기본 섹션을 자동 생성할 수 있습니다.</p>
              </div>
              <button
                onClick={generateDefaultSections}
                disabled={generating}
                style={{
                  flexShrink: 0, padding: "7px 14px", borderRadius: 8, fontSize: 13, fontWeight: 600,
                  background: "#2563EB", color: "#fff", border: "none", cursor: generating ? "not-allowed" : "pointer",
                  opacity: generating ? 0.7 : 1,
                }}
              >
                {generating ? "생성 중..." : "기본 섹션 생성"}
              </button>
            </div>
          )}

          {hasRichContent ? (
            <SectionEditor
              documentId={documentId}
              initialSections={localSections}
              readonly={!canWrite}
            />
          ) : hasLegacyContent ? (
            <LegacyView sections={legacySections} />
          ) : !canWrite ? (
            <p style={{ fontSize: 13, color: "#bbb" }}>등록된 본문이 없습니다.</p>
          ) : null}
        </div>
      )}

      {/* 거북이표 Tab */}
      {activeTab === "거북이표" && (
        <div style={{ padding: "24px 32px" }}>
          <TurtleDiagramSection
            documentId={documentId}
            docType={docType}
            initialData={turtleData}
            canWrite={canWrite}
          />
        </div>
      )}

      {/* 변경이력 Tab */}
      {activeTab === "변경이력" && (
        <div style={{ padding: "24px 32px" }}>
          <h2 style={{ margin: "0 0 16px", fontSize: 14, fontWeight: 700, color: "#1a1a1a" }}>변경 이력</h2>
          {history.length === 0 ? (
            <p style={{ fontSize: 13, color: "#bbb" }}>이력이 없습니다.</p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {history.map(h => (
                <div key={h.id} style={{ display: "flex", gap: 12, alignItems: "start" }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: historyColors[h.action] ?? "#bbb", flexShrink: 0, marginTop: 6 }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ fontSize: 13, fontWeight: 600, color: "#1a1a1a" }}>{historyLabels[h.action] ?? h.action}</span>
                      {h.actor_name && <span style={{ fontSize: 12, color: "#999" }}>{h.actor_name}</span>}
                      <span style={{ fontSize: 11, color: "#bbb" }}>{h.created_at.slice(0, 10)}</span>
                    </div>
                    {h.note && <p style={{ margin: "2px 0 0", fontSize: 12, color: "#555" }}>{h.note}</p>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
