
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
import { getContractors } from '@/lib/data';
import type { Contractor } from '@/lib/types';
import { useEffect, useState } from 'react';

function ContractorsList() {
  const [contractors, setContractors] = useState<Contractor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const data = await getContractors();
      setContractors(data);
      setLoading(false);
    }
    loadData();
  }, []);


  if (loading) {
    return <div>Loading...</div>;
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
  return (
    <Card>
      <CardHeader>
        <CardTitle>Contractor List</CardTitle>
        <CardDescription>A list of all preferred contractors.</CardDescription>
      </CardHeader>
      <CardContent>
        <ContractorsList />
      </CardContent>
    </Card>
  );
}
