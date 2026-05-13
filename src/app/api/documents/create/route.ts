import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient, getUserProfile } from "@/lib/supabase-server";
import { insertDocumentWithGeneratedNumber } from "@/lib/docNumber";
import type { TurtleData } from "@/components/documents/TurtleDiagram";

type CreateDocumentBody = {
  layer: string;
  process_no: string;
  doc_type: string;
  title: string;
  owner_name: string | null;
  related_iso: string | null;
  change_reason: string | null;
  company_code: string;
  sections: Array<{
    key: string;
    title: string;
    content: string | null;
  }>;
  approvals: Array<{
    step: number;
    step_name: string;
    approver_name: string | null;
  }>;
  turtle_data?: TurtleData | null;
};

export async function POST(request: NextRequest) {
  const supabase = await createSupabaseServerClient();
  const profile = await getUserProfile();

  if (!profile?.id) {
    return NextResponse.json({ error: "인증이 필요합니다." }, { status: 401 });
  }

  const body = await request.json() as CreateDocumentBody;
  if (!body.layer || !body.process_no || !body.doc_type || !body.title?.trim()) {
    return NextResponse.json({ error: "필수 입력값이 누락되었습니다." }, { status: 400 });
  }

  // company_code 없으면 임시번호로 저장 (나중에 재채번 가능)
  const effectiveCompanyCode = body.company_code?.trim() || `TEMP-${Date.now()}`;

  let createdDocumentId: string | null = null;

  try {
    const doc = await insertDocumentWithGeneratedNumber(supabase, effectiveCompanyCode, {
      layer: body.layer,
      process_no: body.process_no,
      doc_type: body.doc_type,
      version: "R00",
      title: body.title.trim(),
      status: "draft",
      owner_name: body.owner_name?.trim() || null,
      related_iso: body.related_iso?.trim() || null,
    });

    createdDocumentId = (doc as { id: string }).id;

    const tasks: PromiseLike<unknown>[] = [];

    if (body.sections.length > 0) {
      tasks.push(
        supabase.from("document_sections").insert(
          body.sections.map((section, index) => ({
            document_id: createdDocumentId,
            section_order: index + 1,
            section_key: section.key,
            section_title: section.title,
            content: section.content?.trim() || null,
          }))
        )
      );
    }

    tasks.push(
      supabase.from("document_approvals").insert(
        body.approvals.map((approval) => ({
          document_id: createdDocumentId,
          step: approval.step,
          step_name: approval.step_name,
          approver_name: approval.approver_name?.trim() || null,
          status: "pending",
        }))
      )
    );

    tasks.push(
      supabase.from("document_versions").insert({
        document_id: createdDocumentId,
        version: "R00",
        changed_by: body.owner_name?.trim() || null,
        change_reason: body.change_reason?.trim() || "최초 작성",
        content_snapshot: Object.fromEntries(body.sections.map((section) => [section.key, section.content ?? ""])),
      })
    );

    tasks.push(
      supabase.from("document_history").insert({
        document_id: createdDocumentId,
        action: "create",
        from_status: null,
        to_status: "draft",
        actor_name: body.owner_name?.trim() || null,
        note: "문서 최초 작성",
      })
    );

    if (body.doc_type === "P" && body.turtle_data) {
      tasks.push(
        supabase.from("documents").update({ turtle_data: body.turtle_data }).eq("id", createdDocumentId)
      );
    }

    await Promise.all(tasks);

    return NextResponse.json({ id: createdDocumentId });
  } catch (error) {
    if (createdDocumentId) {
      await supabase.from("documents").delete().eq("id", createdDocumentId);
    }
    const message = error instanceof Error ? error.message : "문서 생성에 실패했습니다.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
