'use server';

/**
 * @fileOverview Generates an award letter email for a selected contractor.
 *
 * - generateAwardLetter - A function that generates the award letter email.
 * - GenerateAwardLetterInput - The input type for the generateAwardLetter function.
 * - GenerateAwardLetterOutput - The return type for the generateAwardLetter function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateAwardLetterInputSchema = z.object({
  projectName: z.string().describe('The name of the project or site.'),
  contractorName: z.string().describe('The name of the supplier being awarded the contract.'),
  contractorEmail: z.string().describe('The email of the supplier contact.'),
  meetingDate: z.string().describe('The date and time for the project team meeting.'),
  confirmationDate: z.string().describe('The deadline for the supplier to confirm acceptance.'),
});
export type GenerateAwardLetterInput = z.infer<typeof GenerateAwardLetterInputSchema>;

const GenerateAwardLetterOutputSchema = z.object({
  emailTo: z.string().describe('The recipient email address.'),
  emailSubject: z.string().describe('The subject of the email.'),
  emailBody: z.string().describe('The body of the email, formatted with HTML line breaks (<br/>) and bold tags (<b>).'),
});
export type GenerateAwardLetterOutput = z.infer<typeof GenerateAwardLetterOutputSchema>;

export async function generateAwardLetter(input: GenerateAwardLetterInput): Promise<GenerateAwardLetterOutput> {
  const result = await generateAwardLetterFlow(input);
  const formattedBody = result.emailBody
    .replace(/\n/g, '<br/>')
    .replace(/\*\*(.*?)\*\*/g, '<b>$1</b>');
  return { ...result, emailBody: formattedBody };
}

const prompt = ai.definePrompt({
  name: 'generateAwardLetterPrompt',
  input: {schema: GenerateAwardLetterInputSchema},
  output: {schema: GenerateAwardLetterOutputSchema},
  prompt: `You are an expert email drafter. Generate an award notification email based on the following template and details.

  **Template:**
  Subject: Award Notification: MARCUS {{{projectName}}}

  Dear {{{contractorName}}},

  We are pleased to announce that {{{contractorName}}} has been awarded the MARCUS {{{projectName}}} RFP after a comprehensive review and assessment of your proposal. Congratulations on your successful selection to move forward in this exciting opportunity!

  Please find attached the formal award letter, which outlines the conditions of the award and the required next steps. Highlights include:
  - **Final Confirmation of Onsite Project Personnel:** Please upload the appropriate resumes to your designated folder [LINK], detailing the site-specific staffing roster for Google's final project team approval.
  - **Project Team Meeting:** Join GPO and the XX Project Team for a meeting on {{{meetingDate}}}. A separate calendar invite will be sent for this meeting—please let us know if you do not receive it. All proposed onsite personnel are expected to attend.

  Your points of contact for the next phase will be:
  - Program Lead: XX
  - Site MARCUS Lead: XX
  - Regional Contract Manager: XX

  Please respond to the email containing this notice to confirm your acceptance of the award and the specified conditions by no later than {{{confirmationDate}}}, by “Replying All” to this email. 

  We deeply appreciate your participation in the RFP process and look forward to a successful partnership with {{{contractorName}}} as we move into the next phase of the MARCUS {{{projectName}}} initiative.

  Best regards,

  [Your Name]
  [Your Position]
  [Your Company]

  **Details:**
  Project Name: {{{projectName}}}
  Contractor Name: {{{contractorName}}}
  Contractor Email: {{{contractorEmail}}}
  Meeting Date: {{{meetingDate}}}
  Confirmation Date: {{{confirmationDate}}}

  Generate the To, Subject, and Body fields for the email.`,
});

const generateAwardLetterFlow = ai.defineFlow(
  {
    name: 'generateAwardLetterFlow',
    inputSchema: GenerateAwardLetterInputSchema,
    outputSchema: GenerateAwardLetterOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    if (!output) {
      throw new Error('Failed to generate award letter');
    }
    return {...output, emailTo: input.contractorEmail};
  }
);
