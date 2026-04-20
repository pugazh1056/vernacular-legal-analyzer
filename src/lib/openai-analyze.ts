import OpenAI from "openai";
import {
  analysisOpenAiJsonSchema,
  analysisResultSchema,
  normalizeAnalysis,
  type AnalysisResult,
} from "./analysis-schema";
import { FIXED_DISCLAIMER } from "./constants";
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

const SYSTEM_PROMPT_BASE = `You are a careful legal-document assistant. You receive the full text of a single document.
Respond with JSON only, matching the provided schema exactly.
Rules:
- Base every claim on the document; do not invent facts, parties, dates, or clauses.
- If a category has no relevant clauses, use an empty array for that list.
- Paraphrase or quote briefly from the document where helpful; when quoting, you may keep short quotes in the source language if needed, but your explanations must be in the requested output language.
- For riskHighlights, use severity that reflects potential impact described in the document (not moral judgment). Use only these severity strings: low, medium, high.
- The document may be written in any language (including Indian languages). Read and understand it completely, then produce the analysis in the output language specified below.`;

function languageBlock(outputLanguageCode: string): string {
  const label = getLanguageOptionLabel(outputLanguageCode);
  const englishOut = outputLanguageCode === "en-US" || outputLanguageCode === "en-GB";
  const disclaimerRule = englishOut
    ? `Set the disclaimer field to exactly this string and nothing else: ${JSON.stringify(FIXED_DISCLAIMER)}`
    : `Set the disclaimer field to an accurate translation of the following text into ${label} (preserve legal meaning): ${JSON.stringify(FIXED_DISCLAIMER)}`;

  return `
Output language: ${label} (${outputLanguageCode})
- Write summary, all key clause bullet strings, risk highlight titles, risk highlight details, and documentReference notes in ${label}.
- JSON property names and severity enum values stay in English as required by the schema.

${disclaimerRule}`;
}

export async function analyzeDocument(
  text: string,
  outputLanguageCode: string
): Promise<AnalysisResult> {
  const client = getClient();
  const model = getModel();

  const systemPrompt = `${SYSTEM_PROMPT_BASE}\n${languageBlock(outputLanguageCode)}`;

  const userContent = `Document text:\n\n${text}`;

  const response = await client.chat.completions.create({
    model,
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userContent },
    ],
    response_format: {
      type: "json_schema",
      json_schema: {
        name: "document_analysis",
        strict: true,
        schema: analysisOpenAiJsonSchema as unknown as Record<string, unknown>,
      },
    },
  });

  const raw = response.choices[0]?.message?.content;
  if (!raw) {
    throw new Error("No analysis returned from the model.");
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new Error("Model returned invalid JSON.");
  }

  const result = analysisResultSchema.safeParse(parsed);
  if (!result.success) {
    throw new Error("Analysis did not match the expected schema.");
  }

  return normalizeAnalysis(result.data, outputLanguageCode);
}
