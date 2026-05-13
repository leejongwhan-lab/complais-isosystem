"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { ROLE_LABELS, ROLE_COLORS, type UserRole } from "@/lib/permissions";
import { Users, ChevronDown, UserPlus, X } from "lucide-react";

type UserRow = {
  id: string;
  full_name: string;
  role: string;
  department: string | null;
};

const ROLES: UserRole[] = ["admin", "manager", "member", "viewer"];

function InviteModal({ onClose }: { onClose: () => void }) {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<UserRole>("member");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/invite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, role }),
      });
      const data = await res.json() as { error?: string };
      if (!res.ok) throw new Error(data.error ?? "초대 실패");
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "오류가 발생했습니다");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 50,
      background: "rgba(0,0,0,0.35)", display: "flex", alignItems: "center", justifyContent: "center",
    }} onClick={onClose}>
      <div style={{
        background: "#fff", borderRadius: 12, padding: 28, width: 400,
        boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
      }} onClick={e => e.stopPropagation()}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
          <h2 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: "#1a1a1a" }}>사용자 초대</h2>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }}>
            <X size={18} color="#999" />
          </button>
        </div>

        {success ? (
          <div style={{ textAlign: "center", padding: "20px 0" }}>
            <p style={{ fontSize: 14, color: "#2F9E44", fontWeight: 600, margin: "0 0 8px" }}>초대 이메일을 발송했습니다</p>
            <p style={{ fontSize: 13, color: "#999", margin: "0 0 20px" }}>{email}</p>
            <button
              onClick={onClose}
              style={{
                padding: "8px 20px", borderRadius: 6, fontSize: 13, fontWeight: 600,
                background: "#3B5BDB", color: "#fff", border: "none", cursor: "pointer",
              }}
            >
              확인
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: "#555", display: "block", marginBottom: 5 }}>
                이메일
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="user@company.com"
                style={{
                  width: "100%", padding: "8px 12px", fontSize: 13,
                  border: "1px solid #E5E5E5", borderRadius: 6, outline: "none",
                  boxSizing: "border-box",
                }}
              />
            </div>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: "#555", display: "block", marginBottom: 5 }}>
                역할
              </label>
              <div style={{ position: "relative" }}>
                <select
                  value={role}
                  onChange={e => setRole(e.target.value as UserRole)}
                  style={{
                    width: "100%", padding: "8px 32px 8px 12px", fontSize: 13,
                    border: "1px solid #E5E5E5", borderRadius: 6, outline: "none",
                    appearance: "none", background: "#fff", cursor: "pointer",
                  }}
                >
                  {ROLES.map(r => (
                    <option key={r} value={r}>{ROLE_LABELS[r]}</option>
                  ))}
                </select>
                <ChevronDown size={13} color="#bbb" style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
              </div>
            </div>
            {error && (
              <p style={{ margin: 0, fontSize: 12, color: "#E03131" }}>{error}</p>
            )}
            <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", marginTop: 4 }}>
              <button
                type="button"
                onClick={onClose}
                style={{
                  padding: "8px 16px", borderRadius: 6, fontSize: 13, fontWeight: 500,
                  background: "#fff", color: "#555", border: "1px solid #E5E5E5", cursor: "pointer",
                }}
              >
                취소
              </button>
              <button
                type="submit"
                disabled={loading}
                style={{
                  padding: "8px 20px", borderRadius: 6, fontSize: 13, fontWeight: 600,
                  background: "#3B5BDB", color: "#fff", border: "none",
                  cursor: loading ? "not-allowed" : "pointer",
                  opacity: loading ? 0.7 : 1,
                }}
              >
                {loading ? "발송 중..." : "초대 이메일 발송"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default function UsersClientView({ users: initial, myId }: { users: UserRow[]; myId: string }) {
  const router = useRouter();
  const [users, setUsers] = useState(initial);
  const [saving, setSaving] = useState<string | null>(null);
  const [showInvite, setShowInvite] = useState(false);

  const handleRoleChange = async (userId: string, newRole: UserRole) => {
    setSaving(userId);
    const { error } = await supabase
      .from("profiles")
      .update({ role: newRole })
      .eq("id", userId);

    setSaving(null);
    if (error) { alert("변경 실패: " + error.message); return; }
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u));
    router.refresh();
  };

  return (
    <div style={{ padding: 24 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
        <Users size={18} color="#555" />
        <h1 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: "#1a1a1a" }}>사용자 관리</h1>
        <span style={{
          fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 6,
          background: "#F0F0F0", color: "#999", marginLeft: 4,
        }}>
          {users.length}명
        </span>
        <div style={{ flex: 1 }} />
        <button
          onClick={() => setShowInvite(true)}
          style={{
            display: "flex", alignItems: "center", gap: 6,
            padding: "6px 14px", borderRadius: 6, fontSize: 13, fontWeight: 600,
            background: "#3B5BDB", color: "#fff", border: "none", cursor: "pointer",
          }}
        >
          <UserPlus size={14} />
          사용자 초대
        </button>
      </div>

      <div style={{ border: "1px solid #E5E5E5", borderRadius: 10, overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#FAFAFA", borderBottom: "1px solid #E5E5E5" }}>
              {["이름", "부서", "역할", ""].map(col => (
                <th key={col} style={{
                  padding: "10px 16px", textAlign: "left",
                  fontSize: 11, fontWeight: 600, color: "#999",
                }}>
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {users.length === 0 && (
              <tr>
                <td colSpan={4} style={{ padding: "32px 16px", textAlign: "center", color: "#bbb", fontSize: 13 }}>
                  등록된 사용자가 없습니다
                </td>
              </tr>
            )}
            {users.map((user, i) => {
              const rc = ROLE_COLORS[user.role as UserRole] ?? { color: "#999", bg: "#F5F5F5" };
              const isMe = user.id === myId;
              return (
                <tr key={user.id} style={{ borderBottom: i < users.length - 1 ? "1px solid #F0F0F0" : "none" }}>
                  <td style={{ padding: "12px 16px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{
                        width: 32, height: 32, borderRadius: "50%",
                        background: "#EEF2FF", color: "#3B5BDB",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: 12, fontWeight: 700, flexShrink: 0,
                      }}>
                        {user.full_name.charAt(0) || "U"}
                      </div>
                      <div>
                        <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: "#1a1a1a" }}>
                          {user.full_name || "—"}
                          {isMe && <span style={{ marginLeft: 6, fontSize: 10, color: "#3B5BDB", fontWeight: 700 }}>나</span>}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: "12px 16px", fontSize: 13, color: "#555" }}>
                    {user.department ?? "—"}
                  </td>
                  <td style={{ padding: "12px 16px" }}>
                    <span style={{
                      fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 5,
                      background: rc.bg, color: rc.color,
                    }}>
                      {ROLE_LABELS[user.role as UserRole] ?? user.role}
                    </span>
                  </td>
                  <td style={{ padding: "12px 16px", textAlign: "right" }}>
                    {!isMe && (
                      <div style={{ position: "relative", display: "inline-block" }}>
                        <select
                          value={user.role}
                          disabled={saving === user.id}
                          onChange={e => handleRoleChange(user.id, e.target.value as UserRole)}
                          style={{
                            padding: "5px 28px 5px 10px", fontSize: 12, borderRadius: 6,
                            border: "1px solid #E5E5E5", background: "#fff", cursor: "pointer",
                            appearance: "none", outline: "none",
                            opacity: saving === user.id ? 0.5 : 1,
                          }}
                        >
                          {ROLES.map(r => (
                            <option key={r} value={r}>{ROLE_LABELS[r]}</option>
                          ))}
                        </select>
                        <ChevronDown size={12} color="#bbb" style={{ position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {showInvite && <InviteModal onClose={() => setShowInvite(false)} />}

      {/* complais 유입 배너 */}
      <div style={{
        marginTop: 28, borderRadius: 10, background: "#EEF2FF",
        border: "1px solid #C5D0FF", padding: "18px 22px",
        display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16,
      }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
          <span style={{ fontSize: 24, flexShrink: 0 }}>👥</span>
          <div>
            <p style={{ margin: "0 0 4px", fontSize: 13, fontWeight: 700, color: "#1a1a1a" }}>
              더 많은 직원을 초대하고 인증기관과 연결하려면 complais를 시작하세요
            </p>
            <p style={{ margin: 0, fontSize: 12, color: "#555" }}>
              complais 플랫폼에서 조직을 관리하고 인증기관 심사 데이터를 ISOSystem과 연동할 수 있습니다.
            </p>
          </div>
        </div>
        <a
          href="https://complais.kr"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            flexShrink: 0, padding: "8px 18px", borderRadius: 7,
            background: "#3B5BDB", color: "#fff", fontSize: 12, fontWeight: 700,
            textDecoration: "none", whiteSpace: "nowrap",
          }}
        >
          complais 바로가기 →
        </a>
      </div>
    </div>
  );
}
