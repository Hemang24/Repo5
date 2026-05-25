import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(req: NextRequest) {
  try {
    const { question } = await req.json();

    if (!question?.trim()) {
      return NextResponse.json({ error: "Question is required" }, { status: 400 });
    }

    const response = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 2000,
      messages: [
        {
          role: "user",
          content: `You are a decision analysis expert helping someone make an important decision.

The user's decision question is: "${question}"

Generate a structured analysis with:
1. 5-7 evaluation criteria most relevant to THIS specific decision (not generic ones)
2. 3-5 realistic options the person could realistically choose from

For each criterion, suggest a weight (0-10) based on typical importance for this type of decision.
For each option, provide initial rough ratings (0-10) for each criterion based on general knowledge.

Respond ONLY with valid JSON in this exact format:
{
  "criteria": [
    {
      "id": "c1",
      "name": "Short Name (3-5 words)",
      "description": "One sentence explaining why this matters for this specific decision",
      "emoji": "relevant emoji",
      "suggestedWeight": 7
    }
  ],
  "options": [
    {
      "id": "o1",
      "name": "Option Name",
      "description": "Brief description of what choosing this option entails",
      "initialRatings": {
        "c1": 7,
        "c2": 5
      }
    }
  ]
}

Make the criteria and options highly specific to "${question}". Be insightful and practical.`,
        },
      ],
    });

    const text = response.content[0].type === "text" ? response.content[0].text : "";
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("No JSON found in response");

    const data = JSON.parse(jsonMatch[0]);
    return NextResponse.json(data);
  } catch (error) {
    console.error("Analyze error:", error);
    return NextResponse.json({ error: "Analysis failed" }, { status: 500 });
  }
}
