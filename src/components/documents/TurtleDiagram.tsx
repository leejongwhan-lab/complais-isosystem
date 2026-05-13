"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export interface TurtleLink {
  title: string;
  url: string;
  type: "doc" | "form";
}

export interface TurtleField {
  items: string[];
  links: TurtleLink[];
}

export interface TurtleData {
  processName: string;
  purpose: string;
  responsible: string;
  input: string[];
  output: string[];
  who: TurtleField;
  withWhat: TurtleField;
  how: TurtleField;
  kpi: TurtleField;
}

export interface TurtleDiagramProps extends TurtleData {
  editable?: boolean;
  onChange?: (data: TurtleData) => void;
}

const FIELD_SHORTCUTS: Record<string, { title: string; url: string }[]> = {
  who: [
    { title: "자격 관리 대장", url: "/forms/F-710-01/new" },
    { title: "교육계획서", url: "/forms/F-720-01/new" },
    { title: "업무분장표", url: "/forms/F-130-01/new" },
  ],
  how: [
    { title: "작업표준서", url: "/forms/F-512-01/new" },
    { title: "관리계획서", url: "/forms/F-511-01/new" },
    { title: "시험표준서", url: "/forms/F-570-01/new" },
  ],
  withWhat: [
    { title: "설비 등록 대장", url: "/forms/F-550-04/new" },
    { title: "측정장비 관리 대장", url: "/forms/F-630-01/new" },
  ],
  kpi: [
    { title: "성과지표 관리표", url: "/forms/F-KPI-01/new" },
  ],
};

interface EditableListProps {
  items: string[];
  onSave: (v: string[]) => void;
  placeholder: string;
  editable: boolean;
}

function EditableList({ items, onSave, placeholder, editable }: EditableListProps) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(items.join("\n"));

  function handleBlur() {
    const next = draft
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);
    onSave(next);
    setEditing(false);
  }

  if (editing) {
    return (
      <textarea
        autoFocus
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={handleBlur}
        style={{
          width: "100%",
          minHeight: 80,
          resize: "vertical",
          fontSize: 13,
          border: "1px solid #3B5BDB",
          borderRadius: 4,
          padding: 6,
          outline: "none",
          boxSizing: "border-box",
          fontFamily: "inherit",
        }}
      />
    );
  }

  if (items.length > 0) {
    return (
      <ul
        onClick={editable ? () => { setDraft(items.join("\n")); setEditing(true); } : undefined}
        style={{
          margin: 0,
          paddingLeft: 16,
          listStyle: "disc",
          cursor: editable ? "pointer" : "default",
        }}
      >
        {items.map((item, i) => (
          <li key={i} style={{ fontSize: 13, color: "#333", lineHeight: 1.7 }}>
            {item}
          </li>
        ))}
      </ul>
    );
  }

  return (
    <span
      onClick={editable ? () => { setDraft(""); setEditing(true); } : undefined}
      style={{
        color: "#bbb",
        fontStyle: "italic",
        fontSize: 12,
        cursor: editable ? "pointer" : "default",
      }}
    >
      {placeholder}
    </span>
  );
}

interface EditableTextProps {
  value: string;
  onSave: (v: string) => void;
  placeholder: string;
  style?: React.CSSProperties;
  editable: boolean;
}

function EditableText({ value, onSave, placeholder, style, editable }: EditableTextProps) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);

  function handleBlur() {
    onSave(draft);
    setEditing(false);
  }

  if (editing) {
    return (
      <input
        autoFocus
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={handleBlur}
        style={{
          width: "100%",
          fontSize: (style?.fontSize as number | undefined) ?? 13,
          border: "1px solid #3B5BDB",
          borderRadius: 4,
          padding: "4px 6px",
          outline: "none",
          background: "#fff",
        }}
      />
    );
  }

  return (
    <span
      onClick={editable ? () => { setDraft(value); setEditing(true); } : undefined}
      style={{ ...style, cursor: editable ? "pointer" : "default" }}
    >
      {value || <span style={{ color: "#bbb" }}>{placeholder}</span>}
    </span>
  );
}

