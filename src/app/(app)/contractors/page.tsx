
'use client';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { useCollection } from '@/firebase/firestore/use-collection';
import type { Contractor } from '@/lib/types';
import { collection, query, orderBy } from 'firebase/firestore';
import { useFirestore } from '@/firebase';
import { useMemo } from 'react';

function ContractorsList() {
  const firestore = useFirestore();

  const contractorsQuery = useMemo(() => {
    if (!firestore) return null;
    return query(
      collection(firestore, 'contractors'),
      orderBy('preference', 'asc')
    );
  }, [firestore]);

  const { data: contractors, loading } = useCollection<Contractor>(
    contractorsQuery
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const getPreferenceLabel = (preference?: number) => {
    if (preference === 1) return 'Most Preferred';
    if (preference && preference > 1 && preference <= 5) return 'Preferred';
    return 'N/A';
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Contractor Name</TableHead>
          <TableHead>POC Name</TableHead>
          <TableHead>POC Email</TableHead>
          <TableHead>Contractor Type</TableHead>
          <TableHead>Most Preferred/Preferred</TableHead>
          <TableHead>Region</TableHead>
          <TableHead>Metro/Site</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {contractors?.map((contractor) => (
          <TableRow key={contractor.id}>
            <TableCell className="font-medium">{contractor.name}</TableCell>
            <TableCell>{contractor.contactName}</TableCell>
            <TableCell>
              <div className="text-sm text-muted-foreground">
                {contractor.contactEmail}
              </div>
            </TableCell>
            <TableCell>{contractor.type}</TableCell>
            <TableCell>{getPreferenceLabel(contractor.preference)}</TableCell>
            <TableCell>{contractor.region || 'N/A'}</TableCell>
            <TableCell>
              <div className="flex flex-wrap gap-1">
                {contractor.metroCodes.map((code) => (
                  <Badge key={code} variant="outline">
                    {code}
                  </Badge>
                ))}
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}


export default function ContractorsPage() {
  const firestore = useFirestore();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Contractor List</CardTitle>
        <CardDescription>A list of all preferred contractors.</CardDescription>
      </CardHeader>
      <CardContent>
        {!firestore ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <ContractorsList />
        )}
      </CardContent>
    </Card>
  );
}
