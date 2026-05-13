import { NextRequest, NextResponse } from "next/server";

type SectionInput = { title: string; content: string };

export async function POST(req: NextRequest) {
  const { title, isoClause, sections } = await req.json() as {
    title: string;
    isoClause?: string;
    sections: SectionInput[];
  };

  if (!process.env.ANTHROPIC_API_KEY) {
    const suggestions = [
      `ISO ${isoClause || "요구사항"} 조항 대비 적용 범위(Scope)가 명시되지 않았습니다. 문서 서두에 적용 부서 및 프로세스를 명확히 기술하세요.`,
      "책임과 권한(R&R) 항목에 담당자별 역할이 구체적으로 기술되어 있지 않습니다. RACI 매트릭스 형식으로 보완을 권장합니다.",
      "모니터링 및 측정 기준이 정량적 지표 없이 서술형으로만 작성되어 있습니다. KPI 또는 측정 주기를 추가하세요.",
    ];
    return NextResponse.json({ suggestions });
  }

  const sectionText = sections
    .map(s => `[${s.title}]\n${s.content || "(내용 없음)"}`)
    .join("\n\n");

  const prompt = `당신은 ISO 인증 컨설턴트입니다. 아래 문서를 검토하고 개선 제안을 JSON 배열로 반환해주세요.

문서 제목: ${title}
관련 ISO 조항: ${isoClause || "미지정"}

--- 문서 내용 ---
${sectionText}
--- 끝 ---

개선 제안을 다음 형식의 JSON 배열로만 반환하세요 (배열 외 텍스트 없이):
["제안1", "제안2", "제안3"]

5개 이내, 각 제안은 한두 문장으로 간결하게 작성하세요.`;

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "anthropic-version": "2023-06-01",
      "x-api-key": process.env.ANTHROPIC_API_KEY ?? "",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1024,
      messages: [{ role: "user", content: prompt }],
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    console.error("Anthropic API error:", text);
    return NextResponse.json({ error: "AI 호출 실패" }, { status: 500 });
  }

  const data = await res.json() as { content?: { text?: string }[] };
  const text = data.content?.[0]?.text ?? "[]";
  const match = text.match(/\[[\s\S]*\]/);
  let suggestions: string[] = [];
  try {
    suggestions = match ? (JSON.parse(match[0]) as string[]) : [];
  } catch {
    suggestions = [];
  }

  return NextResponse.json({ suggestions });
}
