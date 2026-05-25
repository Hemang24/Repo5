import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(req: NextRequest) {
  try {
    const {
      question,
      results,
      criteria,
      devilArguments,
      reactions,
      followUpQA,
    } = await req.json();

    const winner = results[0];
    const followUpText = followUpQA
      .map((qa: { question: string; answer: string }) => `Q: ${qa.question}\nA: ${qa.answer}`)
      .join("\n\n");

    const devilContext = devilArguments
      .map(
        (a: { title: string; argument: string }, i: number) =>
          `- "${a.title}": ${reactions[i] === "agree" ? "User agreed" : reactions[i] === "disagree" ? "User disagreed" : "User neutral"}`
      )
      .join("\n");

    const response = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 3000,
      messages: [
        {
          role: "user",
          content: `You are a wise, empathetic advisor writing a personalized decision report.

DECISION: "${question}"

WEIGHTED ANALYSIS RESULTS:
${results
  .map(
    (r: { optionName: string; totalScore: number; percentage: number }, i: number) =>
      `${i + 1}. ${r.optionName}: ${r.totalScore}/10 (${r.percentage}%)`
  )
  .join("\n")}

TOP CRITERIA (by importance):
${criteria
  .sort((a: { weight: number }, b: { weight: number }) => b.weight - a.weight)
  .slice(0, 4)
  .map((c: { name: string; weight: number }) => `- ${c.name} (weight: ${c.weight}/10)`)
  .join("\n")}

DEVIL'S ADVOCATE REACTIONS:
${devilContext}

FOLLOW-UP RESPONSES:
${followUpText}

Write a deeply personalized report. Use the user's own language and concerns from their answers.
Mirror their vocabulary and framing. Be specific to their situation — no generic advice.

The winner is "${winner.optionName}" with ${winner.percentage}% alignment.

Respond ONLY with valid JSON:
{
  "title": "A personalized report title that references their specific decision (not generic)",
  "executiveSummary": "3-4 sentences: what the data shows, written in their language",
  "keyInsights": [
    "Specific insight 1 drawing from their weights and answers",
    "Specific insight 2",
    "Specific insight 3",
    "Specific insight 4"
  ],
  "recommendation": "${winner.optionName}",
  "reasoning": "3-4 sentences: WHY the data points here, addressing their specific doubts from devil's advocate",
  "confidenceScore": 78,
  "alternativeConsiderations": "2-3 sentences: when the runner-up might actually be better, given what they said",
  "personalNote": "1-2 sentences: something empathetic and specific to what they revealed in their answers"
}

The confidenceScore (0-100) should reflect: how decisive the margin was, how consistent their devil's advocate reactions were, and how clear their follow-up answers were.`,
        },
      ],
    });

    const text = response.content[0].type === "text" ? response.content[0].text : "";
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("No JSON found in response");

    return NextResponse.json(JSON.parse(jsonMatch[0]));
  } catch (error) {
    console.error("Synthesize error:", error);
    return NextResponse.json({ error: "Synthesis failed" }, { status: 500 });
  }
}
