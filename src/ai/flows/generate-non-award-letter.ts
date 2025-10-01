'use server';

/**
 * @fileOverview Generates a non-award letter email for a contractor.
 *
 * - generateNonAwardLetter - A function that generates the non-award letter email.
 * - GenerateNonAwardLetterInput - The input type for the generateNonAwardLetter function.
 * - GenerateNonAwardLetterOutput - The return type for the generateNonAwardLetter function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateNonAwardLetterInputSchema = z.object({
  projectName: z.string().describe('The name of the project.'),
  contractorName: z.string().describe('The name of the supplier who was not selected.'),
  contractorEmail: z.string().describe('The email of the supplier contact.'),
  submissionDate: z.string().describe('The date of the RFP submission.'),
  improvementAreas: z.string().optional().describe('Specific areas for improvement for future proposals.'),
  primaryStakeholderEmail: z.string().optional().describe("The primary stakeholder's email."),
});
export type GenerateNonAwardLetterInput = z.infer<typeof GenerateNonAwardLetterInputSchema>;

const GenerateNonAwardLetterOutputSchema = z.object({
  emailTo: z.string().describe('The recipient email address.'),
  emailSubject: z.string().describe('The subject of the email.'),
  emailBody: z.string().describe('The body of the email, formatted with HTML line breaks (<br/>) and bold tags (<b>).'),
});
export type GenerateNonAwardLetterOutput = z.infer<typeof GenerateNonAwardLetterOutputSchema>;

export async function generateNonAwardLetter(input: GenerateNonAwardLetterInput): Promise<GenerateNonAwardLetterOutput> {
    return generateNonAwardLetterFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateNonAwardLetterPrompt',
  input: {schema: GenerateNonAwardLetterInputSchema},
  output: {schema: GenerateNonAwardLetterOutputSchema},
  prompt: `You are an expert email drafter. Generate a non-award notification email based on the following template and details.
  Format the email body with HTML using <br/> for line breaks and wrap optional sections correctly.

  **Template:**
  Subject: Notice of Decision - Google MARCUS {{{projectName}}} - {{{contractorName}}}

  Dear {{{contractorName}}} Team,<br/><br/>

  We would like to thank you and your team for your participation in the MARCUS {{{projectName}}} RFP on {{{submissionDate}}}.<br/><br/>

  The Google team has decided not to advance this specific project any further with your company. This email formally concludes our review process for this project. We appreciate your interest and will reach out for future RFPs that align with our needs.<br/><br/>

  We appreciate the time and effort you have put into responding to this RFP process. Please note, this decision does not prohibit your involvement in future RFP opportunities with Google.<br/><br/>

  {{#if improvementAreas}}
  While we don’t share the results of the RFP evaluation, here are some areas for potential improvement that could strengthen your proposal in future proposals:<br/>
  {{{improvementAreas}}}<br/><br/>
  {{/if}}

  Thank you for your efforts to support this bid process. Should you have any additional questions, please don’t hesitate to let us know how we can help.<br/><br/>

  Regards,<br/><br/>

  {{#if primaryStakeholderEmail}}
  {{{primaryStakeholderEmail}}}<br/>
  {{/if}}
  [Your Name]<br/>
  [Your Position]<br/>
  [Your Company]

  **Details:**
  Project Name: {{{projectName}}}
  Contractor Name: {{{contractorName}}}
  Contractor Email: {{{contractorEmail}}}
  Submission Date: {{{submissionDate}}}
  Improvement Areas: {{{improvementAreas}}}
  {{#if primaryStakeholderEmail}}
  Primary Stakeholder Email: {{{primaryStakeholderEmail}}}
  {{/if}}

  Generate the To, Subject, and Body fields for the email.`,
});

const generateNonAwardLetterFlow = ai.defineFlow(
  {
    name: 'generateNonAwardLetterFlow',
    inputSchema: GenerateNonAwardLetterInputSchema,
    outputSchema: GenerateNonAwardLetterOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    if (!output) {
      throw new Error('Failed to generate non-award letter');
    }
    return {...output, emailTo: input.contractorEmail};
  }
);
