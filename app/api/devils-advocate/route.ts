import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(req: NextRequest) {
  try {
    const { question, winnerOption, winnerScore, allOptions, criteria } = await req.json();

    const response = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 2000,
      messages: [
        {
          role: "user",
          content: `You are a sharp, intellectually honest devil's advocate.

The user is deciding: "${question}"

Based on their weighted scoring, the top choice is: "${winnerOption.name}" (score: ${winnerScore}/10)

Other options considered: ${allOptions.map((o: { name: string }) => o.name).join(", ")}

Criteria used (with weights):
${criteria.map((c: { name: string; weight: number }) => `- ${c.name} (weight: ${c.weight}/10)`).join("\n")}

Your job: Make 4 compelling, specific arguments AGAINST choosing "${winnerOption.name}".
These should be genuine concerns, blind spots, or risks — not strawmen.
Tailor each argument specifically to THIS decision context, not generic cautions.

Be direct, incisive, and intellectually honest. The goal is to pressure-test their choice.

Respond ONLY with valid JSON:
{
  "arguments": [
    {
      "id": "a1",
      "title": "Short punchy title (4-6 words)",
      "argument": "2-3 sentences making this specific argument compellingly against ${winnerOption.name}"
    }
  ]
}`,
        },
      ],
    });

    const text = response.content[0].type === "text" ? response.content[0].text : "";
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("No JSON found in response");

    return NextResponse.json(JSON.parse(jsonMatch[0]));
  } catch (error) {
    console.error("Devil's advocate error:", error);
    return NextResponse.json({ error: "Analysis failed" }, { status: 500 });
  }
}
