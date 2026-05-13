import { createBrowserClient } from "@supabase/ssr";

/**
 * 쿠키 기반 Supabase 클라이언트 — 인증(로그인·회원가입·온보딩)에만 사용.
 * 세션을 쿠키에 저장하므로 미들웨어(SSR)와 공유된다.
 */
export function getAuthClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
