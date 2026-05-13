"use client";

import { useState } from "react";
import Link from "next/link";
import { getAuthClient } from "@/lib/supabase-browser";
import { Eye, EyeOff, Loader2 } from "lucide-react";

const INPUT: React.CSSProperties = {
  width: "100%", padding: "9px 12px", fontSize: 13, color: "#1a1a1a",
  border: "1px solid #E5E5E5", borderRadius: 8, background: "#fff",
  outline: "none", boxSizing: "border-box",
};

const LABEL: React.CSSProperties = {
  display: "block", marginBottom: 6, fontSize: 11, fontWeight: 600,
  color: "#999", textTransform: "uppercase" as const, letterSpacing: "0.05em",
};

function translateAuthError(msg: string): string {
  if (msg.includes("User already registered"))   return "이미 가입된 이메일입니다. 로그인해주세요.";
  if (msg.includes("Password should be"))        return "비밀번호는 8자 이상이어야 합니다.";
  if (msg.includes("Unable to validate email"))  return "유효하지 않은 이메일 형식입니다.";
  if (msg.includes("Email rate limit"))          return "잠시 후 다시 시도해주세요. (이메일 발송 한도 초과)";
  if (msg.includes("network") || msg.includes("fetch")) return "네트워크 오류가 발생했습니다. 인터넷 연결을 확인하세요.";
  if (msg.includes("timeout"))                   return "응답 시간이 초과되었습니다. 다시 시도해주세요.";
  return msg;
}

