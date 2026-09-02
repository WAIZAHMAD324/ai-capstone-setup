import { GoogleGenerativeAI } from "@google/generative-ai";
import { z } from "zod";

export const runtime = "nodejs";

const RequestSchema = z.object({
  text: z.string().min(20, "Notes too short").max(20000, "Notes too long"),
});

const ResultSchema = z.object({
  summary: z.string().min(1),
  decisions: z.array(z.string()).default([]),
  actionItems: z
    .array(
      z.object({
        title: z.string().min(1),
        owner: z.string().optional().default(""),
        dueDate: z.string().optional().default(""),
        priority: z.enum(["low", "medium", "high"]).default("medium"),
        status: z.enum(["open", "done"]).default("open"),
      })
    )
    .default([]),
});

export async function POST(req: Request) {
  try {
    if (!process.env.GEMINI_API_KEY) {
      return Response.json(
        {
          error:
            "Server missing GEMINI_API_KEY. Add it in .env.local and Vercel env.",
        },
        { status: 500 }
      );
    }

    const body = await req.json();
    const parsed = RequestSchema.safeParse(body);
    if (!parsed.success) {
      return Response.json(
        { error: "Invalid request", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({
      model: "gemini-flash-lite-latest",
    });

    const prompt = `You extract structured information from study/meeting notes.
Return ONLY valid JSON (no markdown, no code fences) with this exact shape:
{
  "summary": "string",
  "decisions": ["string"],
  "actionItems": [
    {
      "title": "string",
      "owner": "string",
      "dueDate": "YYYY-MM-DD or empty string",
      "priority": "low" | "medium" | "high",
      "status": "open" | "done"
    }
  ]
}
Be concise and accurate. If something is unknown, use empty string.

Notes:
${parsed.data.text}`;

    const result = await model.generateContent(prompt);
    const response = result.response;
    let raw = response.text().trim();

    // Remove markdown fences if model adds them
    if (raw.startsWith("```")) {
      raw = raw.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "");
    }

    let json: unknown;
    try {
      json = JSON.parse(raw);
    } catch {
      return Response.json(
        { error: "AI returned invalid JSON", raw: raw.slice(0, 300) },
        { status: 502 }
      );
    }

    const validated = ResultSchema.safeParse(json);
    if (!validated.success) {
      return Response.json(
        {
          error: "AI output validation failed",
          details: validated.error.flatten(),
        },
        { status: 502 }
      );
    }

    return Response.json({ data: validated.data });
  } catch (err: unknown) {
    console.error("AI extract error:", err);
    const message =
      err instanceof Error ? err.message : "Unexpected server error";
    return Response.json({ error: message }, { status: 500 });
  }
}