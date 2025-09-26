
'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { marcusSOPContent } from '@/lib/sop';
import { Button } from '@/components/ui/button';
import { Pencil } from 'lucide-react';

export default function TemplatesPage() {
  const eoiTemplate = {
    subject:
      'CONFIDENTIAL Expression of Interest - Google MARCUS [RFP Name | Year] [GC Name]',
    body: `Dear [GC NAME] Team,

Google is issuing an upcoming Request for Proposal (RFP) for one of its operational data center sites located in [Campus Location]. This work includes, but is not limited to, Moves, Adds, Retrofits, Changes, Utilities, and Security (collectively known as MARCUS works).

Google is seeking qualified General Contractors/Suppliers to perform post-facility handover work at our operational data center campuses located in [Campus Location]. This work includes, but is not limited to, Moves, Adds, Retrofits, Changes, Utilities, and Security (collectively known as MARCUS works). This is confidential information and adheres to the terms set forth in the NDA.

Objectives:
This Expression of Interest (EOI) aims to gather written submissions from qualified companies interested in participating in the upcoming RFP process.

Action Required
If your company is interested in receiving more details about this upcoming RFP, please provide all details required in the following Expression of Interest form [LINK]. Due [Month/Day/Year] at [Time] PST.

Thank you for your time and we appreciate your consideration as a potential partner.

Best regards,`,
  };

  const nonAwardTemplate = {
    subject: 'Notice of Decision - Google MARCUS [Project Name] - [Supplier Name]',
    body: `Dear [Supplier Name] Team,

We would like to thank you and your team for your participation in the MARCUS [Project Name] RFP on [Date].

The Google team has decided not to advance this specific project any further with your company. This email formally concludes our review process for this project. We appreciate your interest and will reach out for future RFPs that align with our needs.

We appreciate the time and effort you have put into responding to this RFP process. Please note, this decision does not prohibit your involvement in future RFP opportunities with Google.

While we don’t share the results of the RFP evaluation, here are some areas for potential improvement that could strengthen your proposal in future proposals:

[Improvement areas]

Thank you for your efforts to support this bid process. Should you have any additional questions, please don’t hesitate to let us know how we can help.

Regards,

[Your Name]
[Your Position]
[Your Company]`,
  };

  const ndaTemplate = {
    subject: 'NDA Renewal Request - [Company Name]',
    body: `Dear [Company Name or POC Name],

I hope this message finds you well.

We are reaching out to notify you that Google is currently in the process of updating its non-disclosure agreements. During our review, we noted that our NDA with your company is set to expire soon and requires renewal for another 5 years. This NDA is crucial as it enables Google’s Data Center Construction team to engage your company regarding future Requests for Proposals (RFPs).

To expedite this renewal process, we kindly request the following information:
- Legal entity name of your company
- Company address and website
- Name, role, and email address of the person authorized to sign the new NDA

Once we receive the above information, we will send the updated NDA via DocuSign for your review and signature.

Thank you for your prompt attention to this matter. We look forward to your response.

Sincerely,

[Your Name]
[Your Position]`,
  };

  const awardTemplate = {
    subject: 'Award Notification: MARCUS Project/Site Name',
    body: `Dear [Supplier Name],

We are pleased to announce that [Supplier Name] has been awarded the MARCUS Project/Site Name RFP after a comprehensive review and assessment of your proposal. Congratulations on your successful selection to move forward in this exciting opportunity!

Please find attached the formal award letter, which outlines the conditions of the award and the required next steps. Highlights include:
- Final Confirmation of Onsite Project Personnel: Please upload the appropriate resumes to your designated folder [LINK], detailing the site-specific staffing roster for Google's final project team approval.
- Project Team Meeting: Join GPO and the XX Project Team for a meeting on [Month/Day/Year] at [Time] PST. A separate calendar invite will be sent for this meeting—please let us know if you do not receive it. All proposed onsite personnel are expected to attend.

Your points of contact for the next phase will be:
- Program Lead: XX
- Site MARCUS Lead: XX
- Regional Contract Manager: XX

Please respond to the email containing this notice to confirm your acceptance of the award and the specified conditions by no later than [Month/Day/Year] at [Time] PST, by “Replying All” to this email. 

We deeply appreciate your participation in the RFP process and look forward to a successful partnership with [Supplier Name] as we move into the next phase of the MARCUS [Project name] initiative.

Best regards,

[Your Name]
[Your Position]
[Your Company]`,
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Templates</CardTitle>
          <CardDescription>
            Standard templates for RFP-related communications.
          </CardDescription>
        </CardHeader>
      </Card>
      <Accordion type="single" collapsible className="w-full space-y-4">
        <AccordionItem value="item-5">
          <Card>
            <AccordionTrigger className="p-6 justify-between items-center w-full">
              <div className="text-left">
                <CardTitle>RFP Instructions (SOP)</CardTitle>
                <CardDescription>
                  This is the Standard Operating Procedure document used by the AI to generate new RFP drafts.
                </CardDescription>
              </div>
              <Button variant="ghost" size="icon" className="mr-4" onClick={(e) => { e.stopPropagation(); alert('Edit functionality to be added.'); }}>
                <Pencil className="h-4 w-4" />
              </Button>
            </AccordionTrigger>
            <AccordionContent>
              <CardContent className="space-y-4">
                <div className="text-sm p-3 bg-muted rounded-md mt-1 whitespace-pre-wrap font-mono h-[60vh] overflow-auto">
                    {marcusSOPContent}
                </div>
              </CardContent>
            </AccordionContent>
          </Card>
        </AccordionItem>
        <AccordionItem value="item-1">
          <Card>
            <AccordionTrigger className="p-6 justify-between items-center w-full">
              <div className="text-left">
                <CardTitle>EOI - Expression of Interest</CardTitle>
                <CardDescription>
                  Template for sending an initial Expression of Interest invitation to
                  potential contractors.
                </CardDescription>
              </div>
              <Button variant="ghost" size="icon" className="mr-4" onClick={(e) => { e.stopPropagation(); alert('Edit functionality to be added.'); }}>
                <Pencil className="h-4 w-4" />
              </Button>
            </AccordionTrigger>
            <AccordionContent>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold text-sm text-muted-foreground">
                    Subject
                  </h3>
                  <p className="text-sm p-3 bg-muted rounded-md mt-1">
                    {eoiTemplate.subject}
                  </p>
                </div>
                <Separator />
                <div>
                  <h3 className="font-semibold text-sm text-muted-foreground">
                    Body
                  </h3>
                  <div className="text-sm p-3 bg-muted rounded-md mt-1 whitespace-pre-wrap font-mono">
                    {eoiTemplate.body}
                  </div>
                </div>
              </CardContent>
            </AccordionContent>
          </Card>
        </AccordionItem>
        <AccordionItem value="item-4">
          <Card>
            <AccordionTrigger className="p-6 justify-between items-center w-full">
              <div className="text-left">
                <CardTitle>Notice of Award</CardTitle>
                <CardDescription>
                  Template for notifying a contractor that they were selected for a project.
                </CardDescription>
              </div>
              <Button variant="ghost" size="icon" className="mr-4" onClick={(e) => { e.stopPropagation(); alert('Edit functionality to be added.'); }}>
                <Pencil className="h-4 w-4" />
              </Button>
            </AccordionTrigger>
            <AccordionContent>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold text-sm text-muted-foreground">
                    Subject
                  </h3>
                  <p className="text-sm p-3 bg-muted rounded-md mt-1">
                    {awardTemplate.subject}
                  </p>
                </div>
                <Separator />
                <div>
                  <h3 className="font-semibold text-sm text-muted-foreground">
                    Body
                  </h3>
                  <div className="text-sm p-3 bg-muted rounded-md mt-1 whitespace-pre-wrap font-mono">
                    {awardTemplate.body}
                  </div>
                </div>
              </CardContent>
            </AccordionContent>
          </Card>
        </AccordionItem>
        <AccordionItem value="item-2">
          <Card>
            <AccordionTrigger className="p-6 justify-between items-center w-full">
              <div className="text-left">
                <CardTitle>Notice of Non-Award</CardTitle>
                <CardDescription>
                  Template for notifying a contractor that they were not selected for a project.
                </CardDescription>
              </div>
              <Button variant="ghost" size="icon" className="mr-4" onClick={(e) => { e.stopPropagation(); alert('Edit functionality to be added.'); }}>
                <Pencil className="h-4 w-4" />
              </Button>
            </AccordionTrigger>
            <AccordionContent>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold text-sm text-muted-foreground">
                    Subject
                  </h3>
                  <p className="text-sm p-3 bg-muted rounded-md mt-1">
                    {nonAwardTemplate.subject}
                  </p>
                </div>
                <Separator />
                <div>
                  <h3 className="font-semibold text-sm text-muted-foreground">
                    Body
                  </h3>
                  <div className="text-sm p-3 bg-muted rounded-md mt-1 whitespace-pre-wrap font-mono">
                    {nonAwardTemplate.body}
                  </div>
                </div>
              </CardContent>
            </AccordionContent>
          </Card>
        </AccordionItem>
        <AccordionItem value="item-3">
          <Card>
            <AccordionTrigger className="p-6 justify-between items-center w-full">
              <div className="text-left">
                <CardTitle>NDA Renewal Email</CardTitle>
                <CardDescription>
                  Template for requesting an NDA renewal from a partner company.
                </CardDescription>
              </div>
              <Button variant="ghost" size="icon" className="mr-4" onClick={(e) => { e.stopPropagation(); alert('Edit functionality to be added.'); }}>
                <Pencil className="h-4 w-4" />
              </Button>
            </AccordionTrigger>
            <AccordionContent>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold text-sm text-muted-foreground">
                    Subject
                  </h3>
                  <p className="text-sm p-3 bg-muted rounded-md mt-1">
                    {ndaTemplate.subject}
                  </p>
                </div>
                <Separator />
                <div>
                  <h3 className="font-semibold text-sm text-muted-foreground">
                    Body
                  </h3>
                  <div className="text-sm p-3 bg-muted rounded-md mt-1 whitespace-pre-wrap font-mono">
                    {ndaTemplate.body}
                  </div>
                </div>
              </CardContent>
            </AccordionContent>
          </Card>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
