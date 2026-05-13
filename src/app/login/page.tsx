"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
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

function translateLoginError(msg: string): string {
  if (msg.includes("Invalid login credentials"))  return "이메일 또는 비밀번호가 올바르지 않습니다.";
  if (msg.includes("Email not confirmed"))         return "이메일 인증이 완료되지 않았습니다. Supabase 대시보드 → Authentication → Settings → Confirm email OFF 설정 필요.";
  if (msg.includes("Too many requests"))           return "로그인 시도가 너무 많습니다. 잠시 후 다시 시도해주세요.";
  if (msg.includes("User not found"))              return "등록되지 않은 이메일입니다.";
  if (msg.includes("timeout"))                     return "응답 시간이 초과되었습니다. 다시 시도해주세요.";
  return msg;
}

function LoginForm() {
  const searchParams = useSearchParams();
  const next = searchParams.get("next") ?? "/";

  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [showPw,   setShowPw]   = useState(false);
  const [loading,  setLoading]  = useState(false);
  const [step,     setStep]     = useState<"idle" | "signingin" | "loadingprofile">("idle");
  const [error,    setError]    = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStep("signingin");
    setError("");

    const supabase = getAuthClient();  // 쿠키 기반 클라이언트

    // ── 1. 로그인 ────────────────────────────────────────────
    const { data, error: authErr } = await supabase.auth.signInWithPassword({ email, password });

    console.log("[login] signInWithPassword:", {
      user:    data?.user  ? { id: data.user.id, email: data.user.email, confirmed: data.user.email_confirmed_at } : null,
      session: data?.session ? "있음" : "없음",
      error:   authErr?.message ?? null,
    });

    if (authErr) {
      console.error("[login] 에러:", authErr.message);
      setError(translateLoginError(authErr.message));
      setLoading(false);
      setStep("idle");
      return;
    }

    if (!data.session) {
      setError("세션 생성 실패. 이메일 인증 여부를 확인하세요.");
      setLoading(false);
      setStep("idle");
      return;
    }

    // ── 2. profiles → company_id 확인 ────────────────────────
    setStep("loadingprofile");

    const { data: profile, error: profileErr } = await supabase
      .from("profiles")
      .select("company_id")
      .eq("id", data.user.id)
      .single();

    console.log("[login] profiles:", {
      company_id: profile?.company_id ?? null,
      error:      profileErr?.message ?? null,
    });

    // ── 3. 강제 이동 (window.location → 쿠키 세션이 미들웨어에 전달됨) ──
    const dest = profile?.company_id
      ? (next !== "/" ? next : "/")
      : "/onboarding";

    console.log("[login] 이동:", dest);
    window.location.href = dest;
  };

  const stepLabel =
    step === "signingin"      ? "로그인 중..." :
    step === "loadingprofile" ? "정보 확인 중..." :
    "로그인";

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
          fontSize: 15, fontWeight: 800, letterSpacing: "-0.03em",
        }}>C</div>
        <span style={{ fontSize: 20, fontWeight: 800, color: "#1a1a1a", letterSpacing: "-0.03em" }}>complAIs</span>
      </div>

      <div style={{
        width: "100%", maxWidth: 400,
        background: "#fff", borderRadius: 14, border: "1px solid #E5E5E5",
        boxShadow: "0 4px 24px rgba(0,0,0,0.06)", overflow: "hidden",
      }}>
        <div style={{ padding: "28px 32px" }}>
          <h1 style={{ margin: "0 0 4px", fontSize: 20, fontWeight: 700, color: "#1a1a1a" }}>로그인</h1>
          <p style={{ margin: "0 0 24px", fontSize: 13, color: "#999" }}>complAIs 계정으로 로그인하세요</p>

          <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
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
                  placeholder="비밀번호 입력" disabled={loading}
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
            </div>

            {error && (
              <div style={{
                padding: "10px 12px", borderRadius: 7,
                background: "#FFF0F0", color: "#E03131",
                fontSize: 12, lineHeight: 1.55, border: "1px solid #FFD5D5",
              }}>
                {error}
              </div>
            )}

            <button
              type="submit" disabled={loading}
              style={{
                display: "flex", alignItems: "center", justifyContent: "center", gap: 7,
                padding: "10px", borderRadius: 8, border: "none",
                background: "#3B5BDB", color: "#fff", fontSize: 13, fontWeight: 600,
                cursor: loading ? "not-allowed" : "pointer",
                opacity: loading ? 0.75 : 1, transition: "opacity 0.15s",
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
            계정이 없으신가요?{" "}
            <Link href="/signup" style={{ color: "#3B5BDB", fontWeight: 600, textDecoration: "none" }}>
              회원가입
            </Link>
          </p>
        </div>
      </div>

      <p style={{ marginTop: 14, fontSize: 11, color: "#ccc", textAlign: "center", lineHeight: 1.6 }}>
        문제 발생 시 터미널에서 [mw] 로그 확인<br />
        이메일 미인증: Supabase → Authentication → Settings → Confirm email OFF
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
