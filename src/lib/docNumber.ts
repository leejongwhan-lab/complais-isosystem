import type { PostgrestError, SupabaseClient } from "@supabase/supabase-js";

const PREVIEW_PLACEHOLDER = "번호미정";
const RETRYABLE_UNIQUE_VIOLATION = "23505";
const SEQUENCE_WIDTH = 2;

type DocumentInsertPayload = {
  layer: string;
  process_no: string;
  doc_type: string;
  version: string;
  title: string;
  status: string;
  owner_name: string | null;
  related_iso: string | null;
};

function normalizeCompanyCode(companyCode: string): string {
  return companyCode.trim().toUpperCase();
}

function buildDocNumberPrefix(companyCode: string, layer: string, processCode: string, typeCode: string): string | null {
  const normalizedCode = normalizeCompanyCode(companyCode);
  if (!normalizedCode || !layer || !processCode || !typeCode) return null;
  return `${normalizedCode}-${layer}-${processCode}-${typeCode}-`;
}

function parseSequence(docNumber: string, prefix: string): number | null {
  if (!docNumber.startsWith(prefix)) return null;
  const rawSequence = docNumber.slice(prefix.length);
  if (!/^\d+$/.test(rawSequence)) return null;
  const sequence = Number.parseInt(rawSequence, 10);
  return Number.isFinite(sequence) ? sequence : null;
}

async function getNextSequence(
  supabase: SupabaseClient,
  prefix: string,
): Promise<number> {
  const { data, error } = await supabase
    .from("documents")
    .select("doc_number")
    .like("doc_number", `${prefix}%`)
    .not("doc_number", "like", "%NEW%")
    .not("doc_number", "like", "%번호미정%");

  if (error) throw error;

  let maxSequence = 0;
  for (const row of (data ?? []) as { doc_number: string }[]) {
    const sequence = parseSequence(row.doc_number, prefix);
    if (sequence && sequence > maxSequence) maxSequence = sequence;
  }

  return maxSequence + 1;
}

function formatDocNumber(prefix: string, sequence: number): string {
  return `${prefix}${String(sequence).padStart(SEQUENCE_WIDTH, "0")}`;
}

export async function generateDocNumber(
  supabase: SupabaseClient,
  companyCode: string,
  layer: string,
  processCode: string,
  typeCode: string,
): Promise<string> {
  const prefix = buildDocNumberPrefix(companyCode, layer, processCode, typeCode);
  if (!prefix) return PREVIEW_PLACEHOLDER;

  const nextSequence = await getNextSequence(supabase, prefix);
  return formatDocNumber(prefix, nextSequence);
}

export async function insertDocumentWithGeneratedNumber(
  supabase: SupabaseClient,
  companyCode: string,
  payload: DocumentInsertPayload,
  maxAttempts = 5,
) {
  const prefix = buildDocNumberPrefix(
    companyCode,
    payload.layer,
    payload.process_no,
    payload.doc_type,
  );

  if (!prefix) {
    throw new Error("회사코드·레이어·프로세스·유형을 모두 선택해주세요");
  }

  let lastError: PostgrestError | Error | null = null;

  for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
    try {
      const nextSequence = await getNextSequence(supabase, prefix);
      const docNumber = formatDocNumber(prefix, nextSequence);
      const { data, error } = await supabase
        .from("documents")
        .insert({ ...payload, doc_number: docNumber })
        .select()
        .single();

      if (!error && data) return data;
      if (error?.code !== RETRYABLE_UNIQUE_VIOLATION) throw error;
      lastError = error;
    } catch (error) {
      const typedError = error as PostgrestError | Error;
      const code = "code" in typedError ? typedError.code : undefined;
      if (code !== RETRYABLE_UNIQUE_VIOLATION) throw typedError;
      lastError = typedError;
    }
  }

  throw lastError ?? new Error("문서번호 생성에 실패했습니다");
}

export function suggestCompanyCode(companyName: string): string {
  return companyName
    .replace(/[^a-zA-Z]/g, "")
    .toUpperCase()
    .slice(0, 3)
    || "COM";
}
