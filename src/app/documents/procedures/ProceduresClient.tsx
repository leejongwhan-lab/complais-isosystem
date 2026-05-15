"use client";

import { useState, useEffect, useRef } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { Upload, FileText, Trash2, ExternalLink, Plus } from "lucide-react";

type DocFile = {
  id: string;
  file_name: string;
  file_size: number | null;
  file_ext: string | null;
  file_url: string | null;
  description: string | null;
  version: string | null;
  doc_type: string;
  uploaded_by: string | null;
  created_at: string;
};

type DocRecord = {
  id: string;
  doc_number: string;
  title: string;
  doc_type: string;
  version: string;
  status: string;
  owner_name: string | null;
  updated_at: string;
};

type MainTab = "docs" | "files" | "upload";
type TypeFilter = "all" | "P" | "R";
type UploadType = "procedure" | "guideline";

const STATUS_LABEL: Record<string, { label: string; color: string; bg: string }> = {
  active:   { label: "유효",   color: "#2F9E44", bg: "#EBFBEE" },
  draft:    { label: "초안",   color: "#888",    bg: "#F5F5F5" },
  review:   { label: "검토중", color: "#3B5BDB", bg: "#EEF2FF" },
  obsolete: { label: "폐기",   color: "#E03131", bg: "#FFF0F0" },
};

const DOC_TYPE_LABEL: Record<string, { label: string; color: string; bg: string }> = {
  P: { label: "절차서", color: "#3B5BDB", bg: "#EEF2FF" },
  R: { label: "지침서", color: "#7048E8", bg: "#F3F0FF" },
};

const EXT_COLORS: Record<string, { color: string; icon: string }> = {
  pdf:  { color: "#E03131", icon: "📄" },
  hwp:  { color: "#7048E8", icon: "📝" },
  hwpx: { color: "#7048E8", icon: "📝" },
  docx: { color: "#3B5BDB", icon: "📘" },
  doc:  { color: "#3B5BDB", icon: "📘" },
  xlsx: { color: "#2F9E44", icon: "📊" },
  xls:  { color: "#2F9E44", icon: "📊" },
};

