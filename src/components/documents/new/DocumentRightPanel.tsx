import { Check, Copy, FileText } from "lucide-react";
import {
  APPROVAL_STEPS,
  DOC_TYPES,
  LAYER_LABELS,
  PROCESS_BY_LAYER,
  STATUS_COLOR,
  type RelatedDoc,
} from "./config";

export default function DocumentRightPanel({
  step,
  layer,
  processCode,
  docType,
  title,
  ownerName,
  sectionContents,
  templates,
  file,
  approvers,
  docNumberPreview,
  relatedDocs,
  onLoadDoc,
  loadingSourceDocId,
}: {
  step: number;
  layer: string;
  processCode: string;
  docType: string;
  title: string;
  ownerName: string;
  sectionContents: Record<string, string>;
  templates: { key: string; title: string; placeholder: string }[];
  file: File | null;
  approvers: Record<number, string>;
  docNumberPreview: string;
  relatedDocs: RelatedDoc[];
  onLoadDoc: (docId: string) => void;
  loadingSourceDocId: string | null;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div>
        <p style={{ margin: "0 0 8px", fontSize: 10, fontWeight: 600, color: "#bbb", textTransform: "uppercase", letterSpacing: "0.06em" }}>
          문서번호 미리보기
        </p>
        {docNumberPreview && docNumberPreview !== "번호미정" ? (
          <div style={{ background: "#F0F4FF", border: "1px solid #C5D0FF", borderRadius: 8, padding: "14px 12px", textAlign: "center" }}>
            <span style={{ fontFamily: "'JetBrains Mono', 'Fira Mono', 'Courier New', monospace", fontSize: 18, fontWeight: 700, color: "#3B5BDB", letterSpacing: "0.04em" }}>
              {docNumberPreview}
            </span>
          </div>
        ) : (
          <div style={{ background: "#FFFBEB", border: "1px solid #FDE68A", borderRadius: 8, padding: "12px", textAlign: "center" }}>
            <p style={{ margin: 0, fontSize: 12, color: "#92400E", fontWeight: 500 }}>
              ⚠ 설정에서 회사 코드를 먼저 입력하세요
            </p>
          </div>
        )}
      </div>

      <div>
        <p style={{ margin: "0 0 8px", fontSize: 10, fontWeight: 600, color: "#bbb", textTransform: "uppercase", letterSpacing: "0.06em" }}>
          선택 현황
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {[
            { key: "레이어", val: layer ? LAYER_LABELS[layer] : null },
            { key: "프로세스", val: processCode ? PROCESS_BY_LAYER[layer]?.find((p) => p.value === processCode)?.label ?? processCode : null },
            { key: "유형", val: docType ? DOC_TYPES.find((t) => t.value === docType)?.label : null },
            { key: "제목", val: title.trim() || null },
            { key: "담당자", val: ownerName.trim() || null },
          ].map(({ key, val }) => (
            <div key={key} style={{ display: "flex", justifyContent: "space-between", gap: 8, fontSize: 12 }}>
              <span style={{ color: "#bbb", flexShrink: 0 }}>{key}</span>
              <span style={{ color: val ? "#1a1a1a" : "#E5E5E5", fontWeight: val ? 500 : 400, textAlign: "right", maxWidth: 140, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {val ?? "—"}
              </span>
            </div>
          ))}
        </div>
      </div>

      {step === 1 && (
        <div>
          <p style={{ margin: "0 0 8px", fontSize: 10, fontWeight: 600, color: "#bbb", textTransform: "uppercase", letterSpacing: "0.06em" }}>
            {processCode} 기존 문서
          </p>
          {relatedDocs.length > 0 ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
              {relatedDocs.map((doc) => {
                const sc = STATUS_COLOR[doc.status] ?? { color: "#999", bg: "#F5F5F5" };
                return (
                  <div key={doc.id} style={{ padding: "8px 10px", background: "#FAFAFA", border: "1px solid #E5E5E5", borderRadius: 6, display: "flex", alignItems: "start", gap: 8 }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ margin: 0, fontFamily: "monospace", fontSize: 11, fontWeight: 700, color: "#3B5BDB" }}>{doc.doc_number}</p>
                      <p style={{ margin: "2px 0 0", fontSize: 11, color: "#555", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{doc.title}</p>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "end", gap: 6, flexShrink: 0 }}>
                      <span style={{ fontSize: 10, fontWeight: 600, borderRadius: 4, padding: "1px 5px", color: sc.color, background: sc.bg, marginTop: 1 }}>
                        {doc.status}
                      </span>
                      <button
                        onClick={() => onLoadDoc(doc.id)}
                        disabled={loadingSourceDocId === doc.id}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 4,
                          padding: "3px 6px",
                          borderRadius: 4,
                          border: "1px solid #D0D7FF",
                          background: "#F5F8FF",
                          color: "#3B5BDB",
                          fontSize: 10,
                          fontWeight: 600,
                          cursor: loadingSourceDocId === doc.id ? "not-allowed" : "pointer",
                          opacity: loadingSourceDocId === doc.id ? 0.6 : 1,
                        }}
                      >
                        <Copy size={10} />
                        {loadingSourceDocId === doc.id ? "불러오는 중" : "내용 불러오기"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p style={{ fontSize: 12, color: "#bbb" }}>해당 프로세스 문서 없음</p>
          )}
        </div>
      )}

      {step === 2 && docType !== "F" && templates.length > 0 && (
        <div>
          <p style={{ margin: "0 0 8px", fontSize: 10, fontWeight: 600, color: "#bbb", textTransform: "uppercase", letterSpacing: "0.06em" }}>
            섹션 작성 현황
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {templates.map((template) => {
              const filled = !!sectionContents[template.key]?.trim();
              return (
                <div key={template.key} style={{ display: "flex", alignItems: "center", gap: 7 }}>
                  <div
                    style={{
                      width: 14,
                      height: 14,
                      borderRadius: 3,
                      flexShrink: 0,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background: filled ? "#3B5BDB" : "#F0F0F0",
                    }}
                  >
                    {filled && <Check size={9} color="#fff" />}
                  </div>
                  <span style={{ fontSize: 12, color: filled ? "#1a1a1a" : "#bbb", fontWeight: filled ? 500 : 400 }}>{template.title}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {step === 2 && docType === "F" && (
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <FileText size={12} color={file ? "#3B5BDB" : "#bbb"} />
          <span style={{ fontSize: 12, color: file ? "#1a1a1a" : "#bbb" }}>{file ? file.name : "파일 미선택"}</span>
        </div>
      )}

      {step === 3 && (
        <div>
          <p style={{ margin: "0 0 8px", fontSize: 10, fontWeight: 600, color: "#bbb", textTransform: "uppercase", letterSpacing: "0.06em" }}>
            결재선 미리보기
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {APPROVAL_STEPS.map((approval) => {
              const name = approvers[approval.step]?.trim() || null;
              return (
                <div key={approval.step} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div
                    style={{
                      width: 18,
                      height: 18,
                      borderRadius: "50%",
                      flexShrink: 0,
                      background: "#EEF2FF",
                      color: "#3B5BDB",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 10,
                      fontWeight: 700,
                    }}
                  >
                    {approval.step}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ margin: 0, fontSize: 11, color: "#bbb" }}>{approval.step_name}</p>
                    <p style={{ margin: 0, fontSize: 12, fontWeight: 600, color: name ? "#1a1a1a" : "#E5E5E5", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {name ?? "—"}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
