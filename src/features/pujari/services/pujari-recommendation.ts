'use server';

/**
 * @fileOverview A pujari recommendation AI agent.
 *
 * - recommendPujari - A function that recommends Pujaris based on user preferences and similar user profiles.
 * - RecommendPujariInput - The input type for the recommendPujari function.
 * - RecommendPujariOutput - The return type for the recommendPujari function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RecommendPujariInputSchema = z.object({
  userPreferences: z
    .string()
    .describe('The preferences of the user for the kind of Pujari they want.'),
  similarUserProfiles: z
    .string()
    .describe('The profiles of other users with similar preferences.'),
});
export type RecommendPujariInput = z.infer<typeof RecommendPujariInputSchema>;

const RecommendPujariOutputSchema = z.object({
  pujariRecommendations: z
    .string()
    .describe('The list of recommended Pujaris based on the user preferences and similar user profiles.'),
});
export type RecommendPujariOutput = z.infer<typeof RecommendPujariOutputSchema>;

export async function recommendPujari(input: RecommendPujariInput): Promise<RecommendPujariOutput> {
  return recommendPujariFlow(input);
}

const prompt = ai.definePrompt({
  name: 'recommendPujariPrompt',
  input: {schema: RecommendPujariInputSchema},
  output: {schema: RecommendPujariOutputSchema},
  prompt: `You are an expert recommendation engine specializing in recommending Vaidika Pujaris.

You will use the user preferences and similar user profiles to recommend the best Pujaris for the user.

User Preferences: {{{userPreferences}}}
Similar User Profiles: {{{similarUserProfiles}}}

Based on the user preferences and similar user profiles, recommend the best Pujaris for the user.
`,
});

const recommendPujariFlow = ai.defineFlow(
  {
    name: 'recommendPujariFlow',
    inputSchema: RecommendPujariInputSchema,
    outputSchema: RecommendPujariOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
