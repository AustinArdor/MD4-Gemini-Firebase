'use server';
/**
 * @fileOverview Analyzes the version history of a Google Document to identify significant changes.
 *
 * - analyzeDocumentChanges - A function that analyzes document changes.
 * - AnalyzeDocumentChangesInput - The input type for the analyzeDocumentChanges function.
 * - AnalyzeDocumentChangesOutput - The return type for the analyzeDocumentChanges function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';
import {GoogleDocumentChange} from '@/services/google-docs';

const AnalyzeDocumentChangesInputSchema = z.object({
  documentId: z.string().describe('The ID of the Google Document to analyze.'),
  changes: z.array(
    z.object({
      wordsAdded: z.number().describe('The number of words added.'),
      wordsRemoved: z.number().describe('The number of words removed.'),
      contentAdded: z.string().describe('The content added.'),
      contentRemoved: z.string().describe('The content removed.'),
    })
  ).describe('The changes in the Google Document.'),
});
export type AnalyzeDocumentChangesInput = z.infer<
  typeof AnalyzeDocumentChangesInputSchema
>;

const AnalyzeDocumentChangesOutputSchema = z.object({
  summary: z.string().describe('A summary of the significant changes in the document.'),
});
export type AnalyzeDocumentChangesOutput = z.infer<
  typeof AnalyzeDocumentChangesOutputSchema
>;

export async function analyzeDocumentChanges(
  input: AnalyzeDocumentChangesInput
): Promise<AnalyzeDocumentChangesOutput> {
  return analyzeDocumentChangesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeDocumentChangesPrompt',
  input: {
    schema: z.object({
      documentId: z.string().describe('The ID of the Google Document to analyze.'),
      changes: z
        .array(
          z.object({
            wordsAdded: z.number().describe('The number of words added.'),
            wordsRemoved: z.number().describe('The number of words removed.'),
            contentAdded: z.string().describe('The content added.'),
            contentRemoved: z.string().describe('The content removed.'),
          })
        )
        .describe('The changes in the Google Document.'),
    }),
  },
  output: {
    schema: z.object({
      summary: z
        .string()
        .describe('A summary of the significant changes in the document.'),
    }),
  },
  prompt: `You are an AI assistant that analyzes the version history of Google Docs to identify significant changes made by the author.

Analyze the following Google Document changes and summarize the key updates, focusing on word count changes and content modifications:

Changes:
{{#each changes}}
- Words Added: {{wordsAdded}}
  Words Removed: {{wordsRemoved}}
  Content Added: {{contentAdded}}
  Content Removed: {{contentRemoved}}
{{/each}}

Summarize the above changes.`,
});

const analyzeDocumentChangesFlow = ai.defineFlow<
  typeof AnalyzeDocumentChangesInputSchema,
  typeof AnalyzeDocumentChangesOutputSchema
>(
  {
    name: 'analyzeDocumentChangesFlow',
    inputSchema: AnalyzeDocumentChangesInputSchema,
    outputSchema: AnalyzeDocumentChangesOutputSchema,
  },
  async input => {
    const {output} = await prompt({
      documentId: input.documentId,
      changes: input.changes,
    });
    return output!;
  }
);
