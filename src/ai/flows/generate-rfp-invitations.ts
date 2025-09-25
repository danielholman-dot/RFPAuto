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


const GenerateRfpInvitationInputSchema = z.object({
  projectName: z.string().describe('The name of the project or RFP.'),
  year: z.string().describe('The current year.'),
  contractorName: z.string().describe('The name of the contractor company (GC).'),
  campusLocation: z.string().describe('The operational data center site location.'),
  eoiFormLink: z.string().describe('The link to the Expression of Interest form.'),
  eoiDueDate: z.string().describe('The due date for the EOI, e.g., Month/Day/Year at Time PST.'),
  proposalSubmissionLink: z.string().describe('The link for the contractor to submit their proposal.'),
});

export type GenerateRfpInvitationInput = z.infer<typeof GenerateRfpInvitationInputSchema>;

const GenerateRfpInvitationOutputSchema = z.object({
  emailSubject: z.string().describe('The subject of the email invitation.'),
  emailBody: z.string().describe('The body of the email invitation.'),
});

export type GenerateRfpInvitationOutput = z.infer<typeof GenerateRfpInvitationOutputSchema>;


export async function generateRfpInvitation(input: GenerateRfpInvitationInput): Promise<GenerateRfpInvitationOutput> {
  return generateRfpInvitationFlow(input);
}


const rfpInvitationPrompt = ai.definePrompt({
  name: 'rfpInvitationPrompt',
  input: {schema: GenerateRfpInvitationInputSchema},
  output: {schema: GenerateRfpInvitationOutputSchema},
  prompt: `You are an expert email drafter specializing in writing compelling RFP Expression of Interest (EOI) emails for project managers.

  Given the following project details and contractor information, draft a personalized email invitation for EOI participation.
  The tone should be professional and formal.

  Project Name: {{{projectName}}}
  Year: {{{year}}}
  Contractor Name: {{{contractorName}}}
  Campus Location: {{{campusLocation}}}
  EOI Form Link: {{{eoiFormLink}}}
  EOI Due Date: {{{eoiDueDate}}}
  Proposal Submission Link: {{{proposalSubmissionLink}}}

  Generate the email subject and body based on the template below.

  <template>
  Subject: CONFIDENTIAL Expression of Interest - Google MARCUS {{{projectName}}} | {{{year}}} {{{contractorName}}}

  Dear {{{contractorName}}} Team,

  Google is issuing an upcoming Request for Proposal (RFP) for one of its operational data center sites located in {{{campusLocation}}}. This work includes, but is not limited to, Moves, Adds, Retrofits, Changes, Utilities, and Security (collectively known as MARCUS works).

  Google is seeking qualified General Contractors/Suppliers to perform post-facility handover work at our operational data center campuses located in {{{campusLocation}}}. This work includes, but is not limited to, Moves, Adds, Retrofits, Changes, Utilities, and Security (collectively known as MARCUS works). This is confidential information and adheres to the terms set forth in the NDA.

  Objectives:
  This Expression of Interest (EOI) aims to gather written submissions from qualified companies interested in participating in the upcoming RFP process.

  Action Required:
  If your company is interested in receiving more details about this upcoming RFP, please provide all details required in the following Expression of Interest form [{{{eoiFormLink}}}]. Due {{{eoiDueDate}}}.

  To submit your proposal, please use the following link: [{{{proposalSubmissionLink}}}]

  Thank you for your time and we appreciate your consideration as a potential partner.

  Best regards,
  </template>
  `,
});

const generateRfpInvitationFlow = ai.defineFlow(
  {
    name: 'generateRfpInvitationFlow',
    inputSchema: GenerateRfpInvitationInputSchema,
    outputSchema: GenerateRfpInvitationOutputSchema,
  },
  async input => {
    const {output} = await rfpInvitationPrompt(input);
    return output!;
  }
);
