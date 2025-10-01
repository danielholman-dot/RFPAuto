
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
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { FilePlus2, Pencil, Trash } from 'lucide-react';
import type { RFP } from '@/lib/types';
import { getRfps, deleteRfp } from '@/lib/data';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';

export default function RfpRegistryPage() {
  const [rfps, setRfps] = useState<RFP[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { toast } = useToast();

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
      default:
        return 'secondary'; // Yellow / warning for active states like Selection, Invitation, etc.
    }
  };

  const handleEdit = (rfpId: string) => {
    router.push(`/rfp/${rfpId}`);
  };

  const handleDelete = async (rfpId: string, rfpName: string) => {
    try {
        await deleteRfp(rfpId);
        setRfps(currentRfps => currentRfps.filter(r => r.id !== rfpId));
        toast({
            title: "RFP Deleted",
            description: `The RFP "${rfpName}" has been successfully deleted.`,
        });
    } catch (error) {
        console.error("Failed to delete RFP:", error);
        toast({
            variant: "destructive",
            title: "Deletion Failed",
            description: "There was an error deleting the RFP. Please try again.",
        });
    }
  };


  if (loading) {
    return <div>Loading...</div>;
  }

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
                    variant={getStatusVariant(rfp.status)}
                  >
                    {rfp.status}
                  </Badge>
                </TableCell>
                <TableCell>{formatDate(rfp.projectStartDate)}</TableCell>
                <TableCell className="text-right">
                  ${rfp.estimatedBudget.toLocaleString('de-DE')}
                </TableCell>
                <TableCell className="text-right space-x-2">
                  <Button variant="outline" size="sm" onClick={() => handleEdit(rfp.id)}>
                    <Pencil className="mr-2 h-4 w-4" />
                    Edit
                  </Button>
                   <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" size="sm">
                            <Trash className="mr-2 h-4 w-4" />
                            Delete
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the RFP "{rfp.projectName}".
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDelete(rfp.id, rfp.projectName)}>
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
