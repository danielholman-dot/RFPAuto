
'use server';

/**
 * @fileOverview A flow that generates a user guide for the MARCUS Automation Suite.
 *
 * - generateUserGuide - A function that generates the user guide content.
 * - GenerateUserGuideOutput - The return type for the generateUserGuide function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateUserGuideOutputSchema = z.object({
  userGuideHtml: z.string().describe('The comprehensive user guide for the application, formatted as a single, well-structured HTML string.'),
});
export type GenerateUserGuideOutput = z.infer<typeof GenerateUserGuideOutputSchema>;

export async function generateUserGuide(): Promise<GenerateUserGuideOutput> {
  return generateUserGuideFlow();
}

const prompt = ai.definePrompt({
  name: 'generateUserGuidePrompt',
  output: {schema: GenerateUserGuideOutputSchema},
  prompt: `You are an expert technical writer tasked with creating a comprehensive user guide for a web application called the "MARCUS Automation Suite". The application is designed to streamline the Request for Proposal (RFP) process for construction and data center projects.

Generate a user guide as a single, well-structured HTML document. The guide should be rich with explanations. Use appropriate HTML tags like <h1>, <h2>, <h3>, <p>, <ul>, <li>, <strong>, and <table> to create a professional and readable document. Do not include <html>, <head>, or <body> tags.

For each major feature or "chapter," provide a detailed explanation of its purpose and functionality. Then, create a simple two-column HTML table that clearly lists the key **Inputs** (what the user provides or does) and the key **Outputs** (what the system produces or the result).

The guide should cover the following key areas of the application:

1.  **Introduction**: Briefly explain the purpose of the MARCUS Automation Suite and its benefits.

2.  **Dashboard**: Describe the main dashboard, including the key performance indicators (KPIs) like Total Budget, Total Contractors, and Active RFPs, and the Gantt chart for project timelines. Explain how the filters work.

3.  **Creating a New RFP**:
    *   Explain how to navigate to the "New RFP" page and fill out the Project Intake Form.
    *   Detail the information required.
    *   Explain that this creates an RFP in "Draft" status.

4.  **Managing an RFP (The RFP Lifecycle)**: This is a major section. Describe the different tabs a user will go through.
    *   **Selection & Drafting**: Explain the "AI-Powered RFP Drafting" tab where users can generate the official RFP instructions document from a template. Mention that they can see suggested contractors here.
    *   **Invitations & Proposals**: Describe how a user can invite contractors, and then track their proposal submissions in the "Proposals" tab.
    *   **AI Analysis**: Explain how users can select submitted proposals and use the "AI Evaluation" feature to get a comparative analysis and bid visualization.
    *   **Awarding**: Detail the "Award" tab, where a user selects a winning contractor and can then generate and send both "Award" and "Non-Award" letters.

5.  **Templates**:
    *   Explain the purpose of the "Templates" page.
    *   Describe how users can view and edit standard templates for RFPs, EOI emails, and award/non-award letters.

6.  **Contractors & Metros**:
    *   Briefly explain the "Contractors" page for viewing, filtering, and managing preferred contractors.
    *   Briefly explain the "Metro" page for viewing the geographical locations of project sites and their map visualization.

Structure the guide logically, starting from an overview and moving to more specific tasks. The tone should be clear, helpful, and professional. Ensure the HTML is clean and well-formed.
`,
});

const generateUserGuideFlow = ai.defineFlow(
  {
    name: 'generateUserGuideFlow',
    outputSchema: GenerateUserGuideOutputSchema,
  },
  async () => {
    const {output} = await prompt({});
    return output!;
  }
);

