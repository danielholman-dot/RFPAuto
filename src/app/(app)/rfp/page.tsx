
'use client';
import {
  Activity,
  ArrowUpRight,
  CircleDollarSign,
  FileText,
  Users,
  Trash,
  Pencil,
} from 'lucide-react';
import Link from 'next/link';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import type { RFP } from '@/lib/types';
import { getRfps, deleteRfp } from '@/lib/data';
import { useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';

export default function RfpRegistryPage() {
  const [rfps, setRfps] = useState<RFP[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    async function loadData() {
      const rfpsData = await getRfps();
      setRfps(rfpsData);
      setLoading(false);
    }
    loadData();
  }, []);

  const handleDelete = async (rfpId: string) => {
    try {
        await deleteRfp(rfpId);
        setRfps(prevRfps => prevRfps.filter(rfp => rfp.id !== rfpId));
        toast({
            title: "RFP Deleted",
            description: "The RFP has been successfully deleted.",
        });
    } catch (error) {
        console.error("Failed to delete RFP:", error);
        toast({
            variant: "destructive",
            title: "Error",
            description: "Failed to delete the RFP. Please try again.",
        });
    }
  };


  const getStatusVariant = (status: RFP['status']) => {
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

  const formatDate = (date: any) => {
    if (!date) return 'N/A';
    if (date.toDate) { // Firebase Timestamp
      return date.toDate().toLocaleDateString();
    }
    return new Date(date).toLocaleDateString();
  };

  if (loading) {
    return <div>Loading RFPs...</div>;
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
            <CardTitle>RFP Registry</CardTitle>
            <CardDescription>
                A complete list of all Requests for Proposal in the system.
            </CardDescription>
        </div>
        <Button asChild>
            <Link href="/rfp/new">Create New RFP</Link>
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Project Name</TableHead>
              <TableHead>Metro</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Budget</TableHead>
              <TableHead>Start Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rfps.map((rfp) => (
              <TableRow key={rfp.id}>
                <TableCell className="font-medium">{rfp.projectName}</TableCell>
                <TableCell>{rfp.metroCode}</TableCell>
                <TableCell>
                  <Badge variant={getStatusVariant(rfp.status)}>
                    {rfp.status}
                  </Badge>
                </TableCell>
                <TableCell>${rfp.estimatedBudget.toLocaleString('de-DE')}</TableCell>
                <TableCell>{formatDate(rfp.projectStartDate)}</TableCell>
                <TableCell className="text-right space-x-2">
                    <Button asChild variant="outline" size="sm">
                        <Link href={`/rfp/${rfp.id}`}>
                            <Pencil className="mr-2 h-4 w-4"/>
                            Edit
                        </Link>
                    </Button>
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="destructive" size="sm">
                                <Trash className="mr-2 h-4 w-4"/>
                                Delete
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete the RFP
                                and all associated data from our servers.
                            </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDelete(rfp.id)}>
                                Continue
                            </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
