
'use client';
import {
  Trash,
  Pencil,
  Loader2,
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
import { useToast } from '@/hooks/use-toast';
import { useCollection, useMemoFirebase, useFirestore, useUser } from '@/firebase';
import { collection, query, orderBy, deleteDoc, doc } from 'firebase/firestore';

export default function RfpRegistryPage() {
  const firestore = useFirestore();
  const { user, isUserLoading } = useUser();
  const { toast } = useToast();
  
  const rfpsQuery = useMemoFirebase(() => {
    if (!user) return null;
    const rfpsCol = collection(firestore, 'rfps');
    return query(rfpsCol, orderBy('createdAt', 'desc'));
  }, [firestore, user]);

  const { data: rfps, isLoading: rfpsLoading } = useCollection<RFP>(rfpsQuery);

  const handleDelete = async (rfpId: string) => {
    if (!firestore) return;
    try {
        const rfpDocRef = doc(firestore, 'rfps', rfpId);
        await deleteDoc(rfpDocRef);
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

  const loading = isUserLoading || rfpsLoading;

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
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
            {rfps && rfps.map((rfp) => (
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
                    <Button asChild variant="outline" size="icon">
                        <Link href={`/rfp/${rfp.id}`}>
                            <Pencil className="h-4 w-4"/>
                        </Link>
                    </Button>
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="destructive" size="icon">
                                <Trash className="h-4 w-4"/>
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
