import Anthropic from "@anthropic-ai/sdk";
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

const tool: Anthropic.Tool = {
  name: "extract_meeting_items",
  description:
    "Extract summary, decisions, and action items from meeting/study notes.",
  input_schema: {
    type: "object",
    properties: {
      summary: { type: "string" },
      decisions: { type: "array", items: { type: "string" } },
      actionItems: {
        type: "array",
        items: {
          type: "object",
          properties: {
            title: { type: "string" },
            owner: { type: "string" },
            dueDate: {
              type: "string",
              description: "Use YYYY-MM-DD if you can, otherwise empty string.",
            },
            priority: { type: "string", enum: ["low", "medium", "high"] },
            status: { type: "string", enum: ["open", "done"] },
          },
          required: ["title", "priority", "status"],
        },
      },
    },
    required: ["summary", "decisions", "actionItems"],
  },
};

export async function POST(req: Request) {
  try {
    if (!process.env.ANTHROPIC_API_KEY) {
      return Response.json(
        { error: "Server missing ANTHROPIC_API_KEY" },
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

    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
    const model = process.env.ANTHROPIC_MODEL || "claude-3-5-sonnet-20240620";

    const msg = await client.messages.create({
      model,
      max_tokens: 800,
      temperature: 0.2,
      system:
        "You extract structured information from notes. Be concise and accurate. If something is unknown, use empty string or omit.",
      messages: [
        {
          role: "user",
          content:
            "Extract summary, decisions, and action items from these notes:\n\n" +
            parsed.data.text,
        },
      ],
      tools: [tool],
      tool_choice: { type: "tool", name: tool.name },
    });

    const toolUse = msg.content.find((c) => c.type === "tool_use");
    if (!toolUse || toolUse.type !== "tool_use") {
      return Response.json(
        { error: "AI did not return structured tool output" },
        { status: 502 }
      );
    }

    const result = ResultSchema.safeParse(toolUse.input);
    if (!result.success) {
      return Response.json(
        { error: "AI output validation failed", details: result.error.flatten() },
        { status: 502 }
      );
    }

    return Response.json({ data: result.data });
  } catch (err) {
    return Response.json(
      { error: "Unexpected server error" },
      { status: 500 }
    );
  }
}