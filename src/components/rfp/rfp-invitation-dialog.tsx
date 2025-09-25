
'use client';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Textarea from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader2, Send } from "lucide-react";
import { generateRfpInvitation } from "@/ai/flows/generate-rfp-invitations";
import type { RFP, Contractor } from "@/lib/types";
import { useEffect, useState } from "react";
import { format } from "date-fns";

type RfpInvitationDialogProps = {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  rfp: RFP;
  contractor: Contractor;
};

export function RfpInvitationDialog({ isOpen, onOpenChange, rfp, contractor }: RfpInvitationDialogProps) {
  const [emailContent, setEmailContent] = useState<{ to: string, subject: string, body: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsLoading(true);
      setEmailContent(null);
      
      const eoiDueDate = rfp.rfpEndDate ? format(new Date(rfp.rfpEndDate), 'MMMM d, yyyy') + ' at 5:00 PM PST' : 'TBD';

      generateRfpInvitation({
        projectName: rfp.projectName,
        contractorName: contractor.name,
        campusLocation: rfp.metroCode,
        eoiDueDate: eoiDueDate,
      }).then(result => {
        setEmailContent({
            to: contractor.contactEmail,
            subject: result.emailSubject,
            body: result.emailBody,
        });
        setIsLoading(false);
      }).catch(err => {
        console.error("Failed to generate email:", err);
        setIsLoading(false);
        // Optionally, show an error message to the user
      });
    }
  }, [isOpen, rfp, contractor]);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>Generate EOI Invitation</DialogTitle>
          <DialogDescription>
            An email will be generated for {contractor.name}. Review and send.
          </DialogDescription>
        </DialogHeader>
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="w-8 h-8 animate-spin" />
            <p className="ml-2">Generating email...</p>
          </div>
        ) : emailContent ? (
          <div className="space-y-4">
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="to" className="text-right">To</Label>
                <Input id="to" value={emailContent.to} className="col-span-3" readOnly />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="subject" className="text-right">Subject</Label>
                <Input id="subject" value={emailContent.subject} className="col-span-3" />
            </div>
             <div className="grid grid-cols-4 items-start gap-4">
                <Label htmlFor="body" className="text-right mt-2">Body</Label>
                <div id="body" className="col-span-3 h-64 border rounded-md p-2 text-sm whitespace-pre-wrap overflow-auto">
                    {emailContent.body}
                </div>
            </div>
          </div>
        ) : (
          <p className="text-center text-muted-foreground">Could not generate email content.</p>
        )}
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button disabled={isLoading || !emailContent}>
            <Send className="mr-2 h-4 w-4" /> Send Email
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
