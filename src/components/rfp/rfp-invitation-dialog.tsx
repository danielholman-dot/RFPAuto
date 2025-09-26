
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
import { Label } from "@/components/ui/label";
import { Loader2, Send } from "lucide-react";
import { generateRfpInvitation } from "@/ai/flows/generate-rfp-invitations";
import type { RFP, Contractor } from "@/lib/types";
import { useEffect, useState } from "react";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";

type RfpInvitationDialogProps = {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  rfp: RFP;
  contractor: Contractor;
  onEoiSent: (contractorId: string) => void;
};

export function RfpInvitationDialog({ isOpen, onOpenChange, rfp, contractor, onEoiSent }: RfpInvitationDialogProps) {
  const [emailContent, setEmailContent] = useState<{ to: string, subject: string, body: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const formatDate = (date: any) => {
    if (!date) return 'TBD';
    const d = date.toDate ? date.toDate() : new Date(date);
    return format(d, 'MMMM d, yyyy');
  };

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
        rfpStartDate: formatDate(rfp.rfpStartDate),
        rfpEndDate: formatDate(rfp.rfpEndDate),
        projectStartDate: formatDate(rfp.projectStartDate),
        projectEndDate: formatDate(rfp.projectEndDate),
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
      });
    }
  }, [isOpen, rfp, contractor]);

  const handleSubjectChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (emailContent) {
      setEmailContent({ ...emailContent, subject: e.target.value });
    }
  };

  const handleSendEmail = () => {
    // In a real app, this would integrate with an email sending service
    toast({
        title: "EOI Sent",
        description: `Expression of Interest email sent to ${contractor.name}.`
    });
    onEoiSent(contractor.id);
  };


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
                <Input id="subject" value={emailContent.subject} onChange={handleSubjectChange} className="col-span-3" />
            </div>
             <div className="grid grid-cols-4 items-start gap-4">
                <Label htmlFor="body" className="text-right mt-2">Body</Label>
                <div 
                  id="body" 
                  className="col-span-3 h-64 border rounded-md p-2 text-sm overflow-auto"
                  dangerouslySetInnerHTML={{ __html: emailContent.body }}
                />
            </div>
          </div>
        ) : (
          <p className="text-center text-muted-foreground">Could not generate email content.</p>
        )}
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSendEmail} disabled={isLoading || !emailContent}>
            <Send className="mr-2 h-4 w-4" /> Send Email
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
