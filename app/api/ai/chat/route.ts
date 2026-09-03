import { GoogleGenerativeAI } from "@google/generative-ai";
import { z } from "zod";

export const runtime = "nodejs";

const RequestSchema = z.object({
  message: z.string().min(1, "Message is required").max(4000, "Message too long"),
});

const ResponseSchema = z.object({
  reply: z.string().min(1),
});

export async function POST(req: Request) {
  try {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      return Response.json(
        { error: "Server missing GEMINI_API_KEY. Add it in .env.local and Vercel env." },
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

    const genAI = new GoogleGenerativeAI(key);
    const model = genAI.getGenerativeModel({ model: "gemini-flash-lite-latest" });

    const prompt = `
You are "AI Study Buddy", an English-only study coach.
Answer the user's message helpfully and concisely.
Prefer step-by-step guidance and short bullet points when useful.
If the user shares messy notes, suggest using the Notes page to extract Summary/Decisions/Action Items.

User message:
${parsed.data.message}
`.trim();

    // Basic timeout protection (prevents long hangs)
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 20000);

    let rawText = "";
    try {
      const result = await model.generateContent(prompt, { signal: controller.signal } as any);
      rawText = result.response.text().trim();
    } finally {
      clearTimeout(timeout);
    }

    const validated = ResponseSchema.safeParse({ reply: rawText });
    if (!validated.success) {
      return Response.json(
        { error: "AI output validation failed", details: validated.error.flatten() },
        { status: 502 }
      );
    }

    return Response.json({ data: validated.data });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unexpected server error";
    // Keep errors safe for users
    return Response.json(
      { error: "AI request failed. Please try again.", details: message },
      { status: 500 }
    );
  }
}