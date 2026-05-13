import { Sparkles, Upload } from "lucide-react";
import TurtleDiagram, { type TurtleData } from "@/components/documents/TurtleDiagram";
import {
  APPROVAL_STEPS,
  DOC_TYPES,
  INPUT_STYLE,
  LAYER_LABELS,
  PROCESS_BY_LAYER,
  type QuickStartPreset,
} from "./config";

export function DocumentStepOne({
  hasSavedDraft,
  quickStartPresets,
  restoreDraft,
  applyPreset,
  layer,
  processCode,
  docType,
  title,
  titleTouched,
  ownerName,
  relatedIso,
  relatedIsoTouched,
  suggestedIsoClause,
  changeReason,
  setLayerAndDefaults,
  setProcessAndDefaults,
  setDocTypeAndDefaults,
  updateTitle,
  updateOwnerName,
  updateRelatedIso,
  updateChangeReason,
}: {
  hasSavedDraft: boolean;
  quickStartPresets: QuickStartPreset[];
  restoreDraft: () => void;
  applyPreset: (preset: QuickStartPreset) => void;
  layer: string;
  processCode: string;
  docType: string;
  title: string;
  titleTouched: boolean;
  ownerName: string;
  relatedIso: string;
  relatedIsoTouched: boolean;
  suggestedIsoClause: string;
  changeReason: string;
  setLayerAndDefaults: (nextLayer: string) => void;
  setProcessAndDefaults: (nextProcessCode: string) => void;
  setDocTypeAndDefaults: (nextDocType: string) => void;
  updateTitle: (nextTitle: string) => void;
  updateOwnerName: (nextOwnerName: string) => void;
  updateRelatedIso: (nextRelatedIso: string) => void;
  updateChangeReason: (nextReason: string) => void;
}) {
  const cardStyle = (selected: boolean): React.CSSProperties => ({
    display: "flex",
    flexDirection: "column",
    alignItems: "start",
    padding: "10px 12px",
    borderRadius: 6,
    cursor: "pointer",
    textAlign: "left",
    border: selected ? "1px solid #3B5BDB" : "1px solid #E5E5E5",
    background: selected ? "#EEF2FF" : "#fff",
    transition: "border-color 0.15s",
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 22, maxWidth: 560 }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
          <label style={{ fontSize: 11, fontWeight: 600, color: "#999", textTransform: "uppercase", letterSpacing: "0.05em" }}>
            빠른 시작
          </label>
          {hasSavedDraft && (
            <button
              onClick={restoreDraft}
              style={{ padding: "4px 10px", borderRadius: 999, border: "1px solid #C5D0FF", background: "#F0F4FF", color: "#3B5BDB", fontSize: 11, fontWeight: 600, cursor: "pointer" }}
            >
              임시저장 복원
            </button>
          )}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 8 }}>
          {quickStartPresets.map((preset) => (
            <button
              key={preset.id}
              onClick={() => applyPreset(preset)}
              style={{ padding: "10px 12px", borderRadius: 8, border: "1px solid #E5E5E5", background: "#FAFAFA", textAlign: "left", cursor: "pointer" }}
            >
              <div style={{ fontSize: 12, fontWeight: 700, color: "#1a1a1a" }}>{preset.label}</div>
              <div style={{ marginTop: 2, fontSize: 11, color: "#777" }}>{preset.desc}</div>
            </button>
          ))}
        </div>
      </div>

      <div>
        <label style={{ display: "block", marginBottom: 6, fontSize: 11, fontWeight: 600, color: "#999", textTransform: "uppercase", letterSpacing: "0.05em" }}>
          레이어 <span style={{ color: "#E03131" }}>*</span>
        </label>
        <select value={layer} onChange={(e) => setLayerAndDefaults(e.target.value)} style={{ ...INPUT_STYLE, cursor: "pointer" }} className="focus:border-[#3B5BDB] transition-colors">
          <option value="">— 레이어 선택 —</option>
          {Object.entries(LAYER_LABELS).map(([key, label]) => (
            <option key={key} value={key}>{label}</option>
          ))}
        </select>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
        <div>
          <label style={{ display: "block", marginBottom: 6, fontSize: 11, fontWeight: 600, color: "#999", textTransform: "uppercase", letterSpacing: "0.05em" }}>
            프로세스 코드 <span style={{ color: "#E03131" }}>*</span>
          </label>
          <select
            value={processCode}
            onChange={(e) => setProcessAndDefaults(e.target.value)}
            disabled={!layer}
            style={{ ...INPUT_STYLE, cursor: layer ? "pointer" : "not-allowed", opacity: layer ? 1 : 0.5 }}
            className="focus:border-[#3B5BDB] transition-colors"
          >
            {!layer && <option value="">— 레이어 먼저 선택 —</option>}
            {(PROCESS_BY_LAYER[layer] ?? []).map((pc) => (
              <option key={pc.value} value={pc.value}>{pc.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label style={{ display: "block", marginBottom: 6, fontSize: 11, fontWeight: 600, color: "#999", textTransform: "uppercase", letterSpacing: "0.05em" }}>
            문서 유형 <span style={{ color: "#E03131" }}>*</span>
          </label>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
            {DOC_TYPES.map((type) => (
              <button key={type.value} onClick={() => setDocTypeAndDefaults(type.value)} style={cardStyle(docType === type.value)}>
                <span style={{ fontSize: 12, fontWeight: 600, color: docType === type.value ? "#3B5BDB" : "#1a1a1a" }}>
                  {type.value} — {type.label}
                </span>
                <span style={{ fontSize: 11, color: "#bbb", marginTop: 2 }}>{type.desc}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div>
        <label style={{ display: "block", marginBottom: 6, fontSize: 11, fontWeight: 600, color: "#999", textTransform: "uppercase", letterSpacing: "0.05em" }}>
          문서 제목 <span style={{ color: "#E03131" }}>*</span>
        </label>
        <input type="text" value={title} onChange={(e) => updateTitle(e.target.value)} placeholder="예: 설계변경 관리 프로세스" style={INPUT_STYLE} className="focus:border-[#3B5BDB] transition-colors placeholder:text-[#bbb]" />
        {!titleTouched && layer && processCode && docType && (
          <p style={{ margin: "6px 0 0", fontSize: 11, color: "#999" }}>선택값 기준으로 제목을 자동 제안했습니다. 그대로 쓰거나 수정하면 됩니다.</p>
        )}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
        <div>
          <label style={{ display: "block", marginBottom: 6, fontSize: 11, fontWeight: 600, color: "#999", textTransform: "uppercase", letterSpacing: "0.05em" }}>
            담당자
          </label>
          <input type="text" value={ownerName} onChange={(e) => updateOwnerName(e.target.value)} placeholder="홍길동" style={INPUT_STYLE} className="focus:border-[#3B5BDB] transition-colors placeholder:text-[#bbb]" />
        </div>
        <div>
          <label style={{ display: "block", marginBottom: 6, fontSize: 11, fontWeight: 600, color: "#999", textTransform: "uppercase", letterSpacing: "0.05em" }}>
            관련 ISO 조항
          </label>
          <input type="text" value={relatedIso} onChange={(e) => updateRelatedIso(e.target.value)} placeholder="예: 8.3" style={INPUT_STYLE} className="focus:border-[#3B5BDB] transition-colors placeholder:text-[#bbb]" />
          {!relatedIsoTouched && suggestedIsoClause && (
            <p style={{ margin: "6px 0 0", fontSize: 11, color: "#999" }}>선택한 프로세스 기준으로 ISO 조항을 자동 제안했습니다.</p>
          )}
        </div>
      </div>

      <div>
        <label style={{ display: "block", marginBottom: 6, fontSize: 11, fontWeight: 600, color: "#999", textTransform: "uppercase", letterSpacing: "0.05em" }}>
          작성 사유
        </label>
        <input type="text" value={changeReason} onChange={(e) => updateChangeReason(e.target.value)} placeholder="예: 최초 작성" style={INPUT_STYLE} className="focus:border-[#3B5BDB] transition-colors placeholder:text-[#bbb]" />
      </div>
    </div>
  );
}

export function DocumentStepTwo({
  docType,
  dragging,
  file,
  templates,
  loadingSections,
  sectionContents,
  turtleData,
  setDragging,
  setFile,
  handleAIDraft,
  updateSectionContents,
  setTurtleData,
}: {
  docType: string;
  dragging: boolean;
  file: File | null;
  templates: { key: string; title: string; placeholder: string }[];
  loadingSections: Record<string, boolean>;
  sectionContents: Record<string, string>;
  turtleData: TurtleData;
  setDragging: (dragging: boolean) => void;
  setFile: (file: File | null) => void;
  handleAIDraft: (key: string, title: string) => void;
  updateSectionContents: (key: string, value: string) => void;
  setTurtleData: (data: TurtleData) => void;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12, maxWidth: 560 }}>
      {docType === "F" ? (
        <div
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => { e.preventDefault(); setDragging(false); const nextFile = e.dataTransfer.files[0]; if (nextFile) setFile(nextFile); }}
          style={{ border: `2px dashed ${dragging ? "#3B5BDB" : "#E5E5E5"}`, borderRadius: 8, padding: "40px 24px", display: "flex", flexDirection: "column", alignItems: "center", gap: 10, background: dragging ? "#F5F8FF" : "#FAFAFA" }}
        >
          <Upload size={24} color="#bbb" />
          {file ? (
            <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: "#3B5BDB" }}>{file.name}</p>
          ) : (
            <>
              <p style={{ margin: 0, fontSize: 13, fontWeight: 500, color: "#555" }}>드래그하거나 클릭하여 업로드</p>
              <p style={{ margin: 0, fontSize: 11, color: "#bbb" }}>PDF, DOCX, XLSX, HWP</p>
            </>
          )}
          <label style={{ marginTop: 4, padding: "5px 12px", borderRadius: 6, border: "1px solid #E5E5E5", background: "#fff", fontSize: 12, fontWeight: 500, color: "#555", cursor: "pointer" }} className="hover:bg-[#F5F5F5] transition-colors">
            파일 선택
            <input type="file" className="hidden" accept=".pdf,.docx,.xlsx,.hwp" onChange={(e) => { const nextFile = e.target.files?.[0]; if (nextFile) setFile(nextFile); }} />
          </label>
        </div>
      ) : (
        templates.map((template) => (
          <div key={template.key} style={{ border: "1px solid #E5E5E5", borderRadius: 8, padding: "14px 16px", background: "#fff" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
              <label style={{ fontSize: 13, fontWeight: 600, color: "#1a1a1a" }}>{template.title}</label>
              <button
                onClick={() => handleAIDraft(template.key, template.title)}
                disabled={loadingSections[template.key]}
                style={{ display: "flex", alignItems: "center", gap: 4, padding: "3px 8px", borderRadius: 4, cursor: loadingSections[template.key] ? "not-allowed" : "pointer", fontSize: 11, fontWeight: 600, color: "#7048E8", border: "1px solid #D4BFFF", background: "#F3F0FF", opacity: loadingSections[template.key] ? 0.6 : 1 }}
                className="hover:opacity-80 transition-opacity"
              >
                {loadingSections[template.key] ? <div className="w-3 h-3 border border-[#7048E8] border-t-transparent rounded-full animate-spin" /> : <Sparkles size={10} />}
                {loadingSections[template.key] ? "생성 중..." : "AI 초안"}
              </button>
            </div>
            <textarea
              rows={5}
              value={sectionContents[template.key] ?? ""}
              onChange={(e) => updateSectionContents(template.key, e.target.value)}
              placeholder={template.placeholder}
              style={{ ...INPUT_STYLE, resize: "vertical", lineHeight: 1.7 }}
              className="focus:border-[#3B5BDB] transition-colors placeholder:text-[#bbb]"
            />
          </div>
        ))
      )}

      {docType === "P" && (
        <div style={{ marginTop: 24, border: "1px solid #E5E5E5", borderRadius: 8, padding: "16px", background: "#fff" }}>
          <p style={{ margin: "0 0 12px", fontSize: 13, fontWeight: 600, color: "#1a1a1a" }}>
            프로세스 거북이표 <span style={{ fontSize: 11, color: "#bbb", fontWeight: 400 }}>(선택사항)</span>
          </p>
          <TurtleDiagram {...turtleData} editable={true} onChange={setTurtleData} />
        </div>
      )}
    </div>
  );
}

export function DocumentStepThree({
  approvers,
  ownerName,
  updateApprovers,
}: {
  approvers: Record<number, string>;
  ownerName: string;
  updateApprovers: (step: number, value: string) => void;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8, maxWidth: 560 }}>
      <p style={{ margin: "0 0 8px", fontSize: 13, color: "#555" }}>결재선을 설정합니다. 이름을 비워두면 해당 단계는 생략됩니다.</p>
      {APPROVAL_STEPS.map((approval) => (
        <div key={approval.step} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", border: "1px solid #E5E5E5", borderRadius: 8, background: "#fff" }}>
          <div style={{ width: 24, height: 24, borderRadius: "50%", flexShrink: 0, background: "#EEF2FF", color: "#3B5BDB", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700 }}>
            {approval.step}
          </div>
          <div style={{ flex: 1 }}>
            <p style={{ margin: "0 0 5px", fontSize: 12, fontWeight: 600, color: "#555" }}>{approval.step_name}</p>
            <input
              type="text"
              value={approvers[approval.step] ?? ""}
              onChange={(e) => updateApprovers(approval.step, e.target.value)}
              placeholder={approval.step === 1 ? ownerName || "작성자 이름" : "담당자 이름"}
              style={{ ...INPUT_STYLE, background: "#FAFAFA" }}
              className="focus:border-[#3B5BDB] transition-colors placeholder:text-[#bbb]"
            />
          </div>
        </div>
      ))}
    </div>
  );
}
