
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
import { generateAwardLetter } from "@/ai/flows/generate-award-letter";
import type { RFP, Contractor } from "@/lib/types";
import { useEffect, useState } from "react";
import { format } from "date-fns";
import Textarea from "../ui/textarea";

type RfpAwardDialogProps = {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  rfp: RFP;
  contractor: Contractor;
};

export function RfpAwardDialog({ isOpen, onOpenChange, rfp, contractor }: RfpAwardDialogProps) {
  const [emailContent, setEmailContent] = useState<{ to: string, subject: string, body: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [yourName, setYourName] = useState('Google Program Owner');
  const [yourPosition, setYourPosition] = useState('Program Manager');
  const [yourCompany, setYourCompany] = useState('Google');

  const formatDate = (date: any) => {
    if (!date) return 'TBD';
    const d = date.toDate ? date.toDate() : new Date(date);
    return format(d, 'MMMM d, yyyy');
  };

  useEffect(() => {
    if (isOpen) {
      setIsLoading(true);
      setEmailContent(null);
      
      const meetingDate = new Date();
      meetingDate.setDate(meetingDate.getDate() + 7);
      
      const confirmationDate = new Date();
      confirmationDate.setDate(confirmationDate.getDate() + 3);

      generateAwardLetter({
        projectName: rfp.projectName,
        contractorName: contractor.name,
        contractorEmail: contractor.contactEmail,
        meetingDate: format(meetingDate, 'MMMM d, yyyy') + ' at 10:00 AM PST',
        confirmationDate: format(confirmationDate, 'MMMM d, yyyy') + ' at 5:00 PM PST'
      }).then(result => {
        let body = result.emailBody;
        body = body.replace(/\[Your Name\]/g, yourName);
        body = body.replace(/\[Your Position\]/g, yourPosition);
        body = body.replace(/\[Your Company\]/g, yourCompany);
        setEmailContent({
            to: contractor.contactEmail,
            subject: result.emailSubject,
            body: body,
        });
        setIsLoading(false);
      }).catch(err => {
        console.error("Failed to generate email:", err);
        setIsLoading(false);
      });
    }
  }, [isOpen, rfp, contractor, yourName, yourPosition, yourCompany]);

  const updateBody = (field: 'name' | 'position' | 'company', value: string) => {
    if (!emailContent) return;

    let newBody = emailContent.body;
    if (field === 'name') newBody = newBody.replace(yourName, value);
    if (field === 'position') newBody = newBody.replace(yourPosition, value);
    if (field === 'company') newBody = newBody.replace(yourCompany, value);
    
    setEmailContent(prev => prev ? {...prev, body: newBody} : null);
  }

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateBody('name', e.target.value);
    setYourName(e.target.value);
  }
  const handlePositionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateBody('position', e.target.value);
    setYourPosition(e.target.value);
  }
  const handleCompanyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateBody('company', e.target.value);
    setYourCompany(e.target.value);
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>Generate Award Letter</DialogTitle>
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
                <h4 className="font-semibold">Your Information</h4>
                <div className="space-y-2">
                    <Label htmlFor="your-name">Your Name</Label>
                    <Input id="your-name" value={yourName} onChange={handleNameChange} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="your-position">Your Position</Label>
                    <Input id="your-position" value={yourPosition} onChange={handlePositionChange} />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="your-company">Your Company</Label>
                    <Input id="your-company" value={yourCompany} onChange={handleCompanyChange} />
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
