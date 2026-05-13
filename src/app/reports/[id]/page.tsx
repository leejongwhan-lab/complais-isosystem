"use client";

import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import AppLayout from "@/components/layout/AppLayout";
import { supabase } from "@/lib/supabase";

type Report = {
  id: string;
  company_id: string;
  tracking_code: string;
  report_type: string;
  sub_type: string | null;
  content: string;
  status: "received" | "reviewing" | "completed";
  handler_id: string | null;
  handler_note: string | null;
  created_at: string;
  updated_at: string;
};

type Message = {
  id: string;
  report_id: string;
  sender: "admin" | "reporter";
  message: string;
  created_at: string;
};

const STATUS_CONFIG: Record<string, { bg: string; color: string; label: string }> = {
  received:  { bg: "#F5F5F5", color: "#888",    label: "접수완료" },
  reviewing: { bg: "#EEF2FF", color: "#3B5BDB", label: "검토중"   },
  completed: { bg: "#EBFBEE", color: "#2F9E44", label: "처리완료" },
};

const TYPE_LABELS: Record<string, string> = {
  safety:      "🦺 안전보건",
  antibribery: "🚫 반부패",
  quality:     "⚠️ 품질",
  workplace:   "💬 직장문화",
  other:       "기타",
};

export default function ReportDetailPage() {
  const { id } = useParams<{ id: string }>();

  const [report, setReport]         = useState<Report | null>(null);
  const [messages, setMessages]     = useState<Message[]>([]);
  const [loading, setLoading]       = useState(true);
  const [newMessage, setNewMessage] = useState("");
  const [sendingMsg, setSendingMsg] = useState(false);

  // Management panel state
  const [status, setStatus]         = useState<"received" | "reviewing" | "completed">("received");
  const [handlerId, setHandlerId]   = useState("");
  const [handlerNote, setHandlerNote] = useState("");
  const [saving, setSaving]         = useState(false);
  const [saveMsg, setSaveMsg]       = useState("");

  const chatEndRef = useRef<HTMLDivElement>(null);

  // Fetch report
  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        const { data } = await supabase
          .from("anonymous_reports")
          .select("*")
          .eq("id", id)
          .single();
        if (data) {
          const r = data as Report;
          setReport(r);
          setStatus(r.status);
          setHandlerId(r.handler_id ?? "");
          setHandlerNote(r.handler_note ?? "");
        }
      } catch {
        // table may not exist yet
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  // Fetch messages + polling
  const fetchMessages = async () => {
    if (!id) return;
    try {
      const { data } = await supabase
        .from("report_messages")
        .select("*")
        .eq("report_id", id)
        .order("created_at", { ascending: true });
      return (data ?? []) as Message[];
    } catch {
      // table may not exist yet
      return [];
    }
  };

  useEffect(() => {
    let active = true;

    const syncMessages = async () => {
      const nextMessages = await fetchMessages();
      if (active && nextMessages) {
        setMessages(nextMessages);
      }
    };

    void syncMessages();
    const timer = setInterval(() => {
      void syncMessages();
    }, 5000);
    return () => {
      active = false;
      clearInterval(timer);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // Auto-scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Send message
  const handleSendMessage = async () => {
    if (!newMessage.trim() || !id) return;
    setSendingMsg(true);
    try {
      await supabase.from("report_messages").insert({
        report_id: id,
        sender: "admin",
        message: newMessage.trim(),
      });
      setNewMessage("");
      const nextMessages = await fetchMessages();
      if (nextMessages) {
        setMessages(nextMessages);
      }
    } catch {
      // ignore
    } finally {
      setSendingMsg(false);
    }
  };

  // Save management panel
  const handleSave = async () => {
    if (!id) return;
    setSaving(true);
    setSaveMsg("");
    try {
      const { error } = await supabase
        .from("anonymous_reports")
        .update({
          status,
          handler_id: handlerId || null,
          handler_note: handlerNote || null,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id);
      if (error) {
        setSaveMsg("저장 실패: " + error.message);
      } else {
        setSaveMsg("저장되었습니다.");
        setTimeout(() => setSaveMsg(""), 3000);
      }
    } catch {
      setSaveMsg("저장 중 오류가 발생했습니다.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <AppLayout company={null} docCount={null} capaOpenCount={null}>
        <div style={{ padding: 24, color: "#888", fontSize: 14 }}>불러오는 중...</div>
      </AppLayout>
    );
  }

  if (!report) {
    return (
      <AppLayout company={null} docCount={null} capaOpenCount={null}>
        <div style={{ padding: 24 }}>
          <p style={{ color: "#E03131", fontSize: 14 }}>제보를 찾을 수 없습니다.</p>
          <Link href="/reports" style={{ color: "#3B5BDB", fontSize: 13 }}>← 목록으로</Link>
        </div>
      </AppLayout>
    );
  }

  const statusCfg   = STATUS_CONFIG[report.status] ?? STATUS_CONFIG.received;
  const currentCfg  = STATUS_CONFIG[status] ?? STATUS_CONFIG.received;
  const typeLabel   = TYPE_LABELS[report.report_type] ?? report.report_type;
  const dateStr     = report.created_at
    ? new Date(report.created_at).toLocaleDateString("ko-KR", {
        year: "numeric", month: "long", day: "numeric",
      })
    : "-";

  return (
    <AppLayout company={null} docCount={null} capaOpenCount={null}>
      <div style={{ padding: 24 }}>

        {/* Page Header */}
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 24, flexWrap: "wrap" }}>
          <Link
            href="/reports"
            style={{ fontSize: 13, color: "#888", textDecoration: "none", flexShrink: 0 }}
          >
            ← 목록으로
          </Link>
          <div style={{ display: "flex", alignItems: "center", gap: 10, flex: 1, flexWrap: "wrap" }}>
            <h1 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: "#1a1a1a", fontFamily: "monospace" }}>
              {report.tracking_code}
            </h1>
            <span style={{
              fontSize: 11,
              fontWeight: 600,
              padding: "3px 10px",
              borderRadius: 20,
              background: statusCfg.bg,
              color: statusCfg.color,
            }}>
              {statusCfg.label}
            </span>
          </div>
          <Link
            href={`/capa/new?source=report&code=${encodeURIComponent(report.tracking_code)}`}
            style={{
              fontSize: 13,
              fontWeight: 600,
              padding: "7px 16px",
              borderRadius: 7,
              background: "#3B5BDB",
              color: "#fff",
              textDecoration: "none",
              flexShrink: 0,
            }}
          >
            CAPA 발행
          </Link>
        </div>

        {/* Two-column grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 20, alignItems: "start" }}>

          {/* ── Left column ── */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

            {/* Meta card */}
            <div style={{
              background: "#fff",
              border: "1px solid #E5E5E5",
              borderRadius: 10,
              padding: "18px 20px",
            }}>
              <p style={{ margin: "0 0 12px", fontSize: 11, fontWeight: 600, color: "#bbb", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                제보 정보
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
                <div>
                  <p style={{ margin: "0 0 3px", fontSize: 11, color: "#999" }}>추적코드</p>
                  <p style={{ margin: 0, fontSize: 14, fontWeight: 600, color: "#3B5BDB", fontFamily: "monospace" }}>
                    {report.tracking_code}
                  </p>
                </div>
                <div>
                  <p style={{ margin: "0 0 3px", fontSize: 11, color: "#999" }}>유형</p>
                  <span style={{
                    fontSize: 12,
                    fontWeight: 600,
                    padding: "3px 10px",
                    borderRadius: 20,
                    background: "#F0F4FF",
                    color: "#3B5BDB",
                  }}>
                    {typeLabel}
                  </span>
                </div>
                {report.sub_type && (
                  <div>
                    <p style={{ margin: "0 0 3px", fontSize: 11, color: "#999" }}>세부유형</p>
                    <span style={{
                      fontSize: 12,
                      fontWeight: 600,
                      padding: "3px 10px",
                      borderRadius: 20,
                      background: "#F5F5F5",
                      color: "#666",
                    }}>
                      {report.sub_type}
                    </span>
                  </div>
                )}
                <div>
                  <p style={{ margin: "0 0 3px", fontSize: 11, color: "#999" }}>접수일</p>
                  <p style={{ margin: 0, fontSize: 13, color: "#444" }}>{dateStr}</p>
                </div>
              </div>
            </div>

            {/* Content card */}
            <div style={{
              background: "#fff",
              border: "1px solid #E5E5E5",
              borderRadius: 10,
              padding: "18px 20px",
            }}>
              <p style={{ margin: "0 0 12px", fontSize: 11, fontWeight: 600, color: "#bbb", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                제보 내용
              </p>
              <p style={{ margin: 0, fontSize: 14, lineHeight: 1.75, color: "#333", whiteSpace: "pre-wrap" }}>
                {report.content}
              </p>
            </div>

            {/* Chat card */}
            <div style={{
              background: "#fff",
              border: "1px solid #E5E5E5",
              borderRadius: 10,
              padding: "18px 20px",
              display: "flex",
              flexDirection: "column",
              gap: 0,
            }}>
              <p style={{ margin: "0 0 14px", fontSize: 11, fontWeight: 600, color: "#bbb", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                메시지
              </p>

              {/* Message list */}
              <div style={{
                minHeight: 200,
                maxHeight: 360,
                overflowY: "auto",
                display: "flex",
                flexDirection: "column",
                gap: 10,
                marginBottom: 14,
                paddingRight: 4,
              }}>
                {messages.length === 0 && (
                  <p style={{ color: "#bbb", fontSize: 13, textAlign: "center", padding: "20px 0" }}>
                    아직 메시지가 없습니다.
                  </p>
                )}
                {messages.map((msg) => {
                  const isReporter = msg.sender === "reporter";
                  return (
                    <div
                      key={msg.id}
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: isReporter ? "flex-end" : "flex-start",
                      }}
                    >
                      <div style={{
                        maxWidth: "75%",
                        padding: "8px 13px",
                        borderRadius: isReporter ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                        background: isReporter ? "#3B5BDB" : "#F5F5F5",
                        color: isReporter ? "#fff" : "#333",
                        fontSize: 13,
                        lineHeight: 1.5,
                      }}>
                        {msg.message}
                      </div>
                      <span style={{ fontSize: 10, color: "#bbb", marginTop: 3 }}>
                        {msg.sender === "admin" ? "관리자" : "제보자"} ·{" "}
                        {msg.created_at
                          ? new Date(msg.created_at).toLocaleString("ko-KR", {
                              month: "numeric", day: "numeric",
                              hour: "2-digit", minute: "2-digit",
                            })
                          : ""}
                      </span>
                    </div>
                  );
                })}
                <div ref={chatEndRef} />
              </div>

              {/* Message input */}
              <div style={{ display: "flex", gap: 8 }}>
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSendMessage(); } }}
                  placeholder="관리자 메시지 입력..."
                  style={{
                    flex: 1,
                    padding: "8px 12px",
                    fontSize: 13,
                    border: "1px solid #E5E5E5",
                    borderRadius: 7,
                    outline: "none",
                    background: "#FAFAFA",
                  }}
                />
                <button
                  onClick={handleSendMessage}
                  disabled={sendingMsg || !newMessage.trim()}
                  style={{
                    padding: "8px 16px",
                    fontSize: 13,
                    fontWeight: 600,
                    borderRadius: 7,
                    border: "none",
                    background: "#3B5BDB",
                    color: "#fff",
                    cursor: sendingMsg || !newMessage.trim() ? "not-allowed" : "pointer",
                    opacity: sendingMsg || !newMessage.trim() ? 0.5 : 1,
                    flexShrink: 0,
                  }}
                >
                  전송
                </button>
              </div>
            </div>
          </div>

          {/* ── Right column — management panel ── */}
          <div style={{
            background: "#fff",
            border: "1px solid #E5E5E5",
            borderRadius: 10,
            padding: "20px",
            display: "flex",
            flexDirection: "column",
            gap: 18,
          }}>
            <p style={{ margin: 0, fontSize: 11, fontWeight: 600, color: "#bbb", textTransform: "uppercase", letterSpacing: "0.06em" }}>
              처리 관리
            </p>

            {/* Status select */}
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: "#555", display: "block", marginBottom: 6 }}>
                처리 상태
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as "received" | "reviewing" | "completed")}
                style={{
                  width: "100%",
                  padding: "8px 10px",
                  fontSize: 13,
                  border: "1px solid #E5E5E5",
                  borderRadius: 7,
                  background: currentCfg.bg,
                  color: currentCfg.color,
                  fontWeight: 600,
                  outline: "none",
                  cursor: "pointer",
                }}
              >
                <option value="received"  style={{ background: "#F5F5F5", color: "#888"    }}>접수완료</option>
                <option value="reviewing" style={{ background: "#EEF2FF", color: "#3B5BDB" }}>검토중</option>
                <option value="completed" style={{ background: "#EBFBEE", color: "#2F9E44" }}>처리완료</option>
              </select>
            </div>

            {/* Handler ID */}
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: "#555", display: "block", marginBottom: 6 }}>
                담당자
              </label>
              <input
                type="text"
                value={handlerId}
                onChange={(e) => setHandlerId(e.target.value)}
                placeholder="담당자 이름 또는 ID"
                style={{
                  width: "100%",
                  padding: "8px 10px",
                  fontSize: 13,
                  border: "1px solid #E5E5E5",
                  borderRadius: 7,
                  outline: "none",
                  boxSizing: "border-box",
                }}
              />
            </div>

            {/* Handler note */}
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: "#555", display: "block", marginBottom: 6 }}>
                처리 메모
              </label>
              <textarea
                value={handlerNote}
                onChange={(e) => setHandlerNote(e.target.value)}
                placeholder="내부 처리 메모를 입력하세요..."
                rows={5}
                style={{
                  width: "100%",
                  padding: "8px 10px",
                  fontSize: 13,
                  border: "1px solid #E5E5E5",
                  borderRadius: 7,
                  outline: "none",
                  resize: "vertical",
                  lineHeight: 1.6,
                  boxSizing: "border-box",
                  fontFamily: "inherit",
                }}
              />
            </div>

            {/* Save button */}
            <button
              onClick={handleSave}
              disabled={saving}
              style={{
                width: "100%",
                padding: "10px",
                fontSize: 13,
                fontWeight: 600,
                borderRadius: 7,
                border: "none",
                background: "#3B5BDB",
                color: "#fff",
                cursor: saving ? "not-allowed" : "pointer",
                opacity: saving ? 0.6 : 1,
              }}
            >
              {saving ? "저장 중..." : "저장"}
            </button>

            {saveMsg && (
              <p style={{
                margin: 0,
                fontSize: 12,
                textAlign: "center",
                color: saveMsg.startsWith("저장 실패") || saveMsg.startsWith("저장 중 오류") ? "#E03131" : "#2F9E44",
              }}>
                {saveMsg}
              </p>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