export default function SignupPage() {
  const [fullName, setFullName] = useState("");
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [confirm,  setConfirm]  = useState("");
  const [showPw,   setShowPw]   = useState(false);
  const [loading,  setLoading]  = useState(false);
  const [step,     setStep]     = useState<"idle" | "signingup" | "signingin">("idle");
  const [error,    setError]    = useState("");
  const [done,     setDone]     = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password.length < 8) {
      setError("비밀번호는 8자 이상이어야 합니다.");
      return;
    }
    if (password !== confirm) {
      setError("비밀번호가 일치하지 않습니다.");
      return;
    }

    setLoading(true);
    setStep("signingup");

    const supabase = getAuthClient();  // 쿠키 기반 클라이언트

    // 10초 타임아웃
    const signupPromise = supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName.trim() } },
    });

    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error("timeout")), 10000)
    );

    let signupData: Awaited<typeof signupPromise>;
    try {
      signupData = await Promise.race([signupPromise, timeoutPromise]) as Awaited<typeof signupPromise>;
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error("[signup] 타임아웃 또는 네트워크 오류:", msg);
      setError("응답 시간이 초과되었습니다. 다시 시도해주세요.");
      setLoading(false);
      setStep("idle");
      return;
    }

    const { data, error: authErr } = signupData;
    console.log("[signup] signUp 결과:", {
      user: data?.user ? { id: data.user.id, email: data.user.email, confirmed: data.user.email_confirmed_at } : null,
      session: data?.session ? "세션 있음" : "세션 없음",
      error: authErr?.message ?? null,
    });

    if (authErr) {
      console.error("[signup] 에러:", authErr);
      setError(translateAuthError(authErr.message));
      setLoading(false);
      setStep("idle");
      return;
    }

    // 세션이 바로 생성됐으면 (이메일 확인 OFF) → 바로 온보딩으로
    if (data.session) {
      console.log("[signup] 세션 생성됨 → 온보딩으로 이동");
      window.location.href = "/onboarding";
      return;
    }

    // 세션 없음 → 이메일 확인 ON 상태. 자동 로그인 시도.
    console.log("[signup] 세션 없음 → 이메일 확인 필요 또는 자동 로그인 시도");
    setStep("signingin");

    const { data: loginData, error: loginErr } = await supabase.auth.signInWithPassword({ email, password });
    console.log("[signup] signIn 결과:", {
      session: loginData?.session ? "세션 있음" : "세션 없음",
      error: loginErr?.message ?? null,
    });

    if (!loginErr && loginData?.session) {
      console.log("[signup] 자동 로그인 성공 → 온보딩으로 이동");
      window.location.href = "/onboarding";
      return;
    }

    // 이메일 인증 필요
    console.log("[signup] 이메일 확인 필요 화면 표시");
    setDone(true);
    setLoading(false);
    setStep("idle");
  };

  if (done) {
    return (
      <div style={{
        minHeight: "100vh", background: "#F8F9FA",
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        padding: 40,
      }}>
        <div style={{
          maxWidth: 400, width: "100%", background: "#fff",
          borderRadius: 14, border: "1px solid #E5E5E5", padding: "36px 32px",
          boxShadow: "0 4px 24px rgba(0,0,0,0.06)", textAlign: "center",
        }}>
          <div style={{ fontSize: 36, marginBottom: 16 }}>📧</div>
          <h2 style={{ margin: "0 0 8px", fontSize: 18, fontWeight: 700 }}>이메일 확인 필요</h2>
          <p style={{ margin: "0 0 6px", fontSize: 13, color: "#555", lineHeight: 1.6 }}>
            <strong>{email}</strong>로 인증 메일을 발송했습니다.
          </p>
          <p style={{ margin: "0 0 20px", fontSize: 12, color: "#999", lineHeight: 1.6 }}>
            메일의 링크를 클릭한 뒤 로그인하세요.<br />
            메일이 오지 않으면 스팸함을 확인해주세요.
          </p>
          <p style={{ margin: "0 0 12px", fontSize: 11, color: "#bbb", padding: "8px 12px", background: "#F8F9FA", borderRadius: 6 }}>
            Supabase 대시보드 → Authentication → Settings<br />
            &quot;Confirm email&quot; 비활성화 시 즉시 로그인됩니다
          </p>
          <Link href="/login" style={{
            display: "block", padding: "9px", borderRadius: 8,
            background: "#3B5BDB", color: "#fff", fontSize: 13, fontWeight: 600,
            textDecoration: "none",
          }}>
            로그인 화면으로
          </Link>
        </div>
      </div>
    );
  }

  const stepLabel = step === "signingup" ? "계정 생성 중..." : step === "signingin" ? "로그인 중..." : "계정 만들기";

  return (
    <div style={{
      minHeight: "100vh", background: "#F8F9FA",
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      padding: "40px 20px",
    }}>
      {/* 로고 */}
      <div style={{ marginBottom: 28, display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{
          width: 34, height: 34, borderRadius: 9, background: "#3B5BDB", color: "#fff",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 15, fontWeight: 800,
        }}>C</div>
        <span style={{ fontSize: 20, fontWeight: 800, color: "#1a1a1a", letterSpacing: "-0.03em" }}>complAIs</span>
      </div>

      <div style={{
        width: "100%", maxWidth: 420,
        background: "#fff", borderRadius: 14, border: "1px solid #E5E5E5",
        boxShadow: "0 4px 24px rgba(0,0,0,0.06)", overflow: "hidden",
      }}>
        <div style={{ padding: "28px 32px" }}>
          <h1 style={{ margin: "0 0 4px", fontSize: 20, fontWeight: 700, color: "#1a1a1a" }}>회원가입</h1>
          <p style={{ margin: "0 0 24px", fontSize: 13, color: "#999" }}>새 complAIs 계정을 만들어 시작하세요</p>

          <form onSubmit={handleSignup} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div>
              <label style={LABEL}>이름</label>
              <input
                type="text" required value={fullName} onChange={e => setFullName(e.target.value)}
                placeholder="홍길동" disabled={loading}
                style={INPUT}
                className="focus:border-[#3B5BDB] transition-colors placeholder:text-[#bbb]"
              />
            </div>

            <div>
              <label style={LABEL}>이메일</label>
              <input
                type="email" required value={email} onChange={e => setEmail(e.target.value)}
                placeholder="name@company.com" disabled={loading}
                style={INPUT}
                className="focus:border-[#3B5BDB] transition-colors placeholder:text-[#bbb]"
              />
            </div>

            <div>
              <label style={LABEL}>비밀번호</label>
              <div style={{ position: "relative" }}>
                <input
                  type={showPw ? "text" : "password"} required value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="8자 이상" disabled={loading}
                  style={{ ...INPUT, paddingRight: 40 }}
                  className="focus:border-[#3B5BDB] transition-colors placeholder:text-[#bbb]"
                />
                <button
                  type="button" onClick={() => setShowPw(v => !v)}
                  style={{
                    position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)",
                    background: "none", border: "none", cursor: "pointer", padding: 0,
                  }}
                >
                  {showPw ? <EyeOff size={16} color="#bbb" /> : <Eye size={16} color="#bbb" />}
                </button>
              </div>
              {password && password.length < 8 && (
                <p style={{ margin: "4px 0 0", fontSize: 11, color: "#E67700" }}>비밀번호를 8자 이상 입력해주세요</p>
              )}
            </div>

            <div>
              <label style={LABEL}>비밀번호 확인</label>
              <input
                type={showPw ? "text" : "password"} required value={confirm}
                onChange={e => setConfirm(e.target.value)}
                placeholder="비밀번호 재입력" disabled={loading}
                style={{
                  ...INPUT,
                  borderColor: confirm && confirm !== password ? "#E03131" : undefined,
                }}
                className="focus:border-[#3B5BDB] transition-colors placeholder:text-[#bbb]"
              />
              {confirm && confirm !== password && (
                <p style={{ margin: "4px 0 0", fontSize: 11, color: "#E03131" }}>비밀번호가 일치하지 않습니다</p>
              )}
            </div>

            {error && (
              <div style={{
                padding: "10px 12px", borderRadius: 7,
                background: "#FFF0F0", color: "#E03131",
                fontSize: 12, lineHeight: 1.5,
                border: "1px solid #FFD5D5",
              }}>
                {error}
              </div>
            )}

            <button
              type="submit" disabled={loading}
              style={{
                display: "flex", alignItems: "center", justifyContent: "center", gap: 7,
                padding: "10px", borderRadius: 8, border: "none",
                background: "#3B5BDB", color: "#fff",
                fontSize: 13, fontWeight: 600,
                cursor: loading ? "not-allowed" : "pointer",
                opacity: loading ? 0.75 : 1, marginTop: 4,
                transition: "opacity 0.15s",
              }}
              className="hover:opacity-90"
            >
              {loading && <Loader2 size={15} className="animate-spin" />}
              {stepLabel}
            </button>
          </form>
        </div>

        <div style={{ padding: "16px 32px", borderTop: "1px solid #F0F0F0", textAlign: "center" }}>
          <p style={{ margin: 0, fontSize: 12, color: "#999" }}>
            이미 계정이 있으신가요?{" "}
            <Link href="/login" style={{ color: "#3B5BDB", fontWeight: 600, textDecoration: "none" }}>
              로그인
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
