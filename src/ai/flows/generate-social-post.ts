'use server';
/**
 * @fileOverview Generates a social media post summarizing the changes in a Google Document.
 *
 * - generateSocialPost - A function that generates a social media post.
 * - GenerateSocialPostInput - The input type for the generateSocialPost function.
 * - GenerateSocialPostOutput - The return type for the generateSocialPost function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';
import {GoogleDocumentChange} from '@/services/google-docs';

const GenerateSocialPostInputSchema = z.object({
  documentId: z.string().describe('The ID of the Google Document.'),
  changes: z.array(
    z.object({
      wordsAdded: z.number().describe('The number of words added.'),
      wordsRemoved: z.number().describe('The number of words removed.'),
      contentAdded: z.string().describe('The content added.'),
      contentRemoved: z.string().describe('The content removed.'),
    })
  ).describe('The changes in the Google Document.'),
});

export type GenerateSocialPostInput = z.infer<typeof GenerateSocialPostInputSchema>;

const GenerateSocialPostOutputSchema = z.object({
  postContent: z.string().describe('The content of the social media post.'),
});

export type GenerateSocialPostOutput = z.infer<typeof GenerateSocialPostOutputSchema>;

export async function generateSocialPost(input: GenerateSocialPostInput): Promise<GenerateSocialPostOutput> {
  return generateSocialPostFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateSocialPostPrompt',
  input: {
    schema: z.object({
      documentId: z.string().describe('The ID of the Google Document.'),
      changes: z.array(
        z.object({
          wordsAdded: z.number().describe('The number of words added.'),
          wordsRemoved: z.number().describe('The number of words removed.'),
          contentAdded: z.string().describe('The content added.'),
          contentRemoved: z.string().describe('The content removed.'),
        })
      ).describe('The changes in the Google Document.'),
    }),
  },
  output: {
    schema: z.object({
      postContent: z.string().describe('The content of the social media post.'),
    }),
  },
  prompt: `You are an AI assistant that generates engaging social media posts for fiction authors about their writing progress.

Given the changes in a Google Document, create a social media post that highlights the author's progress, including word count changes and content updates. Focus on making the post exciting and shareable for their audience.

Changes:
{{#each changes}}
- Words Added: {{wordsAdded}}
  Words Removed: {{wordsRemoved}}
  Content Added: {{contentAdded}}
  Content Removed: {{contentRemoved}}
{{/each}}

Compose a social media post (max 280 characters) summarizing these changes.`,
});

const generateSocialPostFlow = ai.defineFlow<
  typeof GenerateSocialPostInputSchema,
  typeof GenerateSocialPostOutputSchema
>(
  {
    name: 'generateSocialPostFlow',
    inputSchema: GenerateSocialPostInputSchema,
    outputSchema: GenerateSocialPostOutputSchema,
  },
  async input => {
    const {output} = await prompt({
      documentId: input.documentId,
      changes: input.changes,
    });
    return output!;
  }
);
