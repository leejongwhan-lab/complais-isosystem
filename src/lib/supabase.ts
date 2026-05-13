import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

console.log('SUPABASE_URL:', supabaseUrl);

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/** documents 테이블 연결 확인용 — 개발 중에만 사용 */
export async function testConnection(): Promise<{ ok: boolean; count: number | null; error: string | null }> {
  const { count, error } = await supabase
    .from("documents")
    .select("*", { count: "exact", head: true });

  if (error) {
    return { ok: false, count: null, error: error.message };
  }
  return { ok: true, count, error: null };
}
