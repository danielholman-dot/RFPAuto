
'use client';
import { notFound, useParams } from 'next/navigation';
import { RfpTabs } from '@/components/rfp/rfp-tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { RFP, MetroCode } from '@/lib/types';
import { useDoc, useCollection, useMemoFirebase, useFirestore, useAuth } from '@/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { doc, collection } from 'firebase/firestore';
import { Loader2 } from 'lucide-react';

export default function RfpDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const firestore = useFirestore();
  const auth = useAuth();
  const [user, isUserLoading] = useAuthState(auth);

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
  
  const metroInfo = metroCodes?.find(m => m.code === rfp?.metroCode);

  const formatDate = (date: any) => {
    if (!date) return 'N/A';
    if (date.toDate) {
      return date.toDate().toLocaleDateString();
    }
    return new Date(date).toLocaleDateString();
  };

  const getStatusVariant = (status?: RFP['status']) => {
    if (!status) return 'outline';
    switch (status) {
      case 'Award':
      case 'Completed':
        return 'default'; 
      case 'Analysis':
      case 'Feedback':
          return 'secondary';
      case 'Draft':
        return 'outline';
      case 'Selection':
      case 'Invitation':
      case 'Proposals':
        return 'secondary';
      default:
        return 'secondary';
    }
  };
  
  const loading = isUserLoading || rfpLoading || metrosLoading;

  if (loading && !rfp) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }
  
  if (!rfp) {
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
            completedStages: [],
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
      <RfpTabs rfp={rfp} />
    </div>
  );
}

    