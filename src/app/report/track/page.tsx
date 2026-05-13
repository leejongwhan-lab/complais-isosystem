"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

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
  received:  { label: "접수완료", color: "#888",    bg: "#F5F5F5" },
  reviewing: { label: "검토중",   color: "#3B5BDB", bg: "#EEF2FF" },
  completed: { label: "처리완료", color: "#2F9E44", bg: "#EBFBEE" },
};

const TYPE_LABELS: Record<string, string> = {
  safety:      "🦺 안전보건",
  antibribery: "🚫 반부패/준법",
  quality:     "⚠️ 품질",
  workplace:   "💬 직장문화",
  other:       "기타",
};

export default function ReportTrackPage() {
  const [code, setCode] = useState("");
  const [report, setReport] = useState<Report | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [notFound, setNotFound] = useState(false);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [lastFetch, setLastFetch] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 5-second polling once report is loaded
  useEffect(() => {
    if (!report) return;
    const interval = setInterval(() => setLastFetch(Date.now()), 5000);
    return () => clearInterval(interval);
  }, [report]);

  useEffect(() => {
    if (!report) return;
    loadMessages(report.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lastFetch]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function handleSearch() {
    const cleaned = code.trim().toUpperCase();
    if (!cleaned) return;
    setLoading(true);
    setNotFound(false);
    setReport(null);
    setMessages([]);
    try {
      const { data } = await supabase
        .from("anonymous_reports")
        .select("id, tracking_code, report_type, sub_type, content, status, created_at, handler_note")
        .eq("tracking_code", cleaned)
        .single();
      if (data) {
        setReport(data as Report);
        await loadMessages(data.id);
      } else {
        setNotFound(true);
      }
    } catch {
      setNotFound(true);
    }
    setLoading(false);
  }

  async function loadMessages(reportId: string) {
    try {
      const { data } = await supabase
        .from("report_messages")
        .select("id, sender, message, created_at")
        .eq("report_id", reportId)
        .order("created_at", { ascending: true });
      if (data) setMessages(data as Message[]);
    } catch {}
  }

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
      await loadMessages(report.id);
    } catch {}
    setSending(false);
  }

  const statusInfo = report ? (STATUS[report.status] ?? STATUS.received) : null;

  return (
    <div style={{ minHeight: "100vh", background: "#F9FAFB", padding: "24px 16px" }}>
      <div style={{ maxWidth: 640, margin: "0 auto" }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <span style={{ fontSize: 20, fontWeight: 800, color: "#3B5BDB" }}>complAIs</span>
          <span style={{ fontSize: 20, fontWeight: 800, color: "#1a1a1a" }}> ISOSystem</span>
        </div>

        {/* Search Card */}
        <div style={{ background: "#fff", borderRadius: 12, padding: 28, boxShadow: "0 2px 12px rgba(0,0,0,0.05)", marginBottom: 16 }}>
          <h1 style={{ fontSize: 18, fontWeight: 700, color: "#1a1a1a", marginBottom: 6, textAlign: "center" }}>
            처리현황 확인
          </h1>
          <p style={{ fontSize: 13, color: "#555", textAlign: "center", marginBottom: 20 }}>
            제보 시 발급된 추적 코드를 입력하세요
          </p>
          <div style={{ display: "flex", gap: 8 }}>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              placeholder="RPT-XXXX-XXXX"
              style={{
                flex: 1, padding: "10px 14px", fontSize: 15, border: "1px solid #E5E5E5",
                borderRadius: 8, outline: "none", color: "#1a1a1a",
                fontFamily: "monospace", letterSpacing: 2, textTransform: "uppercase",
              }}
            />
            <button
              onClick={handleSearch}
              disabled={loading}
              style={{
                padding: "0 20px", borderRadius: 8, fontSize: 14, fontWeight: 600,
                color: "#fff", background: loading ? "#aaa" : "#3B5BDB",
                border: "none", cursor: loading ? "not-allowed" : "pointer",
                whiteSpace: "nowrap",
              }}
            >
              {loading ? "조회 중..." : "확인"}
            </button>
          </div>

          {notFound && (
            <p style={{ margin: "12px 0 0", textAlign: "center", fontSize: 13, color: "#e03131" }}>
              해당 추적 코드로 제보를 찾을 수 없습니다. 코드를 다시 확인해주세요.
            </p>
          )}
        </div>

        {/* Report Detail */}
        {report && statusInfo && (
          <>
            {/* Report Card */}
            <div style={{ background: "#fff", borderRadius: 12, padding: 24, boxShadow: "0 2px 12px rgba(0,0,0,0.05)", marginBottom: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16, flexWrap: "wrap", gap: 8 }}>
                <div>
                  <div style={{ fontFamily: "monospace", fontSize: 14, fontWeight: 700, color: "#3B5BDB", marginBottom: 4 }}>
                    {report.tracking_code}
                  </div>
                  <div style={{ fontSize: 12, color: "#999" }}>
                    {new Date(report.created_at).toLocaleDateString("ko-KR", { year: "numeric", month: "long", day: "numeric" })}
                  </div>
                </div>
                <span style={{
                  padding: "5px 14px", borderRadius: 20, fontSize: 13, fontWeight: 600,
                  color: statusInfo.color, background: statusInfo.bg,
                }}>
                  {statusInfo.label}
                </span>
              </div>

              {/* Status steps */}
              <div style={{ display: "flex", alignItems: "center", gap: 0, marginBottom: 20, background: "#F9FAFB", borderRadius: 8, padding: "12px 16px" }}>
                {(["received", "reviewing", "completed"] as const).map((s, i) => {
                  const st = STATUS[s];
                  const isCurrentOrPast = ["received", "reviewing", "completed"].indexOf(report.status) >= i;
                  return (
                    <div key={s} style={{ display: "flex", alignItems: "center", flex: i < 2 ? 1 : "none" }}>
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                        <div style={{
                          width: 24, height: 24, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
                          fontSize: 12, fontWeight: 700,
                          background: isCurrentOrPast ? st.color : "#E5E5E5",
                          color: isCurrentOrPast ? "#fff" : "#bbb",
                        }}>
                          {i + 1}
                        </div>
                        <span style={{ fontSize: 11, color: isCurrentOrPast ? st.color : "#bbb", fontWeight: isCurrentOrPast ? 600 : 400, whiteSpace: "nowrap" }}>
                          {st.label}
                        </span>
                      </div>
                      {i < 2 && (
                        <div style={{ flex: 1, height: 2, background: ["received", "reviewing", "completed"].indexOf(report.status) > i ? "#3B5BDB" : "#E5E5E5", margin: "0 8px", marginBottom: 16 }} />
                      )}
                    </div>
                  );
                })}
              </div>

              <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
                <span style={{ padding: "3px 10px", borderRadius: 6, fontSize: 12, color: "#555", background: "#F5F5F5", border: "1px solid #E5E5E5" }}>
                  {TYPE_LABELS[report.report_type] ?? report.report_type}
                </span>
                {report.sub_type && (
                  <span style={{ padding: "3px 10px", borderRadius: 6, fontSize: 12, color: "#555", background: "#F5F5F5", border: "1px solid #E5E5E5" }}>
                    {report.sub_type}
                  </span>
                )}
              </div>

              <div style={{ padding: 16, background: "#F9FAFB", borderRadius: 8, fontSize: 14, color: "#1a1a1a", lineHeight: 1.7, whiteSpace: "pre-wrap" }}>
                {report.content}
              </div>

              {report.handler_note && (
                <div style={{ marginTop: 16, padding: 14, background: "#EBFBEE", borderRadius: 8, border: "1px solid #B2F2BB" }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: "#2F9E44", marginBottom: 6 }}>담당자 메모</div>
                  <div style={{ fontSize: 14, color: "#1a1a1a", lineHeight: 1.6 }}>{report.handler_note}</div>
                </div>
              )}
            </div>

            {/* Chat */}
            <div style={{ background: "#fff", borderRadius: 12, boxShadow: "0 2px 12px rgba(0,0,0,0.05)", overflow: "hidden", marginBottom: 16 }}>
              <div style={{ padding: "14px 20px", borderBottom: "1px solid #E5E5E5", fontSize: 14, fontWeight: 600, color: "#1a1a1a" }}>
                익명 메시지
              </div>
              <div style={{ padding: 16, minHeight: 160, maxHeight: 360, overflowY: "auto", display: "flex", flexDirection: "column", gap: 12 }}>
                {messages.length === 0 ? (
                  <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, color: "#bbb", padding: "30px 0" }}>
                    아직 메시지가 없습니다.
                  </div>
                ) : messages.map((msg) => (
                  <div key={msg.id} style={{ display: "flex", flexDirection: "column", alignItems: msg.sender === "reporter" ? "flex-end" : "flex-start" }}>
                    <div style={{
                      maxWidth: "80%", padding: "10px 14px", fontSize: 14, lineHeight: 1.5,
                      borderRadius: msg.sender === "reporter" ? "12px 12px 2px 12px" : "12px 12px 12px 2px",
                      background: msg.sender === "reporter" ? "#3B5BDB" : "#F5F5F5",
                      color: msg.sender === "reporter" ? "#fff" : "#1a1a1a",
                    }}>
                      {msg.message}
                    </div>
                    <div style={{ fontSize: 11, color: "#bbb", marginTop: 4 }}>
                      {msg.sender === "reporter" ? "제보자" : "담당자"} · {new Date(msg.created_at).toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" })}
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
              {report.status !== "completed" && (
                <div style={{ padding: 16, borderTop: "1px solid #E5E5E5", display: "flex", gap: 8 }}>
                  <textarea
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
                    placeholder="담당자에게 추가 메시지를 보낼 수 있습니다..."
                    rows={2}
                    style={{
                      flex: 1, padding: "10px 12px", fontSize: 13, border: "1px solid #E5E5E5",
                      borderRadius: 8, outline: "none", resize: "none", fontFamily: "inherit",
                      lineHeight: 1.5, color: "#1a1a1a",
                    }}
                  />
                  <button
                    onClick={sendMessage}
                    disabled={sending || !newMessage.trim()}
                    style={{
                      padding: "0 16px", borderRadius: 8, fontSize: 13, fontWeight: 600,
                      color: "#fff", background: sending || !newMessage.trim() ? "#ccc" : "#3B5BDB",
                      border: "none", cursor: sending || !newMessage.trim() ? "not-allowed" : "pointer",
                      alignSelf: "flex-end", height: 40,
                    }}
                  >
                    전송
                  </button>
                </div>
              )}
            </div>
          </>
        )}

        {/* Footer */}
        <div style={{ textAlign: "center" }}>
          <Link href="/report" style={{ fontSize: 13, color: "#999", textDecoration: "none" }}>
            ← 홈으로
          </Link>
        </div>
      </div>
    </div>
  );
}
