
'use client';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
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
      orderBy('name', 'asc')
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

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Contractor Name</TableHead>
          <TableHead>POC Name</TableHead>
          <TableHead>POC Email</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Preferred Status</TableHead>
          <TableHead>Region</TableHead>
          <TableHead>Metro/Site</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {contractors?.map((contractor) => (
          <TableRow key={contractor.id}>
            <TableCell className="font-medium">{contractor.name}</TableCell>
            <TableCell>{contractor.contactName}</TableCell>
            <TableCell>{contractor.contactEmail}</TableCell>
            <TableCell>{contractor.type}</TableCell>
            <TableCell>{contractor.preferredStatus}</TableCell>
            <TableCell>{contractor.region}</TableCell>
            <TableCell>{contractor.metroSite}</TableCell>
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
