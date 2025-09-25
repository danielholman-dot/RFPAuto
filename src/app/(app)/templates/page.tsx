
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
        <AccordionItem value="item-1">
          <Card>
            <AccordionTrigger className="p-6">
              <div>
                <CardTitle className="text-left">EOI - Expression of Interest</CardTitle>
                <CardDescription className="text-left">
                  Template for sending an initial Expression of Interest invitation to
                  potential contractors.
                </CardDescription>
              </div>
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
        <AccordionItem value="item-2">
          <Card>
            <AccordionTrigger className="p-6">
              <div>
                <CardTitle className="text-left">Notice of Non-Award</CardTitle>
                <CardDescription className="text-left">
                  Template for notifying a contractor that they were not selected for a project.
                </CardDescription>
              </div>
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
            <AccordionTrigger className="p-6">
              <div>
                <CardTitle className="text-left">NDA Renewal Email</CardTitle>
                <CardDescription className="text-left">
                  Template for requesting an NDA renewal from a partner company.
                </CardDescription>
              </div>
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
