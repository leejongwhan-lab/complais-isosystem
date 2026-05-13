import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const AUTH_PAGES = new Set(["/login", "/signup"]);

function isPublicReport(pathname: string) {
  return pathname === "/report" || pathname.startsWith("/report/");
}

function isPublicMobile(pathname: string) {
  return pathname === "/mobile" || pathname.startsWith("/mobile/");
}

const TBM_PUBLIC = /^\/tbm\/[^/]+\/(sign|qr)$/;

const ADMIN_ROLES = new Set(["admin", "superadmin"]);
const CONSULTANT_ROLES = new Set(["consultant", "admin", "superadmin"]);

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();
  console.log(`[mw] ${pathname} | ${user?.email ?? "no-session"}`);

  function makeRedirect(to: string): NextResponse {
    const res = NextResponse.redirect(new URL(to, request.url));
    supabaseResponse.cookies.getAll().forEach((cookie) =>
      res.cookies.set(cookie.name, cookie.value, {
        httpOnly: cookie.httpOnly,
        secure: cookie.secure,
        sameSite: cookie.sameSite as "lax" | "strict" | "none" | undefined,
        maxAge: cookie.maxAge,
        path: cookie.path,
      })
    );
    return res;
  }

  if (user && AUTH_PAGES.has(pathname)) return makeRedirect("/");
  if (AUTH_PAGES.has(pathname)) return supabaseResponse;

  if (isPublicReport(pathname)) return supabaseResponse;
  if (isPublicMobile(pathname)) return supabaseResponse;
  if (TBM_PUBLIC.test(pathname)) return supabaseResponse;

  if (!user) {
    const next = pathname === "/" ? "/login" : `/login?next=${encodeURIComponent(pathname)}`;
    console.log(`[mw] 비로그인 → ${next}`);
    return makeRedirect(next);
  }

  if (pathname.startsWith("/admin")) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();
    const role = profile?.role ?? "";
    if (!ADMIN_ROLES.has(role)) {
      console.log(`[mw] /admin 접근 거부 (role=${role})`);
      return makeRedirect("/");
    }
    return supabaseResponse;
  }

  if (pathname.startsWith("/consultant")) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();
    const role = profile?.role ?? "";
    if (!CONSULTANT_ROLES.has(role)) {
      console.log(`[mw] /consultant 접근 거부 (role=${role})`);
      return makeRedirect("/");
    }
    return supabaseResponse;
  }

  if (pathname.startsWith("/onboarding")) return supabaseResponse;

  const cookieCompanyId = request.cookies.get("company_id")?.value;
  if (!cookieCompanyId) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("company_id")
      .eq("id", user.id)
      .single();

    const profileCompanyId = (profile as { company_id?: string | null } | null)?.company_id ?? null;
    if (!profileCompanyId) {
      console.log(`[mw] company_id 없음(profile도 비어있음) → /onboarding`);
      return makeRedirect("/onboarding");
    }

    supabaseResponse.cookies.set("company_id", profileCompanyId, {
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
      sameSite: "lax",
    });
    console.log(`[mw] company_id 쿠키 복구: ${profileCompanyId}`);
  }

  return supabaseResponse;
}

export const config = {
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};
