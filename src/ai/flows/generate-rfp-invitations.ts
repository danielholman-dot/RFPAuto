
'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating tailored RFP invitation emails.
 *
 * The flow takes project details and contractor information as input and generates a personalized email
 * invitation for RFP participation. It exports the `generateRfpInvitation` function, along with the
 * input and output types.
 *
 * - generateRfpInvitation - A function that generates the RFP invitation email.
 * - GenerateRfpInvitationInput - The input type for the generateRfpInvitation function.
 * - GenerateRfpInvitationOutput - The return type for the generateRfpInvitation function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { format }from 'date-fns';


const GenerateRfpInvitationInputSchema = z.object({
  projectName: z.string().describe('The name of the project or RFP.'),
  contractorName: z.string().describe('The name of the contractor company (GC).'),
  campusLocation: z.string().describe('The operational data center site location.'),
  eoiDueDate: z.string().describe('The due date for the EOI, e.g., Month/Day/Year at Time PST.'),
  rfpStartDate: z.string().optional().describe('The start date of the RFP period.'),
  rfpEndDate: z.string().optional().describe('The end date of the RFP period.'),
  projectStartDate: z.string().optional().describe('The projected start date of the project.'),
  projectEndDate: z.string().optional().describe('The projected end date of the project.'),
});

export type GenerateRfpInvitationInput = z.infer<typeof GenerateRfpInvitationInputSchema>;

const GenerateRfpInvitationOutputSchema = z.object({
  emailTo: z.string().describe('The recipient email address.'),
  emailSubject: z.string().describe('The subject of the email invitation.'),
  emailBody: z.string().describe('The body of the email invitation, formatted with HTML line breaks (<br/>) and bold tags (<b>).'),
});

export type GenerateRfpInvitationOutput = z.infer<typeof GenerateRfpInvitationOutputSchema>;


export async function generateRfpInvitation(input: GenerateRfpInvitationInput): Promise<GenerateRfpInvitationOutput> {
  const result = await generateRfpInvitationFlow(input);
  // Basic conversion from Markdown-like bolding to HTML bold tags.
  const formattedBody = result.emailBody
    .replace(/\n/g, '<br/>') // Convert newlines to <br> tags
    .replace(/\*\*(.*?)\*\*/g, '<b>$1</b>'); // Convert **text** to <b>text</b>
  return { ...result, emailBody: formattedBody };
}


const rfpInvitationPrompt = ai.definePrompt({
  name: 'rfpInvitationPrompt',
  input: {schema: GenerateRfpInvitationInputSchema},
  output: {schema: GenerateRfpInvitationOutputSchema},
  prompt: `You are an expert email drafter specializing in writing compelling RFP Expression of Interest (EOI) emails for project managers.

  Given the following project details and contractor information, draft a personalized email invitation for EOI participation.
  The tone should be professional and formal. Use markdown for bolding.

  Project Name: {{{projectName}}}
  Year: ${new Date().getFullYear()}
  Contractor Name: {{{contractorName}}}
  Campus Location: {{{campusLocation}}}
  EOI Form Link: [LINK]
  EOI Due Date: {{{eoiDueDate}}}

  Generate the email subject and body based on the template below. The To, Cc, and Bcc fields are for context and should not be part of the generated output.

  After the main body, include a "Key Dates" section with the provided dates.

  RFP Start Date: {{{rfpStartDate}}}
  RFP End Date: {{{rfpEndDate}}}
  Project Start Date: {{{projectStartDate}}}
  Project End Date: {{{projectEndDate}}}

  <template>
  Subject: CONFIDENTIAL Expression of Interest - Google MARCUS {{{projectName}}} | ${new Date().getFullYear()} {{{contractorName}}}

  Dear {{{contractorName}}} Team,

  Google is issuing an upcoming Request for Proposal (RFP) for one of its operational data center sites located in {{{campusLocation}}}. This work includes, but is not limited to, Moves, Adds, Retrofits, Changes, Utilities, and Security (collectively known as MARCUS works).

  Google is seeking qualified General Contractors/Suppliers to perform post-facility handover work at our operational data center campuses located in {{{campusLocation}}}. This work includes, but is not limited to, Moves, Adds, Retrofits, Changes, Utilities, and Security (collectively known as MARCUS works). This is confidential information and adheres to the terms set forth in the NDA.

  **Objectives:**
  This Expression of Interest (EOI) aims to gather written submissions from qualified companies interested in participating in the upcoming RFP process.

  **Action Required**
  If your company is interested in receiving more details about this upcoming RFP, please provide all details required in the following Expression of Interest form [LINK]. Due {{{eoiDueDate}}}.

  Thank you for your time and we appreciate your consideration as a potential partner.

  Best regards,

  ---
  **Key Dates:**
  RFP Period: {{{rfpStartDate}}} - {{{rfpEndDate}}}
  Projected Timeline: {{{projectStartDate}}} - {{{projectEndDate}}}
  </template>
  `,
});

const generateRfpInvitationFlow = ai.defineFlow(
  {
    name: 'generateRfpInvitationFlow',
    inputSchema: GenerateRfpInvitationInputSchema,
    outputSchema: GenerateRfpInvitationOutputSchema,
  },
  async (input) => {
    const {output} = await rfpInvitationPrompt(input);
    if (!output) {
      throw new Error('Failed to generate RFP invitation');
    }
    return output;
  }
);
