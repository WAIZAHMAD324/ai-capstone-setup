import { GoogleGenerativeAI } from "@google/generative-ai";
import { z } from "zod";

export const runtime = "nodejs";

const RequestSchema = z.object({
  material: z.string().min(40, "Study material is too short").max(20000, "Study material is too long"),
  numQuestions: z.number().int().min(3).max(10).default(5),
  difficulty: z.enum(["easy", "medium", "hard"]).default("medium"),
});

const QuizSchema = z.object({
  title: z.string().min(1),
  questions: z
    .array(
      z.object({
        question: z.string().min(1),
        options: z.array(z.string().min(1)).length(4),
        correctIndex: z.number().int().min(0).max(3),
        explanation: z.string().min(1),
      })
    )
    .min(3)
    .max(10),
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

    const { material, numQuestions, difficulty } = parsed.data;

    const genAI = new GoogleGenerativeAI(key);
    const model = genAI.getGenerativeModel({ model: "gemini-flash-lite-latest" });

    const prompt = `
You are an expert quiz generator.
Create a multiple-choice quiz from the user's study material.

Rules:
- Output MUST be ONLY valid JSON (no markdown, no code fences).
- Exactly ${numQuestions} questions.
- Each question has exactly 4 options.
- correctIndex must be 0..3.
- Provide a short explanation for why the correct option is correct.
- Difficulty: ${difficulty}.
- Avoid trick questions; keep wording clear and student-friendly.

Return JSON with this exact shape:
{
  "title": "string",
  "questions": [
    {
      "question": "string",
      "options": ["string","string","string","string"],
      "correctIndex": 0,
      "explanation": "string"
    }
  ]
}

Study material:
${material}
`.trim();

    // Timeout protection (prevents long hangs)
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 25000);

    let raw = "";
    try {
      const result = await model.generateContent(prompt, { signal: controller.signal } as any);
      raw = result.response.text().trim();
    } finally {
      clearTimeout(timeout);
    }

    // Remove fences if model adds them
    if (raw.startsWith("```")) {
      raw = raw.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "");
    }

    let json: unknown;
    try {
      json = JSON.parse(raw);
    } catch {
      return Response.json(
        { error: "AI returned invalid JSON", raw: raw.slice(0, 500) },
        { status: 502 }
      );
    }

    const validated = QuizSchema.safeParse(json);
    if (!validated.success) {
      return Response.json(
        { error: "AI output validation failed", details: validated.error.flatten() },
        { status: 502 }
      );
    }

    return Response.json({ data: validated.data });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unexpected server error";
    return Response.json(
      { error: "Quiz generation failed. Please try again.", details: message },
      { status: 500 }
    );
  }
}