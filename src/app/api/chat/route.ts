import { NextResponse } from "next/server";
import { z } from "zod";
import { answerFromDocument } from "@/lib/openai-chat";
import { getDocumentSession } from "@/lib/session-store";

export const runtime = "nodejs";

const bodySchema = z.object({
  sessionId: z.string().uuid(),
  question: z.string().min(1).max(4000),
});

export async function POST(request: Request) {
  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid sessionId or question." },
      { status: 400 }
    );
  }

  const { sessionId, question } = parsed.data;
  const session = getDocumentSession(sessionId);
  if (!session) {
    return NextResponse.json(
      { error: "Session expired or not found. Upload the document again.", code: "SESSION_NOT_FOUND" },
      { status: 404 }
    );
  }

  try {
    const answer = await answerFromDocument(
      session.text,
      question,
      session.preferredLanguage
    );
    return NextResponse.json({ answer });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Chat failed.";
    return NextResponse.json({ error: message, code: "CHAT_FAILED" }, { status: 502 });
  }
}
