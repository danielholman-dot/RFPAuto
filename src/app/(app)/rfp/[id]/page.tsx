'use client';
import { notFound, useParams } from 'next/navigation';
import { RfpTabs } from '@/components/rfp/rfp-tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { RFP, MetroCode } from '@/lib/types';
import { useEffect, useState } from 'react';
import { useDoc, useCollection, useMemoFirebase, useFirestore, useUser } from '@/firebase';
import { doc, collection } from 'firebase/firestore';
import { Loader2 } from 'lucide-react';

export default function RfpDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const firestore = useFirestore();
  const { user, isUserLoading } = useUser();

  const rfpRef = useMemoFirebase(() => {
    if (!user) return null;
    return doc(firestore, 'rfps', id);
  }, [firestore, id, user]);
  const { data: rfp, isLoading: rfpLoading } = useDoc<RFP>(rfpRef);

  const metrosQuery = useMemoFirebase(() => {
    if (!user) return null;
    return collection(firestore, 'metro_codes');
  }, [firestore, user]);
  const { data: metroCodes, isLoading: metrosLoading } = useCollection<MetroCode>(metrosQuery);
  
  // Local state for mutations to reflect immediately
  const [localRfp, setLocalRfp] = useState<RFP | null>(null);

  useEffect(() => {
    if (rfp) {
        setLocalRfp(rfp);
    }
  }, [rfp]);

  const metroInfo = metroCodes?.find(m => m.code === localRfp?.metroCode);

  const formatDate = (date: any) => {
    if (!date) return 'N/A';
    // Firebase Timestamps have a toDate() method
    if (date.toDate) {
      return date.toDate().toLocaleDateString();
    }
    // Handle cases where it might already be a Date object
    return new Date(date).toLocaleDateString();
  };

  const getStatusVariant = (status?: RFP['status']) => {
    if (!status) return 'outline';
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
        return 'secondary'; // Yellow / warning for active states
      default:
        return 'secondary';
    }
  };

  const loading = isUserLoading || rfpLoading || metrosLoading;

  if (loading && !localRfp) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  // This part handles the creation of a *new* RFP, which doesn't exist in the DB yet.
  if (!localRfp) {
    if (id.startsWith('draft-')) {
        const newRfp: RFP = {
            id: id,
            projectName: 'New RFP Draft',
            scopeOfWork: 'To be defined.',
            metroCode: 'N/A',
            contractorType: 'N/A',
            estimatedBudget: 0,
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
                 <RfpTabs rfp={newRfp} setRfp={setLocalRfp} isDraft={true} />
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
              <CardTitle className="text-2xl font-bold">{localRfp.projectName}</CardTitle>
              <CardDescription>ID: {localRfp.id}</CardDescription>
            </div>
            <Badge variant={getStatusVariant(localRfp.status)} className="text-lg">{localRfp.status}</Badge>
          </div>
        </CardHeader>
        <CardContent className="grid md:grid-cols-3 gap-4 text-sm">
            <div><strong>Metro:</strong> {metroInfo ? `${metroInfo.code} - ${metroInfo.city}, ${metroInfo.state}`: localRfp.metroCode}</div>
            <div><strong>Contractor Type:</strong> {localRfp.contractorType}</div>
            <div className="md:col-span-3"><strong>Budget:</strong> ${localRfp.estimatedBudget.toLocaleString('de-DE')}</div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 md:col-span-3">
              <div><strong>RFP Start:</strong> {formatDate(localRfp.rfpStartDate)}</div>
              <div><strong>RFP End:</strong> {formatDate(localRfp.rfpEndDate)}</div>
              <div><strong>Project Start:</strong> {formatDate(localRfp.projectStartDate)}</div>
              <div><strong>Project End:</strong> {formatDate(localRfp.projectEndDate)}</div>
            </div>
            <div className="md:col-span-3">
                <p><strong>Scope:</strong> {localRfp.scopeOfWork}</p>
            </div>
        </CardContent>
      </Card>
      <RfpTabs rfp={localRfp} setRfp={setLocalRfp} />
    </div>
  );
}
