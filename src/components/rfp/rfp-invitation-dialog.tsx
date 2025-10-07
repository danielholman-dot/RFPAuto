
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
import { Loader2, Send, Pencil, Save } from "lucide-react";
import { generateRfpReleaseEmail } from "@/ai/flows/generate-rfp-release-email";
import type { RFP, Contractor } from "@/lib/types";
import { useEffect, useState } from "react";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import Textarea from "../ui/textarea";

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
  const [isEditing, setIsEditing] = useState(false);
  const { toast } = useToast();

  const formatDate = (date: any) => {
    if (!date) return 'TBD';
    const d = date?.toDate ? date.toDate() : new Date(date);
    if (isNaN(d.getTime())) return 'TBD';
    return format(d, 'MM/dd/yyyy');
  };

  useEffect(() => {
    if (isOpen) {
      setIsLoading(true);
      setIsEditing(false);
      setEmailContent(null);
      
      const rfpEndDate = rfp.rfpEndDate ? (rfp.rfpEndDate.toDate ? rfp.rfpEndDate.toDate() : new Date(rfp.rfpEndDate)) : new Date();
      if (isNaN(rfpEndDate.getTime())) {
          console.error("Invalid rfpEndDate");
          setIsLoading(false);
          toast({ variant: "destructive", title: "Error", description: "Invalid RFP End Date."});
          return;
      }
      const submissionLink = `${window.location.origin}/proposal/submit/${rfp.id}`;

      generateRfpReleaseEmail({
        projectName: rfp.projectName,
        contractorName: contractor.name,
        campusLocation: rfp.metroCode,
        year: new Date().getFullYear().toString(),
        confirmationDueDate: formatDate(new Date(rfpEndDate.getTime() - 18 * 24 * 60 * 60 * 1000)), // 2 days after start
        qnaDueDate: formatDate(new Date(rfpEndDate.getTime() - 13 * 24 * 60 * 60 * 1000)), // 7 days after start
        submissionDueDate: formatDate(rfpEndDate),
        submissionLink: submissionLink,
        primaryStakeholderName: rfp.primaryStakeholderName,
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
  }, [isOpen, rfp, contractor, toast]);

  const handleContentChange = (field: 'subject' | 'body', value: string) => {
    if (emailContent) {
      setEmailContent({ ...emailContent, [field]: value });
    }
  };

  const handleSendEmail = () => {
    // In a real app, this would integrate with an email sending service
    toast({
        title: "RFP Release Sent",
        description: `RFP Release email sent to ${contractor.name}.`
    });
    onEoiSent(contractor.id);
  };


  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>Generate RFP Release Email</DialogTitle>
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
                <Input 
                  id="subject" 
                  value={emailContent.subject} 
                  onChange={(e) => handleContentChange('subject', e.target.value)} 
                  className="col-span-3" 
                />
            </div>
             <div className="grid grid-cols-4 items-start gap-4">
                <Label htmlFor="body" className="text-right mt-2">Body</Label>
                <div className="col-span-3 space-y-2">
                  {isEditing ? (
                    <Textarea 
                      id="body"
                      value={emailContent.body.replace(/<br\s*\/?>/gi, '\n')}
                      onChange={(e) => handleContentChange('body', e.target.value.replace(/\n/g, '<br/>'))}
                      className="h-96 text-sm bg-background"
                    />
                  ) : (
                    <div 
                      id="body"
                      className="h-96 border rounded-md p-2 text-sm overflow-auto bg-muted/50"
                      dangerouslySetInnerHTML={{ __html: emailContent.body }}
                    />
                  )}
                  <div className="flex justify-end">
                    <Button variant="ghost" size="sm" onClick={() => setIsEditing(!isEditing)}>
                      {isEditing ? <><Save className="mr-2 h-4 w-4" /> Save</> : <><Pencil className="mr-2 h-4 w-4" /> Edit</>}
                    </Button>
                  </div>
                </div>
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
