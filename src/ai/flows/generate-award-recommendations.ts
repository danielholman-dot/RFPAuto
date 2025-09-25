// src/ai/flows/generate-award-recommendations.ts
'use server';

/**
 * @fileOverview Generates award recommendations based on proposal analysis and scoring.
 *
 * - generateAwardRecommendation - A function that generates award recommendations.
 * - GenerateAwardRecommendationInput - The input type for the generateAwardRecommendation function.
 * - GenerateAwardRecommendationOutput - The return type for the generateAwardRecommendation function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateAwardRecommendationInputSchema = z.object({
  proposalAnalysis: z
    .string()
    .describe('The analysis of the proposals against RFP requirements.'),
  scoring:
    z.string().describe('The scoring of the proposals based on defined criteria.'),
  projectPerformanceData: z.string().optional().describe('Project performance data for the contractors under consideration')
});

export type GenerateAwardRecommendationInput = z.infer<
  typeof GenerateAwardRecommendationInputSchema
>;

const GenerateAwardRecommendationOutputSchema = z.object({
  awardRecommendation: z
    .string()
    .describe('The AI-driven award recommendation based on the analysis and scoring.'),
  justification: z
    .string()
    .describe('The justification for the award recommendation.'),
  suggestedSrmUpdate: z
    .string()
    .optional()
    .describe('Recommended updates to the supplier relationship management (SRM) system based on project performance')
});

export type GenerateAwardRecommendationOutput = z.infer<
  typeof GenerateAwardRecommendationOutputSchema
>;

export async function generateAwardRecommendation(
  input: GenerateAwardRecommendationInput
): Promise<GenerateAwardRecommendationOutput> {
  return generateAwardRecommendationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateAwardRecommendationPrompt',
  input: {schema: GenerateAwardRecommendationInputSchema},
  output: {schema: GenerateAwardRecommendationOutputSchema},
  prompt: `Based on the following proposal analysis and scoring, provide an AI-driven award recommendation and justification.

Proposal Analysis: {{{proposalAnalysis}}}
Scoring: {{{scoring}}}

{{#if projectPerformanceData}}
Also consider this project performance data:
{{{projectPerformanceData}}}
Based on this, provide a recommendation on updates to the supplier relationship management (SRM) system.
{{/if}}

Provide the award recommendation, justification, and any suggested SRM updates.`,  
});

const generateAwardRecommendationFlow = ai.defineFlow(
  {
    name: 'generateAwardRecommendationFlow',
    inputSchema: GenerateAwardRecommendationInputSchema,
    outputSchema: GenerateAwardRecommendationOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
