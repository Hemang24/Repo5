import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(req: NextRequest) {
  try {
    const { question, winnerOption, criteria, devilArguments, reactions } = await req.json();

    const agreedArgs = devilArguments
      .filter((_: unknown, i: number) => reactions[i] === "agree")
      .map((a: { title: string }) => a.title);

    const disagreedArgs = devilArguments
      .filter((_: unknown, i: number) => reactions[i] === "disagree")
      .map((a: { title: string }) => a.title);

    const response = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 1500,
      messages: [
        {
          role: "user",
          content: `You are an expert advisor helping someone deeply understand their decision.

Decision: "${question}"
Leading option: "${winnerOption}"
Top criteria (by weight): ${criteria.slice(0, 3).map((c: { name: string }) => c.name).join(", ")}

When presented with counter-arguments, the user:
- Agreed with concerns about: ${agreedArgs.length > 0 ? agreedArgs.join(", ") : "none"}
- Pushed back on: ${disagreedArgs.length > 0 ? disagreedArgs.join(", ") : "none"}

Generate 4-5 highly personalized follow-up questions that:
1. Probe the areas they agreed with (if any) — they have real doubts there
2. Explore WHY they pushed back on certain arguments — understand their values
3. Uncover information we don't yet have that could change the analysis
4. Help them articulate what they actually want (not just what scores highest)

Make each question specific, not generic. Reference their actual decision context.

Respond ONLY with valid JSON:
{
  "questions": [
    {
      "id": "q1",
      "question": "Your specific question?",
      "context": "One sentence: why this question matters for their decision"
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
    console.error("Followup error:", error);
    return NextResponse.json({ error: "Analysis failed" }, { status: 500 });
  }
}
