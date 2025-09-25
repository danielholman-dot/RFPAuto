
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
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { FilePlus2, Pencil } from 'lucide-react';
import type { RFP } from '@/lib/types';
import { getRfps } from '@/lib/data';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function RfpRegistryPage() {
  const [rfps, setRfps] = useState<RFP[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function loadData() {
      const data = await getRfps();
      setRfps(data);
      setLoading(false);
    }
    loadData();
  }, []);

  const formatDate = (date: any) => {
    if (!date) return 'N/A';
    if (date.toDate) { // Firebase Timestamp
      return date.toDate().toLocaleDateString();
    }
    return new Date(date).toLocaleDateString();
  };
  
  if (loading) {
    return <div>Loading...</div>;
  }

  const handleEdit = (rfpId: string) => {
    router.push(`/rfp/${rfpId}`);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>RFP Registry</CardTitle>
          <CardDescription>
            A complete list of all Requests for Proposal.
          </CardDescription>
        </div>
        <Link href="/rfp/new">
          <Button>
            <FilePlus2 className="mr-2 h-4 w-4" />
            Create New RFP
          </Button>
        </Link>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Project Name</TableHead>
              <TableHead>Metro</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Project Start Date</TableHead>
              <TableHead className="text-right">Budget</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rfps?.map((rfp) => (
              <TableRow key={rfp.id}>
                <TableCell>
                  <Link
                    href={`/rfp/${rfp.id}`}
                    className="font-medium text-primary hover:underline"
                  >
                    {rfp.projectName}
                  </Link>
                </TableCell>
                <TableCell>{rfp.metroCode}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      rfp.status === 'Awarded' || rfp.status === 'Completed'
                        ? 'default'
                        : 'secondary'
                    }
                  >
                    {rfp.status}
                  </Badge>
                </TableCell>
                <TableCell>{formatDate(rfp.projectStartDate)}</TableCell>
                <TableCell className="text-right">
                  ${rfp.estimatedBudget.toLocaleString()}
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="outline" size="sm" onClick={() => handleEdit(rfp.id)}>
                    <Pencil className="mr-2 h-4 w-4" />
                    Edit
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
