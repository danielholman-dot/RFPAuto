# **App Name**: MARCUS Automation Suite

## Core Features:

- Project Intake: Collect initial project details including project name, scope of work, metro code (dropdown with predetermined codes), contractor type (dropdown from preferred list), estimated budget, start date, and technical documents.
- Contractor Selection: Use the preferred contractor list to pull metro code and contractor type to provide 5 contractors (most preferred first) and their contact information, based on the filtered selected.
- EOI Email Generation and Sending: Present on all the companies that could participate in this RFP according to the filter selected to send a EOI email to get them onboard of interest.
- AI Email Drafting for RFP Invitation: Automatically populate emails requesting RFP participation, tailored to each contractor with project name and start date. Include a 2-step approval process before sending, with an export button for each email. This tool will determine the best information to present.
- AI-Powered RFP Generation: Generate project-specific RFP instructions by combining project data with boilerplate content from the MARCUS SOP using the Gemini API, automatically sending the completed RFP to selected contractors.
- Automated Proposal Submission and Reminders: Enable contractors to submit proposals back into the system, with AI-drafted email reminders (specify timeframe) sent to contractors to ensure timely submissions. This tool will send follow up messages when appropriate.
- AI-Driven Proposal Analysis and Scoring: Analyze proposals against RFP requirements and technical documents. Generate preliminary scorecard entries (Safety, Experience, Programmatic Approach, Commercial Excellence, Innovative Solutions, Mission Critical Experience) for human review using AI.
- Award Recommendation and SRM Update: Based on proposal analysis and scoring, provide an AI-driven award recommendation.  The system will perform a final assessment based on project performance to update the supplier's status on the Preferred Contractor List, combined with summarization of stakeholder and contractor feedback for a Lessons Learned report.
- Feedback Collection: Distribute feedback forms to stakeholders and contractors to gather input on system performance.
- Dashboards: A user-friendly sidebar for easy navigation between dashboards, new RFPs, the RFP registry, contractor lists, metro codes, and system settings.

## Style Guidelines:

- Primary color: Deep blue (#294384) to convey trust, reliability, and enterprise-level professionalism, while avoiding cliches of money or security. The user is in good hands.
- Background color: Light blue-gray (#D4DAE2), a very desaturated and bright shade of the primary color to give a neutral, clean feel.
- Accent color: Purple (#673AB7), for highlights and calls to action; an analogous color with enough brightness to stand out from the primary.
- Body text and headline font: 'Inter' (sans-serif) for a modern, objective, neutral look. pulled from Google Fonts.
- Employ a clean and structured layout with a prominent sidebar for easy navigation.  Each section of the RFP process should be clearly delineated and easy to access. Use tabbed interfaces or segmented displays to manage the different stages (Intake, Selection, AI Drafting, etc.).
- Use a set of consistent, professional icons throughout the interface to represent different sections and actions. Icons should be simple and easily understandable, aiding navigation and reducing cognitive load.
- Incorporate subtle animations and transitions to provide feedback to user interactions and improve the overall user experience. For example, use a smooth transition when switching between dashboard sections or a loading animation when AI processes are running.