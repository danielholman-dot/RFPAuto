
'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import type { RFP } from '@/lib/types';
import { getRfpById, getContractors, addProposal } from '@/lib/data';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import { useFirebase } from '@/firebase';
import type { FirebaseServicesAndUser } from '@/firebase/provider';

type ProposalSubmitFormProps = {
  rfpId: string;
  router: ReturnType<typeof useRouter>;
  firebase: FirebaseServicesAndUser;
};

function ProposalSubmitForm({ rfpId, router, firebase }: ProposalSubmitFormProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [contractorId, setContractorId] = useState('');
  const [rfp, setRfp] = useState<RFP | null>(null);
  const [loading, setLoading] = useState(true);
  
  const { firestore } = firebase;

  useEffect(() => {
    async function loadData() {
      if (!firestore) return;
      const rfpData = await getRfpById(rfpId);
      setRfp(rfpData);

      // In a real app, you might get this from an auth context or URL param
      // For now, we'll just pick a random one for demonstration
      const contractors = await getContractors();
      if (contractors.length > 0) {
        const randomContractor = contractors[Math.floor(Math.random() * contractors.length)];
        setContractorId(randomContractor.id);
      }
      setLoading(false);
    }
    loadData();
  }, [rfpId, firestore]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!file || !rfpId || !contractorId) {
      alert('Please select a file and ensure you have a valid RFP link.');
      return;
    }

    setIsSubmitting(true);

    try {
      // In a real app, you would upload the file to Firebase Storage
      // and get the download URL. Here we'll simulate it.
      const proposalDocumentUrl = `proposals/${rfpId}/${file.name}`;
      // In a real app, you might use a Cloud Function to extract text.
      const proposalText = `This is a dummy extracted text for the file: ${file.name}. File size: ${file.size} bytes.`;

      await addProposal(rfpId, {
        contractorId: contractorId,
        rfpId: rfpId,
        submittedDate: new Date(),
        status: 'Submitted',
        proposalDocumentUrl,
        proposalText,
      });

      alert('Proposal submitted successfully!');
      router.push(`/proposal/submit/success`);
    } catch (error) {
      console.error('Error submitting proposal:', error);
      alert('Failed to submit proposal. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen"><Loader2 className="w-8 h-8 animate-spin" /></div>;
  }

  if (!rfp) {
    return <div className="flex justify-center items-center h-screen"><p>RFP not found.</p></div>;
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-muted">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>Submit Proposal</CardTitle>
          <CardDescription>For: {rfp.projectName}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="proposal-file">Proposal Document</Label>
              <Input id="proposal-file" type="file" onChange={handleFileChange} required />
               <p className="text-xs text-muted-foreground">To upload a Google Sheet, first go to File > Download > Microsoft Excel (.xlsx) and upload the exported file.</p>
            </div>
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Submit Proposal
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}


export default function ProposalSubmitPage() {
    const params = useParams();
    const router = useRouter();
    const firebase = useFirebase();

    const rfpId = params.rfpId as string;

    if (!rfpId) {
        return <div className="flex justify-center items-center h-screen"><p>Invalid RFP link.</p></div>;
    }

    return <ProposalSubmitForm rfpId={rfpId} router={router} firebase={firebase} />;
}
