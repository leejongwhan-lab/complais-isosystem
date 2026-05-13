import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

type Action = "request_review" | "approve" | "reject" | "obsolete" | "restore" | "revise" | "delete";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await req.json() as { action: Action; actor_name?: string; note?: string };
  const { action, actor_name, note } = body;

  const { data: doc, error: docErr } = await supabase
    .from("documents")
    .select("*")
    .eq("id", id)
    .single();

  if (docErr || !doc) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const fromStatus = doc.status as string;

  // ── 삭제 ──────────────────────────────────────────────────────
  if (action === "delete") {
    const { error } = await supabase.from("documents").delete().eq("id", id);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ ok: true });
  }

  // ── 개정 (신규 문서 생성) ─────────────────────────────────────
  if (action === "revise") {
    const vNum = parseInt((doc.version as string).slice(1) || "0") + 1;
    const newVersion = `R${String(vNum).padStart(2, "0")}`;

    const { data: newDoc, error: insertErr } = await supabase
      .from("documents")
      .insert({
        doc_number:    doc.doc_number,
        layer:         doc.layer,
        process_no:    doc.process_no,
        doc_type:      doc.doc_type,
        industry_code: doc.industry_code,
        version:       newVersion,
        title:         doc.title,
        description:   doc.description,
        status:        "draft",
        owner_name:    doc.owner_name,
        related_iso:   doc.related_iso,
      })
      .select()
      .single();

    if (insertErr || !newDoc) {
      return NextResponse.json({ error: insertErr?.message ?? "개정 실패" }, { status: 500 });
    }

    // 섹션 복사
    const { data: sections } = await supabase
      .from("document_sections")
      .select("*")
      .eq("document_id", id);

    if (sections && sections.length > 0) {
      await supabase.from("document_sections").insert(
        (sections as Record<string, unknown>[]).map(s => ({
          document_id:   newDoc.id,
          section_order: s.section_order,
          section_key:   s.section_key,
          section_title: s.section_title,
          content:       s.content,
        }))
      );
    }

    await supabase.from("document_history").insert({
      document_id: id,
      action:      "revise",
      from_status: fromStatus,
      to_status:   "draft",
      actor_name:  actor_name ?? null,
      note:        `${newVersion} 개정 시작`,
    });

    return NextResponse.json({ newDocId: newDoc.id });
  }

  // ── 일반 상태 전환 ─────────────────────────────────────────────
  const updates: Record<string, unknown> = {};
  let toStatus: string;

  switch (action) {
    case "request_review":
      toStatus = "review";
      updates.status               = toStatus;
      updates.reviewer             = actor_name ?? null;
      updates.review_requested_at  = new Date().toISOString();
      updates.reject_reason        = null;
      break;
    case "approve":
      toStatus = "active";
      updates.status       = toStatus;
      updates.approver     = actor_name ?? null;
      updates.approved_at  = new Date().toISOString();
      break;
    case "reject":
      toStatus = "draft";
      updates.status        = toStatus;
      updates.reject_reason = note ?? null;
      break;
    case "obsolete":
      toStatus = "obsolete";
      updates.status        = toStatus;
      updates.obsoleted_at  = new Date().toISOString();
      break;
    case "restore":
      toStatus = "draft";
      updates.status       = toStatus;
      updates.obsoleted_at = null;
      break;
    default:
      return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  }

  const { error: updateErr } = await supabase.from("documents").update(updates).eq("id", id);
  if (updateErr) return NextResponse.json({ error: updateErr.message }, { status: 500 });

  await supabase.from("document_history").insert({
    document_id: id,
    action,
    from_status: fromStatus,
    to_status:   toStatus!,
    actor_name:  actor_name ?? null,
    note:        note ?? null,
  });

  return NextResponse.json({ ok: true, status: toStatus });
}
