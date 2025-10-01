
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
import { generateNonAwardLetter } from "@/ai/flows/generate-non-award-letter";
import type { RFP, Contractor } from "@/lib/types";
import { useEffect, useState, useCallback } from "react";
import { format } from "date-fns";
import Textarea from "../ui/textarea";

type RfpNonAwardDialogProps = {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  rfp: RFP;
  contractor: Contractor;
};

export function RfpNonAwardDialog({ isOpen, onOpenChange, rfp, contractor }: RfpNonAwardDialogProps) {
  const [emailContent, setEmailContent] = useState<{ to: string, subject: string, body: string, originalBody: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [improvementAreas, setImprovementAreas] = useState('');
  const [yourName, setYourName] = useState('Google Program Owner');
  const [yourPosition, setYourPosition] = useState('Program Manager');
  const [yourCompany, setYourCompany] = useState('Google');
  
  const formatDate = (date: any) => {
    if (!date) return 'TBD';
    const d = date.toDate ? date.toDate() : new Date(date);
    return format(d, 'MMMM d, yyyy');
  };

  const generateAndSetEmail = useCallback(() => {
    setIsLoading(true);
    setEmailContent(null);
    
    generateNonAwardLetter({
      projectName: rfp.projectName,
      contractorName: contractor.name,
      contractorEmail: contractor.contactEmail,
      submissionDate: formatDate(rfp.rfpEndDate),
      improvementAreas: improvementAreas,
      primaryStakeholderEmail: rfp.primaryStakeholderEmail,
    }).then(result => {
      setEmailContent({
          to: contractor.contactEmail,
          subject: result.emailSubject,
          body: result.emailBody,
          originalBody: result.emailBody,
      });
      setIsLoading(false);
    }).catch(err => {
      console.error("Failed to generate email:", err);
      setIsLoading(false);
    });
  }, [rfp, contractor, improvementAreas]);

  useEffect(() => {
    if (isOpen) {
        generateAndSetEmail();
    }
  }, [isOpen, generateAndSetEmail]);

  const updateEmailBody = useCallback(() => {
    if (emailContent?.originalBody) {
      let newBody = emailContent.originalBody;
      newBody = newBody.replace(/\[Your Name\]/g, yourName);
      newBody = newBody.replace(/\[Your Position\]/g, yourPosition);
      newBody = newBody.replace(/\[Your Company\]/g, yourCompany);
      newBody = newBody.replace(/{{{improvementAreas}}}/g, improvementAreas);
      if (newBody !== emailContent.body) {
        setEmailContent(prev => prev ? { ...prev, body: newBody } : null);
      }
    }
  }, [emailContent?.originalBody, emailContent?.body, yourName, yourPosition, yourCompany, improvementAreas]);

  useEffect(() => {
    updateEmailBody();
  }, [yourName, yourPosition, yourCompany, improvementAreas, updateEmailBody]);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>Generate Non-Award Letter</DialogTitle>
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
          <div className="grid md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-4">
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
                    <div 
                    id="body" 
                    className="col-span-3 h-[28rem] border rounded-md p-2 text-sm overflow-auto bg-muted/50"
                    dangerouslySetInnerHTML={{ __html: emailContent.body }}
                    />
                </div>
            </div>
            <div className="space-y-4 border-l pl-6">
                <h4 className="font-semibold">Customization</h4>
                <div className="space-y-2">
                    <Label htmlFor="improvement-areas">Improvement Areas (Optional)</Label>
                    <Textarea 
                        id="improvement-areas" 
                        placeholder="e.g., - Greater detail in the project timeline would be beneficial.&#10;- More competitive pricing on material costs."
                        value={improvementAreas}
                        onChange={(e) => setImprovementAreas(e.target.value)}
                        className="h-32"
                    />
                </div>
                 <Button variant="ghost" size="sm" onClick={generateAndSetEmail}>Regenerate with feedback</Button>
                <h4 className="font-semibold">Your Information</h4>
                <div className="space-y-2">
                    <Label htmlFor="your-name">Your Name</Label>
                    <Input id="your-name" value={yourName} onChange={(e) => setYourName(e.target.value)} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="your-position">Your Position</Label>
                    <Input id="your-position" value={yourPosition} onChange={(e) => setYourPosition(e.target.value)} />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="your-company">Your Company</Label>
                    <Input id="your-company" value={yourCompany} onChange={(e) => setYourCompany(e.target.value)} />
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