interface DocLinkModalProps {
  fieldKey: string;
  onAdd: (link: TurtleLink) => void;
  onClose: () => void;
}

function DocLinkModal({ fieldKey, onAdd, onClose }: DocLinkModalProps) {
  const [q, setQ] = useState("");
  const [results, setResults] = useState<{ id: string; doc_number: string; title: string }[]>([]);
  const [searching, setSearching] = useState(false);
  const shortcuts = FIELD_SHORTCUTS[fieldKey] ?? [];

  useEffect(() => {
    let active = true;

    async function searchDocuments() {
      if (q.length < 2) {
        if (active) {
          setResults([]);
          setSearching(false);
        }
        return;
      }

      setSearching(true);
      const { data } = await supabase
        .from("documents")
        .select("id, doc_number, title")
        .or(`doc_number.ilike.%${q}%,title.ilike.%${q}%`)
        .limit(8);

      if (!active) return;
      setResults((data ?? []) as { id: string; doc_number: string; title: string }[]);
      setSearching(false);
    }

    void searchDocuments();
    return () => {
      active = false;
    };
  }, [q]);

  return (
    <div
      onClick={onClose}
      style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 2000, display: "flex", alignItems: "center", justifyContent: "center" }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{ background: "#fff", borderRadius: 10, padding: "20px", width: 420, maxHeight: "70vh", overflow: "auto", boxShadow: "0 20px 60px rgba(0,0,0,0.25)" }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
          <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: "#1a1a1a" }}>관련 문서 연결</p>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 18, color: "#999", lineHeight: 1 }}>×</button>
        </div>

        <input
          autoFocus
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="문서번호 또는 제목으로 검색..."
          style={{ width: "100%", padding: "7px 10px", fontSize: 13, border: "1px solid #E5E5E5", borderRadius: 6, outline: "none", boxSizing: "border-box", marginBottom: 10 }}
        />

        {searching && <p style={{ fontSize: 12, color: "#bbb", margin: "0 0 8px" }}>검색 중...</p>}
        {results.length > 0 && (
          <div style={{ marginBottom: 14, display: "flex", flexDirection: "column", gap: 2 }}>
            <p style={{ margin: "0 0 6px", fontSize: 10, fontWeight: 700, color: "#bbb", textTransform: "uppercase", letterSpacing: "0.06em" }}>문서 검색 결과</p>
            {results.map((doc) => (
              <button
                key={doc.id}
                onClick={() => { onAdd({ title: `${doc.doc_number} ${doc.title}`, url: `/documents/${doc.id}`, type: "doc" }); onClose(); }}
                style={{ display: "flex", alignItems: "center", gap: 8, padding: "7px 10px", borderRadius: 6, border: "1px solid #E5E5E5", background: "#FAFAFA", cursor: "pointer", textAlign: "left" }}
              >
                <span style={{ fontFamily: "monospace", fontSize: 11, fontWeight: 700, color: "#3B5BDB", flexShrink: 0 }}>{doc.doc_number}</span>
                <span style={{ fontSize: 12, color: "#333", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{doc.title}</span>
              </button>
            ))}
          </div>
        )}
        {q.length >= 2 && !searching && results.length === 0 && (
          <p style={{ fontSize: 12, color: "#bbb", marginBottom: 12 }}>검색 결과 없음</p>
        )}

        {shortcuts.length > 0 && (
          <div>
            <p style={{ margin: "0 0 6px", fontSize: 10, fontWeight: 700, color: "#bbb", textTransform: "uppercase", letterSpacing: "0.06em" }}>서식 바로가기</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {shortcuts.map((s) => (
                <button
                  key={s.url}
                  onClick={() => { onAdd({ title: s.title, url: s.url, type: "form" }); onClose(); }}
                  style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 10px", borderRadius: 6, border: "1px solid #E5E5E5", background: "#FFFBF0", cursor: "pointer", textAlign: "left", fontSize: 12, color: "#555" }}
                >
                  <span>📋</span>
                  <span>{s.title}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

interface TurtleFieldCellProps {
  fieldKey: string;
  label: string;
  sublabel: string;
  field: TurtleField;
  editable: boolean;
  onUpdate: (field: TurtleField) => void;
  itemsPlaceholder: string;
  style?: React.CSSProperties;
}

function TurtleFieldCell({ fieldKey, label, sublabel, field, editable, onUpdate, itemsPlaceholder, style }: TurtleFieldCellProps) {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div style={{ display: "flex", flexDirection: "column", ...style }}>
      <p style={{ margin: "0 0 2px", fontSize: 10, fontWeight: 700, color: "#aaa", textTransform: "uppercase", letterSpacing: "0.06em" }}>{label}</p>
      <p style={{ margin: "0 0 10px", fontSize: 11, color: "#777" }}>{sublabel}</p>

      <EditableList
        items={field.items}
        onSave={(v) => onUpdate({ ...field, items: v })}
        placeholder={itemsPlaceholder}
        editable={editable}
      />

      {field.links.length > 0 && (
        <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 3 }}>
          {field.links.map((link, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <a
                href={link.url}
                onClick={(e) => e.stopPropagation()}
                style={{ fontSize: 11, color: "#3B5BDB", textDecoration: "none", display: "flex", alignItems: "center", gap: 3, flex: 1, overflow: "hidden" }}
              >
                <span>{link.type === "doc" ? "📄" : "📋"}</span>
                <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{link.title}</span>
              </a>
              {editable && (
                <button
                  onClick={() => {
                    const newLinks = field.links.filter((_, li) => li !== i);
                    onUpdate({ ...field, links: newLinks });
                  }}
                  style={{ background: "none", border: "none", cursor: "pointer", color: "#bbb", fontSize: 14, lineHeight: 1, padding: "0 2px", flexShrink: 0 }}
                >
                  ×
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {editable && (
        <button
          onClick={() => setModalOpen(true)}
          style={{ marginTop: 8, padding: "3px 8px", fontSize: 11, fontWeight: 500, color: "#3B5BDB", background: "#EEF2FF", border: "1px solid #C5D0FF", borderRadius: 4, cursor: "pointer", alignSelf: "flex-start" }}
        >
          + 관련 문서 추가
        </button>
      )}

      {modalOpen && (
        <DocLinkModal
          fieldKey={fieldKey}
          onAdd={(link) => onUpdate({ ...field, links: [...field.links, link] })}
          onClose={() => setModalOpen(false)}
        />
      )}
    </div>
  );
}

export default function TurtleDiagram({
  processName,
  purpose,
  responsible,
  input,
  output,
  who,
  withWhat,
  how,
  kpi,
  editable,
  onChange,
}: TurtleDiagramProps) {
  const [localData, setLocalData] = useState<TurtleData>({
    processName, purpose, responsible, input, output, who, withWhat, how, kpi,
  });

  function update<K extends keyof TurtleData>(field: K, value: TurtleData[K]) {
    const next = { ...localData, [field]: value };
    setLocalData(next);
    onChange?.(next);
  }

  return (
    <div style={{
      border: "1px solid #E0E0E0",
      borderRadius: 8,
      overflow: "hidden",
      display: "grid",
      gridTemplateColumns: "1fr 1.6fr 1fr",
      gridTemplateRows: "auto 1fr 1fr auto",
    }}>

      {/* Input (top full-width) */}
      <div style={{ gridColumn: "1 / 4", gridRow: 1, background: "#F0FDF4", borderBottom: "1px solid #E0E0E0", padding: "12px 16px" }}>
        <p style={{ margin: "0 0 6px", fontSize: 10, fontWeight: 700, color: "#2F9E44", textTransform: "uppercase", letterSpacing: "0.07em" }}>
          입력 (Input) — 무엇이 들어오는가?
        </p>
        <EditableList
          items={localData.input}
          onSave={(v) => update("input", v)}
          placeholder="입력 항목을 추가하세요"
          editable={!!editable}
        />
      </div>

      {/* Who (top-left) */}
      <TurtleFieldCell
        fieldKey="who"
        label="인원/역량 (Who)"
        sublabel="누가 수행하는가?"
        field={localData.who}
        editable={!!editable}
        onUpdate={(v) => update("who", v)}
        itemsPlaceholder="담당자/역량 추가"
        style={{ gridColumn: 1, gridRow: 2, background: "#F8F8FF", borderRight: "1px solid #E0E0E0", borderBottom: "1px solid #E0E0E0", padding: "14px 16px" }}
      />

      {/* Center */}
      <div style={{ gridColumn: 2, gridRow: "2 / 4", background: "#EEF2FF", padding: "20px 18px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", gap: 8 }}>
        <EditableText value={localData.processName} onSave={(v) => update("processName", v)} placeholder="프로세스명" style={{ fontSize: 16, fontWeight: 700, color: "#1a1a1a", display: "block" }} editable={!!editable} />
        <EditableText value={localData.purpose} onSave={(v) => update("purpose", v)} placeholder="목적/목표를 입력하세요" style={{ fontSize: 13, color: "#555", display: "block" }} editable={!!editable} />
        <div style={{ width: "100%", borderTop: "1px solid #C5D0FF", margin: "6px 0" }} />
        <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
          <span style={{ fontSize: 11, color: "#888" }}>책임자:</span>
          <EditableText value={localData.responsible} onSave={(v) => update("responsible", v)} placeholder="담당자명" style={{ fontSize: 12, fontWeight: 600, color: "#3B5BDB" }} editable={!!editable} />
        </div>
      </div>

      {/* How (top-right) */}
      <TurtleFieldCell
        fieldKey="how"
        label="방법/절차 (How)"
        sublabel="어떻게 수행하는가?"
        field={localData.how}
        editable={!!editable}
        onUpdate={(v) => update("how", v)}
        itemsPlaceholder="절차/방법 추가"
        style={{ gridColumn: 3, gridRow: 2, background: "#F8F8FF", borderLeft: "1px solid #E0E0E0", borderBottom: "1px solid #E0E0E0", padding: "14px 16px" }}
      />

      {/* WithWhat (bottom-left) */}
      <TurtleFieldCell
        fieldKey="withWhat"
        label="장비/자원 (With What)"
        sublabel="무엇으로 수행하는가?"
        field={localData.withWhat}
        editable={!!editable}
        onUpdate={(v) => update("withWhat", v)}
        itemsPlaceholder="장비/자원 추가"
        style={{ gridColumn: 1, gridRow: 3, background: "#FAFAFA", borderRight: "1px solid #E0E0E0", padding: "14px 16px" }}
      />

      {/* KPI (bottom-right) */}
      <TurtleFieldCell
        fieldKey="kpi"
        label="성과지표 (KPI)"
        sublabel="얼마나 잘 수행하는가?"
        field={localData.kpi}
        editable={!!editable}
        onUpdate={(v) => update("kpi", v)}
        itemsPlaceholder="KPI 추가"
        style={{ gridColumn: 3, gridRow: 3, background: "#FFFBF0", borderLeft: "1px solid #E0E0E0", padding: "14px 16px" }}
      />

      {/* Output (bottom full-width) */}
      <div style={{ gridColumn: "1 / 4", gridRow: 4, background: "#FFF7ED", borderTop: "1px solid #E0E0E0", padding: "12px 16px" }}>
        <p style={{ margin: "0 0 6px", fontSize: 10, fontWeight: 700, color: "#D97706", textTransform: "uppercase", letterSpacing: "0.07em" }}>
          출력 (Output) — 무엇이 나가는가?
        </p>
        <EditableList
          items={localData.output}
          onSave={(v) => update("output", v)}
          placeholder="출력 항목을 추가하세요"
          editable={!!editable}
        />
      </div>
    </div>
  );
}
