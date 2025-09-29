
'use client';
import { notFound, useParams } from 'next/navigation';
import { RfpTabs } from '@/components/rfp/rfp-tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { RFP } from '@/lib/types';
import { getRfpById, metroCodes } from '@/lib/data';
import { useEffect, useState }from 'react';

export default function RfpDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const [rfp, setRfp] = useState<RFP | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const data = await getRfpById(id);
      setRfp(data);
      setLoading(false);
    }
    if (id) {
      loadData();
    }
  }, [id]);

  const metroInfo = metroCodes.find(m => m.code === rfp?.metroCode);

  const formatDate = (date: any) => {
    if (!date) return 'N/A';
    if (date.toDate) { // Firebase Timestamp
      return date.toDate().toLocaleDateString();
    }
    return new Date(date).toLocaleDateString();
  };

  const getStatusVariant = (status: RFP['status']) => {
    switch (status) {
      case 'Award':
      case 'Completed':
        return 'default'; // Green / primary color for success
      case 'Analysis':
      case 'Feedback':
          return 'secondary'; // Blue / secondary for final stages
      case 'Draft':
        return 'outline'; // Grey outline for pending
      case 'Selection':
      case 'Invitation':
      case 'Proposals':
        return 'secondary'; // Yellow / warning for active states like Selection, Invitation, etc.
      default:
        return 'secondary';
    }
  };

  if (loading) {
    return <div>Loading RFP...</div>
  }

  if (!rfp) {
    // This part handles the creation of a *new* RFP, which doesn't exist in the DB yet.
    // We check for a specific prefix to know it's a new draft.
    if (id.startsWith('draft-')) {
        const newRfp: RFP = {
            id: id,
            projectName: 'New RFP Draft',
            scopeOfWork: 'To be defined.',
            metroCode: 'N/A',
            contractorType: 'N/A',
            estimatedBudget: 0,
            projectStartDate: new Date(),
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
                        <Badge variant={getStatusVariant(newRfp.status)} className="text-lg">{newRfp.status}</Badge>
                        </div>
                    </CardHeader>
                </Card>
                 <RfpTabs rfp={newRfp} setRfp={setRfp} isDraft={true} />
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
            <Badge variant={getStatusVariant(rfp.status)} className="text-lg">{rfp.status}</Badge>
          </div>
        </CardHeader>
        <CardContent className="grid md:grid-cols-3 gap-4 text-sm">
            <div><strong>Metro:</strong> {metroInfo ? `${metroInfo.code} - ${metroInfo.city}, ${metroInfo.state}`: rfp.metroCode}</div>
            <div><strong>Contractor Type:</strong> {rfp.contractorType}</div>
            <div className="md:col-span-3"><strong>Budget:</strong> ${rfp.estimatedBudget.toLocaleString('de-DE')}</div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 md:col-span-3">
              <div><strong>RFP Start:</strong> {formatDate(rfp.rfpStartDate)}</div>
              <div><strong>RFP End:</strong> {formatDate(rfp.rfpEndDate)}</div>
              <div><strong>Project Start:</strong> {formatDate(rfp.projectStartDate)}</div>
              <div><strong>Project End:</strong> {formatDate(rfp.projectEndDate)}</div>
            </div>
            <div className="md:col-span-3">
                <p><strong>Scope:</strong> {rfp.scopeOfWork}</p>
            </div>
        </CardContent>
      </Card>
      <RfpTabs rfp={rfp} setRfp={setRfp} />
    </div>
  );
}
