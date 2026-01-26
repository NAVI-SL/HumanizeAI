'use server';
/**
 * @fileOverview Rewrites text to sound more human.
 *
 * - rewriteTextToHumanize - A function that rewrites text to sound more human.
 * - RewriteTextToHumanizeInput - The input type for the rewriteTextToHumanize function.
 * - RewriteTextToHumanizeOutput - The return type for the rewriteTextToHumanize function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RewriteTextToHumanizeInputSchema = z.object({
  text: z.string().describe('The text to rewrite to sound more human.'),
});
export type RewriteTextToHumanizeInput = z.infer<typeof RewriteTextToHumanizeInputSchema>;

const RewriteTextToHumanizeOutputSchema = z.object({
  rewrittenText: z.string().describe('The rewritten text that sounds more human.'),
});
export type RewriteTextToHumanizeOutput = z.infer<typeof RewriteTextToHumanizeOutputSchema>;

export async function rewriteTextToHumanize(input: RewriteTextToHumanizeInput): Promise<RewriteTextToHumanizeOutput> {
  return rewriteTextToHumanizeFlow(input);
}

const rewriteTextToHumanizePrompt = ai.definePrompt({
  name: 'rewriteTextToHumanizePrompt',
  input: {schema: RewriteTextToHumanizeInputSchema},
  output: {schema: RewriteTextToHumanizeOutputSchema},
  prompt: `Rewrite the following text to sound more human:\n\n{{text}}`,
});

const rewriteTextToHumanizeFlow = ai.defineFlow(
  {
    name: 'rewriteTextToHumanizeFlow',
    inputSchema: RewriteTextToHumanizeInputSchema,
    outputSchema: RewriteTextToHumanizeOutputSchema,
  },
  async input => {
    const {output} = await rewriteTextToHumanizePrompt(input);
    return output!;
  }
);
