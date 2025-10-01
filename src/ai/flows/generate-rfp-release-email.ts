
'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating tailored RFP release emails.
 *
 * - generateRfpReleaseEmail - A function that generates the RFP release email.
 * - GenerateRfpReleaseEmailInput - The input type for the generateRfpReleaseEmail function.
 * - GenerateRfpReleaseEmailOutput - The return type for the generateRfpReleaseEmail function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateRfpReleaseEmailInputSchema = z.object({
  projectName: z.string().describe('The name of the project or RFP.'),
  year: z.string().describe('The current year.'),
  contractorName: z.string().describe('The name of the contractor company.'),
  campusLocation: z.string().describe('The operational data center site location.'),
  confirmationDueDate: z.string().describe('The due date for confirming receipt.'),
  qnaDueDate: z.string().describe('The due date for submitting questions.'),
  submissionDueDate: z.string().describe('The due date for the final RFP proposal submission.'),
  submissionLink: z.string().describe('The unique link for the contractor to submit their proposal.'),
});

export type GenerateRfpReleaseEmailInput = z.infer<typeof GenerateRfpReleaseEmailInputSchema>;

const GenerateRfpReleaseEmailOutputSchema = z.object({
  emailTo: z.string().describe('The recipient email address.'),
  emailSubject: z.string().describe('The subject of the email invitation.'),
  emailBody: z.string().describe('The body of the email invitation, formatted with HTML line breaks (<br/>) and bold tags (<b>).'),
});

export type GenerateRfpReleaseEmailOutput = z.infer<typeof GenerateRfpReleaseEmailOutputSchema>;

export async function generateRfpReleaseEmail(input: GenerateRfpReleaseEmailInput): Promise<GenerateRfpReleaseEmailOutput> {
  const result = await generateRfpReleaseEmailFlow(input);
  return result;
}

const rfpReleasePrompt = ai.definePrompt({
  name: 'rfpReleasePrompt',
  input: {schema: GenerateRfpReleaseEmailInputSchema},
  output: {schema: GenerateRfpReleaseEmailOutputSchema},
  prompt: `You are an expert email drafter specializing in writing formal RFP Release invitations for project managers.
  Given the following project details, draft a personalized email invitation.
  The tone should be professional and formal. Format the email body using HTML for line breaks (<br/>).

  **Details:**
  Project Name: {{{projectName}}}
  Year: {{{year}}}
  Contractor Name: {{{contractorName}}}
  Campus Location: {{{campusLocation}}}
  Confirmation Due Date: {{{confirmationDueDate}}}
  Q&A Due Date: {{{qnaDueDate}}}
  Submission Due Date: {{{submissionDueDate}}}
  Submission Link: {{{submissionLink}}}

  **Template:**
  Subject: Invitation to Participate - Google MARCUS {{{projectName}}}, {{{year}}} / {{{contractorName}}}

  Dear {{{contractorName}}} Team,<br/><br/>

  Google would like to invite your company to participate in the MARCUS {{{projectName}}}, {{{year}}}, where we are seeking qualified General Contractors/Suppliers to perform post-facility completion handover work at our operational data center campuses located in {{{campusLocation}}}. Google is excited to have your company as a potential partner for this project. Below is a list of key actions pertaining to the RFP.<br/><br/>

  To submit your proposal, please use the following secure link: <a href="{{{submissionLink}}}">Submit Proposal</a>.<br/><br/>

  If you have not yet completed the RFI Prequalification Questionnaire, please ensure it is filled out as soon as possible. If you have already completed this requirement, please disregard this statement.<br/><br/>

  <b>Key Action Items</b><br/>
  - Review RFP package contained in the shared folder: Due {{{confirmationDueDate}}}<br/>
  - Confirm receipt of this email: Due {{{confirmationDueDate}}} / 5:00 PST<br/>
  - Q&A - General Contractor/Supplier submits questions (if applicable): Due {{{qnaDueDate}}} / 5:00 PST<br/>
  - Submission of RFP Proposal: Due {{{submissionDueDate}}} / 5:00 PST<br/>
  - General Contractor/Supplier Personnel Interview (if notified by Google)<br/><br/>

  To access the RFP Folder, please click on this [LINK] to sign up for a Google Docs account using your corporate email address. Please notice that we can't grant you access to personal Gmail accounts. Once you register please let us know and we will share the folder with your registered corporate email address. Additional Reference Documents will be added to your RFP Folder.<br/><br/>

  Please 'Reply All' to this email to confirm receipt of the RFP documents by {{{confirmationDueDate}}} at 5:00 PST.<br/><br/>

  Please upload your RFP Submission packet by {{{submissionDueDate}}} at 5:00 PST using the submission link provided above. Please note failure to submit all required documents by the specified due date may result in disqualification from further consideration for this RFP. It is critical that all materials are provided on time to ensure your proposal is reviewed in its entirety.<br/><br/>

  We look forward to your participation in this RFP.<br/><br/>

  Best Regards,
  `,
});

const generateRfpReleaseEmailFlow = ai.defineFlow(
  {
    name: 'generateRfpReleaseEmailFlow',
    inputSchema: GenerateRfpReleaseEmailInputSchema,
    outputSchema: GenerateRfpReleaseEmailOutputSchema,
  },
  async (input) => {
    const {output} = await rfpReleasePrompt(input);
    if (!output) {
      throw new Error('Failed to generate RFP release email');
    }
    return output;
  }
);
