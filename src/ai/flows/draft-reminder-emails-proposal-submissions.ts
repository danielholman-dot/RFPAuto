'use server';
/**
 * @fileOverview This file defines a Genkit flow for drafting email reminders to contractors for proposal submissions.
 *
 * - draftReminderEmailsForProposalSubmissions - A function that drafts reminder emails to contractors for proposal submissions.
 * - DraftReminderEmailsForProposalSubmissionsInput - The input type for the draftReminderEmailsForProposalSubmissions function.
 * - DraftReminderEmailsForProposalSubmissionsOutput - The return type for the draftReminderEmailsForProposalSubmissions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DraftReminderEmailsForProposalSubmissionsInputSchema = z.object({
  projectName: z.string().describe('The name of the project.'),
  contractorName: z.string().describe('The name of the contractor.'),
  submissionDeadline: z.string().describe('The proposal submission deadline.'),
  projectScope: z.string().describe('A short description of the project scope.'),
  additionalContext: z.string().optional().describe('Any additional context or instructions for the email.'),
});

export type DraftReminderEmailsForProposalSubmissionsInput = z.infer<
  typeof DraftReminderEmailsForProposalSubmissionsInputSchema
>;

const DraftReminderEmailsForProposalSubmissionsOutputSchema = z.object({
  emailSubject: z.string().describe('The subject of the reminder email.'),
  emailBody: z.string().describe('The body of the reminder email.'),
});

export type DraftReminderEmailsForProposalSubmissionsOutput = z.infer<
  typeof DraftReminderEmailsForProposalSubmissionsOutputSchema
>;

export async function draftReminderEmailsForProposalSubmissions(
  input: DraftReminderEmailsForProposalSubmissionsInput
): Promise<DraftReminderEmailsForProposalSubmissionsOutput> {
  return draftReminderEmailsForProposalSubmissionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'draftReminderEmailsForProposalSubmissionsPrompt',
  input: {schema: DraftReminderEmailsForProposalSubmissionsInputSchema},
  output: {schema: DraftReminderEmailsForProposalSubmissionsOutputSchema},
  prompt: `You are an AI assistant specializing in composing professional and effective email reminders.

  Based on the provided project details, contractor information, and submission deadline, draft a personalized email reminder to encourage timely proposal submission.

  Project Name: {{{projectName}}}
  Contractor Name: {{{contractorName}}}
  Submission Deadline: {{{submissionDeadline}}}
  Project Scope: {{{projectScope}}}
  Additional Context: {{{additionalContext}}}

  Compose both the subject and body of the email.
  The email should:
  - Clearly state the approaching deadline.
  - Briefly reiterate the project scope.
  - Encourage prompt submission.
  - Provide contact information for any queries.
  - Maintain a professional and courteous tone.
`,
});

const draftReminderEmailsForProposalSubmissionsFlow = ai.defineFlow(
  {
    name: 'draftReminderEmailsForProposalSubmissionsFlow',
    inputSchema: DraftReminderEmailsForProposalSubmissionsInputSchema,
    outputSchema: DraftReminderEmailsForProposalSubmissionsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
