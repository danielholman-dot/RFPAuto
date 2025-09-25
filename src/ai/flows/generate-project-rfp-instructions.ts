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
  return generateProjectRFPInstructionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateProjectRFPInstructionsPrompt',
  input: {schema: GenerateProjectRFPInstructionsInputSchema},
  output: {schema: GenerateProjectRFPInstructionsOutputSchema},
  prompt: `You are an expert in generating project-specific RFP instructions. Combine the project data with the MARCUS SOP content to create comprehensive RFP instructions.

Project Name: {{{projectName}}}
Scope of Work: {{{scopeOfWork}}}
Metro Code: {{{metroCode}}}
Contractor Type: {{{contractorType}}}
Estimated Budget: {{{estimatedBudget}}}
Start Date: {{{startDate}}}
Technical Documents: {{{technicalDocuments}}}
MARCUS SOP Content: ${marcusSOPContent}

Generate project-specific RFP instructions:`,
});

const generateProjectRFPInstructionsFlow = ai.defineFlow(
  {
    name: 'generateProjectRFPInstructionsFlow',
    inputSchema: GenerateProjectRFPInstructionsInputSchema,
    outputSchema: GenerateProjectRFPInstructionsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
