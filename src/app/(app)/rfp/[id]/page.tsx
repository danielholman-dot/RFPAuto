'use client';
import { notFound } from 'next/navigation';
import { RfpTabs } from '@/components/rfp/rfp-tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useDoc } from '@/firebase/firestore/use-doc';
import { doc } from 'firebase/firestore';
import { useFirestore } from '@/firebase';
import type { RFP } from '@/lib/types';

type RfpDetailPageProps = {
  params: {
    id: string;
  };
};

export default function RfpDetailPage({ params }: RfpDetailPageProps) {
  const firestore = useFirestore();
  const { data: rfp, loading } = useDoc<RFP>(doc(firestore, 'rfps', params.id));

  const formatDate = (date: any) => {
    if (!date) return 'N/A';
    if (date.toDate) { // Firebase Timestamp
      return date.toDate().toLocaleDateString();
    }
    return new Date(date).toLocaleDateString();
  };

  if (loading) {
    return <div>Loading RFP...</div>
  }

  if (!rfp) {
    // This part handles the creation of a *new* RFP, which doesn't exist in the DB yet.
    // We check for a specific prefix to know it's a new draft.
    if (params.id.startsWith('draft-')) {
        const newRfp: RFP = {
            id: params.id,
            projectName: 'New RFP Draft',
            scopeOfWork: 'To be defined.',
            metroCode: 'N/A',
            contractorType: 'N/A',
            estimatedBudget: 0,
            startDate: new Date(),
            status: 'Draft',
            proposals: [],
            invitedContractors: [],
        }
        return (
            <div className="space-y-6">
                <Card>
                    <CardHeader>
                        <div className="flex justify-between items-start">
                        <div>
                            <CardTitle className="text-2xl font-bold">{newRfp.projectName}</CardTitle>
                            <CardDescription>ID: {newRfp.id}</CardDescription>
                        </div>
                        <Badge variant="outline" className="text-lg">{newRfp.status}</Badge>
                        </div>
                    </CardHeader>
                </Card>
                 <RfpTabs rfp={newRfp} isDraft={true} />
            </div>
        )
    }
    notFound();
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl font-bold">{rfp.projectName}</CardTitle>
              <CardDescription>ID: {rfp.id}</CardDescription>
            </div>
            <Badge variant={rfp.status === 'Awarded' ? 'default' : 'secondary'} className="text-lg">{rfp.status}</Badge>
          </div>
        </CardHeader>
        <CardContent className="grid md:grid-cols-3 gap-4 text-sm">
            <div><strong>Metro:</strong> {rfp.metroCode}</div>
            <div><strong>Contractor Type:</strong> {rfp.contractorType}</div>
            <div><strong>Start Date:</strong> {formatDate(rfp.startDate)}</div>
            <div className="md:col-span-3"><strong>Budget:</strong> ${rfp.estimatedBudget.toLocaleString()}</div>
            <div className="md:col-span-3">
                <p><strong>Scope:</strong> {rfp.scopeOfWork}</p>
            </div>
        </CardContent>
      </Card>
      <RfpTabs rfp={rfp} />
    </div>
  );
}
