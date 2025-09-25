import { config } from 'dotenv';
config();

import '@/ai/flows/analyze-and-score-proposals.ts';
import '@/ai/flows/generate-project-rfp-instructions.ts';
import '@/ai/flows/generate-rfp-invitations.ts';
import '@/ai/flows/draft-reminder-emails-proposal-submissions.ts';
import '@/ai/flows/generate-award-recommendations.ts';
import '@/ai/flows/summarize-stakeholder-feedback.ts';
import '@/ai/flows/generate-comparative-analysis.ts';
