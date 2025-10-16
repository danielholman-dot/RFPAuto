
'use client';

import { useParams, notFound, useRouter } from 'next/navigation';
import type { RFP, Contractor, MetroCode } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, ArrowLeft, Users, FileText } from 'lucide-react';
import { useDoc, useCollection, useMemoFirebase, useFirestore } from '@/firebase';
import { doc, collection, query, where } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

export default function MetroDetailPage() {
  const params = useParams();
  const code = params.code as string;
  const firestore = useFirestore();
  const router = useRouter();

  const metroQuery = useMemoFirebase(() => {
    if (!code) return null;
    return query(collection(firestore, 'metro_codes'), where('code', '==', code));
  }, [firestore, code]);
  const { data: metroData, isLoading: metroLoading } = useCollection<MetroCode>(metroQuery);
  const metro = metroData?.[0];

  const rfpsQuery = useMemoFirebase(() => {
    if (!code) return null;
    return query(collection(firestore, 'rfps'), where('metroCode', '==', code));
  }, [firestore, code]);
  const { data: rfps, isLoading: rfpsLoading } = useCollection<RFP>(rfpsQuery);

  const contractorsQuery = useMemoFirebase(() => {
    if (!code) return null;
    return query(collection(firestore, 'contractors'), where('metroCodes', 'array-contains', code));
  }, [firestore, code]);
  const { data: contractors, isLoading: contractorsLoading } = useCollection<Contractor>(contractorsQuery);

  const loading = metroLoading || rfpsLoading || contractorsLoading;

  const formatDate = (date: any) => {
    if (!date) return 'N/A';
    const d = date.toDate ? date.toDate() : new Date(date);
    return d.toLocaleDateString();
  };
  
  const getRfpStatusVariant = (status: RFP['status']) => {
    switch (status) {
      case 'Award':
      case 'Completed':
        return 'default';
      case 'Analysis':
      case 'Feedback':
        return 'secondary';
      case 'Draft':
        return 'outline';
      default:
        return 'secondary';
    }
  };

  const getContractorStatusVariant = (status: string) => {
    switch (status) {
        case 'Most Preferred':
            return 'default';
        case 'Preferred':
            return 'secondary';
        default:
            return 'outline';
    }
  };


  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!metro) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <Button variant="outline" onClick={() => router.back()}>
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Metro List
      </Button>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <CardTitle className="text-3xl">Metro Summary: {metro.code}</CardTitle>
              <CardDescription className="text-lg">{metro.city}, {metro.state} - {metro.region}</CardDescription>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-4 md:mt-0">
                <div className="flex items-center gap-3 bg-muted p-3 rounded-lg">
                    <FileText className="h-6 w-6 text-muted-foreground" />
                    <div>
                        <div className="text-2xl font-bold">{rfps?.length || 0}</div>
                        <p className="text-xs text-muted-foreground">RFPs</p>
                    </div>
                </div>
                <div className="flex items-center gap-3 bg-muted p-3 rounded-lg">
                    <Users className="h-6 w-6 text-muted-foreground" />
                    <div>
                        <div className="text-2xl font-bold">{contractors?.length || 0}</div>
                        <p className="text-xs text-muted-foreground">Contractors</p>
                    </div>
                </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>RFPs in this Metro</CardTitle>
          </CardHeader>
          <CardContent>
            {rfps && rfps.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Project</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Budget</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rfps.map(rfp => (
                    <TableRow key={rfp.id}>
                      <TableCell className="font-medium">
                        <Link href={`/rfp/${rfp.id}`} className="text-primary hover:underline">{rfp.projectName}</Link>
                      </TableCell>
                      <TableCell><Badge variant={getRfpStatusVariant(rfp.status)}>{rfp.status}</Badge></TableCell>
                      <TableCell className="text-right">${rfp.estimatedBudget.toLocaleString('de-DE')}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <p className="text-muted-foreground text-center py-8">No RFPs found for this metro.</p>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Contractors in this Metro</CardTitle>
          </CardHeader>
          <CardContent>
             {contractors && contractors.length > 0 ? (
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Status</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {contractors.map(c => (
                            <TableRow key={c.id}>
                                <TableCell className="font-medium">
                                  <Link href={`/contractors/${c.id}`} className="text-primary hover:underline">{c.name}</Link>
                                </TableCell>
                                <TableCell>{c.type}</TableCell>
                                <TableCell><Badge variant={getContractorStatusVariant(c.preferredStatus)}>{c.preferredStatus}</Badge></TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
             ) : (
                <p className="text-muted-foreground text-center py-8">No contractors found for this metro.</p>
             )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
