
'use server';

/**
 * @fileOverview An AI agent for performing a comparative analysis of multiple proposals.
 *
 * - generateComparativeAnalysis - A function that handles the proposal comparison process.
 * - GenerateComparativeAnalysisInput - The input type for the generateComparativeAnalysis function.
 * - GenerateComparativeAnalysisOutput - The return type for the generateComparativeAnalysis function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ProposalInputSchema = z.object({
    contractorName: z.string().describe('The name of the contractor who submitted the proposal.'),
    proposalText: z.string().describe('The full text of the proposal.'),
});

const GenerateComparativeAnalysisInputSchema = z.object({
  rfpScope: z.string().describe('The scope of work from the RFP.'),
  proposals: z.array(ProposalInputSchema).describe('An array of proposals to be compared.'),
});
export type GenerateComparativeAnalysisInput = z.infer<
  typeof GenerateComparativeAnalysisInputSchema
>;

const GenerateComparativeAnalysisOutputSchema = z.object({
    commercialAnalysis: z.string().describe('A comparative summary of the commercial aspects of the proposals.'),
    technicalAnalysis: z.string().describe('A comparative summary of the technical aspects and approaches of the proposals.'),
    presentationAnalysis: z.string().describe('A summary of the clarity, completeness, and overall presentation quality of the proposals.'),
});
export type GenerateComparativeAnalysisOutput = z.infer<
  typeof GenerateComparativeAnalysisOutputSchema
>;

export async function generateComparativeAnalysis(
  input: GenerateComparativeAnalysisInput
): Promise<GenerateComparativeAnalysisOutput> {
  return generateComparativeAnalysisFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateComparativeAnalysisPrompt',
  input: {schema: GenerateComparativeAnalysisInputSchema},
  output: {schema: GenerateComparativeAnalysisOutputSchema},
  prompt: `You are an expert procurement analyst. Your task is to perform a comparative analysis of multiple proposals based on the provided RFP scope.

  RFP Scope of Work:
  {{{rfpScope}}}

  You have received the following proposals:
  {{#each proposals}}
  ---
  Proposal from: {{{contractorName}}}
  Proposal Text:
  {{{proposalText}}}
  ---
  {{/each}}

  Please provide a detailed comparative analysis of these proposals. For each of the following points, compare and contrast the proposals, highlighting key strengths and weaknesses for each contractor.

  1.  **Commercial Analysis**: Compare the pricing, value for money, cost-saving suggestions, and overall financial health or stability implied by the proposals.

  2.  **Technical Analysis**: Evaluate the proposed technical solutions, adherence to the scope of work, understanding of the requirements, and innovative approaches.

  3.  **Presentation Analysis**: Assess the overall quality of the proposal documents. Consider their clarity, professionalism, completeness, and how well they communicate the contractor's understanding and capabilities.
  `,
});

const generateComparativeAnalysisFlow = ai.defineFlow(
  {
    name: 'generateComparativeAnalysisFlow',
    inputSchema: GenerateComparativeAnalysisInputSchema,
    outputSchema: GenerateComparativeAnalysisOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