function formatBytes(bytes: number | null): string {
  if (!bytes) return "—";
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function ProceduresClient() {
  const [mainTab, setMainTab] = useState<MainTab>("docs");
  const [typeFilter, setTypeFilter] = useState<TypeFilter>("all");
  const [docRecords, setDocRecords] = useState<DocRecord[]>([]);
  const [files, setFiles] = useState<DocFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [uploadType, setUploadType] = useState<UploadType>("procedure");
  const [uploadMsg, setUploadMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    async function load() {
      const [docsRes, filesRes] = await Promise.all([
        supabase
          .from("documents")
          .select("id, doc_number, title, doc_type, version, status, owner_name, updated_at")
          .in("doc_type", ["P", "R"])
          .order("updated_at", { ascending: false }),
        supabase
          .from("document_files")
          .select("id, file_name, file_size, file_ext, file_url, description, version, doc_type, uploaded_by, created_at")
          .in("doc_type", ["procedure", "guideline"])
          .order("created_at", { ascending: false }),
      ]);
      setDocRecords((docsRes.data ?? []) as DocRecord[]);
      setFiles((filesRes.data ?? []) as DocFile[]);
      setLoading(false);
    }
    load();
  }, []);

  const filteredDocs = typeFilter === "all"
    ? docRecords
    : docRecords.filter(d => d.doc_type === typeFilter);

  async function handleUpload(fileList: FileList | null) {
    if (!fileList || fileList.length === 0) return;
    setUploading(true);
    setUploadMsg(null);

    const uploaded: DocFile[] = [];
    for (const file of Array.from(fileList)) {
      const ext = (file.name.split(".").pop() ?? "").toLowerCase();
      const path = `procedures/${Date.now()}_${file.name}`;

      let fileUrl: string | null = null;
      const { error: storageErr } = await supabase.storage
        .from("documents")
        .upload(path, file, { upsert: false });

      if (!storageErr) {
        const { data: urlData } = supabase.storage.from("documents").getPublicUrl(path);
        fileUrl = urlData?.publicUrl ?? null;
      }

      const { data: row } = await supabase
        .from("document_files")
        .insert({
          doc_type: uploadType,
          file_name: file.name,
          file_size: file.size,
          file_ext: ext,
          file_url: fileUrl,
          version: "R00",
        })
        .select()
        .single();

      if (row) uploaded.push(row as DocFile);
    }

    setFiles(prev => [...uploaded, ...prev]);
    setUploadMsg({ ok: true, text: `${uploaded.length}개 파일이 업로드되었습니다.` });
    setUploading(false);
    setMainTab("files");
  }

  async function handleDelete(file: DocFile) {
    if (!confirm(`"${file.file_name}" 파일을 삭제하시겠습니까?`)) return;
    await supabase.from("document_files").delete().eq("id", file.id);
    setFiles(prev => prev.filter(f => f.id !== file.id));
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "calc(100vh - 52px)" }}>
      <div style={{
        display: "flex", gap: 0, borderBottom: "1px solid #E5E5E5",
        background: "#fff", padding: "0 24px", flexShrink: 0,
        alignItems: "center", justifyContent: "space-between",
      }}>
        <div style={{ display: "flex" }}>
          {([
            { key: "docs" as MainTab,   label: "등록된 문서" },
            { key: "files" as MainTab,  label: "업로드 파일" },
            { key: "upload" as MainTab, label: "파일 업로드" },
          ]).map(t => (
            <button key={t.key} onClick={() => setMainTab(t.key)} style={{
              padding: "12px 20px", fontSize: 13, fontWeight: mainTab === t.key ? 600 : 400,
              color: mainTab === t.key ? "#3B5BDB" : "#888",
              background: "transparent", border: "none",
              borderBottom: mainTab === t.key ? "2px solid #3B5BDB" : "2px solid transparent",
              cursor: "pointer", marginBottom: -1,
            }}>
              {t.label}
            </button>
          ))}
        </div>
        <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
          <Link href="/documents/new?type=P" style={{
            display: "flex", alignItems: "center", gap: 5,
            padding: "6px 12px", borderRadius: 6, fontSize: 12, fontWeight: 600,
            border: "1px solid #3B5BDB", color: "#3B5BDB", textDecoration: "none",
          }}>
            <Plus size={12} />
            새로 작성
          </Link>
          <Link href="/documents" style={{
            fontSize: 12, color: "#999", textDecoration: "none", padding: "4px 10px",
            border: "1px solid #E5E5E5", borderRadius: 5,
          }}>
            전체 문서관리
          </Link>
        </div>
      </div>

      {uploadMsg && (
        <div style={{
          margin: "12px 24px 0", padding: "10px 14px", borderRadius: 6, flexShrink: 0,
          background: uploadMsg.ok ? "#F0FBF4" : "#FFF0F0",
          color: uploadMsg.ok ? "#2F9E44" : "#E03131",
          fontSize: 13, fontWeight: 500,
        }}>
          {uploadMsg.text}
        </div>
      )}

      <div style={{ flex: 1, overflowY: "auto", padding: "20px 24px" }}>
        {mainTab === "docs" && (
          <>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
              <div>
                <h2 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: "#1a1a1a" }}>절차서·지침서</h2>
                <p style={{ margin: "3px 0 0", fontSize: 12, color: "#999" }}>
                  doc_type = P (절차서), R (지침서)
                </p>
              </div>
              <div style={{ display: "flex", gap: 6 }}>
                {(["all", "P", "R"] as TypeFilter[]).map(t => (
                  <button key={t} onClick={() => setTypeFilter(t)} style={{
                    padding: "4px 12px", borderRadius: 20, fontSize: 12, fontWeight: 500,
                    border: typeFilter === t ? "1.5px solid #3B5BDB" : "1px solid #E5E5E5",
                    background: typeFilter === t ? "#EEF2FF" : "#fff",
                    color: typeFilter === t ? "#3B5BDB" : "#666",
                    cursor: "pointer",
                  }}>
                    {t === "all" ? "전체" : (DOC_TYPE_LABEL[t]?.label ?? t)}
                    <span style={{ marginLeft: 4, color: "#aaa" }}>
                      ({t === "all" ? docRecords.length : docRecords.filter(d => d.doc_type === t).length})
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {loading ? (
              <div style={{ textAlign: "center", padding: "60px 0", color: "#bbb", fontSize: 13 }}>로딩 중...</div>
            ) : filteredDocs.length === 0 ? (
              <div style={{ textAlign: "center", padding: "60px 0" }}>
                <FileText size={40} color="#ddd" />
                <p style={{ marginTop: 12, color: "#bbb", fontSize: 13 }}>
                  등록된 문서가 없습니다.<br />
                  <Link href="/documents/new?type=P" style={{ color: "#3B5BDB" }}>절차서 새로 작성하기</Link>
                </p>
              </div>
            ) : (
              <div style={{ border: "1px solid #E5E5E5", borderRadius: 8, overflow: "hidden" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead style={{ background: "#FAFAFA", borderBottom: "1px solid #E5E5E5" }}>
                    <tr>
                      {["구분", "문서번호", "문서명", "버전", "상태", "담당자", "최종수정"].map((h, i) => (
                        <th key={i} style={{ padding: "9px 14px", textAlign: "left", fontSize: 11, fontWeight: 600, color: "#999" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredDocs.map((doc, idx) => {
                      const st = STATUS_LABEL[doc.status] ?? STATUS_LABEL.draft;
                      const dt = DOC_TYPE_LABEL[doc.doc_type];
                      return (
                        <tr
                          key={doc.id}
                          style={{ borderTop: idx > 0 ? "1px solid #F0F0F0" : "none", cursor: "pointer" }}
                          onClick={() => window.location.href = `/documents/${doc.id}`}
                          className="hover:bg-[#F9FAFB] transition-colors"
                        >
                          <td style={{ padding: "10px 14px" }}>
                            {dt && (
                              <span style={{ fontSize: 10, fontWeight: 700, color: dt.color, background: dt.bg, padding: "2px 6px", borderRadius: 4 }}>
                                {dt.label}
                              </span>
                            )}
                          </td>
                          <td style={{ padding: "10px 14px", fontSize: 12, fontFamily: "monospace", color: "#555" }}>
                            {doc.doc_number}
                          </td>
                          <td style={{ padding: "10px 14px", fontSize: 13, color: "#1a1a1a" }}>
                            {doc.title}
                          </td>
                          <td style={{ padding: "10px 14px", fontSize: 12, color: "#777" }}>{doc.version}</td>
                          <td style={{ padding: "10px 14px" }}>
                            <span style={{ fontSize: 11, fontWeight: 600, color: st.color, background: st.bg, padding: "2px 7px", borderRadius: 4 }}>
                              {st.label}
                            </span>
                          </td>
                          <td style={{ padding: "10px 14px", fontSize: 12, color: "#777" }}>{doc.owner_name ?? "—"}</td>
                          <td style={{ padding: "10px 14px", fontSize: 12, color: "#aaa", whiteSpace: "nowrap" }}>
                            {new Date(doc.updated_at).toLocaleDateString("ko-KR")}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}

        {mainTab === "files" && (
          <>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
              <h2 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: "#1a1a1a" }}>업로드된 파일</h2>
              <button
                onClick={() => setMainTab("upload")}
                style={{
                  display: "flex", alignItems: "center", gap: 6,
                  padding: "7px 14px", borderRadius: 6, fontSize: 12, fontWeight: 600,
                  background: "#3B5BDB", color: "#fff", border: "none", cursor: "pointer",
                }}
              >
                <Upload size={13} />
                파일 업로드
              </button>
            </div>

            {loading ? (
              <div style={{ textAlign: "center", padding: "60px 0", color: "#bbb", fontSize: 13 }}>로딩 중...</div>
            ) : files.length === 0 ? (
              <div style={{ textAlign: "center", padding: "60px 0" }}>
                <Upload size={40} color="#ddd" />
                <p style={{ marginTop: 12, color: "#bbb", fontSize: 13 }}>업로드된 파일이 없습니다.</p>
              </div>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14 }}>
                {files.map(file => {
                  const ext = file.file_ext ?? file.file_name.split(".").pop()?.toLowerCase() ?? "";
                  const extInfo = EXT_COLORS[ext] ?? { color: "#888", icon: "📄" };
                  return (
                    <div key={file.id} style={{
                      border: "1px solid #E5E5E5", borderRadius: 10,
                      padding: "14px", background: "#fff",
                      display: "flex", flexDirection: "column", gap: 8,
                    }}>
                      <div style={{ fontSize: 32, textAlign: "center" }}>{extInfo.icon}</div>
                      <p style={{
                        margin: 0, fontSize: 12, fontWeight: 600, color: "#1a1a1a",
                        textAlign: "center", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                      }}>
                        {file.file_name}
                      </p>
                      <p style={{ margin: 0, fontSize: 11, color: "#aaa", textAlign: "center" }}>
                        버전: {file.version ?? "R00"} · {formatBytes(file.file_size)}
                      </p>
                      <p style={{ margin: 0, fontSize: 10, color: "#ccc", textAlign: "center" }}>
                        {new Date(file.created_at).toLocaleDateString("ko-KR")}
                      </p>
                      <div style={{ display: "flex", gap: 6 }}>
                        {file.file_url ? (
                          <a
                            href={file.file_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                              flex: 1, padding: "5px 8px", borderRadius: 5, fontSize: 11,
                              border: "1px solid #E5E5E5", color: "#555", background: "#fff",
                              textDecoration: "none", textAlign: "center",
                              display: "flex", alignItems: "center", justifyContent: "center", gap: 3,
                            }}
                          >
                            <ExternalLink size={10} />
                            다운로드
                          </a>
                        ) : (
                          <span style={{ flex: 1, padding: "5px 8px", borderRadius: 5, fontSize: 11, background: "#F5F5F5", color: "#bbb", textAlign: "center" }}>
                            —
                          </span>
                        )}
                        <button
                          onClick={() => handleDelete(file)}
                          style={{
                            padding: "5px 8px", borderRadius: 5, fontSize: 11,
                            border: "1px solid #FFD0D0", background: "#FFF5F5", color: "#E03131",
                            cursor: "pointer",
                          }}
                        >
                          <Trash2 size={11} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}

        {mainTab === "upload" && (
          <div style={{ maxWidth: 560, margin: "0 auto" }}>
            <h2 style={{ margin: "0 0 4px", fontSize: 16, fontWeight: 700, color: "#1a1a1a" }}>절차서·지침서 업로드</h2>
            <p style={{ margin: "0 0 20px", fontSize: 12, color: "#999" }}>파일 종류를 선택한 후 업로드하세요.</p>

            <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
              {([
                { key: "procedure" as UploadType, label: "절차서" },
                { key: "guideline" as UploadType, label: "지침서" },
              ]).map(t => (
                <button key={t.key} onClick={() => setUploadType(t.key)} style={{
                  flex: 1, padding: "10px", borderRadius: 8, fontSize: 13, fontWeight: 600,
                  border: uploadType === t.key ? "2px solid #3B5BDB" : "1px solid #E5E5E5",
                  background: uploadType === t.key ? "#EEF2FF" : "#fff",
                  color: uploadType === t.key ? "#3B5BDB" : "#666",
                  cursor: "pointer",
                }}>
                  {t.label}
                </button>
              ))}
            </div>

            <div
              onDragOver={e => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={e => { e.preventDefault(); setDragOver(false); handleUpload(e.dataTransfer.files); }}
              onClick={() => fileInputRef.current?.click()}
              style={{
                border: `2px dashed ${dragOver ? "#3B5BDB" : "#D0D7DD"}`,
                borderRadius: 10, padding: "48px 32px", textAlign: "center",
                cursor: "pointer", transition: "all 0.15s",
                background: dragOver ? "#EEF2FF" : "#FAFAFA",
              }}
            >
              <Upload size={36} color={dragOver ? "#3B5BDB" : "#ccc"} style={{ margin: "0 auto 12px" }} />
              <p style={{ margin: 0, fontSize: 14, fontWeight: 600, color: dragOver ? "#3B5BDB" : "#555" }}>
                파일을 여기에 끌어다 놓거나 클릭하여 선택
              </p>
              <p style={{ margin: "8px 0 0", fontSize: 12, color: "#999" }}>
                {uploadType === "procedure" ? "절차서" : "지침서"}로 등록됩니다
              </p>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                style={{ display: "none" }}
                onChange={e => handleUpload(e.target.files)}
              />
            </div>

            {uploading && (
              <div style={{ marginTop: 16, display: "flex", alignItems: "center", gap: 8, color: "#3B5BDB", fontSize: 13 }}>
                <div className="w-4 h-4 border-2 border-[#3B5BDB] border-t-transparent rounded-full animate-spin" />
                업로드 중...
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
