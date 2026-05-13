import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { description, source } = await req.json() as {
    description: string;
    source: string;
  };

  if (!process.env.ANTHROPIC_API_KEY) {
    const whys = [
      `Why 1: ${source}에서 발생한 문제로, 작업 표준이 현장 실정에 맞지 않게 설정되어 있었다.`,
      "Why 2: 작업 표준 개정 절차가 없어 변경된 공정 조건이 문서에 반영되지 않았다.",
      "Why 3: 문서 관리 책임자가 지정되어 있지 않아 주기적인 검토가 이루어지지 않았다.",
      "Why 4: 문서 관리 시스템(DMS)이 부재하여 최신 버전 관리가 수동으로만 이루어졌다.",
      "Why 5: 문서화된 품질경영시스템 절차가 현장 교육 없이 배포만 된 상태였다.",
    ];
    return NextResponse.json({ whys });
  }

  const prompt = `당신은 품질 관리 전문가입니다. 다음 CAPA 문제에 대해 5-Why 근본원인 분석을 수행해주세요.

발생원: ${source}
문제 설명: ${description}

5-Why 분석 결과를 다음 형식의 JSON 배열로만 반환하세요 (배열 외 텍스트 없이):
["Why1 답변", "Why2 답변", "Why3 답변", "Why4 답변", "Why5 답변"]

각 답변은 한 문장으로 간결하게 작성하고, Why가 연쇄적으로 이어지도록 작성하세요.`;

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
  let whys: string[] = [];
  try {
    whys = match ? (JSON.parse(match[0]) as string[]) : [];
  } catch {
    whys = [];
  }

  return NextResponse.json({ whys });
}
