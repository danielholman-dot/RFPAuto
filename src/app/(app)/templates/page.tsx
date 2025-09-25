
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
      <Accordion type="single" collapsible className="w-full">
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
      </Accordion>
    </div>
  );
}
