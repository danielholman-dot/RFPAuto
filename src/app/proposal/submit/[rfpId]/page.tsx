'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useFirestore, useDoc } from '@/firebase';
import { doc, addDoc, collection, serverTimestamp } from 'firebase/firestore';
import type { RFP } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import { FirebaseClientProvider } from '@/firebase/client-provider';

function ProposalSubmitForm() {
  const { rfpId } = useParams();
  const router = useRouter();
  const firestore = useFirestore();
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [contractorId, setContractorId] = useState('');

  // Dummy implementation for getting a contractor ID.
  // In a real app, you would get this from the authenticated user.
  if (!contractorId) {
    const randomId = Math.random().toString(36).substring(2);
    // A list of some contractor IDs that exist in firestore from seeding.
    const contractorIds = ['0yPAa7sLcb08n4s8iLfL', '5aITH6T7nifYmU5tKq2T', '6U4YpYq6y1h3f2C2gN3q'];
    setContractorId(contractorIds[Math.floor(Math.random() * contractorIds.length)]);
  }

  const { data: rfp, loading } = useDoc<RFP>(doc(firestore, 'rfps', rfpId as string));

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
      // Dummy URL and text extraction
      const proposalDocumentUrl = `https://example.com/proposals/${rfpId}/${file.name}`;
      const proposalText = `This is a dummy extracted text for the file: ${file.name}. File size: ${file.size} bytes.`;

      await addDoc(collection(firestore, 'rfps', rfpId as string, 'proposals'), {
        contractorId: contractorId,
        rfpId: rfpId,
        submittedDate: serverTimestamp(),
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
              <Label htmlFor="proposal-file">Proposal Document (PDF)</Label>
              <Input id="proposal-file" type="file" accept=".pdf" onChange={handleFileChange} required />
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
    return (
        <FirebaseClientProvider>
            <ProposalSubmitForm />
        </FirebaseClientProvider>
    )
}
