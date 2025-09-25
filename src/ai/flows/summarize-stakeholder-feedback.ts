'use server';

/**
 * @fileOverview Summarizes stakeholder and contractor feedback into a Lessons Learned report.
 *
 * - summarizeStakeholderFeedback - A function that summarizes feedback into a lessons learned report.
 * - SummarizeStakeholderFeedbackInput - The input type for the summarizeStakeholderFeedback function.
 * - SummarizeStakeholderFeedbackOutput - The return type for the summarizeStakeholderFeedback function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeStakeholderFeedbackInputSchema = z.object({
  stakeholderFeedback: z
    .string()
    .describe('Feedback collected from stakeholders regarding the project.'),
  contractorFeedback: z
    .string()
    .describe('Feedback collected from contractors regarding the project.'),
  projectPerformanceData: z
    .string()
    .describe(
      'Data on project performance, including metrics and key performance indicators.'
    ),
});
export type SummarizeStakeholderFeedbackInput = z.infer<
  typeof SummarizeStakeholderFeedbackInputSchema
>;

const SummarizeStakeholderFeedbackOutputSchema = z.object({
  lessonsLearnedReport: z
    .string()
    .describe(
      'A comprehensive lessons learned report summarizing stakeholder and contractor feedback, and project performance data.'
    ),
});
export type SummarizeStakeholderFeedbackOutput = z.infer<
  typeof SummarizeStakeholderFeedbackOutputSchema
>;

export async function summarizeStakeholderFeedback(
  input: SummarizeStakeholderFeedbackInput
): Promise<SummarizeStakeholderFeedbackOutput> {
  return summarizeStakeholderFeedbackFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeStakeholderFeedbackPrompt',
  input: {schema: SummarizeStakeholderFeedbackInputSchema},
  output: {schema: SummarizeStakeholderFeedbackOutputSchema},
  prompt: `You are an expert project manager responsible for creating lessons learned reports.

  Based on the following information, create a comprehensive lessons learned report.

  Stakeholder Feedback: {{{stakeholderFeedback}}}
  Contractor Feedback: {{{contractorFeedback}}}
  Project Performance Data: {{{projectPerformanceData}}}

  The lessons learned report should include key takeaways, areas for improvement, and recommendations for future projects.
  Focus on actionable insights that can be used to improve the RFP process and contractor performance.
  The report should be well-structured and easy to understand.
  Be as detailed as possible.
  `,
});

const summarizeStakeholderFeedbackFlow = ai.defineFlow(
  {
    name: 'summarizeStakeholderFeedbackFlow',
    inputSchema: SummarizeStakeholderFeedbackInputSchema,
    outputSchema: SummarizeStakeholderFeedbackOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
