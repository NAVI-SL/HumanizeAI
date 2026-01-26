'use server';

import { analyzeTextForAIContent } from '@/ai/flows/analyze-text-for-ai-content';
import { rewriteTextToHumanize } from '@/ai/flows/rewrite-text-to-humanize';
import { z } from 'zod';

const textSchema = z.string().min(50, { message: 'Please enter at least 50 characters.' });

export async function handleAnalyzeText(text: string) {
  try {
    const validatedText = textSchema.parse(text);
    const result = await analyzeTextForAIContent(validatedText);
    return { success: true, data: result };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors[0].message };
    }
    console.error('Analysis error:', error);
    return { success: false, error: 'An unexpected error occurred during analysis.' };
  }
}

export async function handleRewriteText(text: string) {
  try {
    const validatedText = textSchema.parse(text);
    const result = await rewriteTextToHumanize({ text: validatedText });
    return { success: true, data: result };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors[0].message };
    }
    console.error('Rewrite error:', error);
    return { success: false, error: 'An unexpected error occurred while humanizing text.' };
  }
}
