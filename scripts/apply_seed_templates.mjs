import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createClient } from "@supabase/supabase-js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, "..");
const seedPath = path.join(projectRoot, "supabase", "seed_templates.sql");
const envPath = path.join(projectRoot, ".env.local");

function parseEnv(text) {
  const env = {};
  for (const line of text.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const idx = trimmed.indexOf("=");
    if (idx === -1) continue;
    const key = trimmed.slice(0, idx);
    const value = trimmed.slice(idx + 1);
    env[key] = value;
  }
  return env;
}

function parseSeedSql(sql) {
  const tuplePattern = /\('([^']*)',\s*'([^']*)',\s*'([^']*)',\s*'([^']*)',\s*'([^']*)',\s*\n'([^']*)',\s*'([^']*)',\s*'([^']*)',\s*(\d+),\s*\n'([\s\S]*?)'::jsonb\)/g;
  const templates = [];

  for (const match of sql.matchAll(tuplePattern)) {
    const [
      ,
      template_code,
      standard,
      layer,
      process_no,
      doc_type,
      title,
      iso_clause,
      plan_required,
      sort_order,
      sectionsJson,
    ] = match;

    templates.push({
      template_code,
      standard,
      layer,
      process_no,
      doc_type,
      title,
      iso_clause,
      plan_required,
      sort_order: Number.parseInt(sort_order, 10),
      sections: JSON.parse(sectionsJson),
      is_active: true,
    });
  }

  return templates;
}

async function main() {
  const [seedSql, envText] = await Promise.all([
    fs.readFile(seedPath, "utf8"),
    fs.readFile(envPath, "utf8"),
  ]);

  const env = parseEnv(envText);
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || env.SUPABASE_SERVICE_ROLE_KEY;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const supabaseKey = serviceRoleKey || anonKey;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error("Supabase URL 또는 key를 찾을 수 없습니다.");
  }

  const templates = parseSeedSql(seedSql);
  if (templates.length === 0) {
    throw new Error("seed_templates.sql에서 템플릿을 파싱하지 못했습니다.");
  }

  const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const { error } = await supabase
    .from("document_templates")
    .upsert(templates, { onConflict: "template_code" });

  if (error) throw error;

  console.log(`APPLIED_TEMPLATES=${templates.length}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
