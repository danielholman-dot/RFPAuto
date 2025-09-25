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
  projectName: z.string().describe('The name of the project.'),
  startDate: z.string().describe('The start date of the project.'),
  contractorName: z.string().describe('The name of the contractor receiving the invitation.'),
  contractorContactName: z.string().describe('The contact person at the contractor company.'),
  projectDescription: z.string().describe('A brief description of the project.'),
  scopeOfWork: z.string().describe('The scope of work for the project.'),
  technicalDocumentsLink: z.string().describe('Link to the technical documents related to the project.'),
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
  prompt: `You are an expert email drafter specializing in writing compelling RFP invitation emails for project managers.

  Given the following project details and contractor information, draft a personalized email invitation for RFP participation.
  The email should clearly state the project name, start date, and a brief description of the project.
  It should also mention the scope of work and provide a link to the technical documents.
  The tone should be professional and inviting, encouraging the contractor to participate in the RFP process.

  Project Name: {{{projectName}}}
  Start Date: {{{startDate}}}
  Contractor Name: {{{contractorName}}}
  Contractor Contact Name: {{{contractorContactName}}}
  Project Description: {{{projectDescription}}}
  Scope of Work: {{{scopeOfWork}}}
  Technical Documents Link: {{{technicalDocumentsLink}}}

  Output the email subject and body in the following JSON format:
  {
    "emailSubject": "Subject of the email",
    "emailBody": "Body of the email"
  }`,
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
