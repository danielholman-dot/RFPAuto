'use server';

/**
 * @fileOverview An AI agent for analyzing and scoring proposals against RFP requirements.
 *
 * - analyzeAndScoreProposals - A function that handles the proposal analysis and scoring process.
 * - AnalyzeAndScoreProposalsInput - The input type for the analyzeAndScoreProposals function.
 * - AnalyzeAndScoreProposalsOutput - The return type for the analyzeAndScoreProposals function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeAndScoreProposalsInputSchema = z.object({
  proposalText: z
    .string()
    .describe('The text of the proposal to be analyzed.'),
  rfpRequirements: z
    .string()
    .describe('The RFP requirements document.'),
  technicalDocuments: z
    .string()
    .describe('The relevant technical documents for the project.'),
});
export type AnalyzeAndScoreProposalsInput = z.infer<
  typeof AnalyzeAndScoreProposalsInputSchema
>;

const AnalyzeAndScoreProposalsOutputSchema = z.object({
  scorecardEntries: z.object({
    safety: z.string().describe('Scorecard entry for Safety.'),
    experience: z.string().describe('Scorecard entry for Experience.'),
    programmaticApproach: z
      .string()
      .describe('Scorecard entry for Programmatic Approach.'),
    commercialExcellence: z
      .string()
      .describe('Scorecard entry for Commercial Excellence.'),
    innovativeSolutions: z
      .string()
      .describe('Scorecard entry for Innovative Solutions.'),
    missionCriticalExperience: z
      .string()
      .describe('Scorecard entry for Mission Critical Experience.'),
  }),
});
export type AnalyzeAndScoreProposalsOutput = z.infer<
  typeof AnalyzeAndScoreProposalsOutputSchema
>;

export async function analyzeAndScoreProposals(
  input: AnalyzeAndScoreProposalsInput
): Promise<AnalyzeAndScoreProposalsOutput> {
  return analyzeAndScoreProposalsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeAndScoreProposalsPrompt',
  input: {schema: AnalyzeAndScoreProposalsInputSchema},
  output: {schema: AnalyzeAndScoreProposalsOutputSchema},
  prompt: `You are an AI assistant specializing in analyzing proposals against RFP requirements and technical documents.

  Analyze the proposal text in relation to the RFP requirements and technical documents provided.
  Generate preliminary scorecard entries for the following criteria:

  - Safety: Evaluate the proposal's safety protocols and record.
  - Experience: Assess the proposer's relevant experience.
  - Programmatic Approach: Analyze the proposed approach to the project.
  - Commercial Excellence: Evaluate the commercial aspects of the proposal.
  - Innovative Solutions: Identify any innovative solutions proposed.
  - Mission Critical Experience: Assess the proposer's experience with mission-critical projects.

  Provide a detailed scorecard entry for each criterion based on the information provided in the proposal, RFP requirements, and technical documents.

  RFP Requirements: {{{rfpRequirements}}}
  Technical Documents: {{{technicalDocuments}}}
  Proposal Text: {{{proposalText}}}
  `,
});

const analyzeAndScoreProposalsFlow = ai.defineFlow(
  {
    name: 'analyzeAndScoreProposalsFlow',
    inputSchema: AnalyzeAndScoreProposalsInputSchema,
    outputSchema: AnalyzeAndScoreProposalsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
