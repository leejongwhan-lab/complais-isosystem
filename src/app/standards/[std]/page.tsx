import AppLayout from "@/components/layout/AppLayoutServer";
import { supabase } from "@/lib/supabase";
import { getCompany } from "@/lib/company";
import Link from "next/link";
import { STANDARD_REQUIREMENTS, STANDARD_INFO } from "@/lib/standardRequirements";

async function getTableCount(tableName: string): Promise<number> {
  try {
    const { count } = await supabase
      .from(tableName as Parameters<typeof supabase.from>[0])
      .select("*", { count: "exact", head: true });
    return count ?? 0;
  } catch {
    return 0;
  }
}

export default async function StandardsPage({
  params,
  searchParams,
}: {
  params: Promise<{ std: string }>;
  searchParams: Promise<{ tab?: string }>;
}) {
  const [{ std }, { tab: tabParam }] = await Promise.all([params, searchParams]);
  const activeTab = (tabParam === "retain" ? "retain" : "maintain") as "maintain" | "retain";

  const stdInfo = STANDARD_INFO[std];
  const records = STANDARD_REQUIREMENTS[std];

  if (!stdInfo || !records) {
    return (
      <AppLayout>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "calc(100vh - 52px)", flexDirection: "column", gap: 12 }}>
          <p style={{ fontSize: 16, fontWeight: 600, color: "#E03131" }}>알 수 없는 표준: {std}</p>
          <Link href="/" style={{ fontSize: 13, color: "#3B5BDB" }}>대시보드로 돌아가기</Link>
        </div>
      </AppLayout>
    );
  }

  // 각 레코드의 테이블 카운트 집계
  const uniqueTables = [...new Set(records.map(r => r.table).filter((t): t is string => !!t))];
  const countResults = await Promise.all(uniqueTables.map(t => getTableCount(t)));
  const tableCounts: Record<string, number> = {};
  uniqueTables.forEach((t, i) => { tableCounts[t] = countResults[i]; });

  function getCount(rec: (typeof records)[0]): number {
    if (!rec.table) return -1;
    return tableCounts[rec.table] ?? 0;
  }

  const maintainItems = records.filter(r => r.type === "maintain");
  const retainItems   = records.filter(r => r.type === "retain");

  const registeredCount = records.filter(r => {
    const c = getCount(r);
    return c > 0;
  }).length;
  const totalCount = records.length;
  const pct = totalCount > 0 ? Math.round((registeredCount / totalCount) * 100) : 0;

  const company = await getCompany();

  const tabItems = activeTab === "maintain" ? maintainItems : retainItems;

  return (
    <AppLayout>
      <div style={{ padding: "28px 32px", maxWidth: 920 }}>
        {/* 헤더 */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
            <span style={{
              padding: "3px 10px", borderRadius: 6, fontSize: 13, fontWeight: 700,
              color: stdInfo.color, background: stdInfo.bg,
            }}>
              {stdInfo.name}
            </span>
            {company?.company_name && (
              <span style={{ fontSize: 12, color: "#aaa" }}>{company.company_name}</span>
            )}
          </div>
          <h1 style={{ margin: "0 0 6px", fontSize: 20, fontWeight: 700, color: "#1a1a1a" }}>
            {stdInfo.name} 필수 문서·기록 현황
          </h1>

          {/* 요약 뱃지 */}
          <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
            <span style={{ fontSize: 12, fontWeight: 600, padding: "3px 10px", borderRadius: 20, background: "#F5F5F5", color: "#555" }}>
              전체 {totalCount}개
            </span>
            <span style={{ fontSize: 12, fontWeight: 600, padding: "3px 10px", borderRadius: 20, background: "#EBFBEE", color: "#2F9E44" }}>
              기록있음 {registeredCount}개
            </span>
            <span style={{ fontSize: 12, fontWeight: 600, padding: "3px 10px", borderRadius: 20, background: "#FFF0F0", color: "#E03131" }}>
              미등록 {totalCount - registeredCount}개
            </span>
          </div>

          {/* 진행률 바 */}
          <div style={{ height: 6, background: "#F0F0F0", borderRadius: 3, maxWidth: 400 }}>
            <div style={{
              height: "100%", borderRadius: 3, background: stdInfo.color,
              width: `${pct}%`, transition: "width 0.5s",
            }} />
          </div>
          <p style={{ margin: "4px 0 0", fontSize: 11, color: "#999" }}>
            {registeredCount}/{totalCount} 항목 기록됨 ({pct}%)
          </p>
        </div>

        {/* 탭 */}
        <div style={{ display: "flex", gap: 0, borderBottom: "1px solid #E5E5E5", marginBottom: 20 }}>
          {([
            { key: "maintain", label: `유지해야 할 문서 (Maintain) ${maintainItems.length}` },
            { key: "retain",   label: `보유해야 할 기록 (Retain) ${retainItems.length}` },
          ] as const).map(t => (
            <Link
              key={t.key}
              href={`/standards/${std}?tab=${t.key}`}
              style={{
                padding: "10px 18px", fontSize: 13,
                fontWeight: activeTab === t.key ? 600 : 400,
                color: activeTab === t.key ? stdInfo.color : "#888",
                borderBottom: activeTab === t.key ? `2px solid ${stdInfo.color}` : "2px solid transparent",
                textDecoration: "none", marginBottom: -1,
              }}
            >
              {t.label}
            </Link>
          ))}
        </div>

        {/* 테이블 */}
        <div style={{ border: "1px solid #E5E5E5", borderRadius: 8, overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead style={{ background: "#FAFAFA", borderBottom: "1px solid #E5E5E5" }}>
              <tr>
                {["조항", "필수 문서·기록명", "보존기간", "현황", "관련서식", "이동"].map((h, i) => (
                  <th key={i} style={{ padding: "9px 14px", textAlign: "left", fontSize: 11, fontWeight: 600, color: "#999", whiteSpace: "nowrap" }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tabItems.map((rec, idx) => {
                const count = getCount(rec);
                const hasData = count > 0;
                const isManual = count === -1;

                return (
                  <tr key={idx} style={{ borderTop: idx > 0 ? "1px solid #F0F0F0" : "none" }}>
                    {/* 조항 */}
                    <td style={{ padding: "11px 14px", whiteSpace: "nowrap" }}>
                      <span style={{
                        fontSize: 10, fontWeight: 700, fontFamily: "monospace",
                        color: stdInfo.color, background: stdInfo.bg,
                        padding: "2px 6px", borderRadius: 4,
                      }}>
                        {rec.clause}
                      </span>
                    </td>

                    {/* 제목 */}
                    <td style={{ padding: "11px 14px", fontSize: 13, color: "#1a1a1a" }}>
                      {rec.title}
                    </td>

                    {/* 보존기간 */}
                    <td style={{ padding: "11px 14px", whiteSpace: "nowrap" }}>
                      <span style={{ fontSize: 11, fontWeight: 600, background: "#F5F5F5", color: "#777", padding: "2px 7px", borderRadius: 3 }}>
                        {rec.retention}
                      </span>
                    </td>

                    {/* 현황 */}
                    <td style={{ padding: "11px 14px", whiteSpace: "nowrap" }}>
                      {isManual ? (
                        <span style={{ fontSize: 11, fontWeight: 600, background: "#F5F5F5", color: "#999", padding: "3px 8px", borderRadius: 4 }}>
                          수동 확인
                        </span>
                      ) : hasData ? (
                        <span style={{ fontSize: 11, fontWeight: 700, background: "#EBFBEE", color: "#2F9E44", padding: "3px 8px", borderRadius: 4 }}>
                          ✓ {count}건 등록
                        </span>
                      ) : (
                        <span style={{ fontSize: 11, fontWeight: 700, background: "#FFF0F0", color: "#E03131", padding: "3px 8px", borderRadius: 4 }}>
                          미등록
                        </span>
                      )}
                    </td>

                    {/* 관련서식 */}
                    <td style={{ padding: "11px 14px" }}>
                      <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                        {(rec.formCodes ?? []).map(code => (
                          <Link
                            key={code}
                            href={`/forms/${code}/new`}
                            style={{
                              fontSize: 10, fontFamily: "monospace",
                              color: "#555", background: "#F5F5F5",
                              padding: "1px 5px", borderRadius: 3,
                              textDecoration: "none", whiteSpace: "nowrap",
                            }}
                          >
                            {code}
                          </Link>
                        ))}
                      </div>
                    </td>

                    {/* 이동 */}
                    <td style={{ padding: "11px 14px", whiteSpace: "nowrap" }}>
                      <Link
                        href={rec.link}
                        style={{
                          display: "inline-flex", alignItems: "center", gap: 4,
                          padding: "4px 10px", borderRadius: 5, fontSize: 12,
                          border: hasData || isManual
                            ? "1px solid #E5E5E5"
                            : `1px solid ${stdInfo.color}`,
                          background: hasData || isManual ? "#fff" : stdInfo.bg,
                          color: hasData || isManual ? "#666" : stdInfo.color,
                          textDecoration: "none", fontWeight: 500,
                        }}
                      >
                        {!hasData && !isManual ? "등록하기" : "확인하기"}
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* 하단 안내 */}
        <div style={{ marginTop: 20, padding: "14px 18px", borderRadius: 8, background: "#F8F9FA", border: "1px solid #E5E5E5" }}>
          <p style={{ margin: 0, fontSize: 12, color: "#777", lineHeight: 1.6 }}>
            심사관은 위 기록들을 요구합니다. <strong style={{ color: "#E03131" }}>미등록</strong> 항목을 우선적으로 완료하세요.
            수동 확인 항목은 해당 메뉴에서 직접 확인하거나 파일을 업로드하세요.
          </p>
        </div>
      </div>
    </AppLayout>
  );
}
