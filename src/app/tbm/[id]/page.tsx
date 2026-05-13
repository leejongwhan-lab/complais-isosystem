import { Suspense } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import AppLayoutServer from "@/components/layout/AppLayoutServer";
import { supabase } from "@/lib/supabase";
import PrintButton from "@/components/print/PrintButton";
import PrintLayout from "@/components/print/PrintLayout";
import { ChevronLeft, QrCode, Users } from "lucide-react";

function ContentSpinner() {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "calc(100vh - 56px)" }}>
      <div className="w-7 h-7 border-2 border-[#3B5BDB] border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

async function TBMDetailContent({ id }: { id: string }) {
  const [tbmResult, attendeesResult] = await Promise.all([
    supabase.from("tbm_records").select("*").eq("id", id).single(),
    supabase
      .from("tbm_attendees")
      .select("*")
      .eq("tbm_id", id)
      .order("signed_at", { ascending: true }),
  ]);

  if (tbmResult.error || !tbmResult.data) {
    notFound();
  }

  const tbm = tbmResult.data as {
    id: string;
    tbm_date: string;
    work_location: string;
    work_content: string;
    hazards: string | null;
    safety_instructions: string | null;
    weather: string | null;
    temperature: string | null;
    leader_name: string;
    attendee_count: number;
    created_at: string;
  };

  const attendees = (attendeesResult.data ?? []) as Array<{
    id: string;
    tbm_id: string;
    name: string;
    signature: string | null;
    signed_at: string;
  }>;

  const SECTION_STYLE = {
    background: "#FAFAFA",
    border: "1px solid #E5E5E5",
    borderRadius: 8,
    padding: "16px 20px",
    marginBottom: 16,
  };

  const LABEL_STYLE = {
    fontSize: 11,
    fontWeight: 600 as const,
    color: "#999",
    textTransform: "uppercase" as const,
    letterSpacing: "0.05em",
    marginBottom: 4,
  };

  const VALUE_STYLE = {
    fontSize: 14,
    color: "#1a1a1a",
    fontWeight: 500 as const,
  };

  return (
    <PrintLayout title="TBM 안전교육 기록">
      <div style={{ padding: "0 0 40px" }}>
        {/* Header */}
        <div style={{
          padding: "20px 28px",
          borderBottom: "1px solid #E5E5E5",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
            <Link
              href="/tbm"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 3,
                fontSize: 13,
                color: "#999",
                textDecoration: "none",
              }}
              className="hover:text-[#1a1a1a] transition-colors"
            >
              <ChevronLeft size={14} />
              TBM 관리
            </Link>
            <span style={{ fontSize: 13, color: "#E5E5E5" }}>›</span>
            <span style={{ fontSize: 13, color: "#1a1a1a", fontWeight: 500 }}>
              {tbm.tbm_date}
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }} className="no-print">
            <Link
              href={`/tbm/${id}/qr`}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 5,
                padding: "5px 10px",
                borderRadius: 6,
                border: "1px solid #E5E5E5",
                background: "#fff",
                fontSize: 12,
                fontWeight: 500,
                color: "#555",
                textDecoration: "none",
              }}
              className="hover:bg-[#F5F5F5] transition-colors"
            >
              <QrCode size={13} />
              QR코드
            </Link>
            <PrintButton />
            <Link
              href="/tbm"
              style={{
                padding: "5px 12px",
                borderRadius: 6,
                border: "1px solid #E5E5E5",
                background: "#fff",
                fontSize: 12,
                fontWeight: 500,
                color: "#555",
                textDecoration: "none",
              }}
              className="hover:bg-[#F5F5F5] transition-colors"
            >
              목록
            </Link>
          </div>
        </div>

        {/* Content */}
        <div style={{ padding: "28px 28px 0" }}>

          {/* Info Grid */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 12,
            marginBottom: 24,
          }}>
            <div style={SECTION_STYLE}>
              <div style={LABEL_STYLE}>작업일</div>
              <div style={VALUE_STYLE}>{tbm.tbm_date}</div>
            </div>
            <div style={SECTION_STYLE}>
              <div style={LABEL_STYLE}>작업 장소</div>
              <div style={VALUE_STYLE}>{tbm.work_location}</div>
            </div>
            <div style={SECTION_STYLE}>
              <div style={LABEL_STYLE}>날씨</div>
              <div style={VALUE_STYLE}>{tbm.weather ?? "—"}</div>
            </div>
            <div style={SECTION_STYLE}>
              <div style={LABEL_STYLE}>기온</div>
              <div style={VALUE_STYLE}>{tbm.temperature ?? "—"}</div>
            </div>
            <div style={SECTION_STYLE}>
              <div style={LABEL_STYLE}>책임자</div>
              <div style={VALUE_STYLE}>{tbm.leader_name}</div>
            </div>
            <div style={SECTION_STYLE}>
              <div style={LABEL_STYLE}>참석자 수</div>
              <div style={VALUE_STYLE}>
                {attendees.length > 0 ? attendees.length : tbm.attendee_count}명
              </div>
            </div>
          </div>

          {/* Work Content */}
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: "#555", marginBottom: 8 }}>작업 내용</div>
            <div style={{
              background: "#FAFAFA",
              border: "1px solid #E5E5E5",
              borderRadius: 8,
              padding: "16px 20px",
              fontSize: 14,
              color: "#1a1a1a",
              lineHeight: 1.7,
              whiteSpace: "pre-wrap",
            }}>
              {tbm.work_content}
            </div>
          </div>

          {/* Hazards */}
          {tbm.hazards && (
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: "#555", marginBottom: 8 }}>위험 요인</div>
              <div style={{
                background: "#FFF9DB",
                border: "1px solid #FFD43B",
                borderRadius: 8,
                padding: "16px 20px",
                fontSize: 14,
                color: "#1a1a1a",
                lineHeight: 1.7,
                whiteSpace: "pre-wrap",
              }}>
                {tbm.hazards}
              </div>
            </div>
          )}

          {/* Safety Instructions */}
          {tbm.safety_instructions && (
            <div style={{ marginBottom: 24 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: "#555", marginBottom: 8 }}>안전 지시사항</div>
              <div style={{
                background: "#EBFBEE",
                border: "1px solid #69DB7C",
                borderRadius: 8,
                padding: "16px 20px",
                fontSize: 14,
                color: "#1a1a1a",
                lineHeight: 1.7,
                whiteSpace: "pre-wrap",
              }}>
                {tbm.safety_instructions}
              </div>
            </div>
          )}

          {/* Attendees Section */}
          <div style={{ marginBottom: 24 }}>
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              marginBottom: 16,
            }}>
              <Users size={16} color="#555" />
              <span style={{ fontSize: 14, fontWeight: 600, color: "#1a1a1a" }}>
                참석자 서명 현황
              </span>
              <span style={{
                fontSize: 11,
                fontWeight: 700,
                padding: "2px 8px",
                borderRadius: 10,
                background: "#EEF2FF",
                color: "#3B5BDB",
              }}>
                {attendees.length}명
              </span>
            </div>

            {attendees.length > 0 ? (
              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: 12,
              }}>
                {attendees.map(a => (
                  <div
                    key={a.id}
                    style={{
                      border: "1px solid #E5E5E5",
                      borderRadius: 8,
                      padding: "12px 14px",
                      background: "#fff",
                    }}
                  >
                    <div style={{ fontSize: 13, fontWeight: 700, color: "#1a1a1a", marginBottom: 4 }}>
                      {a.name}
                    </div>
                    <div style={{ fontSize: 11, color: "#bbb", marginBottom: 8 }}>
                      {new Date(a.signed_at).toLocaleString("ko-KR", {
                        month: "2-digit",
                        day: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                    {a.signature && (
                      <div style={{
                        border: "1px solid #F0F0F0",
                        borderRadius: 6,
                        background: "#FAFAFA",
                        overflow: "hidden",
                      }}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={a.signature}
                          alt={`${a.name} 서명`}
                          style={{ width: "100%", height: 60, objectFit: "contain" }}
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div>
                <p style={{ margin: "0 0 16px", fontSize: 13, color: "#999" }}>
                  아직 서명한 참석자가 없습니다.
                </p>
                <div style={{
                  border: "2px dashed #E5E5E5",
                  borderRadius: 8,
                  padding: "20px 24px",
                  textAlign: "center",
                }}>
                  <p style={{ margin: "0 0 8px", fontSize: 13, color: "#555" }}>
                    QR코드를 스캔하거나 아래 링크를 공유하세요
                  </p>
                  <p style={{ margin: 0, fontSize: 12, color: "#3B5BDB", fontFamily: "monospace" }}>
                    /tbm/{id}/sign
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </PrintLayout>
  );
}

export default async function TBMDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <AppLayoutServer>
      <Suspense fallback={<ContentSpinner />}>
        <TBMDetailContent id={id} />
      </Suspense>
    </AppLayoutServer>
  );
}
