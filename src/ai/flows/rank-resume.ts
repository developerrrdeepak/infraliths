'use server';

import { generateObject } from '@/ai/genkit';
import { z } from 'zod';
import { loadPrompt } from '../prompt-loader';

// --- Schema ---
const RankResumeOutputSchema = z.object({
  match_score: z.number().describe("0-100 score of how well the resume matches the role"),
  strengths: z.string().describe("Key strong points"),
  weaknesses: z.string().describe("Areas lacking"),
  keywords_missing: z.array(z.string()).describe("Important keywords from the industry missing in the resume"),
  final_recommendation: z.string().describe("Actionable advice"),
});

export type RankResumeOutput = z.infer<typeof RankResumeOutputSchema>;

export interface RankResumeInput {
  pdfBase64: string;
  jobRole: string;
  field: string;
}

export async function rankResumeFlow(input: RankResumeInput): Promise<RankResumeOutput> {
  const { pdfBase64, jobRole, field } = input;

  // 1. Load the text prompt
  const textPrompt = loadPrompt('torch-my-resume/ranker-prompt.md', {
    jobRole: jobRole,
    field: field,
  });

  // 2. Construct Multimodal Prompt
  // Our genkit.ts helper knows how to transform this 'media' object into the correct SDK format
  const promptParts = [
    { text: textPrompt },
    { media: { url: `data:application/pdf;base64,${pdfBase64}` } }
  ];

  try {
    // 3. Generate strict JSON
    const result = await generateObject<RankResumeOutput>(
      promptParts,
      'pro' // 'pro' model is required for PDF analysis + complex reasoning
    );

    return result;
  } catch (error) {
    console.error("Rank Resume Error:", error);
    throw new Error("Failed to rank resume. Ensure the PDF is valid.");
  }
}