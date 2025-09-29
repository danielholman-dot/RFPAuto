
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
        { id: 'be-1', text: 'Replace mock data with a real database connection (e.g., Firestore).', completed: false, level: 'Owner' },
        { id: 'be-2', text: 'Implement file uploads for technical documents and proposal submissions.', completed: false, level: 'Any' },
        { id: 'be-3', text: 'Secure all backend API endpoints and server actions.', completed: false, level: 'Any' },
        { id: 'be-4', text: 'Create database logic to save RFP progress, stage completions, and user edits.', completed: false, level: 'Any' },
    ],
    'Frontend & UI': [
        { id: 'fe-1', text: 'Connect email sending dialogs (EOI, Award, Non-Award) to a real email service.', completed: false, level: 'Any' },
        { id: 'fe-2', text: 'Implement "Forgot Password" and user profile management pages.', completed: false, level: 'Any' },
        { id: 'fe-3', text: 'Wire up the "Permissions" table on the Settings page to a user role management system.', completed: false, level: 'Owner' },
        { id: 'fe-4', text: 'Ensure all forms have comprehensive validation and error handling.', completed: false, level: 'Any' },
        { id: 'fe-5', text: 'Finalize the UI/UX for all interactive components based on user feedback.', completed: false, level: 'Any' },
    ],
    'Authentication & Security': [
        { id: 'auth-1', text: 'Implement a full authentication flow (Login, Logout, Session Management).', completed: false, level: 'Owner' },
        { id: 'auth-2', text: 'Enforce role-based access control (RBAC) based on the permissions set in Settings.', completed: false, level: 'Owner' },
        { id: 'auth-3', text: 'Add security headers and configure Cross-Origin Resource Sharing (CORS) policies.', completed: false, level: 'Owner' },
    ],
    'Deployment & Operations': [
        { id: 'deploy-1', text: 'Set up production and staging deployment environments.', completed: false, level: 'Owner' },
        { id: 'deploy-2', text: 'Configure environment variables for database connections and API keys.', completed: false, level: 'Owner' },
        { id: 'deploy-3', text: 'Implement logging, monitoring, and alerting for the production application.', completed: false, level: 'Owner' },
        { id: 'deploy-4', text: 'Perform a final security audit and penetration testing.', completed: false, level: 'Owner' },
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
            <Accordion type="multiple" defaultValue={Object.keys(tasks)} className="w-full space-y-4">
                {(Object.keys(tasks) as TaskCategory[]).map(category => (
                    <AccordionItem value={category} key={category}>
                        <Card>
                            <AccordionTrigger className="p-6 hover:no-underline">
                                <CardTitle className="text-xl">{category}</CardTitle>
                            </AccordionTrigger>
                            <AccordionContent className="px-6">
                                <div className="space-y-4">
                                    {tasks[category].map(task => (
                                        <div key={task.id} className="flex items-center justify-between">
                                            <div className="flex items-center space-x-3">
                                                <Checkbox id={task.id} checked={task.completed} />
                                                <label
                                                    htmlFor={task.id}
                                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                                >
                                                    {task.text}
                                                </label>
                                            </div>
                                            <Badge variant={task.level === 'Owner' ? 'destructive' : 'secondary'}>{task.level}</Badge>
                                        </div>
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
