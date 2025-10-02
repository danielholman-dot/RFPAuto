
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
  primaryStakeholderName: z.string().optional().describe("The primary stakeholder's name."),
  primaryStakeholderEmail: z.string().optional().describe('The primary stakeholder\'s email.'),
});
export type GenerateProjectRFPInstructionsInput = z.infer<
  typeof GenerateProjectRFPInstructionsInputSchema
>;

const GenerateProjectRFPInstructionsOutputSchema = z.object({
  rfpInstructions: z.string().describe('The generated project-specific RFP instructions as an HTML document.'),
});
export type GenerateProjectRFPInstructionsOutput = z.infer<
  typeof GenerateProjectRFPInstructionsOutputSchema
>;

export async function generateProjectRFPInstructions(
  input: GenerateProjectRFPInstructionsInput
): Promise<GenerateProjectRFPInstructionsOutput> {
  const startDate = new Date(input.startDate);
  
  // Validate the date and default to now() if it's invalid.
  const validStartDate = !isNaN(startDate.getTime()) ? startDate : new Date();

  const rfpTimeline = {
      currentMonth: format(new Date(), 'MMMM'),
      currentYear: format(new Date(), 'yyyy'),
      googleContactName: input.primaryStakeholderName || "MARCUS Program Team",
      googleContactEmail: input.primaryStakeholderEmail || "marcus-rfp-support@google.com",
      eoiResponseDate: format(addBusinessDays(validStartDate, 5), 'MM/dd/yyyy'),
      rfpStartDate: format(validStartDate, 'MM/dd/yyyy'),
      rfpConfirmationDate: format(addBusinessDays(validStartDate, 2), 'MM/dd/yyyy'),
      qnaSubmissionDate: format(addBusinessDays(validStartDate, 7), 'MM/dd/yyyy'),
      qnaResponseDate: format(addBusinessDays(validStartDate, 10), 'MM/dd/yyyy'),
      rfpEndDate: format(addBusinessDays(validStartDate, 20), 'MM/dd/yyyy'),
      presentationDate: format(addBusinessDays(validStartDate, 25), 'MM/dd/yyyy'),
      awardNotificationDate: format(addBusinessDays(validStartDate, 30), 'MM/dd/yyyy'),
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
  prompt: `You are an expert in generating project-specific RFP instructions. Your task is to convert the provided plain text SOP into a well-formatted HTML document, filling in the dynamic project data.

MARCUS SOP Content (Template):
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

Generate a single HTML document. Use appropriate HTML tags like <h1>, <h2>, <h3>, <p>, <ul>, <li>, <strong>, and <table> to create a professional and readable document.
- Main sections should use <h2>.
- Sub-sections should use <h3>.
- The Table of Contents should be an unordered list with links to the corresponding section IDs.
- Pay attention to lists, bold text, and tables to ensure they are rendered correctly in HTML.
- The entire output should be a single, valid HTML string.
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
