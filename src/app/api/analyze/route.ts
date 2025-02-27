import { OpenAI } from "openai";
import { NextResponse } from "next/server";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const SYSTEM_PROMPT = `You are an expert in Apple's App Store Review Guidelines. Your task is to analyze app ideas and identify potential violations of the guidelines. For each app idea, you should:

1. Analyze the idea against all sections of the App Store Review Guidelines
2. Identify any potential violations
3. For each violation:
   - Cite the specific guideline section
   - Explain why it might be violated
   - Provide a probability (0-1) of this being a real issue

Return the analysis in this exact JSON format:
{
  "violations": [
    {
      "guideline": "string (guideline section and title)",
      "explanation": "string (detailed explanation)",
      "probability": number (0-1)
    }
  ],
  "isCompliant": boolean (true if no high-probability violations)
}

Only include violations with probability > 0.3. Sort violations by probability in descending order.`;

export async function POST(req: Request) {
  try {
    const { appIdea } = await req.json();

    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: appIdea },
      ],
      temperature: 0.7,
      response_format: { type: "json_object" },
    });

    const result = JSON.parse(completion.choices[0].message.content || "{}");

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error analyzing app idea:", error);
    return NextResponse.json(
      { error: "Failed to analyze app idea" },
      { status: 500 }
    );
  }
}
