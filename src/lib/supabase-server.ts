import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function createSupabaseServerClient() {
  const cookieStore = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll(); },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {}
        },
      },
    }
  );
}

export async function getUser() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

type UserProfile = {
  id: string;
  company_id: string | null;
  full_name: string;
  role: string;
  department: string | null;
  avatar_url: string | null;
  email: string | undefined;
};

export async function getUserProfile(): Promise<UserProfile | null> {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from("profiles")
    .select("id, company_id, full_name, role, department, avatar_url")
    .eq("id", user.id)
    .single();

  console.log("[getUserProfile] uid:", user.id, "role:", (data as { role?: string } | null)?.role ?? null, "error:", error?.code ?? null);

  if (!data) {
    // 프로필 행이 없으면 (트리거 미적용 등) 기본 행을 생성
    const { data: created } = await supabase
      .from("profiles")
      .upsert({ id: user.id, role: "member", full_name: "" }, { onConflict: "id" })
      .select("id, company_id, full_name, role, department, avatar_url")
      .single();
    if (!created) return null;
    return { ...(created as Record<string, unknown>), email: user.email } as UserProfile;
  }

  return { ...(data as Record<string, unknown>), email: user.email } as UserProfile;
}
