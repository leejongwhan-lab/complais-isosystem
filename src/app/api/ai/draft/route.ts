import { NextRequest, NextResponse } from "next/server";

const DOC_TYPE_NAMES: Record<string, string> = {
  M: "매뉴얼 (최상위 방침 문서)",
  P: "프로세스 (업무 절차)",
  R: "지침서 (세부 작업 지침)",
  F: "서식 (양식·기록지)",
};

const LAYER_NAMES: Record<string, string> = {
  C: "공통 (Common)",
  I: "특화 (Industry)",
  E: "환경안전 (EHS)",
};

export async function POST(req: NextRequest) {
  const { docType, sectionKey, title, isoClause, layer } = await req.json() as {
    docType: string;
    sectionKey: string;
    title: string;
    isoClause?: string;
    layer: string;
  };

  if (!process.env.ANTHROPIC_API_KEY) {
    const clause = isoClause || "해당 조항";
    const content = `[AI 초안 - 테스트 모드]\n\n본 섹션은 ISO ${clause} 요구사항에 따라 작성되었습니다. OOO(주)는 「${sectionKey}」에 관한 절차를 수립하고 유지합니다.\n\n문서 유형: ${DOC_TYPE_NAMES[docType] ?? docType} / 레이어: ${LAYER_NAMES[layer] ?? layer} / 문서 제목: ${title}\n\n본 초안은 ANTHROPIC_API_KEY 미설정 시 반환되는 테스트 텍스트입니다. 실제 운영 환경에서는 Claude AI가 해당 ISO 조항의 요구사항을 분석하여 실무에 적합한 내용을 자동 생성합니다.`;
    return NextResponse.json({ content });
  }

  const prompt = `당신은 ISO 인증 컨설턴트입니다. 아래 정보를 바탕으로 문서 섹션의 초안을 한국어로 작성해주세요.

문서 제목: ${title}
문서 유형: ${DOC_TYPE_NAMES[docType] ?? docType}
레이어: ${LAYER_NAMES[layer] ?? layer}
관련 ISO 조항: ${isoClause || "미지정"}
섹션 키: ${sectionKey}

실무적이고 구체적인 내용을 2~4 문단으로 작성해주세요. 마크다운 없이 순수 텍스트로 작성하세요.`;

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
  const content = data.content?.[0]?.text ?? "";

  return NextResponse.json({ content });
}
