"use client";
import { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

type Report = {
  id: string;
  tracking_code: string;
  report_type: string;
  sub_type: string | null;
  content: string;
  status: string;
  created_at: string;
  handler_note: string | null;
};

type Message = {
  id: string;
  sender: string;
  message: string;
  created_at: string;
};

const STATUS: Record<string, { label: string; color: string; bg: string }> = {
  received: { label: "접수완료", color: "#3B5BDB", bg: "#EEF2FF" },
  reviewing: { label: "검토중", color: "#E67700", bg: "#FFF9DB" },
  completed: { label: "처리완료", color: "#2F9E44", bg: "#EBFBEE" },
};

const TYPE_LABELS: Record<string, string> = {
  safety: "🦺 안전보건",
  antibribery: "🚫 반부패/준법",
  quality: "⚠️ 품질",
  workplace: "💬 직장문화",
  other: "기타",
};

export default function ReportStatusPage() {
  const params = useParams<{ code: string }>();
  const [report, setReport] = useState<Report | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [loading, setLoading] = useState(true);
  const [refreshTick, setRefreshTick] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const { data: rData } = await supabase
          .from("anonymous_reports")
          .select("*")
          .eq("tracking_code", params.code)
          .single();

        if (!rData) {
          setNotFound(true);
          setLoading(false);
          return;
        }
        setReport(rData);

        const { data: mData } = await supabase
          .from("report_messages")
          .select("*")
          .eq("report_id", rData.id)
          .order("created_at");
        setMessages(mData ?? []);
      } catch {
        setNotFound(true);
      }
      setLoading(false);
    }
    load();
  }, [params.code, refreshTick]);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Poll every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => setRefreshTick((tick) => tick + 1), 5000);
    return () => clearInterval(interval);
  }, []);

  async function sendMessage() {
    if (!report || !newMessage.trim()) return;
    setSending(true);
    try {
      await supabase.from("report_messages").insert({
        report_id: report.id,
        sender: "reporter",
        message: newMessage.trim(),
      });
      setNewMessage("");
      setRefreshTick((tick) => tick + 1);
    } catch {
      // silently fail
    }
    setSending(false);
  }

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#F9FAFB",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              width: 36,
              height: 36,
              border: "3px solid #E5E5E5",
              borderTopColor: "#3B5BDB",
              borderRadius: "50%",
              animation: "spin 0.8s linear infinite",
              margin: "0 auto 12px",
            }}
          />
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          <p style={{ fontSize: 14, color: "#999" }}>조회 중...</p>
        </div>
      </div>
    );
  }

  if (notFound || !report) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#F9FAFB",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 24,
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🔍</div>
          <h1 style={{ fontSize: 20, fontWeight: 700, color: "#1a1a1a", marginBottom: 8 }}>
            제보를 찾을 수 없습니다
          </h1>
          <p style={{ fontSize: 14, color: "#555", marginBottom: 24 }}>
            추적 코드를 다시 확인해주세요.
          </p>
          <Link
            href="/report/track"
            style={{
              display: "inline-block",
              padding: "10px 24px",
              borderRadius: 8,
              fontSize: 14,
              fontWeight: 600,
              color: "#fff",
              background: "#3B5BDB",
              textDecoration: "none",
            }}
          >
            다시 시도
          </Link>
        </div>
      </div>
    );
  }

  const statusInfo = STATUS[report.status] ?? STATUS.received;

  return (
    <div style={{ minHeight: "100vh", background: "#F9FAFB", padding: "24px 16px" }}>
      <div style={{ maxWidth: 640, margin: "0 auto" }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 20 }}>
          <span style={{ fontSize: 18, fontWeight: 800, color: "#3B5BDB" }}>complAIs</span>
          <span style={{ fontSize: 18, fontWeight: 800, color: "#1a1a1a" }}> ISOSystem</span>
        </div>

        {/* Report Card */}
        <div
          style={{
            background: "#fff",
            borderRadius: 12,
            padding: 24,
            boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
            marginBottom: 16,
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16, flexWrap: "wrap", gap: 8 }}>
            <div>
              <div style={{ fontFamily: "monospace", fontSize: 14, fontWeight: 700, color: "#3B5BDB", marginBottom: 4 }}>
                {report.tracking_code}
              </div>
              <div style={{ fontSize: 12, color: "#999" }}>
                {new Date(report.created_at).toLocaleDateString("ko-KR", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
            </div>
            <span
              style={{
                padding: "4px 12px",
                borderRadius: 20,
                fontSize: 13,
                fontWeight: 600,
                color: statusInfo.color,
                background: statusInfo.bg,
              }}
            >
              {statusInfo.label}
            </span>
          </div>

          <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
            <span
              style={{
                padding: "3px 10px",
                borderRadius: 6,
                fontSize: 12,
                color: "#555",
                background: "#F5F5F5",
                border: "1px solid #E5E5E5",
              }}
            >
              {TYPE_LABELS[report.report_type] ?? report.report_type}
            </span>
            {report.sub_type && (
              <span
                style={{
                  padding: "3px 10px",
                  borderRadius: 6,
                  fontSize: 12,
                  color: "#555",
                  background: "#F5F5F5",
                  border: "1px solid #E5E5E5",
                }}
              >
                {report.sub_type}
              </span>
            )}
          </div>

          <div
            style={{
              padding: 16,
              background: "#F9FAFB",
              borderRadius: 8,
              fontSize: 14,
              color: "#1a1a1a",
              lineHeight: 1.7,
              whiteSpace: "pre-wrap",
            }}
          >
            {report.content}
          </div>

          {report.handler_note && (
            <div
              style={{
                marginTop: 16,
                padding: 14,
                background: "#EBFBEE",
                borderRadius: 8,
                border: "1px solid #B2F2BB",
              }}
            >
              <div style={{ fontSize: 12, fontWeight: 600, color: "#2F9E44", marginBottom: 6 }}>
                담당자 답변
              </div>
              <div style={{ fontSize: 14, color: "#1a1a1a", lineHeight: 1.6 }}>
                {report.handler_note}
              </div>
            </div>
          )}
        </div>

        {/* Chat Section */}
        <div
          style={{
            background: "#fff",
            borderRadius: 12,
            boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              padding: "16px 20px",
              borderBottom: "1px solid #E5E5E5",
              fontSize: 14,
              fontWeight: 600,
              color: "#1a1a1a",
            }}
          >
            익명 메시지
          </div>

          {/* Messages */}
          <div
            style={{
              padding: 16,
              minHeight: 200,
              maxHeight: 400,
              overflowY: "auto",
              display: "flex",
              flexDirection: "column",
              gap: 12,
            }}
          >
            {messages.length === 0 ? (
              <div
                style={{
                  flex: 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 13,
                  color: "#bbb",
                  padding: 40,
                }}
              >
                아직 메시지가 없습니다.
              </div>
            ) : (
              messages.map((msg) => (
                <div
                  key={msg.id}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: msg.sender === "reporter" ? "flex-end" : "flex-start",
                  }}
                >
                  <div
                    style={{
                      maxWidth: "80%",
                      padding: "10px 14px",
                      borderRadius: msg.sender === "reporter" ? "12px 12px 2px 12px" : "12px 12px 12px 2px",
                      background: msg.sender === "reporter" ? "#3B5BDB" : "#F5F5F5",
                      color: msg.sender === "reporter" ? "#fff" : "#1a1a1a",
                      fontSize: 14,
                      lineHeight: 1.5,
                    }}
                  >
                    {msg.message}
                  </div>
                  <div style={{ fontSize: 11, color: "#bbb", marginTop: 4 }}>
                    {msg.sender === "reporter" ? "제보자" : "담당자"} ·{" "}
                    {new Date(msg.created_at).toLocaleTimeString("ko-KR", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Message Input */}
          {report.status !== "completed" && (
            <div
              style={{
                padding: 16,
                borderTop: "1px solid #E5E5E5",
                display: "flex",
                gap: 8,
              }}
            >
              <textarea
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage();
                  }
                }}
                placeholder="담당자에게 추가 메시지를 보낼 수 있습니다..."
                rows={2}
                style={{
                  flex: 1,
                  padding: "10px 12px",
                  fontSize: 13,
                  border: "1px solid #E5E5E5",
                  borderRadius: 8,
                  outline: "none",
                  resize: "none",
                  fontFamily: "inherit",
                  lineHeight: 1.5,
                  color: "#1a1a1a",
                }}
              />
              <button
                onClick={sendMessage}
                disabled={sending || !newMessage.trim()}
                style={{
                  padding: "0 16px",
                  borderRadius: 8,
                  fontSize: 13,
                  fontWeight: 600,
                  color: "#fff",
                  background: sending || !newMessage.trim() ? "#ccc" : "#3B5BDB",
                  border: "none",
                  cursor: sending || !newMessage.trim() ? "not-allowed" : "pointer",
                  whiteSpace: "nowrap",
                  alignSelf: "flex-end",
                  height: 40,
                }}
              >
                전송
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{ textAlign: "center", marginTop: 20, display: "flex", gap: 16, justifyContent: "center" }}>
          <Link
            href="/report/track"
            style={{ fontSize: 13, color: "#999", textDecoration: "none" }}
          >
            ← 다른 제보 조회
          </Link>
          <Link
            href="/report"
            style={{
              fontSize: 13, fontWeight: 600, color: "#fff", textDecoration: "none",
              background: "#3B5BDB", padding: "8px 20px", borderRadius: 8,
            }}
          >
            홈으로
          </Link>
        </div>
      </div>
    </div>
  );
}
