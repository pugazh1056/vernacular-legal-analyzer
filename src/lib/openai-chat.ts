import OpenAI from "openai";
import { getLanguageOptionLabel } from "./profile-preferences";

function getClient(): OpenAI {
  const key = process.env.OPENAI_API_KEY;
  if (!key) {
    throw new Error("OPENAI_API_KEY is not configured.");
  }
  return new OpenAI({ apiKey: key });
}

function getModel(): string {
  return process.env.OPENAI_MODEL?.trim() || "gpt-4o-mini";
}

export async function answerFromDocument(
  documentText: string,
  question: string,
  outputLanguageCode: string
): Promise<string> {
  const client = getClient();
  const model = getModel();
  const label = getLanguageOptionLabel(outputLanguageCode);

  const CHAT_SYSTEM = `You answer questions using ONLY the document text provided in the user message (inside the marked section).
If the answer is not supported by the document, say you cannot find that in the document and avoid guessing.
The user may write their question in ${label} or in another language; always write your entire answer in ${label}.
Keep answers concise. This is not legal advice.`;

  const userBlock = `---BEGIN DOCUMENT---\n${documentText}\n---END DOCUMENT---\n\nQuestion: ${question}`;

  const response = await client.chat.completions.create({
    model,
    messages: [
      { role: "system", content: CHAT_SYSTEM },
      { role: "user", content: userBlock },
    ],
    max_tokens: 1024,
  });

  const answer = response.choices[0]?.message?.content?.trim();
  if (!answer) {
    throw new Error("No answer returned from the model.");
  }
  return answer;
}
