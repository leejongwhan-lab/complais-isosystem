"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { ROLE_LABELS } from "@/lib/permissions";
import { User, Mail, Shield, Save } from "lucide-react";

type Profile = {
  id: string;
  company_id: string | null;
  full_name: string;
  role: string;
  department: string | null;
  avatar_url: string | null;
  email: string | undefined;
};

const INPUT: React.CSSProperties = {
  width: "100%", padding: "8px 12px", fontSize: 13, color: "#1a1a1a",
  border: "1px solid #E5E5E5", borderRadius: 7, background: "#fff",
  outline: "none", boxSizing: "border-box",
};

const LABEL: React.CSSProperties = {
  display: "block", marginBottom: 5, fontSize: 11, fontWeight: 600,
  color: "#999", textTransform: "uppercase" as const, letterSpacing: "0.05em",
};

export default function ProfileClientView({ profile }: { profile: Profile }) {
  const router = useRouter();

  const [fullName,   setFullName]   = useState(profile.full_name);
  const [department, setDepartment] = useState(profile.department ?? "");
  const [saving,     setSaving]     = useState(false);
  const [saved,      setSaved]      = useState(false);
  const [error,      setError]      = useState("");

  // Password change state
  const [newPw,     setNewPw]     = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [pwSaving,  setPwSaving]  = useState(false);
  const [pwError,   setPwError]   = useState("");
  const [pwSaved,   setPwSaved]   = useState(false);

  const roleLabel = ROLE_LABELS[profile.role as keyof typeof ROLE_LABELS] ?? profile.role;
  const initial   = fullName.charAt(0) || "U";

  const handleSave = async () => {
    setSaving(true);
    setError("");
    const { error: err } = await supabase
      .from("profiles")
      .update({ full_name: fullName.trim(), department: department.trim() || null })
      .eq("id", profile.id);

    setSaving(false);
    if (err) { setError(err.message); return; }
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
    router.refresh();
  };

  const handlePwChange = async () => {
    setPwError("");
    if (newPw.length < 8) { setPwError("비밀번호는 8자 이상이어야 합니다."); return; }
    if (newPw !== confirmPw) { setPwError("비밀번호가 일치하지 않습니다."); return; }

    setPwSaving(true);
    const { error: err } = await supabase.auth.updateUser({ password: newPw });
    setPwSaving(false);

    if (err) { setPwError(err.message); return; }
    setPwSaved(true);
    setNewPw(""); setConfirmPw("");
    setTimeout(() => setPwSaved(false), 3000);
  };

  return (
    <div style={{ maxWidth: 640, margin: "0 auto", padding: 24 }}>
      <h1 style={{ margin: "0 0 20px", fontSize: 18, fontWeight: 700, color: "#1a1a1a" }}>내 프로필</h1>

      {/* 프로필 카드 */}
      <div style={{ border: "1px solid #E5E5E5", borderRadius: 10, overflow: "hidden", marginBottom: 20 }}>
        <div style={{ padding: "16px 20px", borderBottom: "1px solid #E5E5E5", display: "flex", alignItems: "center", gap: 6 }}>
          <User size={14} color="#555" />
          <span style={{ fontSize: 13, fontWeight: 600, color: "#1a1a1a" }}>기본 정보</span>
        </div>

        {/* 아바타 행 */}
        <div style={{ padding: "20px 20px 0", display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{
            width: 56, height: 56, borderRadius: "50%",
            background: "#EEF2FF", color: "#3B5BDB",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 22, fontWeight: 700, flexShrink: 0,
          }}>
            {initial}
          </div>
          <div>
            <p style={{ margin: 0, fontSize: 16, fontWeight: 700, color: "#1a1a1a" }}>{fullName || "—"}</p>
            <p style={{ margin: "2px 0 0", fontSize: 12, color: "#999" }}>{profile.email}</p>
            <span style={{
              display: "inline-block", marginTop: 4,
              fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 4,
              background: "#EEF2FF", color: "#3B5BDB",
            }}>
              {roleLabel}
            </span>
          </div>
        </div>

        <div style={{ padding: 20, display: "flex", flexDirection: "column", gap: 14 }}>
          <div>
            <label style={LABEL}>이름</label>
            <input
              type="text" value={fullName} onChange={e => setFullName(e.target.value)}
              style={INPUT} className="focus:border-[#3B5BDB] transition-colors"
            />
          </div>
          <div>
            <label style={LABEL}>부서</label>
            <input
              type="text" value={department} onChange={e => setDepartment(e.target.value)}
              placeholder="예: 품질관리팀"
              style={INPUT} className="focus:border-[#3B5BDB] transition-colors placeholder:text-[#bbb]"
            />
          </div>

          {error && (
            <div style={{ padding: "8px 12px", borderRadius: 6, background: "#FFF0F0", color: "#E03131", fontSize: 12 }}>
              {error}
            </div>
          )}

          <button
            onClick={handleSave} disabled={saving}
            style={{
              display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
              padding: "8px 16px", borderRadius: 7, border: "none",
              background: saved ? "#2F9E44" : "#3B5BDB", color: "#fff",
              fontSize: 13, fontWeight: 600, cursor: saving ? "not-allowed" : "pointer",
              alignSelf: "flex-start", opacity: saving ? 0.7 : 1, transition: "background 0.2s",
            }}
          >
            <Save size={14} />
            {saving ? "저장 중..." : saved ? "저장됨" : "저장"}
          </button>
        </div>
      </div>

      {/* 계정 정보 */}
      <div style={{ border: "1px solid #E5E5E5", borderRadius: 10, overflow: "hidden", marginBottom: 20 }}>
        <div style={{ padding: "16px 20px", borderBottom: "1px solid #E5E5E5", display: "flex", alignItems: "center", gap: 6 }}>
          <Mail size={14} color="#555" />
          <span style={{ fontSize: 13, fontWeight: 600, color: "#1a1a1a" }}>계정</span>
        </div>
        <div style={{ padding: 20, display: "flex", flexDirection: "column", gap: 14 }}>
          <div>
            <label style={LABEL}>이메일</label>
            <input type="email" value={profile.email ?? ""} disabled
              style={{ ...INPUT, background: "#F8F9FA", color: "#999" }}
            />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div>
              <label style={LABEL}>새 비밀번호</label>
              <input
                type="password" value={newPw} onChange={e => setNewPw(e.target.value)}
                placeholder="8자 이상"
                style={INPUT} className="focus:border-[#3B5BDB] transition-colors placeholder:text-[#bbb]"
              />
            </div>
            <div>
              <label style={LABEL}>비밀번호 확인</label>
              <input
                type="password" value={confirmPw} onChange={e => setConfirmPw(e.target.value)}
                placeholder="재입력"
                style={{
                  ...INPUT,
                  borderColor: confirmPw && confirmPw !== newPw ? "#E03131" : undefined,
                }}
                className="focus:border-[#3B5BDB] transition-colors placeholder:text-[#bbb]"
              />
            </div>
          </div>

          {pwError && (
            <div style={{ padding: "8px 12px", borderRadius: 6, background: "#FFF0F0", color: "#E03131", fontSize: 12 }}>
              {pwError}
            </div>
          )}

          <button
            onClick={handlePwChange} disabled={pwSaving || !newPw}
            style={{
              display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
              padding: "8px 16px", borderRadius: 7, border: "none",
              background: pwSaved ? "#2F9E44" : "#555", color: "#fff",
              fontSize: 13, fontWeight: 600, cursor: (pwSaving || !newPw) ? "not-allowed" : "pointer",
              alignSelf: "flex-start", opacity: (pwSaving || !newPw) ? 0.5 : 1, transition: "background 0.2s",
            }}
          >
            {pwSaving ? "변경 중..." : pwSaved ? "변경됨" : "비밀번호 변경"}
          </button>
        </div>
      </div>

      {/* 권한 */}
      <div style={{ border: "1px solid #E5E5E5", borderRadius: 10, overflow: "hidden" }}>
        <div style={{ padding: "16px 20px", borderBottom: "1px solid #E5E5E5", display: "flex", alignItems: "center", gap: 6 }}>
          <Shield size={14} color="#555" />
          <span style={{ fontSize: 13, fontWeight: 600, color: "#1a1a1a" }}>권한</span>
        </div>
        <div style={{ padding: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 13, color: "#555" }}>현재 역할:</span>
            <span style={{ fontSize: 13, fontWeight: 700, color: "#3B5BDB" }}>{roleLabel}</span>
          </div>
          <p style={{ margin: "8px 0 0", fontSize: 12, color: "#999" }}>
            역할 변경은 관리자에게 문의하세요.
          </p>
        </div>
      </div>
    </div>
  );
}
