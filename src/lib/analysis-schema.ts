import { z } from "zod";
import { FIXED_DISCLAIMER } from "./constants";

export const severitySchema = z.enum(["low", "medium", "high"]);

export const riskHighlightSchema = z.object({
  severity: severitySchema,
  title: z.string(),
  detail: z.string(),
  documentReference: z
    .string()
    .transform((s) => (s.trim() === "" ? undefined : s)),
});

export const keyClausesSchema = z.object({
  payment: z.array(z.string()).default([]),
  termination: z.array(z.string()).default([]),
  penalties: z.array(z.string()).default([]),
  other: z.array(z.string()).default([]),
});

export const analysisResultSchema = z.object({
  summary: z.string(),
  keyClauses: keyClausesSchema,
  riskHighlights: z.array(riskHighlightSchema),
  disclaimer: z.string(),
});

export type AnalysisResult = z.infer<typeof analysisResultSchema>;

/**
 * JSON Schema for OpenAI structured outputs (strict).
 * Mirrors analysisResultSchema; optional fields use empty string sent by the model.
 */
export const analysisOpenAiJsonSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    summary: { type: "string", description: "Plain-language summary for a non-lawyer." },
    keyClauses: {
      type: "object",
      additionalProperties: false,
      properties: {
        payment: { type: "array", items: { type: "string" } },
        termination: { type: "array", items: { type: "string" } },
        penalties: { type: "array", items: { type: "string" } },
        other: { type: "array", items: { type: "string" } },
      },
      required: ["payment", "termination", "penalties", "other"],
    },
    riskHighlights: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          severity: { type: "string", enum: ["low", "medium", "high"] },
          title: { type: "string" },
          detail: { type: "string" },
          documentReference: {
            type: "string",
            description: "Quote or section reference from the document, or empty string if none.",
          },
        },
        required: ["severity", "title", "detail", "documentReference"],
      },
    },
    disclaimer: {
      type: "string",
      description:
        "Legal disclaimer: exact English string for en-US/en-GB outputs; faithful translation for other languages as instructed in the system message.",
    },
  },
  required: ["summary", "keyClauses", "riskHighlights", "disclaimer"],
} as const;

export function normalizeAnalysis(
  parsed: AnalysisResult,
  outputLanguageCode: string
): AnalysisResult {
  const englishOut = outputLanguageCode === "en-US" || outputLanguageCode === "en-GB";
  const disclaimer = englishOut
    ? FIXED_DISCLAIMER
    : (parsed.disclaimer?.trim() || FIXED_DISCLAIMER);
  return {
    ...parsed,
    disclaimer,
  };
}
