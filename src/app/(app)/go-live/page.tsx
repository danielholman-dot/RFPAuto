
'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { ClipboardList } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const tasks = {
    'Backend & Data Persistence': [
        { 
            id: 'be-1', 
            text: 'Replace mock data with a real database connection (e.g., Firestore).', 
            completed: false, 
            level: 'Owner',
            steps: [
                "1. Set up a new Firebase project and create a Firestore database.",
                "2. Define data models/schemas for RFPs, Contractors, and Proposals.",
                "3. Replace functions in `src/lib/data.ts` with Firestore SDK calls (`getDoc`, `addDoc`, `query`).",
                "4. Ensure security rules are in place to protect the data."
            ]
        },
        { 
            id: 'be-2', 
            text: 'Implement file uploads for technical documents and proposal submissions.', 
            completed: false, 
            level: 'Any',
            steps: [
                "1. Choose a storage solution (e.g., Firebase Storage).",
                "2. Create a service to handle file uploads, which returns a URL.",
                "3. Update the RFP creation form and proposal submission page to use this service.",
                "4. Store the returned file URL in the corresponding Firestore document."
            ]
        },
        { 
            id: 'be-3', 
            text: 'Secure all backend API endpoints and server actions.', 
            completed: false, 
            level: 'Any',
            steps: [
                "1. In each server action or API route, get the current authenticated user.",
                "2. Check if the user has the required role/permission for the action.",
                "3. If the user is not authenticated or authorized, throw an error.",
                "4. Implement this for all data mutation endpoints (create, update, delete)."
            ]
        },
        { 
            id: 'be-4', 
            text: 'Create database logic to save RFP progress, stage completions, and user edits.', 
            completed: false, 
            level: 'Any',
            steps: [
                "1. Create a `updateRfp` function that accepts an RFP ID and the data to update.",
                "2. In the `RfpTabs` component, call this function whenever a stage is marked complete or data is edited.",
                "3. Ensure the function uses `setDoc` with `{ merge: true }` or `updateDoc` to avoid overwriting data."
            ]
        },
    ],
    'Frontend & UI': [
        { 
            id: 'fe-1', 
            text: 'Connect email sending dialogs (EOI, Award, Non-Award) to a real email service.', 
            completed: false, 
            level: 'Any',
            steps: [
                "1. Choose an email sending service (e.g., SendGrid, Resend).",
                "2. Create a server action that takes recipient, subject, and body, and sends the email.",
                "3. In the dialog components, call this server action when the 'Send' button is clicked.",
                "4. Add success and error handling with toasts."
            ]
        },
        { 
            id: 'fe-2', 
            text: 'Implement "Forgot Password" and user profile management pages.', 
            completed: false, 
            level: 'Any',
            steps: [
                "1. Create a 'Forgot Password' page that uses the Firebase Auth SDK's `sendPasswordResetEmail` function.",
                "2. Create a 'Profile' or 'Account' page for logged-in users.",
                "3. On the profile page, allow users to update their name and change their password using `updatePassword`."
            ]
        },
        { 
            id: 'fe-3', 
            text: 'Wire up the "Permissions" table on the Settings page to a user role management system.', 
            completed: false, 
            level: 'Owner',
            steps: [
                "1. Store permissions configuration in the database instead of local state.",
                "2. Create functions to fetch and update these permissions.",
                "3. The Settings page should use these functions to display and save changes.",
                "4. This database config will be the source of truth for securing backend actions."
            ]
        },
        { 
            id: 'fe-4', 
            text: 'Ensure all forms have comprehensive validation and error handling.', 
            completed: false, 
            level: 'Any',
            steps: [
                "1. Review all forms (`ProjectIntakeForm`, etc.) and ensure Zod schemas are strict.",
                "2. Add validation for required fields, string lengths, and data formats.",
                "3. Make sure `<FormMessage />` is present for every field to display errors.",
                "4. Test forms with invalid data to ensure errors are displayed correctly."
            ]
        },
        { 
            id: 'fe-5', 
            text: 'Finalize the UI/UX for all interactive components based on user feedback.', 
            completed: false, 
            level: 'Any',
            steps: [
                "1. Conduct user testing sessions with target users (GPO, PMs).",
                "2. Gather feedback on workflow, clarity, and ease of use.",
                "3. Prioritize feedback and create tickets for UI/UX improvements.",
                "4. Iterate on component designs based on feedback."
            ]
        },
    ],
    'Authentication & Security': [
        { 
            id: 'auth-1', 
            text: 'Implement a full authentication flow (Login, Logout, Session Management).', 
            completed: false, 
            level: 'Owner',
            steps: [
                "1. Set up Firebase Authentication and enable providers (e.g., Email/Password, Google).",
                "2. Create Login and Sign-up pages using Firebase Auth UI or custom forms.",
                "3. Implement logic to handle user sessions, protecting pages that require login.",
                "4. Add a 'Logout' button that calls the `signOut` function."
            ]
        },
        { 
            id: 'auth-2', 
            text: 'Enforce role-based access control (RBAC) based on the permissions set in Settings.', 
            completed: false, 
            level: 'Owner',
            steps: [
                "1. When a user logs in, fetch their role (e.g., 'gpo', 'pm') from the database.",
                "2. Store the user's role in their session or auth token (using custom claims).",
                "3. On the frontend, conditionally render UI elements based on the user's role.",
                "4. In the backend, verify the user's role before allowing sensitive operations."
            ]
        },
        { 
            id: 'auth-3', 
            text: 'Add security headers and configure Cross-Origin Resource Sharing (CORS) policies.', 
            completed: false, 
            level: 'Owner',
            steps: [
                "1. In `next.config.js`, add a `headers` function to apply security headers (CSP, X-XSS-Protection, etc.).",
                "2. If the frontend and backend are on different domains, configure CORS policies.",
                "3. Ensure `HttpOnly` and `Secure` flags are set on session cookies."
            ]
        },
    ],
    'Deployment & Operations': [
        { 
            id: 'deploy-1', 
            text: 'Set up production and staging deployment environments.', 
            completed: false, 
            level: 'Owner',
            steps: [
                "1. Choose a hosting provider (e.g., Firebase App Hosting, Vercel).",
                "2. Create two environments: one for 'staging' and one for 'production'.",
                "3. Configure CI/CD pipelines to automatically deploy branches to the correct environment."
            ]
        },
        { 
            id: 'deploy-2', 
            text: 'Configure environment variables for database connections and API keys.', 
            completed: false, 
            level: 'Owner',
            steps: [
                "1. Create separate `.env.production` and `.env.development` files.",
                "2. Add secrets for database credentials, email service keys, etc., to your hosting provider's environment variable settings.",
                "3. Do not commit secret keys to the Git repository."
            ]
        },
        { 
            id: 'deploy-3', 
            text: 'Implement logging, monitoring, and alerting for the production application.', 
            completed: false, 
            level: 'Owner',
            steps: [
                "1. Integrate a logging service (e.g., Sentry, Logtail) to capture errors.",
                "2. Set up uptime monitoring to get alerts if the application goes down.",
                "3. Configure alerts for high error rates or performance degradation."
            ]
        },
        { _id: 'deploy-4', 
            id: 'deploy-4', 
            text: 'Perform a final security audit and penetration testing.', 
            completed: false, 
            level: 'Owner',
            steps: [
                "1. Review all code for common security vulnerabilities (XSS, CSRF, SQLi-like issues with NoSQL).",
                "2. Use security scanning tools to check for dependencies with known vulnerabilities.",
                "3. Consider hiring a third-party service to perform a penetration test on the live application."
            ]
        },
    ],
};

