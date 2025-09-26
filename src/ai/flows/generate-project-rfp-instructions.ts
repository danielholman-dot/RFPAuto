
'use server';
/**
 * @fileOverview A flow that generates project-specific RFP instructions by combining project data with boilerplate content from the MARCUS SOP.
 *
 * - generateProjectRFPInstructions - A function that generates the project-specific RFP instructions.
 * - GenerateProjectRFPInstructionsInput - The input type for the generateProjectRFPInstructions function.
 * - GenerateProjectRFPInstructionsOutput - The return type for the generateProjectRFPInstructions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { marcusSOPContent } from '@/lib/sop';
import { format, addBusinessDays } from 'date-fns';

const GenerateProjectRFPInstructionsInputSchema = z.object({
  projectName: z.string().describe('The name of the project.'),
  scopeOfWork: z.string().describe('The scope of work for the project.'),
  metroCode: z.string().describe('The metro code for the project.'),
  contractorType: z.string().describe('The type of contractor needed for the project.'),
  estimatedBudget: z.number().describe('The estimated budget for the project.'),
  startDate: z.string().describe('The start date for the project.'),
  technicalDocuments: z.string().describe('Technical documents related to the project.'),
});
export type GenerateProjectRFPInstructionsInput = z.infer<
  typeof GenerateProjectRFPInstructionsInputSchema
>;

const GenerateProjectRFPInstructionsOutputSchema = z.object({
  rfpInstructions: z.string().describe('The generated project-specific RFP instructions.'),
});
export type GenerateProjectRFPInstructionsOutput = z.infer<
  typeof GenerateProjectRFPInstructionsOutputSchema
>;

export async function generateProjectRFPInstructions(
  input: GenerateProjectRFPInstructionsInput
): Promise<GenerateProjectRFPInstructionsOutput> {
  const startDate = new Date(input.startDate);
  const rfpTimeline = {
      currentMonth: format(new Date(), 'MMMM'),
      currentYear: format(new Date(), 'yyyy'),
      googleContactName: "MARCUS Program Team",
      googleContactEmail: "marcus-rfp-support@google.com",
      eoiResponseDate: format(addBusinessDays(startDate, 5), 'MM/dd/yyyy'),
      rfpStartDate: format(startDate, 'MM/dd/yyyy'),
      rfpConfirmationDate: format(addBusinessDays(startDate, 2), 'MM/dd/yyyy'),
      qnaSubmissionDate: format(addBusinessDays(startDate, 7), 'MM/dd/yyyy'),
      qnaResponseDate: format(addBusinessDays(startDate, 10), 'MM/dd/yyyy'),
      rfpEndDate: format(addBusinessDays(startDate, 20), 'MM/dd/yyyy'),
      presentationDate: format(addBusinessDays(startDate, 25), 'MM/dd/yyyy'),
      awardNotificationDate: format(addBusinessDays(startDate, 30), 'MM/dd/yyyy'),
  }

  const promptInput = { ...input, ...rfpTimeline };

  return generateProjectRFPInstructionsFlow(promptInput);
}

const prompt = ai.definePrompt({
  name: 'generateProjectRFPInstructionsPrompt',
  input: {schema: GenerateProjectRFPInstructionsInputSchema.extend({
      currentMonth: z.string(),
      currentYear: z.string(),
      googleContactName: z.string(),
      googleContactEmail: z.string(),
      eoiResponseDate: z.string(),
      rfpStartDate: z.string(),
      rfpConfirmationDate: z.string(),
      qnaSubmissionDate: z.string(),
      qnaResponseDate: z.string(),
      rfpEndDate: z.string(),
      presentationDate: z.string(),
      awardNotificationDate: z.string(),
  })},
  output: {schema: GenerateProjectRFPInstructionsOutputSchema},
  prompt: `You are an expert in generating project-specific RFP instructions. Combine the project data with the MARCUS SOP content to create comprehensive RFP instructions.

MARCUS SOP Content: 
${marcusSOPContent}

You must use the content above as the template for the RFP instructions. Fill in the placeholders in the template with the following project-specific data.

Project Name: {{{projectName}}}
Scope of Work: {{{scopeOfWork}}}
Metro Code: {{{metroCode}}}
Contractor Type: {{{contractorType}}}
Estimated Budget: {{{estimatedBudget}}}
Start Date: {{{startDate}}}
Technical Documents: {{{technicalDocuments}}}
Current Month: {{{currentMonth}}}
Current Year: {{{currentYear}}}
Google Contact Name: {{{googleContactName}}}
Google Contact Email: {{{googleContactEmail}}}
EOI Response Date: {{{eoiResponseDate}}}
RFP Start Date: {{{rfpStartDate}}}
RFP Confirmation Date: {{{rfpConfirmationDate}}}
Q&A Submission Date: {{{qnaSubmissionDate}}}
Q&A Response Date: {{{qnaResponseDate}}}
RFP End Date: {{{rfpEndDate}}}
Presentation Date: {{{presentationDate}}}
Award Notification Date: {{{awardNotificationDate}}}

Generate the full, formatted RFP instructions document based on the template and the provided data.
`,
});

const generateProjectRFPInstructionsFlow = ai.defineFlow(
  {
    name: 'generateProjectRFPInstructionsFlow',
    inputSchema: GenerateProjectRFPInstructionsInputSchema.extend({
        currentMonth: z.string(),
        currentYear: z.string(),
        googleContactName: z.string(),
        googleContactEmail: z.string(),
        eoiResponseDate: z.string(),
        rfpStartDate: z.string(),
        rfpConfirmationDate: z.string(),
        qnaSubmissionDate: z.string(),
        qnaResponseDate: z.string(),
        rfpEndDate: z.string(),
        presentationDate: z.string(),
        awardNotificationDate: z.string(),
    }),
    outputSchema: GenerateProjectRFPInstructionsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
