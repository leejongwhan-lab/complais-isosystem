"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { FormTemplate, FormRecord, FormData } from "@/types/form";
import FormEngine from "./FormEngine";
import { supabase } from "@/lib/supabase";
import Breadcrumb from "@/components/ui/Breadcrumb";
import PrintButton from "@/components/print/PrintButton";
import PrintLayout from "@/components/print/PrintLayout";

interface FormRecordClientProps {
  template: FormTemplate;
  record: FormRecord;
}

const STATUS_LABEL: Record<string, string> = {
  draft: "임시저장", completed: "완료", approved: "승인",
};

export default function FormRecordClient({ template, record }: FormRecordClientProps) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!saved) return;
    const timer = setTimeout(() => setSaved(false), 4000);
    return () => clearTimeout(timer);
  }, [saved]);

  async function handleSave(data: FormData, status: "draft" | "completed") {
    await supabase
      .from("form_records")
      .update({ data, status, updated_at: new Date().toISOString() })
      .eq("id", record.id);
    router.refresh();
    setEditing(false);
    setSaved(true);
  }

  return (
    <>
    <PrintLayout
      docNumber={record.record_number}
      title={template.form_name}
      version={record.status === "approved" ? "승인" : "작성중"}
      isForm={true}
      formCode={template.form_code}
    >
    <div style={{ padding: 24 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
        <Breadcrumb items={[
          { label: "서식 라이브러리", href: "/forms" },
          { label: template.form_name, href: `/forms/${template.form_code}/records` },
          { label: record.record_number },
        ]} />
        <div className="no-print" style={{ display: "flex", gap: 6, alignItems: "center" }}>
          <PrintButton />
          <Link href={`/forms/${template.form_code}/records`} style={{
            display: "flex", alignItems: "center", gap: 4,
            padding: "5px 10px", borderRadius: 6, textDecoration: "none",
            fontSize: 12, fontWeight: 500, color: "#555",
            border: "1px solid #E5E5E5", background: "#fff",
          }} className="hover:bg-[#F5F5F5] transition-colors">
            <ChevronLeft size={12} color="#999" />목록
          </Link>
        </div>
      </div>
      {/* 헤더 */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
        <div>
          <p style={{ margin: 0, fontSize: 12, color: "#bbb" }}>
            {record.record_number} · {STATUS_LABEL[record.status] ?? record.status}
          </p>
          <h1 style={{ margin: "4px 0 0", fontSize: 18, fontWeight: 700, color: "#1a1a1a" }}>
            {template.form_name}
          </h1>
        </div>
        {!editing && record.status !== "approved" && (
          <button
            onClick={() => setEditing(true)}
            style={{
              padding: "7px 16px", borderRadius: 6, fontSize: 13, fontWeight: 500,
              border: "1px solid #E5E5E5", background: "#fff", color: "#555",
              cursor: "pointer",
            }}
            className="hover:bg-[#F5F5F5] transition-colors"
          >
            편집
          </button>
        )}
        {editing && (
          <button
            onClick={() => setEditing(false)}
            style={{
              padding: "7px 16px", borderRadius: 6, fontSize: 13, fontWeight: 500,
              border: "1px solid #E5E5E5", background: "#fff", color: "#888",
              cursor: "pointer",
            }}
            className="hover:bg-[#F5F5F5] transition-colors"
          >
            취소
          </button>
        )}
      </div>

      <FormEngine
        template={template}
        initialData={record.data as FormData}
        onSave={handleSave}
        readOnly={!editing}
      />
    </div>
    </PrintLayout>

    {/* 저장 완료 토스트 */}
    {saved && (
      <div style={{
        position: "fixed", bottom: 24, right: 24, zIndex: 1000,
        background: "#1A1A2E", color: "#fff", borderRadius: 8,
        padding: "10px 18px", fontSize: 13, fontWeight: 500,
        display: "flex", alignItems: "center", gap: 10,
        boxShadow: "0 4px 16px rgba(0,0,0,0.2)",
      }}>
        <span style={{ color: "#4ADE80" }}>✓</span>
        서식이 저장되었습니다
        <button
          onClick={() => window.print()}
          style={{ marginLeft: 8, padding: "3px 10px", borderRadius: 5, border: "1px solid rgba(255,255,255,0.3)", background: "transparent", color: "#fff", fontSize: 12, cursor: "pointer" }}
        >
          인쇄하기
        </button>
      </div>
    )}
  </>
  );
}