type TaskCategory = keyof typeof tasks;

export default function GoLivePage() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ClipboardList className="w-6 h-6" />
            To-Do List: Go-Live Checklist
          </CardTitle>
          <CardDescription>
            A high-level overview of the remaining tasks to make this application production-ready.
          </CardDescription>
        </CardHeader>
        <CardContent>
            <Accordion type="multiple" className="w-full space-y-4">
                {(Object.keys(tasks) as TaskCategory[]).map(category => (
                    <AccordionItem value={category} key={category} className="border-b-0">
                        <Card>
                            <AccordionTrigger className="p-6 hover:no-underline text-xl">
                                {category}
                            </AccordionTrigger>
                            <AccordionContent className="px-6">
                                <div className="space-y-6">
                                    {tasks[category].map(task => (
                                        <Accordion key={task.id} type="single" collapsible className="w-full">
                                            <AccordionItem value={task.id} className="border rounded-lg">
                                                <AccordionTrigger className="p-4 hover:no-underline">
                                                    <div className="flex items-center justify-between w-full">
                                                        <div className="flex items-center space-x-3">
                                                            <Checkbox id={task.id} checked={task.completed} onClick={(e) => e.stopPropagation()} />
                                                            <label
                                                                htmlFor={task.id}
                                                                className="text-sm font-medium leading-none"
                                                            >
                                                                {task.text}
                                                            </label>
                                                        </div>
                                                        <Badge variant={task.level === 'Owner' ? 'destructive' : 'secondary'}>{task.level}</Badge>
                                                    </div>
                                                </AccordionTrigger>
                                                <AccordionContent className="px-4">
                                                     <div className="mt-2 pl-7 text-xs text-muted-foreground space-y-1">
                                                        <p className="font-bold mb-2">Steps:</p>
                                                        {task.steps.map((step, index) => (
                                                            <p key={index}>{step}</p>
                                                        ))}
                                                    </div>
                                                </AccordionContent>
                                            </AccordionItem>
                                        </Accordion>
                                    ))}
                                </div>
                            </AccordionContent>
                        </Card>
                    </AccordionItem>
                ))}
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
}

    